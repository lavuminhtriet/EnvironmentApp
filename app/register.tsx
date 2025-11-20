import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Validate dữ liệu đầu vào
    if (!email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      // 2. Tạo tài khoản Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Tạo hồ sơ User trong Firestore (Quan trọng cho FR-1.2)
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: email.split('@')[0], // Tạm lấy tên từ email
        role: 'user',
        createdAt: serverTimestamp(),
        photoURL: null,
        phoneNumber: ''
      });

      Alert.alert('Thành công', 'Tài khoản đã được tạo! Mời bạn đăng nhập.');
      router.replace('/'); // Quay về màn hình đăng nhập

    } catch (error: any) {
      let msg = error.message;
      if (error.code === 'auth/email-already-in-use') msg = 'Email này đã được đăng ký!';
      if (error.code === 'auth/invalid-email') msg = 'Email không hợp lệ!';
      Alert.alert('Đăng ký thất bại', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
    >
      <View style={styles.container}>
        <Title style={styles.title}>Đăng Ký Mới</Title>
        <Text style={styles.subtitle}>Tạo tài khoản để tham gia cộng đồng xanh</Text>
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          label="Nhập lại mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={handleRegister} 
          loading={loading} 
          style={styles.button}
          contentStyle={{height: 50}}
        >
          Đăng Ký
        </Button>

        <View style={styles.row}>
          <Text>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#2E7D32' },
  subtitle: { textAlign: 'center', marginBottom: 30, color: '#666' },
  input: { marginBottom: 15, backgroundColor: '#fff' },
  button: { marginTop: 10, backgroundColor: '#2E7D32', borderRadius: 8 },
  row: { flexDirection: 'row', marginTop: 20, justifyContent: 'center' },
  link: { fontWeight: 'bold', color: '#2E7D32' }
});