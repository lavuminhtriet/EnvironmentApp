import React, { useState } from 'react';
import { ScrollView, Image, Alert, Keyboard, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Chip, IconButton, Portal, Modal, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; // Dùng legacy API cho việc đọc file
import { useRouter, Stack } from 'expo-router';
import { styles } from '../styles/waste.styles';

// --- IMPORTS CẦN THIẾT CHO CỘNG ĐIỂM ---
import { auth } from '../firebaseConfig'; // Import Auth để kiểm tra trạng thái đăng nhập
import { addPoints } from '../utils/gamification'; // Import hàm cộng điểm
// ---------------------------------------

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export default function WasteScreen() {
  const [input, setInput] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần quyền truy cập thư viện!');
      return;
    }
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!res.canceled) {
      setImageUri(res.assets[0].uri);
      setResult(null);
      setShowModal(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần quyền truy cập Camera!');
      return;
    }
    let res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!res.canceled) {
      setImageUri(res.assets[0].uri);
      setResult(null);
      setShowModal(false);
    }
  };

  const identifyWaste = async (manualText) => {
    const textToAnalyze = manualText || input;

    if (!textToAnalyze && !imageUri) {
      Alert.alert('Thông báo', 'Hãy nhập tên rác hoặc chọn ảnh.');
      return;
    }

    if (!GEMINI_API_KEY) {
      Alert.alert("Lỗi Cấu Hình", "Chưa tìm thấy API Key.");
      return;
    }

    setLoading(true);
    setResult(null);
    Keyboard.dismiss();

    try {
      let requestBody;

      // Xử lý có ảnh (Visual Multimodal)
      if (imageUri && !manualText) {
        // Đọc ảnh và chuyển sang Base64
        const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
        requestBody = {
          contents: [{
            parts: [
              { text: "Đây là rác gì? Phân loại (Hữu cơ/Vô cơ/Tái chế/Độc hại)? Cách xử lý ngắn gọn?" },
              { inline_data: { mime_type: "image/jpeg", data: base64 } }
            ]
          }]
        };
      } else {
        // Chỉ text
        requestBody = {
          contents: [{
            parts: [{ text: `Rác "${textToAnalyze}" thuộc loại nào? Hướng dẫn xử lý ngắn gọn.` }]
          }]
        };
      }

      // Gửi lên Gemini 1.5 Flash (Fix Model Name)
      const response = await fetch(
        // Sửa model name từ 2.5 sang 1.5
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "Lỗi từ Gemini API");
      }

      setResult(data.candidates?.[0]?.content?.parts?.[0]?.text || "Không nhận diện được.");

      // --- FR-9.1.1 FIX: CỘNG ĐIỂM SAU KHI PHÂN LOẠI THÀNH CÔNG ---
      const user = auth.currentUser;
      // Cộng 5 điểm cho việc phân loại thành công
      if (user && !user.isAnonymous) {
          await addPoints(5, "phân loại rác thành công"); 
      }
      // -----------------------------------------------------------

    } catch (error) {
      console.error("Lỗi AI Waste:", error);
      Alert.alert("Lỗi AI", error.message || "Không thể phân tích. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerBar}>
        <IconButton icon="arrow-left" onPress={() => router.back()} iconColor="#000" size={26} style={{ marginLeft: -8 }} />
        <Text style={styles.headerTitle}>Phân Loại Rác AI</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.scannerSection}>
          <Text style={styles.sectionLabel}>Hình ảnh vật phẩm</Text>

          <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={0.9} style={[styles.imageBox, imageUri ? styles.imageBoxFilled : null]}>
            {imageUri ? (
              <>
                <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
                <View style={styles.editBadge}>
                  <IconButton icon="camera-retake" iconColor="#fff" size={20} />
                  <Text style={styles.editBadgeText}>Chụp lại</Text>
                </View>
              </>
            ) : (
              <View style={styles.placeholderContent}>
                <IconButton icon="line-scan" size={60} iconColor="#1B5E20" />
                <Text style={styles.uploadHint}>Chạm để quét AI</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.sectionLabel}>Hoặc nhập tên</Text>

          <TextInput
            placeholder="Ví dụ: Vỏ hộp sữa, Pin cũ..."
            value={input}
            onChangeText={setInput}
            mode="outlined"
            style={styles.textInput}
            outlineColor="#E0E0E0"
            activeOutlineColor="#1B5E20"
            textColor="#000"
            placeholderTextColor="#9E9E9E"
            right={<TextInput.Icon icon="magnify" color="#1B5E20" onPress={() => identifyWaste()} />}
          />

          <View style={styles.chipContainer}>
            <Chip onPress={() => identifyWaste("Túi nilon")} style={styles.chipItem} textStyle={styles.chipText} icon="shopping">Túi nilon</Chip>
            <Chip onPress={() => identifyWaste("Pin cũ")} style={styles.chipItem} textStyle={styles.chipText} icon="battery">Pin cũ</Chip>
            <Chip onPress={() => identifyWaste("Vỏ chai")} style={styles.chipItem} textStyle={styles.chipText} icon="bottle-soda">Chai nhựa</Chip>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => identifyWaste()}
          loading={loading}
          disabled={loading}
          style={styles.analyzeBtn}
          labelStyle={styles.analyzeBtnLabel}
          icon="auto-fix"
        >
          {loading ? "ĐANG PHÂN TÍCH..." : "PHÂN TÍCH NGAY"}
        </Button>

        {result && !loading && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <IconButton icon="robot" iconColor="#55c05cff" size={24} style={{ margin: 0 }} />
              <Text style={styles.resultTitle}>Kết quả phân tích</Text>
            </View>
            <View style={styles.resultDivider} />
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}

      </ScrollView>

      <Portal>
        <Modal visible={showModal} onDismiss={() => setShowModal(false)} contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chọn nguồn ảnh</Text>
            <IconButton icon="close" onPress={() => setShowModal(false)} />
          </View>

          <TouchableOpacity style={styles.optionBtn} onPress={takePhoto}>
            <Avatar.Icon size={40} icon="camera" style={{ backgroundColor: '#E8F5E9' }} color='#1B5E20' />
            <Text style={styles.optionText}>Chụp ảnh mới</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionBtn} onPress={pickImage}>
            <Avatar.Icon size={40} icon="image" style={{ backgroundColor: '#E3F2FD' }} color='#1565C0' />
            <Text style={styles.optionText}>Chọn từ Thư viện</Text>
          </TouchableOpacity>
        </Modal>
      </Portal>

    </KeyboardAvoidingView>
  );
}