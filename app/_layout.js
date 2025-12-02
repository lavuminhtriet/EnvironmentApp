import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper'; 

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    
    <PaperProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="register" options={{ headerShown: true, title: 'Đăng Ký' }} />
          <Stack.Screen name="profile" options={{ headerShown: true, title: 'Hồ Sơ Cá Nhân' }} />
          <Stack.Screen name="report" options={{ headerShown: true, title: 'Báo Cáo Vi Phạm' }} />
          <Stack.Screen name="history" options={{ headerShown: true, title: 'Lịch Sử Báo Cáo' }} />
          <Stack.Screen name="waste" options={{ headerShown: true, title: 'Phân Loại Rác AI' }} />
          <Stack.Screen name="chatbot" options={{ headerShown: false }} />
          <Stack.Screen name="community" options={{ headerShown: false }} />
          <Stack.Screen name="learn" options={{ headerShown: false }} />
          <Stack.Screen name="map" options={{ headerShown: false }} />
          <Stack.Screen name="rewards" options={{ headerShown: true, title: 'Đổi Quà' }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="analytics" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}