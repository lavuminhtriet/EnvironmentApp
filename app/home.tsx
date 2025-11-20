import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Alert, Platform, LogBox, Image } from 'react-native';
import { Text, Card, Button, ActivityIndicator, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/home.styles';

LogBox.ignoreLogs(['expo-notifications']);
const API_KEY = process.env.EXPO_PUBLIC_WEATHER_KEY || 'c1833d62ce0bca4e36467936b5dcc725';

const CAMPAIGNS = [
    { id: '1', title: 'Chủ nhật Xanh', date: 'CN, 20/11', location: 'Công viên Thống Nhất' },
    { id: '2', title: 'Thu gom Pin cũ', date: 'T7, 19/11', location: 'Sảnh A, Vincom' },
    { id: '3', title: 'Trồng cây gây rừng', date: '25/11', location: 'Ngoại ô thành phố' },
];

const GREEN_TIPS = [
    "Mang túi vải khi đi chợ để giảm rác thải nhựa.",
    "Tắt các thiết bị điện khi không sử dụng.",
    "Sử dụng bình nước cá nhân thay vì chai nhựa dùng một lần.",
    "Phân loại rác tại nguồn giúp tái chế dễ dàng hơn.",
    "Trồng thêm một cây xanh ở nơi bạn sống.",
];

interface AQIData {
  aqi: number;
  city: string;
  label: string;
  color: string;
  advice: string;
}

// [MỚI] Interface cho Thời tiết
interface WeatherData {
    temp: number;
    desc: string;
    icon: string;
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
  const [weather, setWeather] = useState<WeatherData | null>(null); // [MỚI] State thời tiết
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dailyTip, setDailyTip] = useState('');

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
        if (finalStatus !== 'granted') return;
    } catch { console.log("Bỏ qua đăng ký thông báo."); }
  }

  useEffect(() => {
      registerForPushNotificationsAsync();
      setDailyTip(GREEN_TIPS[Math.floor(Math.random() * GREEN_TIPS.length)]);
  }, []);

  const getAQIDescription = (aqi: number) => {
    switch (aqi) {
      case 1: return { label: 'Tốt', color: '#4CAF50', advice: 'Không khí trong lành. Tận hưởng đi! 🌳' };
      case 2: return { label: 'Khá', color: '#8BC34A', advice: 'Chất lượng ổn, chấp nhận được.' };
      case 3: return { label: 'Trung bình', color: '#FFC107', advice: 'Nhóm nhạy cảm nên hạn chế ra ngoài. 😷' };
      case 4: return { label: 'Kém', color: '#FF5722', advice: 'Cảnh báo: Nên đeo khẩu trang chuyên dụng!' };
      case 5: return { label: 'Nguy hại', color: '#B71C1C', advice: '🆘 RẤT XẤU! Tránh mọi hoạt động ngoài trời.' };
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

  useEffect(() => {
    const fetchData = async () => {
      if (!refreshing) setLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLoading(false);
            return;
        }
        let location;
        try {
            location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        } catch {
            location = { coords: { latitude: 10.7769, longitude: 106.7009 } };
        }
        
        const { latitude, longitude } = location.coords;
        
        // 1. Gọi API Ô nhiễm
        const aqiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
        const aqiRes = await fetch(aqiUrl);
        const aqiJson = await aqiRes.json();

        // [MỚI] 2. Gọi API Thời tiết (FR-6.3)
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=vi`;
        const weatherRes = await fetch(weatherUrl);
        const weatherJson = await weatherRes.json();

        if (aqiJson.list && aqiJson.list.length > 0) {
            const aqiValue = aqiJson.list[0].main.aqi;
            let address = await Location.reverseGeocodeAsync({ latitude, longitude });
            setAqiData({ aqi: aqiValue, city: address[0]?.city || "Vị trí của bạn", ...getAQIDescription(aqiValue) });
            checkAndTriggerAlert(aqiValue);
        }

        // [MỚI] Set dữ liệu thời tiết
        if (weatherJson.main) {
            setWeather({
                temp: Math.round(weatherJson.main.temp),
                desc: weatherJson.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${weatherJson.weather[0].icon}@2x.png`
            });
        }

      } catch { Alert.alert("Lỗi", "Không tải được dữ liệu."); } finally { setLoading(false); setRefreshing(false); }
    };
    fetchData();
  }, [refreshing]); 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
           <Text variant="headlineMedium" style={styles.headerTitle}>Environment App</Text>
           <Text variant="bodyMedium" style={{color: '#666'}}>Dữ liệu thực tế từ OpenWeather</Text>
        </View>
        <IconButton icon="account-circle" iconColor="#2E7D32" size={35} onPress={() => router.push('/profile' as any)} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); }} />}>
        
        <Card style={{marginBottom: 20, backgroundColor: '#E8F5E9', borderLeftWidth: 5, borderLeftColor: '#4CAF50'}}>
            <Card.Title title="💡 Mẹo sống xanh hôm nay" titleStyle={{fontSize: 16, fontWeight: 'bold', color: '#2E7D32'}} />
            <Card.Content><Text style={{fontSize: 15, fontStyle: 'italic'}}>&quot;{dailyTip}&quot;</Text></Card.Content>
        </Card>

        {/* [MỚI] Khu vực Thời tiết & AQI nằm ngang nhau */}
        <Text variant="titleLarge" style={styles.sectionTitle}>Thông tin Môi trường</Text>
        {loading ? (
           <ActivityIndicator animating={true} color="#2E7D32" size="large" />
        ) : (
           <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
               {/* Card AQI */}
               <Card style={[styles.aqiCard, { backgroundColor: aqiData?.color || '#ddd', width: '48%', marginBottom: 0 }]}>
                    <Card.Content style={{ alignItems: 'center', padding: 10 }}>
                        <Text style={{fontSize: 40, fontWeight: 'bold', color: '#fff'}}>{aqiData?.aqi}/5</Text>
                        <Text style={{color: '#fff', fontWeight: 'bold'}}>AQI</Text>
                        <Text style={{color: '#fff', fontSize: 12, textAlign: 'center'}}>{aqiData?.label}</Text>
                    </Card.Content>
               </Card>

               {/* [MỚI] Card Thời tiết - FR-6.3 */}
               <Card style={{ backgroundColor: '#2196F3', width: '48%', borderRadius: 25 }}>
                    <Card.Content style={{ alignItems: 'center', padding: 10 }}>
                        {weather && <Image source={{uri: weather.icon}} style={{width: 50, height: 50}} />}
                        <Text style={{fontSize: 30, fontWeight: 'bold', color: '#fff'}}>{weather?.temp}°C</Text>
                        <Text style={{color: '#fff', fontSize: 12, textAlign: 'center', textTransform: 'capitalize'}}>{weather?.desc}</Text>
                    </Card.Content>
               </Card>
           </View>
        )}
        
        {/* Lời khuyên hiển thị dưới cùng */}
        {!loading && aqiData && (
             <View style={[styles.adviceBox, {backgroundColor: '#607D8B', marginBottom: 20}]}>
                <Text style={styles.adviceText}>📍 {aqiData.city}: {aqiData.advice}</Text>
             </View>
        )}

        <View style={{marginBottom: 20}}>
            <Text variant="titleMedium" style={{fontWeight: 'bold', marginBottom: 10, color: '#2E7D32'}}>🔥 Chiến dịch địa phương</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {CAMPAIGNS.map(camp => (
                    <Card key={camp.id} style={{width: 200, marginRight: 10, backgroundColor: '#E8F5E9'}}>
                        <Card.Title title={camp.title} subtitle={camp.date} titleStyle={{fontSize: 14, fontWeight: 'bold'}} />
                        <Card.Content><Text variant="bodySmall">📍 {camp.location}</Text></Card.Content>
                        <Card.Actions><Button compact>Tham gia</Button></Card.Actions>
                    </Card>
                ))}
            </ScrollView>
        </View>

        <View style={styles.grid}>
          <View style={styles.rowBtn}>
            <Button mode="contained" icon="camera" style={[styles.gridBtn, { backgroundColor: '#D32F2F', marginRight: 6 }]} contentStyle={{height: 70, flexDirection: 'column'}} labelStyle={{fontSize: 12}} onPress={() => router.push('/report' as any)}>Báo cáo</Button>
            <Button mode="contained" icon="history" style={[styles.gridBtn, { backgroundColor: '#FF9800', marginLeft: 6 }]} contentStyle={{height: 70, flexDirection: 'column'}} labelStyle={{fontSize: 12}} onPress={() => router.push('/history' as any)}>Lịch sử</Button>
          </View>
          <View style={styles.rowBtn}>
            <Button mode="contained" icon="recycle" style={[styles.gridBtn, { backgroundColor: '#4CAF50', marginRight: 6 }]} contentStyle={{height: 70, flexDirection: 'column'}} labelStyle={{fontSize: 12}} onPress={() => router.push('/waste' as any)}>Phân loại rác</Button>
            <Button mode="contained" icon="robot" style={[styles.gridBtn, { backgroundColor: '#1976D2', marginLeft: 6 }]} contentStyle={{height: 70, flexDirection: 'column'}} labelStyle={{fontSize: 12}} onPress={() => router.push('/chatbot' as any)}>Chatbot AI</Button>
          </View>
          <View style={styles.rowBtn}>
            <Button mode="contained" icon="account-group" style={[styles.gridBtn, { backgroundColor: '#009688', marginRight: 6 }]} contentStyle={{height: 70, flexDirection: 'column'}} labelStyle={{fontSize: 12}} onPress={() => router.push('/community' as any)}>Cộng đồng</Button>
            <Button mode="contained" icon="school" style={[styles.gridBtn, { backgroundColor: '#795548', marginLeft: 6 }]} contentStyle={{height: 70, flexDirection: 'column'}} labelStyle={{fontSize: 12}} onPress={() => router.push('/learn' as any)}>Học tập</Button>
          </View>
          <Button mode="contained" icon="map-marker-radius" style={[styles.fullBtn, { backgroundColor: '#00B8D4', marginTop: 5 }]} contentStyle={{height: 50}} onPress={() => router.push('/map' as any)}>Bản đồ Điểm Thu Gom</Button>
          <Button mode="contained" icon="gift" style={[styles.fullBtn, { backgroundColor: '#9C27B0', marginTop: 10 }]} contentStyle={{height: 50}} onPress={() => router.push('/rewards' as any)}>Đổi điểm & Quà tặng</Button>
          <View style={[styles.rowBtn, { marginTop: 10 }]}>
             <Button mode="outlined" icon="chart-bar" style={[styles.gridBtn, { marginRight: 6, borderColor: '#555' }]} contentStyle={{height: 50}} labelStyle={{color: '#333'}} onPress={() => router.push('/analytics' as any)}>Thống kê</Button>
            <Button mode="outlined" icon="cog" style={[styles.gridBtn, { marginLeft: 6, borderColor: '#555' }]} contentStyle={{height: 50}} labelStyle={{color: '#333'}} onPress={() => router.push('/settings' as any)}>Cài đặt</Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}