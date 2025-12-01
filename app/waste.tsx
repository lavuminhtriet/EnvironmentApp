import React, { useState } from 'react';
import { ScrollView, Image, Alert, Keyboard, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'; 
import { Text, TextInput, Button, ActivityIndicator, Chip, IconButton, Portal, Modal, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; 
import { useRouter, Stack } from 'expo-router';
import { styles } from '../styles/waste.styles';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export default function WasteScreen() {
  const [input, setInput] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
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
      mediaTypes: ['images'], allowsEditing: true, quality: 0.5,
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
        mediaTypes: ['images'], allowsEditing: true, quality: 0.5,
    });
    if (!res.canceled) {
        setImageUri(res.assets[0].uri);
        setResult(null);
        setShowModal(false); 
    }
  };

  const identifyWaste = async (manualText?: string) => {
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
      if (imageUri && !manualText) {
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
        requestBody = {
          contents: [{
            parts: [{ text: `Rác "${textToAnalyze}" thuộc loại nào? Hướng dẫn xử lý ngắn gọn.` }]
          }]
        };
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(requestBody) 
        }
      );

      const data = await response.json();
      
      if (data.error) throw new Error(data.error.message);
      setResult(data.candidates?.[0]?.content?.parts?.[0]?.text || "Không nhận diện được.");
    
    } catch (error: any) {
      Alert.alert("Lỗi AI", "Không thể phân tích. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      
      <View style={styles.headerBar}>
          <IconButton icon="arrow-left" onPress={() => router.back()} iconColor="#0E4626" size={26} style={styles.backBtn} />
          <Text style={styles.headerTitle}>Phân Loại Rác AI</Text>
          <View style={{width: 40}} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <View style={styles.scannerSection}>
            <Text style={styles.scannerTitle}>Quét hình ảnh</Text>
            
            <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={0.9} style={[styles.imageBox, imageUri ? styles.imageBoxFilled : null]}>
                {imageUri ? (
                    <>
                        <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
                        <View style={styles.floatingCamBtn}>
                            <Text style={styles.floatingCamText}>Chọn ảnh khác</Text>
                        </View>
                    </>
                ) : (
                    <View style={{alignItems: 'center'}}>
                        <IconButton icon="line-scan" size={50} iconColor="#2E7D32" />
                        <Text style={styles.uploadHint}>Nhấn để tải ảnh rác thải lên</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>

        
        <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Hoặc nhập tên vật phẩm</Text>
            
            <TextInput 
                placeholder="VD: Vỏ hộp sữa, Pin cũ..." 
                value={input} 
                onChangeText={setInput} 
                mode="outlined" 
                style={styles.textInput}
                outlineStyle={styles.inputOutline}
                activeOutlineColor="#0E4626"
                outlineColor="#E0E0E0"
                textColor="#000"
                placeholderTextColor="#999"
                right={<TextInput.Icon icon="magnify" color="#0E4626" onPress={() => identifyWaste()} />}
            />

            
            <View style={styles.chipContainer}>
                <Chip onPress={() => identifyWaste("Túi nilon")} style={styles.chipItem} textStyle={styles.chipText} icon="shopping">Túi nilon</Chip>
                <Chip onPress={() => identifyWaste("Pin cũ")} style={styles.chipItem} textStyle={styles.chipText} icon="battery">Pin cũ</Chip>
                <Chip onPress={() => identifyWaste("Vỏ chai nhựa")} style={styles.chipItem} textStyle={styles.chipText} icon="bottle-soda">Chai nhựa</Chip>
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
                    <Text style={{fontSize: 24}}>🤖</Text>
                    <Text style={styles.resultTitle}>Kết quả từ AI</Text>
                </View>
                <View style={styles.resultContent}>
                    <Text style={styles.resultText}>{result}</Text>
                </View>
            </View>
        )}
        
      </ScrollView>

      
      <Portal>
          <Modal visible={showModal} onDismiss={() => setShowModal(false)} contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Nguồn ảnh</Text>
              
              <TouchableOpacity style={styles.optionBtn} onPress={takePhoto}>
                  <Avatar.Icon size={40} icon="camera" style={{backgroundColor: '#E8F5E9'}} color='#2E7D32' />
                  <Text style={styles.optionText}>Chụp ảnh mới</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionBtn} onPress={pickImage}>
                  <Avatar.Icon size={40} icon="image" style={{backgroundColor: '#E3F2FD'}} color='#1565C0' />
                  <Text style={styles.optionText}>Chọn từ Thư viện</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                  <Text style={styles.cancelText}>HỦY</Text>
              </TouchableOpacity>
          </Modal>
      </Portal>

    </KeyboardAvoidingView>
  );
}