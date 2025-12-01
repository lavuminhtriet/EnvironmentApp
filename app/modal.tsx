import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      <StatusBar style="light" />
      
      <Text variant="headlineMedium" style={styles.title}>Thông báo</Text>
      <Text variant="bodyMedium" style={styles.message}>
        Đây là màn hình Modal mẫu. Bạn có thể dùng nó để hiển thị chi tiết thông tin hoặc xác nhận hành động.
      </Text>

      
      <Button 
        mode="contained" 
        onPress={() => router.back()} 
        style={styles.button}
        buttonColor="#2E7D32"
      >
        Đóng
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2E7D32',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
});