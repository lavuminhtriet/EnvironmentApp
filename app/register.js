import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import * as Location from 'expo-location'; 
import { Colors, Fonts } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const themeColor = Colors.light;

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) return Alert.alert('Yêu cầu', 'Vui lòng nhập đầy đủ thông tin');
    if (password !== confirmPassword) return Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
    if (password.length < 6) return Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');

    setLoading(true);
    try {
      // (Logic lấy vị trí giữ nguyên, rút gọn cho demo)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email, displayName: email.split('@')[0], role: 'user', createdAt: serverTimestamp(),
        photoURL: null, phoneNumber: '', address: 'Chưa cập nhật', badge: 'Tân binh', score: 0
      });
      Alert.alert('Thành công', 'Tài khoản đã được tạo. Vui lòng đăng nhập.');
      router.back();
    } catch (error) { Alert.alert('Đăng ký thất bại', error.message); } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} iconColor={themeColor.text} onPress={() => router.back()} style={{marginLeft: 0}} />
      </View>
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.content}>
        <View style={{marginBottom: 40}}>
            <Text style={[styles.title, { color: themeColor.text, fontFamily: Fonts.ios.serifTitle }]}>Tạo tài khoản</Text>
            <Text style={[styles.subtitle, { color: themeColor.icon }]}>Tham gia cộng đồng ECO LIFE ngay hôm nay</Text>
        </View>
        
        <View style={styles.form}>
            <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
                mode="flat" style={styles.input} textColor={themeColor.text} underlineColor={themeColor.border} activeUnderlineColor={themeColor.primary}
                left={<TextInput.Icon icon="email-outline" color={themeColor.icon} size={20}/>} />
            
            <TextInput label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry
                mode="flat" style={styles.input} textColor={themeColor.text} underlineColor={themeColor.border} activeUnderlineColor={themeColor.primary}
                left={<TextInput.Icon icon="lock-outline" color={themeColor.icon} size={20}/>} />

            <TextInput label="Xác nhận mật khẩu" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry
                mode="flat" style={styles.input} textColor={themeColor.text} underlineColor={themeColor.border} activeUnderlineColor={themeColor.primary}
                left={<TextInput.Icon icon="lock-check-outline" color={themeColor.icon} size={20}/>} />

            <Button mode="contained" onPress={handleRegister} loading={loading} 
                style={[styles.primaryBtn, { backgroundColor: themeColor.primary }]} contentStyle={styles.btnContent} labelStyle={styles.primaryBtnLabel}>
                ĐĂNG KÝ
            </Button>
        </View>

        <View style={styles.footer}>
          <Text style={{color: themeColor.icon}}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.link, { color: themeColor.primary }]}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 30 },
  header: { height: 60, justifyContent: 'center', alignItems: 'flex-start', marginTop: Platform.OS === 'android' ? 30 : 10 },
  content: { flex: 1, justifyContent: 'center', paddingBottom: 50 },
  
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16 },

  form: { width: '100%' },
  input: { backgroundColor: 'transparent', marginBottom: 15, fontSize: 16, height: 55, paddingLeft: 0 },
  
  primaryBtn: { borderRadius: 4, elevation: 0, marginTop: 20 },
  btnContent: { height: 54 },
  primaryBtnLabel: { fontSize: 15, fontWeight: '700', letterSpacing: 1.5 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  link: { fontWeight: 'bold', textDecorationLine: 'underline' }
});