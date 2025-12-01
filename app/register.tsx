import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Text, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import * as Location from 'expo-location'; 

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>(''); 

  
  const getCurrentAddress = async (): Promise<string> => {
    try {
      setLocationStatus('Đang lấy vị trí...');
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return ''; 
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      
      
      let addressList = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (addressList.length > 0) {
        const addr = addressList[0];
        
        const district = addr.district || addr.subregion || '';
        const city = addr.city || addr.region || '';
        return `${district}, ${city}`.replace(/^, /, ''); 
      }
      return '';
    } catch (error) {
      console.log("Lỗi lấy vị trí:", error);
      return '';
    } finally {
      setLocationStatus('');
    }
  };

  const handleRegister = async () => {
    
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
      
      const detectedAddress = await getCurrentAddress();

      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: email.split('@')[0],
        role: 'user',
        createdAt: serverTimestamp(),
        photoURL: null,
        phoneNumber: '',
        address: detectedAddress || 'Chưa cập nhật', 
        badge: 'Tân binh', 
        score: 0
      });

      Alert.alert(
        'Thành công', 
        `Tài khoản đã được tạo!\n(Khu vực mặc định: ${detectedAddress || 'Không xác định'})`
      );
      router.replace('/'); 

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

        
        {locationStatus ? <Text style={{textAlign: 'center', color: '#666', marginBottom: 10}}>{locationStatus}</Text> : null}

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