import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { db, storage, auth } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Video, ResizeMode } from 'expo-av'; // [MỚI] Import Video
import { styles } from '../styles/report.styles';

export default function ReportScreen() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null); // Đổi tên từ imageUri -> mediaUri
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image'); // [MỚI] Lưu loại file
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Lỗi', 'Cần quyền thư viện!'); return; }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'], // [MỚI] Cho phép cả Video - FR-4.1.1
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
        setMediaUri(result.assets[0].uri);
        setMediaType(result.assets[0].type === 'video' ? 'video' : 'image');
    }
  };

  const uploadMedia = async (uri: string) => { 
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      // Đặt đuôi file đúng loại
      const ext = mediaType === 'video' ? 'mp4' : 'jpg';
      const filename = `reports/${Date.now()}.${ext}`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error: any) { throw error; }
  };

  const handleSubmit = async () => {
    if (!description || !mediaUri) { Alert.alert('Thiếu thông tin', 'Nhập mô tả và chọn ảnh/video.'); return; }
    setUploading(true);
    try {
      const url = await uploadMedia(mediaUri);
      const currentUser = auth.currentUser;

      await addDoc(collection(db, "reports"), {
        userId: currentUser?.uid || 'guest',
        userEmail: currentUser?.email || 'Ẩn danh',
        description: description,
        mediaUrl: url, // Đổi tên trường
        mediaType: mediaType, // Lưu loại file
        location: location ? { lat: location.latitude, lng: location.longitude } : null,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      if (currentUser && !currentUser.isAnonymous) {
          const userRef = doc(db, "users", currentUser.uid);
          await updateDoc(userRef, { score: increment(10) });
          Alert.alert('Thành công', '+10 điểm thưởng! 🌿');
      } else {
          Alert.alert('Thành công', 'Báo cáo đã gửi!');
      }
      router.back();
    } catch (error: any) { Alert.alert('Lỗi', error.message); } finally { setUploading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineSmall" style={styles.header}>Báo cáo vi phạm</Text>
        <Text style={styles.subHeader}>Chụp ảnh hoặc quay video hành vi vi phạm.</Text>

        <Card style={styles.imageCard} onPress={pickMedia}>
           {mediaUri ? (
             // [MỚI] Logic hiển thị Video hoặc Ảnh
             mediaType === 'video' ? (
                <Video
                    style={styles.imagePreview}
                    source={{ uri: mediaUri }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                />
             ) : (
                <Image source={{ uri: mediaUri }} style={styles.imagePreview} />
             )
           ) : (
             <View style={styles.placeholder}><Button icon="camera" mode="text">Chọn Ảnh/Video</Button></View>
           )}
        </Card>
        
        <Button mode="outlined" onPress={pickMedia} style={{marginBottom: 20}}>Đổi file khác</Button>

        <TextInput label="Mô tả sự việc" value={description} onChangeText={setDescription} mode="outlined" multiline numberOfLines={4} style={styles.input} />
        
        <View style={styles.locationBox}>
          <Text variant="bodySmall" style={{color: location ? '#2E7D32' : '#F44336'}}>
             {location ? `✅ Vị trí: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : '📍 Đang lấy vị trí...'}
          </Text>
        </View>

        <Button mode="contained" onPress={handleSubmit} loading={uploading} disabled={uploading} style={styles.submitBtn} contentStyle={{height: 50}}>
          {uploading ? 'Đang gửi...' : 'GỬI BÁO CÁO'}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}