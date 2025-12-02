import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Modal, Portal, IconButton, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter, Stack } from 'expo-router'; 
import { db, storage, auth } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addPoints } from '../utils/gamification';
import { useVideoPlayer, VideoView } from 'expo-video';
import { styles } from '../styles/report.styles';

const VideoPreview = ({ uri }) => {
  const player = useVideoPlayer(uri, player => {
    player.loop = true;
    player.play();
  });
  return (
    <View style={styles.videoContainer}>
      <VideoView style={styles.videoView} player={player} nativeControls={false} contentFit="cover" />
    </View>
  );
};

export default function ReportScreen() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [mediaUri, setMediaUri] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const [location, setLocation] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [tempCoord, setTempCoord] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setTempCoord({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      await ImagePicker.requestCameraPermissionsAsync();
    })();
  }, []);

  const handleImageResult = (result) => {
    if (!result.canceled) {
        setMediaUri(result.assets[0].uri);
        setMediaType(result.assets[0].type === 'video' ? 'video' : 'image');
    }
  };

  const openLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Lỗi', 'Cần quyền truy cập thư viện!'); return; }
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images', 'videos'], allowsEditing: false, quality: 0.5 });
    handleImageResult(result);
  };

  const openCamera = async (mode) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Lỗi', 'Cần quyền truy cập Camera!'); return; }
    let result = await ImagePicker.launchCameraAsync({ mediaTypes: mode === 'video' ? ['videos'] : ['images'], allowsEditing: false, quality: 0.5, videoMaxDuration: 60 });
    handleImageResult(result);
  };

  const showMediaOptions = () => {
      Alert.alert("Chọn bằng chứng", "", [
              { text: "Hủy", style: "cancel" },
              { text: "📸 Chụp ảnh", onPress: () => openCamera('image') },
              { text: "🎥 Quay video", onPress: () => openCamera('video') },
              { text: "🖼️ Thư viện", onPress: openLibrary },
          ], { cancelable: true }
      );
  };

  const confirmLocation = () => {
    if (tempCoord) {
        setLocation({ latitude: tempCoord.latitude, longitude: tempCoord.longitude, altitude: 0, accuracy: 0, altitudeAccuracy: 0, heading: 0, speed: 0 });
        setMapVisible(false);
    }
  };

  const uploadMedia = async (uri) => { 
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const ext = mediaType === 'video' ? 'mp4' : 'jpg';
      const filename = `reports/${Date.now()}.${ext}`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) { throw error; }
  };

  const handleSubmit = async () => {
    if (!description || !mediaUri) { Alert.alert('Thiếu thông tin', 'Vui lòng nhập mô tả và bằng chứng.'); return; }
    setUploading(true);
    try {
      const url = await uploadMedia(mediaUri);
      const currentUser = auth.currentUser;

      await addDoc(collection(db, "reports"), {
        userId: currentUser?.uid || 'guest', userEmail: currentUser?.email || 'Ẩn danh', description: description, mediaUrl: url, mediaType: mediaType,
        location: location ? { lat: location.latitude, lng: location.longitude } : null, status: 'pending', createdAt: serverTimestamp()
      });
      if (currentUser && !currentUser.isAnonymous) { await addPoints(10, "gửi báo cáo"); } 
      else { Alert.alert('Thành công', 'Báo cáo đã gửi!'); }
      router.back();
    } catch (error) { Alert.alert('Lỗi', error.message); } finally { setUploading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.headerBar}>
          <IconButton icon="arrow-left" onPress={() => router.back()} iconColor="#000" size={26} style={{marginLeft: -8}} />
          <Text style={styles.headerTitle}>Báo cáo vi phạm</Text>
          <IconButton icon="alert-circle-outline" iconColor="#D32F2F" size={26} onPress={() => Alert.alert("Lưu ý", "Hãy cung cấp hình ảnh rõ nét để chúng tôi xử lý nhanh nhất.")} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Phần 1: Upload Media */}
        <View style={styles.cardSection}>
            <View style={styles.labelRow}>
                <View style={[styles.iconBox, {backgroundColor: '#E8F5E9'}]}>
                    <IconButton icon="camera" size={20} iconColor='#1B5E20' />
                </View>
                <Text style={styles.cardLabel}>Bằng chứng (Ảnh/Video)</Text>
            </View>
            
            <TouchableOpacity onPress={showMediaOptions} activeOpacity={0.9} style={[styles.mediaContainer, mediaUri ? styles.mediaContainerFilled : null]}>
               {mediaUri ? (
                    <>
                        {mediaType === 'video' ? <VideoPreview uri={mediaUri} /> : <Image source={{ uri: mediaUri }} style={styles.previewImage} resizeMode="cover" />}
                        <View style={styles.floatingEditBtn}>
                            <Text style={styles.floatingEditText}>Thay đổi</Text>
                        </View>
                    </>
               ) : (
                 <View style={styles.uploadPlaceholder}>
                    <Avatar.Icon size={60} icon="cloud-upload" style={{backgroundColor: '#F5F5F5'}} color='#BDBDBD' />
                    <Text style={styles.uploadTextMain}>Chạm để tải lên</Text>
                    <Text style={styles.uploadTextSub}>Hỗ trợ Ảnh hoặc Video</Text>
                 </View>
               )}
            </TouchableOpacity>
        </View>

        {/* Phần 2: Vị trí */}
        <View style={styles.cardSection}>
            <View style={styles.labelRow}>
                <View style={[styles.iconBox, {backgroundColor: '#E0F7FA'}]}>
                     <IconButton icon="map-marker" size={20} iconColor='#006064' />
                </View>
                <Text style={styles.cardLabel}>Vị trí sự việc</Text>
            </View>
            
            <View style={styles.miniMapContainer}>
                <MapView 
                    provider={PROVIDER_GOOGLE}
                    style={styles.miniMap}
                    region={{
                        latitude: location?.latitude || 10.7769,
                        longitude: location?.longitude || 106.7009,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                >
                    {location && <Marker coordinate={{latitude: location.latitude, longitude: location.longitude}} />}
                </MapView>
            </View>

            <View style={styles.locationTextContainer}>
                <Text style={styles.locationAddress}>
                    {location ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : "Đang lấy toạ độ..."}
                </Text>
                <Button mode="outlined" onPress={() => setMapVisible(true)} compact style={styles.changeLocBtn} labelStyle={styles.changeLocText}>
                    Ghim trên bản đồ
                </Button>
            </View>
        </View>

        {/* Phần 3: Mô tả */}
        <View style={styles.cardSection}>
            <View style={styles.labelRow}>
                <View style={[styles.iconBox, {backgroundColor: '#FFF3E0'}]}>
                     <IconButton icon="pencil" size={20} iconColor='#E65100' />
                </View>
                <Text style={styles.cardLabel}>Chi tiết</Text>
            </View>
            <TextInput 
                placeholder="Mô tả chi tiết sự việc..."
                value={description} 
                onChangeText={setDescription} 
                mode="outlined" 
                multiline 
                style={styles.descInput} 
                outlineColor="#E0E0E0"
                activeOutlineColor="#1B5E20"
                textColor="#000"
                placeholderTextColor="#9E9E9E"
            />
        </View>

      </ScrollView>

      <View style={styles.submitBtnContainer}>
        <Button 
            mode="contained" 
            onPress={handleSubmit} 
            loading={uploading} 
            disabled={uploading} 
            style={styles.submitBtn}
            labelStyle={styles.submitBtnLabel}
            icon={uploading ? undefined : "send"}
        >
          {uploading ? 'ĐANG GỬI...' : 'GỬI BÁO CÁO'}
        </Button>
      </View>

      <Portal>
        <Modal visible={mapVisible} onDismiss={() => setMapVisible(false)} contentContainerStyle={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <IconButton icon="close" onPress={() => setMapVisible(false)} iconColor="#000" size={24} />
                <Text style={styles.modalTitle}>Chọn vị trí</Text>
                <View style={{width: 40}} /> 
            </View>
            <View style={styles.mapWrapper}>
                <MapView provider={PROVIDER_GOOGLE} style={{flex: 1}} initialRegion={{ latitude: location?.latitude || 10.7769, longitude: location?.longitude || 106.7009, latitudeDelta: 0.005, longitudeDelta: 0.005 }} onPress={(e) => setTempCoord(e.nativeEvent.coordinate)}>
                    {tempCoord && <Marker coordinate={tempCoord} />}
                </MapView>
                <View style={styles.confirmLocBtnContainer}>
                     <Button mode="contained" onPress={confirmLocation} style={styles.confirmLocBtn} labelStyle={{fontWeight: 'bold', fontSize: 16}}>
                        Xác nhận vị trí này
                     </Button>
                </View>
            </View>
        </Modal>
      </Portal>
    </KeyboardAvoidingView>
  );
}