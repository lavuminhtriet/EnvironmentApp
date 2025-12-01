import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, TouchableOpacity, Switch } from 'react-native';
import { Text, Button, ActivityIndicator, IconButton, Avatar } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import { styles } from '../styles/settings.styles';

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
              trigger: { 
                  type: 'timeInterval', 
                  seconds: 5, 
                  repeats: false 
              } as any, 
          });
          Alert.alert("Thành công", "Đã đặt lịch nhắc! Bạn sẽ nhận thông báo sau 5 giây (Demo).");
      } catch {
          Alert.alert("Lỗi", "Không thể đặt lịch thông báo.");
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

            
            <View style={styles.settingRow}>
                <View style={styles.itemLeft}>
                    <View style={[styles.iconBox, {backgroundColor: '#FFF3E0'}]}>
                        <Avatar.Icon size={24} icon="lightbulb-on" style={{backgroundColor:'transparent'}} color='#EF6C00' />
                    </View>
                    <View>
                        <Text style={styles.itemTitle}>Mẹo sống xanh</Text>
                        <Text style={styles.itemDesc}>Nhận lời khuyên mỗi sáng</Text>
                    </View>
                </View>
                <Switch value={dailyTip} onValueChange={setDailyTip} trackColor={{false: '#E0E0E0', true: '#A5D6A7'}} thumbColor={dailyTip ? '#2E7D32' : '#f4f3f4'} />
            </View>

            
            <TouchableOpacity style={[styles.settingRow, styles.lastRow]} onPress={scheduleGarbageReminder}>
                <View style={styles.itemLeft}>
                    <View style={[styles.iconBox, {backgroundColor: '#F3E5F5'}]}>
                        <Avatar.Icon size={24} icon="truck" style={{backgroundColor:'transparent'}} color='#7B1FA2' />
                    </View>
                    <View>
                        <Text style={styles.itemTitle}>Đặt lịch đổ rác</Text>
                        <Text style={styles.itemDesc}>Demo: Nhắc sau 5 giây</Text>
                    </View>
                </View>
                <IconButton icon="chevron-right" size={24} iconColor="#ccc" style={{margin:0}} />
            </TouchableOpacity>
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
                            mode="outlined" 
                            onPress={() => setAqiThreshold(50)} 
                            style={[styles.thresholdBtn, aqiThreshold === 50 && styles.thresholdBtnActive]}
                            labelStyle={{color: aqiThreshold === 50 ? '#0E4626' : '#666', fontWeight:'bold'}}
                            compact
                        >
                            50 (Tốt)
                        </Button>
                        <Button 
                            mode="outlined" 
                            onPress={() => setAqiThreshold(100)} 
                            style={[styles.thresholdBtn, aqiThreshold === 100 && styles.thresholdBtnActive]}
                            labelStyle={{color: aqiThreshold === 100 ? '#0E4626' : '#666', fontWeight:'bold'}}
                            compact
                        >
                            100 (TB)
                        </Button>
                        <Button 
                            mode="outlined" 
                            onPress={() => setAqiThreshold(150)} 
                            style={[styles.thresholdBtn, aqiThreshold === 150 && styles.thresholdBtnActive]}
                            labelStyle={{color: aqiThreshold === 150 ? '#3cba1aff' : '#666', fontWeight:'bold'}}
                            compact
                        >
                            150 (Kém)
                        </Button>
                    </View>
                    <Text style={styles.note}>*Hệ thống sẽ gửi thông báo khi chỉ số vượt quá mức này.</Text>
                </View>
            )}
        </View>

        <Button 
            mode="contained" 
            onPress={handleSave} 
            style={styles.saveBtn}
            labelStyle={styles.saveBtnLabel}
            icon="check"
        >
          LƯU CÀI ĐẶT
        </Button>

      </ScrollView>
    </View>
  );
}

