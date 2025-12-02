import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Platform, LogBox, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button, ActivityIndicator, IconButton, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc, increment, collection, query, where, orderBy, getDocs, addDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { styles } from '../styles/home.styles';
import { addPoints } from '../utils/gamification';
import { seedInitialData } from '../utils/seedData'; 

LogBox.ignoreLogs(['expo-notifications']);
const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || 'c1833d62ce0bca4e36467936b5dcc725';

const GREEN_TIPS_DATA = [
    { icon: "💡", title: "Tắt chế độ chờ", content: "Nhiều thiết bị điện tử vẫn tiêu thụ điện khi ở chế độ chờ (standby). Hãy rút phích cắm!" },
    { icon: "🧊", title: "Điều chỉnh máy lạnh", content: "Đặt nhiệt độ máy lạnh cao hơn 1-2 độ C và dùng quạt sẽ tiết kiệm năng lượng đáng kể." },
    { icon: "🚿", title: "Tắm nhanh hơn", content: "Giảm thời gian tắm vòi sen 2 phút có thể tiết kiệm hàng chục lít nước mỗi ngày." },
    { icon: "🍎", title: "Ăn ít thịt đỏ", content: "Giảm tiêu thụ thịt đỏ, tăng cường rau xanh giúp giảm lượng khí methane thải ra môi trường." },
    { icon: "🗑️", title: "Thu gom rác điện tử", content: "Mang điện thoại cũ, dây sạc hỏng đến các điểm thu gom chuyên dụng, đừng vứt vào thùng rác thường." },
    { icon: "🥡", title: "Mang hộp đựng", content: "Luôn mang theo hộp đựng cá nhân khi mua đồ ăn mang đi để loại bỏ đồ nhựa dùng một lần." },
    { icon: "🚲", title: "Ưu tiên xe đạp/đi bộ", content: "Nếu quãng đường ngắn, hãy chọn đi bộ hoặc xe đạp thay vì phương tiện cơ giới." },
    { icon: "🍂", title: "Tự ủ phân", content: "Biến rác hữu cơ (vỏ rau, củ, quả) thành phân bón cho cây trồng tại nhà (compost)." },
    { icon: "👕", title: "Mua đồ second-hand", content: "Ưu tiên mua sắm đồ cũ để giảm thiểu nhu cầu sản xuất mới và lãng phí tài nguyên." },
    { icon: "☀️", title: "Tận dụng ánh sáng", content: "Mở rèm, sử dụng ánh sáng tự nhiên vào ban ngày thay vì bật đèn." },
];



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
  const [aqiData, setAqiData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
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

  const getAQIDescription = (aqi) => {
    switch (aqi) {
      case 1: return { label: 'Tốt', color: '#4CAF50', advice: 'Không khí trong lành. Tận hưởng đi! 🌳' };
      case 2: return { label: 'Khá', color: '#8BC34A', advice: 'Chất lượng ổn, chấp nhận được.' };
      case 3: return { label: 'Trung bình', color: '#FFB300', advice: 'Nhóm nhạy cảm nên hạn chế ra ngoài. 😷' };
      case 4: return { label: 'Kém', color: '#FF7043', advice: 'Cảnh báo: Nên đeo khẩu trang chuyên dụng!' };
      case 5: return { label: 'Nguy hại', color: '#D32F2F', advice: '🆘 RẤT XẤU! Tránh mọi hoạt động ngoài trời.' };
      default: return { label: '---', color: '#ccc', advice: '...' };
    }
  };

  const checkAndTriggerAlert = async (aqi) => {
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
      } catch { console.log("Lỗi gửi thông báo."); }
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
          const list = [];
          snapshot.forEach(doc => {
              list.push({ id: doc.id, ...doc.data() });
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

  const handleJoinCampaign = async (title) => {
      const user = auth.currentUser;
      
      if (!user) { Alert.alert("Lỗi", "Bạn cần đăng nhập!"); return; }

      if (user.isAnonymous) {
          Alert.alert("Thông báo", "Bạn đã đăng ký tham gia thành công!\nVui lòng đăng nhập để tích điểm.");
          return;
      }
      
      try {
          await addPoints(20, `tham gia chiến dịch "${title}"`);

          Alert.alert("Đăng ký thành công!", `Hẹn gặp bạn tại chiến dịch "${title}".\n(Bạn đã nhận được +20 điểm thưởng)`);
      } catch (error) { 
          console.error("Lỗi tham gia chiến dịch:", error);
          Alert.alert("Lỗi", "Không thể tham gia lúc này. Vui lòng kiểm tra kết nối."); 
      }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
           <Text variant="titleLarge" style={styles.greetingText}>Xin chào, {userData.name} 👋</Text>
           <View style={styles.badgeContainer}>
               <Avatar.Icon size={16} icon="medal" style={{backgroundColor:'transparent'}} color='#2E7D32' />
               <Text style={styles.badgeText}>{userData.badge}</Text>
           </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.avatarContainer}>
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
                
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={seedInitialData} style={{marginRight: 10}}>
                        <Text style={{color: 'red', fontSize: 12, fontWeight: 'bold'}}>⚡ NẠP DATA</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={createTestCampaign}>
                        <Text style={{color: '#aaa', fontSize: 12}}>+ Test Data</Text>
                    </TouchableOpacity>
                </View>
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
                                <Text numberOfLines={2} style={styles.campaignTitle}>{camp.title}</Text>
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
            
            <TouchableOpacity style={[styles.bentoItem, styles.bentoLarge, {backgroundColor: '#FFEBEE'}]} onPress={() => router.push('/report')}>
                <View style={styles.bentoContent}>
                    <Text style={[styles.bentoTitle, {color: '#D32F2F'}]}>Báo cáo vi phạm</Text>
                    <Text style={styles.bentoDesc}>Gửi ảnh/video vi phạm môi trường</Text>
                </View>
                <Avatar.Icon size={48} icon="camera-plus" style={{backgroundColor: '#FFCDD2'}} color='#D32F2F' />
            </TouchableOpacity>

            <View style={styles.bentoRow}>
                <TouchableOpacity style={[styles.bentoItem, {backgroundColor: '#E8F5E9'}]} onPress={() => router.push('/waste')}>
                    <Avatar.Icon size={40} icon="recycle" style={{backgroundColor: '#C8E6C9', marginBottom: 10}} color='#2E7D32' />
                    <Text style={[styles.bentoTitle, {color: '#2E7D32'}]}>Phân loại rác</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.bentoItem, {backgroundColor: '#E3F2FD'}]} onPress={() => router.push('/chatbot')}>
                    <Avatar.Icon size={40} icon="robot" style={{backgroundColor: '#BBDEFB', marginBottom: 10}} color='#1976D2' />
                    <Text style={[styles.bentoTitle, {color: '#1976D2'}]}>Chatbot AI</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bentoRow}>
                 <TouchableOpacity style={[styles.bentoItem, {backgroundColor: '#E0F7FA'}]} onPress={() => router.push('/map')}>
                    <Avatar.Icon size={40} icon="map-marker-radius" style={{backgroundColor: '#B2EBF2', marginBottom: 10}} color='#0097A7' />
                    <Text style={[styles.bentoTitle, {color: '#0097A7'}]}>Bản đồ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.bentoItem, {backgroundColor: '#F3E5F5'}]} onPress={() => router.push('/community')}>
                    <Avatar.Icon size={40} icon="account-group" style={{backgroundColor: '#E1BEE7', marginBottom: 10}} color='#7B1FA2' />
                    <Text style={[styles.bentoTitle, {color: '#7B1FA2'}]}>Cộng đồng</Text>
                </TouchableOpacity>
            </View>

             <View style={styles.bentoRow}>
                 <TouchableOpacity style={[styles.bentoItem, {backgroundColor: '#FFF3E0'}]} onPress={() => router.push('/learn')}>
                    <Avatar.Icon size={40} icon="school" style={{backgroundColor: '#FFE0B2', marginBottom: 10}} color='#F57C00' />
                    <Text style={[styles.bentoTitle, {color: '#F57C00'}]}>Học tập</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.bentoItem, {backgroundColor: '#FCE4EC'}]} onPress={() => router.push('/rewards')}>
                    <Avatar.Icon size={40} icon="gift" style={{backgroundColor: '#F8BBD0', marginBottom: 10}} color='#C2185B' />
                    <Text style={[styles.bentoTitle, {color: '#C2185B'}]}>Đổi quà</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.footerRow}>
             <Button mode="outlined" icon="history" onPress={() => router.push('/history')} style={styles.footerBtn} textColor="#555">Lịch sử</Button>
             <Button mode="outlined" icon="chart-bar" onPress={() => router.push('/analytics')} style={styles.footerBtn} textColor="#555">Thống kê</Button>
             <Button mode="outlined" icon="cog" onPress={() => router.push('/settings')} style={styles.footerBtn} textColor="#555">Cài đặt</Button>
        </View>
        
        <View style={{height: 30}} />
      </ScrollView>
    </View>
  );
}