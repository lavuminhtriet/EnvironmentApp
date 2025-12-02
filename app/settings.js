import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, TouchableOpacity, Switch, Platform } from 'react-native';
import { Text, Button, ActivityIndicator, IconButton, Avatar } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker'; 

import { styles } from '../styles/settings.styles';

export default function SettingsScreen() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [aqiAlert, setAqiAlert] = useState(true);
  const [aqiThreshold, setAqiThreshold] = useState(100);
  const [dailyTip, setDailyTip] = useState(true);
  
  // State mới cho giờ thông báo
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

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
          if (data.reminderTime) setReminderTime(new Date(data.reminderTime));
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
    const settings = { pushEnabled, aqiAlert, aqiThreshold, dailyTip, reminderTime: reminderTime.toString() };
    try {
      await AsyncStorage.setItem('@user_settings', JSON.stringify(settings));
      Alert.alert("Đã lưu", "Cài đặt của bạn đã được cập nhật.");
      router.back();
    } catch {
      Alert.alert("Lỗi", "Không thể lưu cài đặt.");
    }
  };

  const handleTimeChange = (event, selectedDate) => {
      setShowTimePicker(false);
      if (selectedDate) {
          setReminderTime(selectedDate);
          scheduleDailyReminder(selectedDate);
      }
  };

  const scheduleDailyReminder = async (date) => {
      if (!pushEnabled) return;
      try {
          await Notifications.cancelAllScheduledNotificationsAsync();
          
          const trigger = {
              hour: date.getHours(),
              minute: date.getMinutes(),
              repeats: true,
          };

          await Notifications.scheduleNotificationAsync({
              content: {
                  title: "🚛 Nhắc nhở đổ rác",
                  body: "Đã đến giờ thu gom rác! Hãy chung tay bảo vệ môi trường.",
                  sound: 'default',
              },
              trigger,
          });
          
          Alert.alert("Đã đặt lịch", `Bạn sẽ nhận thông báo vào ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')} hàng ngày.`);
      } catch (e) {
          Alert.alert("Lỗi", "Không thể đặt lịch thông báo. Hãy kiểm tra quyền.");
      }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#0E4626" /></View>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerBar}>
        <IconButton icon="arrow-left" onPress={() => router.back()} iconColor="#0E4626" size={26} style={styles.backBtn} />
        <Text style={styles.headerTitle}>Cài Đặt</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>Thông báo & Tiện ích</Text>
        <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
                <View style={styles.itemLeft}>
                    <View style={[styles.iconBox, {backgroundColor: '#E3F2FD'}]}>
                        <Avatar.Icon size={24} icon="bell-ring" style={{backgroundColor:'transparent'}} color='#1565C0' />
                    </View>
                    <View>
                        <Text style={styles.itemTitle}>Thông báo đẩy</Text>
                        <Text style={styles.itemDesc}>Tin tức, sự kiện môi trường</Text>
                    </View>
                </View>
                <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{false: '#E0E0E0', true: '#A5D6A7'}} thumbColor={pushEnabled ? '#2E7D32' : '#f4f3f4'} />
            </View>

            <TouchableOpacity style={[styles.settingRow, styles.lastRow]} onPress={() => setShowTimePicker(true)}>
                <View style={styles.itemLeft}>
                    <View style={[styles.iconBox, {backgroundColor: '#F3E5F5'}]}>
                        <Avatar.Icon size={24} icon="clock-outline" style={{backgroundColor:'transparent'}} color='#7B1FA2' />
                    </View>
                    <View>
                        <Text style={styles.itemTitle}>Giờ nhắc đổ rác</Text>
                        <Text style={styles.itemDesc}>
                            {reminderTime.getHours().toString().padStart(2,'0')}:{reminderTime.getMinutes().toString().padStart(2,'0')} hàng ngày
                        </Text>
                    </View>
                </View>
                <IconButton icon="pencil" size={24} iconColor="#ccc" style={{margin:0}} />
            </TouchableOpacity>

            {showTimePicker && (
                <DateTimePicker
                    value={reminderTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
        </View>

        <Text style={styles.sectionHeader}>Cảnh báo môi trường</Text>
        <View style={styles.settingsCard}>
            <View style={[styles.settingRow, !aqiAlert && styles.lastRow]}>
                <View style={styles.itemLeft}>
                    <View style={[styles.iconBox, {backgroundColor: '#FFEBEE'}]}>
                        <Avatar.Icon size={24} icon="alert-octagon" style={{backgroundColor:'transparent'}} color='#D32F2F' />
                    </View>
                    <View>
                        <Text style={styles.itemTitle}>Cảnh báo AQI nguy hại</Text>
                        <Text style={styles.itemDesc}>Khi không khí ô nhiễm nặng</Text>
                    </View>
                </View>
                <Switch value={aqiAlert} onValueChange={setAqiAlert} trackColor={{false: '#E0E0E0', true: '#EF9A9A'}} thumbColor={aqiAlert ? '#C62828' : '#f4f3f4'} />
            </View>

            {aqiAlert && (
                <View style={styles.thresholdContainer}>
                    <Text style={styles.thresholdLabel}>Ngưỡng thông báo (AQI): {aqiThreshold}</Text>
                    <View style={styles.thresholdRow}>
                        <Button 
                            mode="outlined" onPress={() => setAqiThreshold(50)} 
                            style={[styles.thresholdBtn, aqiThreshold === 50 && styles.thresholdBtnActive]}
                            labelStyle={{color: aqiThreshold === 50 ? '#0E4626' : '#666', fontWeight:'bold'}} compact
                        >50</Button>
                        <Button 
                            mode="outlined" onPress={() => setAqiThreshold(100)} 
                            style={[styles.thresholdBtn, aqiThreshold === 100 && styles.thresholdBtnActive]}
                            labelStyle={{color: aqiThreshold === 100 ? '#0E4626' : '#666', fontWeight:'bold'}} compact
                        >100</Button>
                        <Button 
                            mode="outlined" onPress={() => setAqiThreshold(150)} 
                            style={[styles.thresholdBtn, aqiThreshold === 150 && styles.thresholdBtnActive]}
                            labelStyle={{color: aqiThreshold === 150 ? '#3cba1aff' : '#666', fontWeight:'bold'}} compact
                        >150</Button>
                    </View>
                </View>
            )}
        </View>

        <Button 
            mode="contained" onPress={handleSave} style={styles.saveBtn}
            labelStyle={styles.saveBtnLabel} icon="check"
        >LƯU CÀI ĐẶT</Button>
      </ScrollView>
    </View>
  );
}