import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Avatar, ActivityIndicator, Divider, List, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { deleteUser } from 'firebase/auth';
import { styles } from '../styles/profile.styles';

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Kiểm tra xem Avatar là URI local mới hay đã là URL Firebase
  const isNewAvatarSelected = avatar && !avatar.startsWith('http');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.displayName || '');
          setPhone(data.phoneNumber || '');
          setAddress(data.address || '');
          setAvatar(data.photoURL || null);
        } else {
            setName(user.email?.split('@')[0] || 'User');
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchUserData();
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Lỗi', 'Cần quyền truy cập ảnh!'); return; }
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let photoURL = avatar;
      
      // [QUAN TRỌNG] Chỉ upload nếu ảnh là URI mới (chưa có http)
      if (isNewAvatarSelected) { 
        const response = await fetch(avatar);
        const blob = await response.blob();
        const filename = `avatars/${user.uid}.jpg`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(storageRef);
      }
      
      // Lưu tất cả (bao gồm photoURL mới hoặc cũ) vào Firestore
      await setDoc(doc(db, "users", user.uid), { displayName: name, phoneNumber: phone, address: address, photoURL: photoURL, email: user.email }, { merge: true });
      Alert.alert('Thành công', 'Hồ sơ đã được cập nhật!');
    } catch (error) { 
      console.error("Lỗi lưu hồ sơ:", error); 
      Alert.alert('Lỗi', 'Không thể lưu hồ sơ. Vui lòng kiểm tra lại'); 
    } finally { setSaving(false); }
  };

  const handleLogout = async () => { await auth.signOut(); router.replace('/'); };

  const handleDeleteAccount = () => {
    Alert.alert("Cảnh báo nguy hiểm", "Bạn có chắc muốn xóa vĩnh viễn tài khoản?", [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa ngay", style: "destructive", onPress: async () => {
            if (!user) return;
            try {
              setLoading(true);
              await deleteDoc(doc(db, "users", user.uid));
              await deleteUser(user);
              Alert.alert("Đã xóa", "Tài khoản đã bị xóa vĩnh viễn.");
              router.replace('/');
            } catch { Alert.alert("Lỗi", "Vui lòng đăng nhập lại trước khi thực hiện thao tác này."); } finally { setLoading(false); }
          }}
      ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2E7D32"/></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          {avatar ? ( <Image source={{ uri: avatar }} style={styles.avatar} /> ) : ( <Avatar.Icon size={100} icon="account" style={{backgroundColor: '#e0e0e0'}} /> )}
          <View style={styles.editBadge}><Text style={{color: '#fff', fontSize: 10}}>Sửa</Text></View>
        </TouchableOpacity>
        
        <Text variant="headlineSmall" style={{marginTop: 10, fontWeight: 'bold'}}>{user?.email}</Text>
        
        {/* Hiển thị chip cảnh báo khi ảnh mới đã chọn nhưng chưa lưu */}
        {isNewAvatarSelected && (
            <Chip icon="content-save" style={{marginTop: 5}} textStyle={{fontWeight: 'bold'}} onPress={handleSave}>
                Nhấn "Lưu thay đổi" để áp dụng ảnh mới!
            </Chip>
        )}
      </View>

      <View style={styles.form}>
        <TextInput label="Họ và tên" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
        <TextInput label="Số điện thoại" value={phone} onChangeText={setPhone} mode="outlined" keyboardType="phone-pad" style={styles.input} />
        <TextInput label="Khu vực sống" value={address} onChangeText={setAddress} mode="outlined" style={styles.input} />
        <Button mode="contained" onPress={handleSave} loading={saving} style={styles.saveBtn}>Lưu thay đổi</Button>
      </View>
      <Divider style={{marginVertical: 20}} />
      <List.Section>
        <List.Subheader>Cài đặt & Bảo mật</List.Subheader>
        <List.Item title="Đăng xuất" left={() => <List.Icon icon="logout" color="#F44336" />} onPress={handleLogout} titleStyle={{color: '#F44336'}} />
        <List.Item title="Xóa tài khoản" description="Hành động không thể hoàn tác" left={() => <List.Icon icon="delete-forever" color="#D32F2F" />} onPress={handleDeleteAccount} titleStyle={{color: '#D32F2F'}} />
      </List.Section>
    </ScrollView>
  );
}