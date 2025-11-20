import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, List, Switch, Divider, Button, Appbar, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
export default function SettingsScreen() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [aqiAlert, setAqiAlert] = useState(true);
  const [aqiThreshold, setAqiThreshold] = useState(100);
  const [dailyTip, setDailyTip] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@user_settings');
        if (jsonValue != null) {
          const data = JSON.parse(jsonValue);
          setPushEnabled(data.pushEnabled);
          setAqiAlert(data.aqiAlert);
          setAqiThreshold(data.aqiThreshold);
          setDailyTip(data.dailyTip);
        }
      } catch {
        console.error("Lỗi load settings");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    const settings = { pushEnabled, aqiAlert, aqiThreshold, dailyTip };
    try {
      await AsyncStorage.setItem('@user_settings', JSON.stringify(settings));
      Alert.alert("Đã lưu", "Cài đặt của bạn đã được cập nhật.");
      router.back();
    } catch {
      Alert.alert("Lỗi", "Không thể lưu cài đặt.");
    }
  };



  const scheduleGarbageReminder = async () => {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "🚛 Nhắc nhở đổ rác",
                body: "Đã đến giờ thu gom rác tái chế! Hãy mang rác ra đúng nơi quy định.",
                sound: 'default',
            },
            // [FIX LỖI ĐỎ] Sử dụng 'as const' để ép kiểu cho TypeScript
            trigger: { 
                type: 'timeInterval' as const, // Thêm 'as const'
                seconds: 5, 
                repeats: false 
            }, 
        });
        Alert.alert("Thành công", "Đã đặt lịch nhắc! Bạn sẽ nhận thông báo sau 5 giây (Demo).");
    } catch {
        Alert.alert("Lỗi", "Không thể đặt lịch thông báo.");
    }
};








  if (loading) return <ActivityIndicator style={{marginTop: 50}} color="#2E7D32" />;

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: '#fff', elevation: 4}}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Cài đặt & Thông báo" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        
        <List.Section>
          <List.Subheader>Thông báo chung</List.Subheader>
          <List.Item
            title="Nhận thông báo đẩy"
            description="Tin tức, sự kiện môi trường"
            right={() => <Switch value={pushEnabled} onValueChange={setPushEnabled} color="#2E7D32" />}
          />
          <List.Item
            title="Mẹo sống xanh mỗi ngày"
            description="Nhận lời khuyên vào 8:00 sáng"
            right={() => <Switch value={dailyTip} onValueChange={setDailyTip} color="#2E7D32" />}
          />
          
          <List.Item
            title="Đặt nhắc nhở đổ rác"
            description="Demo: Nhắc sau 5 giây"
            left={() => <List.Icon icon="delete-clock" color="#F57C00"/>}
            onPress={scheduleGarbageReminder}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Cảnh báo chất lượng không khí</List.Subheader>
          <List.Item
            title="Cảnh báo AQI nguy hại"
            description="Khi chỉ số vượt ngưỡng an toàn"
            right={() => <Switch value={aqiAlert} onValueChange={setAqiAlert} color="#D32F2F" />}
          />
          
          {aqiAlert && (
            <View style={styles.thresholdBox}>
              <Text style={{marginBottom: 10}}>Ngưỡng cảnh báo AQI: {aqiThreshold}</Text>
              <View style={styles.thresholdButtons}>
                <Button mode={aqiThreshold === 50 ? 'contained' : 'outlined'} onPress={() => setAqiThreshold(50)} compact>50 (Tốt)</Button>
                <Button mode={aqiThreshold === 100 ? 'contained' : 'outlined'} onPress={() => setAqiThreshold(100)} compact>100 (TB)</Button>
                <Button mode={aqiThreshold === 150 ? 'contained' : 'outlined'} onPress={() => setAqiThreshold(150)} compact>150 (Kém)</Button>
              </View>
              <Text style={styles.note}>*Chỉ nhận thông báo khi AQI cao hơn mức này.</Text>
            </View>
          )}
        </List.Section>

        <Divider />

        <Button mode="contained" onPress={handleSave} style={styles.saveBtn}>
          Lưu Cài Đặt
        </Button>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { paddingBottom: 20 },
  thresholdBox: { padding: 15, backgroundColor: '#fff', marginHorizontal: 15, borderRadius: 8, marginBottom: 10 },
  thresholdButtons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  note: { fontSize: 12, color: '#888', fontStyle: 'italic' },
  saveBtn: { margin: 20, backgroundColor: '#2E7D32' }
});