import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Alert, Platform, LogBox, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, ActivityIndicator, IconButton, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc, increment, collection, query, where, orderBy, getDocs, addDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { styles } from '../styles/home.styles';

LogBox.ignoreLogs(['expo-notifications']);
const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || 'c1833d62ce0bca4e36467936b5dcc725';

const GREEN_TIPS_DATA = [
    { icon: "🌱", title: "Trồng thêm cây xanh", content: "Cây xanh giúp lọc không khí và giảm nhiệt độ môi trường sống của bạn." },
    { icon: "💧", title: "Tiết kiệm nước", content: "Tắt vòi nước khi đang đánh răng có thể tiết kiệm tới 20 lít nước mỗi ngày." },
    { icon: "🛍️", title: "Nói không với túi nilon", content: "Mang theo túi vải cá nhân khi đi chợ để giảm rác thải nhựa khó phân hủy." },
    { icon: "💡", title: "Tắt điện khi rời phòng", content: "Hành động nhỏ này giúp giảm lượng khí thải CO2 và tiết kiệm tiền điện." },
    { icon: "📄", title: "Tiết kiệm giấy", content: "Tận dụng cả hai mặt giấy khi in ấn hoặc dùng làm giấy nháp." },
    { icon: "🔋", title: "Thu gom pin cũ", content: "Đừng vứt pin vào thùng rác thường! Hãy mang đến các điểm thu gom chuyên dụng." },
    { icon: "🥡", title: "Hạn chế đồ nhựa 1 lần", content: "Mang theo bình nước và hộp đựng cá nhân thay vì dùng đồ nhựa dùng một lần." },
];

interface Campaign {
    id: string;
    title: string;
    date: any;
    location: string;
    description?: string;
}

interface AQIData {
  aqi: number;
  city: string;
  label: string;
  color: string;
  advice: string;
}


interface WeatherData {
    temp: number;
    desc: string;
    icon: string;
    main: string;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function HomeScreen() {
  const router = useRouter();
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [currentTip, setCurrentTip] = useState({ icon: '💡', title: 'Mẹo hay', content: 'Đang tải...' });
  
  
  const [userData, setUserData] = useState({
      name: 'Khách',
      avatar: null,
      badge: 'Khách tham quan',
      isGuest: true
  });

  
  useEffect(() => {
      const user = auth.currentUser;
      
      if (user && !user.isAnonymous) {
          
          const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
              if (docSnap.exists()) {
                  const data = docSnap.data();
                  setUserData({
                      name: data.displayName || user.email?.split('@')[0] || 'Người dùng',
                      avatar: data.photoURL || null,
                      badge: data.badge || 'Tân binh',
                      isGuest: false
                  });
              }
          });
          return () => unsub();
      } else {
          
          setUserData({
              name: 'Khách',
              avatar: null,
              badge: 'Chế độ Khách',
              isGuest: true
          });
      }
  }, []);

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) return;
    try {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
    } catch { console.log("Lỗi quyền thông báo."); }
  }

  useEffect(() => {
      registerForPushNotificationsAsync();
      const randomTip = GREEN_TIPS_DATA[Math.floor(Math.random() * GREEN_TIPS_DATA.length)];
      setCurrentTip(randomTip);
      fetchCampaigns();
  }, []);

  const getAQIDescription = (aqi: number) => {
    switch (aqi) {
      case 1: return { label: 'Tốt', color: '#4CAF50', advice: 'Không khí trong lành. Tận hưởng đi! 🌳' };
      case 2: return { label: 'Khá', color: '#8BC34A', advice: 'Chất lượng ổn, chấp nhận được.' };
      case 3: return { label: 'Trung bình', color: '#FFB300', advice: 'Nhóm nhạy cảm nên hạn chế ra ngoài. 😷' };
      case 4: return { label: 'Kém', color: '#FF7043', advice: 'Cảnh báo: Nên đeo khẩu trang chuyên dụng!' };
      case 5: return { label: 'Nguy hại', color: '#D32F2F', advice: '🆘 RẤT XẤU! Tránh mọi hoạt động ngoài trời.' };
      default: return { label: '---', color: '#ccc', advice: '...' };
    }
  };

  const checkAndTriggerAlert = async (aqi: number) => {
      try {
        const jsonValue = await AsyncStorage.getItem('@user_settings');
        let threshold = 100; 
        let enabled = true;
        if (jsonValue != null) {
             const settings = JSON.parse(jsonValue);
             if (settings.aqiAlert === false) enabled = false;
             if (settings.aqiThreshold) {
                 if (settings.aqiThreshold <= 50) threshold = 2;
                 else if (settings.aqiThreshold <= 100) threshold = 3;
                 else threshold = 4;
             }
        }
        if (enabled && aqi >= threshold) {
             await Notifications.scheduleNotificationAsync({
                content: {
                    title: "⚠️ Cảnh báo không khí!",
                    body: `Chỉ số AQI hiện tại là ${aqi}/5. Vượt ngưỡng cài đặt của bạn!`,
                    sound: 'default',
                },
                trigger: null,
            });
        }
      } catch { console.log("Không thể gửi thông báo."); }
  };

  const fetchCampaigns = async () => {
      try {
          const now = new Date();
          const q = query(
              collection(db, "campaigns"),
              where("date", ">=", Timestamp.fromDate(now)),
              orderBy("date", "asc")
          );
          const snapshot = await getDocs(q);
          const list: Campaign[] = [];
          snapshot.forEach(doc => {
              list.push({ id: doc.id, ...doc.data() } as Campaign);
          });
          setCampaigns(list);
      } catch (error) { console.log("Lỗi tải chiến dịch:", error); }
  };

  const createTestCampaign = async () => {
      try {
          await addDoc(collection(db, "campaigns"), {
              title: "Dọn rác bãi biển " + Math.floor(Math.random() * 100),
              location: "Bãi biển Mỹ Khê, Đà Nẵng",
              description: "Tham gia làm sạch bờ biển cùng cộng đồng.",
              date: Timestamp.fromDate(new Date(Date.now() + 86400000 * 2)),
              createdAt: Timestamp.now()
          });
          Alert.alert("Đã tạo!", "Chiến dịch mới đã được tạo. Hãy kéo xuống để reload.");
          fetchCampaigns();
      } catch (e) { Alert.alert("Lỗi", "Không thể tạo chiến dịch."); }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!refreshing) setLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') { setLoading(false); return; }
        
        let location;
        try {
            location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        } catch {
            location = { coords: { latitude: 10.7769, longitude: 106.7009 } }; 
        }
        
        const { latitude, longitude } = location.coords;
        
        if (API_KEY) {
            const aqiRes = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
            const aqiJson = await aqiRes.json();
            const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=vi`);
            const weatherJson = await weatherRes.json();

            if (aqiJson.list && aqiJson.list.length > 0) {
                const aqiValue = aqiJson.list[0].main.aqi;
                let address = await Location.reverseGeocodeAsync({ latitude, longitude });
                setAqiData({ aqi: aqiValue, city: address[0]?.city || "Vị trí của bạn", ...getAQIDescription(aqiValue) });
                checkAndTriggerAlert(aqiValue);
            }
            if (weatherJson.main) {
                setWeather({
                    temp: Math.round(weatherJson.main.temp),
                    desc: weatherJson.weather[0].description,
                    icon: `https://openweathermap.org/img/wn/${weatherJson.weather[0].icon}@2x.png`,
                    main: weatherJson.weather[0].main
                });
            }
        }
      } catch (e) { console.log("Lỗi fetch API:", e); } 
      finally { setLoading(false); setRefreshing(false); }
    };
    fetchData();
  }, [refreshing]);

  const handleJoinCampaign = async (title: string) => {
      const user = auth.currentUser;
      if (!user) { Alert.alert("Lỗi", "Bạn cần đăng nhập!"); return; }
      try {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { score: increment(20) });
          Alert.alert("Đăng ký thành công!", `Hẹn gặp bạn tại chiến dịch "${title}".\n(Bạn đã nhận được +20 điểm thưởng)`);
      } catch { Alert.alert("Lỗi", "Không thể tham gia lúc này."); }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
           <Text variant="titleLarge" style={styles.greetingText}>Xin chào, {userData.name} 👋</Text>
           {/* [MỚI] Hiển thị Badge */}
           <View style={styles.badgeContainer}>
               <Avatar.Icon size={16} icon="medal" style={{backgroundColor:'transparent'}} color='#2E7D32' />
               <Text style={styles.badgeText}>{userData.badge}</Text>
           </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile' as any)} style={styles.avatarContainer}>
            {userData.avatar ? (
                <Image source={{ uri: userData.avatar }} style={{width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: '#fff'}} />
            ) : (
                <Avatar.Icon size={45} icon="account" style={{backgroundColor: '#E8F5E9'}} color='#0E4626' />
            )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCampaigns(); }} />}
      >
        
        
        <View style={styles.tipContainer}>
            <View style={styles.tipIconBox}><Text style={{fontSize: 24}}>{currentTip.icon}</Text></View>
            <View style={{flex: 1}}>
                <Text style={styles.tipTitle}>{currentTip.title}</Text>
                <Text style={styles.tipContent} numberOfLines={3}>{currentTip.content}</Text>
            </View>
        </View>

        
        <Text variant="titleMedium" style={styles.sectionTitle}>Chất lượng môi trường</Text>
        
        {loading ? (
           <ActivityIndicator animating={true} color="#0E4626" size="large" style={{marginBottom: 20}} />
        ) : (
           <View style={styles.statsRow}>
               
               <View style={[styles.statCard, { backgroundColor: '#fff', borderColor: aqiData?.color || '#ddd' }]}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View>
                            <Text style={[styles.statValue, {color: aqiData?.color}]}>{aqiData?.aqi || '--'}</Text>
                            <Text style={styles.statLabel}>AQI Index</Text>
                        </View>
                        <IconButton icon="air-filter" iconColor={aqiData?.color} size={28} />
                    </View>
                    <Text style={[styles.statStatus, {color: aqiData?.color}]}>{aqiData?.label}</Text>
               </View>

               
               <View style={[styles.statCard, { backgroundColor: '#fff', borderColor: '#2196F3' }]}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View>
                            <Text style={[styles.statValue, {color: '#2196F3'}]}>{weather?.temp || '--'}°</Text>
                            <Text style={styles.statLabel}>Nhiệt độ</Text>
                        </View>
                        {weather && <Image source={{uri: weather.icon}} style={{width: 40, height: 40}} />}
                    </View>
                    <Text style={[styles.statStatus, {color: '#2196F3', textTransform: 'capitalize'}]}>{weather?.desc}</Text>
               </View>
           </View>
        )}

        {!loading && aqiData && (
            <View style={styles.locationBadge}>
                <Text style={styles.locationText}>📍 {aqiData.city}</Text>
                <Text style={styles.adviceText}>{aqiData.advice}</Text>
            </View>
        )}

        
        <View style={{marginTop: 25}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Chiến dịch nổi bật</Text>
                <TouchableOpacity onPress={createTestCampaign}>
                    <Text style={{color: '#aaa', fontSize: 12}}>+ Test Data</Text>
                </TouchableOpacity>
            </View>
            
            {campaigns.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={{color: '#999'}}>Chưa có chiến dịch nào sắp tới.</Text>
                </View>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingRight: 20}}>
                    {campaigns.map(camp => (
                        <TouchableOpacity key={camp.id} activeOpacity={0.9} style={styles.campaignCard} onPress={() => handleJoinCampaign(camp.title)}>
                            <View style={styles.campaignDateBox}>
                                <Text style={styles.campaignDateText}>{camp.date ? new Date(camp.date.seconds * 1000).getDate() : 'Now'}</Text>
                                <Text style={styles.campaignMonthText}>Th{camp.date ? new Date(camp.date.seconds * 1000).getMonth() + 1 : '...'}</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text numberOfLines={1} style={styles.campaignTitle}>{camp.title}</Text>
                                <Text numberOfLines={1} style={styles.campaignLoc}>📍 {camp.location}</Text>
                            </View>
                            <Button mode="contained" compact style={styles.joinBtn} labelStyle={{fontSize: 10}}>Tham gia</Button>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>

        
        <Text variant="titleMedium" style={[styles.sectionTitle, {marginTop: 25}]}>Tiện ích xanh</Text>
        <View style={styles.bentoGrid}>
            
            
            <TouchableOpacity style={[styles.bentoItem, styles.bentoLarge, {backgroundColor: '#FFEBEE'}]} onPress={() => router.push('/report' as any)}>
                <View style={styles.bentoContent}>
                    <Text style={[styles.bentoTitle, {color: '#D32F2F'}]}>Báo cáo vi phạm</Text>
                    <Text style={styles.bentoDesc}>Gửi ảnh/video vi phạm môi trường</Text>
                </View>
                <Avatar.Icon size={48} icon="camera-plus" style={{backgroundColor: '#FFCDD2'}} color='#D32F2F' />
            </TouchableOpacity>

            
            <View style={styles.bentoRow}>
                <TouchableOpacity style={[styles.bentoItem, {backgroundColor: '#E8F5E9'}]} onPress={() => router.push('/waste' as any)}>
                    <Avatar.Icon size={40} icon="recycle" style={{backgroundColor: '#C8E6C9', marginBottom: 10}} color='#2E7D32' />
                    <Text style={[styles.bentoTitle, {color: '#2E7D32'}]}>Phân loại rác</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.bentoItem, {backgroundColor: '#E3F2FD'}]} onPress={() => router.push('/chatbot' as any)}>
                    <Avatar.Icon size={40} icon="robot" style={{backgroundColor: '#BBDEFB', marginBottom: 10}} color='#1976D2' />
                    <Text style={[styles.bentoTitle, {color: '#1976D2'}]}>Chatbot AI</Text>
                </TouchableOpacity>
            </View>

            
            <View style={styles.bentoRow}>
                 <TouchableOpacity style={[styles.bentoItem, {backgroundColor: '#E0F7FA'}]} onPress={() => router.push('/map' as any)}>
                    <Avatar.Icon size={40} icon="map-marker-radius" style={{backgroundColor: '#B2EBF2', marginBottom: 10}} color='#0097A7' />
                    <Text style={[styles.bentoTitle, {color: '#0097A7'}]}>Bản đồ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.bentoItem, {backgroundColor: '#F3E5F5'}]} onPress={() => router.push('/community' as any)}>
                    <Avatar.Icon size={40} icon="account-group" style={{backgroundColor: '#E1BEE7', marginBottom: 10}} color='#7B1FA2' />
                    <Text style={[styles.bentoTitle, {color: '#7B1FA2'}]}>Cộng đồng</Text>
                </TouchableOpacity>
            </View>

            
             <View style={styles.bentoRow}>
                 <TouchableOpacity style={[styles.bentoItem, {backgroundColor: '#FFF3E0'}]} onPress={() => router.push('/learn' as any)}>
                    <Avatar.Icon size={40} icon="school" style={{backgroundColor: '#FFE0B2', marginBottom: 10}} color='#F57C00' />
                    <Text style={[styles.bentoTitle, {color: '#F57C00'}]}>Học tập</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.bentoItem, {backgroundColor: '#FCE4EC'}]} onPress={() => router.push('/rewards' as any)}>
                    <Avatar.Icon size={40} icon="gift" style={{backgroundColor: '#F8BBD0', marginBottom: 10}} color='#C2185B' />
                    <Text style={[styles.bentoTitle, {color: '#C2185B'}]}>Đổi quà</Text>
                </TouchableOpacity>
            </View>
        </View>

        
        <View style={styles.footerRow}>
             <Button mode="outlined" icon="history" onPress={() => router.push('/history' as any)} style={styles.footerBtn} textColor="#555">Lịch sử</Button>
             <Button mode="outlined" icon="chart-bar" onPress={() => router.push('/analytics' as any)} style={styles.footerBtn} textColor="#555">Thống kê</Button>
             <Button mode="outlined" icon="cog" onPress={() => router.push('/settings' as any)} style={styles.footerBtn} textColor="#555">Cài đặt</Button>
        </View>
        
        <View style={{height: 30}} />
      </ScrollView>
    </View>
  );
}