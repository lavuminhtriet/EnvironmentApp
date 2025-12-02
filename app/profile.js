import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Avatar, ActivityIndicator, List, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, Stack } from 'expo-router';
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
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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
      if (isNewAvatarSelected && avatar) { 
        const response = await fetch(avatar);
        const blob = await response.blob();
        const filename = `avatars/${user.uid}.jpg`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", user.uid), { displayName: name, phoneNumber: phone, address: address, photoURL: photoURL, email: user.email }, { merge: true });
      Alert.alert('Thành công', 'Hồ sơ đã được cập nhật!');
    } catch (error) { 
      Alert.alert('Lỗi', 'Không thể lưu hồ sơ.'); 
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
              Alert.alert("Đã xóa", "Tài khoản đã bị xóa.");
              router.replace('/');
            } catch { Alert.alert("Lỗi", "Vui lòng đăng nhập lại trước khi xóa."); } finally { setLoading(false); }
          }}
      ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#0E4626"/></View>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <IconButton icon="arrow-left" iconColor="#fff" size={24} style={styles.backBtn} onPress={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerBackground}>
            <Text style={styles.headerTitle}>Hồ Sơ Cá Nhân</Text>
        </View>

        <View style={styles.mainContent}>
            
            <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={pickImage} activeOpacity={0.9}>
                    <View style={styles.avatarWrapper}>
                        {avatar ? ( <Image source={{ uri: avatar }} style={styles.avatarImage} resizeMode="cover" /> ) : ( <Avatar.Icon size={110} icon="account" style={{backgroundColor: '#E0E0E0'}} color='#fff' /> )}
                    </View>
                    <View style={styles.editBadge}>
                        <IconButton icon="camera" size={16} iconColor="#fff" onPress={pickImage} style={{margin:0}} />
                    </View>
                </TouchableOpacity>
                
                <Text style={styles.userName}>{name || "Chưa đặt tên"}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
            </View>

            
            <View style={styles.cardSection}>
                <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Họ và tên</Text>
                    <TextInput 
                        value={name} 
                        onChangeText={setName} 
                        mode="outlined" 
                        style={styles.inputField}
                        outlineStyle={styles.inputOutline}
                        activeOutlineColor="#0E4626" 
                        outlineColor="#E0E0E0"       
                        textColor="#000"             
                        placeholder="Nhập họ tên..."
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Số điện thoại</Text>
                    <TextInput 
                        value={phone} 
                        onChangeText={setPhone} 
                        mode="outlined" 
                        keyboardType="phone-pad" 
                        style={styles.inputField} 
                        outlineStyle={styles.inputOutline}
                        activeOutlineColor="#0E4626"
                        outlineColor="#E0E0E0"
                        textColor="#000"
                        placeholder="Nhập số điện thoại..."
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Khu vực sinh sống</Text>
                    <TextInput 
                        value={address} 
                        onChangeText={setAddress} 
                        mode="outlined" 
                        style={styles.inputField} 
                        outlineStyle={styles.inputOutline}
                        activeOutlineColor="#0E4626"
                        outlineColor="#E0E0E0"
                        textColor="#000"
                        placeholder="Nhập địa chỉ..."
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            
            <Button 
                mode="contained" 
                onPress={handleSave} 
                loading={saving} 
                style={styles.saveBtn} 
                labelStyle={styles.saveBtnLabel}
                icon="content-save"
            >
                LƯU THAY ĐỔI
            </Button>

            <View style={styles.menuSection}>
                <List.Item 
                    title="Đăng xuất" 
                    left={props => <List.Icon {...props} icon="logout" color="#FF9800" />} 
                    onPress={handleLogout} 
                    style={styles.menuItem}
                    titleStyle={{fontWeight: '600', color: '#444'}}
                    right={props => <List.Icon {...props} icon="chevron-right" color="#ccc" />}
                />
                <List.Item 
                    title="Xóa tài khoản vĩnh viễn" 
                    description="Hành động không thể hoàn tác"
                    left={props => <List.Icon {...props} icon="delete-forever" color="#D32F2F" />} 
                    onPress={handleDeleteAccount} 
                    style={[styles.menuItem, {backgroundColor: '#FFEBEE', borderColor: '#FFCDD2'}]}
                    titleStyle={{fontWeight: 'bold', color: '#D32F2F'}}
                    descriptionStyle={{color: '#B71C1C', fontSize: 12}}
                />
            </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}