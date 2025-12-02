import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors, Fonts } from '@/constants/theme';

export default function ModalScreen() {
  const router = useRouter();
  // Nhận title và message truyền từ các trang khác sang
  const params = useLocalSearchParams();
  const title = params.title || 'Thông báo';
  const message = params.message || 'Nội dung thông báo mặc định.';
  const type = params.type || 'info'; // info, success, error

  const themeColor = Colors.light;

  let iconName = 'information-outline';
  let iconColor = themeColor.primary;

  if (type === 'success') { iconName = 'check-circle-outline'; iconColor = themeColor.success; }
  else if (type === 'error') { iconName = 'alert-circle-outline'; iconColor = themeColor.danger; }

  return (
    <View style={[styles.container, { backgroundColor: themeColor.background }]}>
      <StatusBar style="dark" />
      
      <View style={styles.dialogCard}>
          <View style={styles.iconContainer}>
             <IconButton icon={iconName} size={50} iconColor={iconColor} style={{margin: 0}} />
          </View>
          
          <Text style={[styles.title, { color: themeColor.text, fontFamily: Fonts.ios.serifTitle }]}>
            {title}
          </Text>
          
          <Text style={[styles.message, { color: themeColor.icon }]}>
            {message}
          </Text>

          <View style={styles.buttonRow}>
            <Button 
                mode="contained" 
                onPress={() => router.back()} 
                style={[styles.button, { backgroundColor: themeColor.primary }]}
                contentStyle={{height: 48}}
                labelStyle={{fontWeight: '700', letterSpacing: 1}}
            >
              ĐÓNG
            </Button>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    // Làm nền mờ đằng sau (nếu hỗ trợ)
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  dialogCard: {
      backgroundColor: '#fff',
      borderRadius: 4, // Bo góc ít để sang
      padding: 30,
      width: '100%',
      alignItems: 'center',
      elevation: 10, // Đổ bóng nhẹ
      shadowColor: '#000', shadowOffset: {width: 0, height: 5}, shadowOpacity: 0.1, shadowRadius: 10
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24
  },
  buttonRow: {
      width: '100%',
  },
  button: {
    width: '100%',
    borderRadius: 4,
  },
});