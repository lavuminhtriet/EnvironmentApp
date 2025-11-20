import React, { useState } from 'react';
import { ScrollView, Image, Alert, Keyboard, View } from 'react-native'; 
import { Text, TextInput, Button, Card, ActivityIndicator, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; 
import { useRouter } from 'expo-router';
import { styles } from '../styles/waste.styles';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export default function WasteScreen() {
  const [input, setInput] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần quyền truy cập ảnh!');
      return;
    }
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, quality: 0.5,
    });
    if (!res.canceled) {
      setImageUri(res.assets[0].uri);
      setResult(null); 
    }
  };

  const identifyWaste = async (manualText?: string) => {
    const textToAnalyze = manualText || input;

    if (!textToAnalyze && !imageUri) {
      Alert.alert('Thông báo', 'Hãy nhập tên rác hoặc chọn ảnh.');
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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      setResult(data.candidates?.[0]?.content?.parts?.[0]?.text || "Không nhận diện được.");
    } catch {
      Alert.alert("Lỗi AI", "Hệ thống bận, thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>Phân loại rác AI ♻️</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <TextInput placeholder="Nhập tên rác (VD: Hộp xốp...)" value={input} onChangeText={setInput} style={styles.input} />
          
          <Text variant="bodySmall" style={{marginBottom: 5, color: '#666'}}>Tra cứu nhanh:</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10}}>
            <Chip onPress={() => identifyWaste("Túi nilon")} icon="shopping">Túi nilon</Chip>
            <Chip onPress={() => identifyWaste("Pin cũ")} icon="battery">Pin cũ</Chip>
            <Chip onPress={() => identifyWaste("Vỏ chai nhựa")} icon="bottle-soda">Chai nhựa</Chip>
            <Chip onPress={() => identifyWaste("Thuốc hết hạn")} icon="pill">Thuốc</Chip>
          </View>

          <Button mode="outlined" icon="image" onPress={pickImage} style={{marginBottom: 10}}>
            {imageUri ? "Đổi ảnh khác" : "Hoặc chụp/chọn ảnh"}
          </Button>
          {imageUri && ( <Image source={{ uri: imageUri }} style={styles.previewImage} /> )}
          
          <Button mode="contained" icon="magnify" onPress={() => identifyWaste()} loading={loading} style={styles.analyzeBtn}>
             Phân tích
          </Button>
        </Card.Content>
      </Card>

      {loading && <ActivityIndicator size="large" color="#4CAF50" style={{marginTop: 20}} />}
      
      {result && !loading && (
        <Card style={styles.resultCard}>
          <Card.Title title="Kết quả phân tích" titleStyle={{color: '#2E7D32', fontWeight: 'bold'}} />
          <Card.Content><Text style={styles.resultText}>{result}</Text></Card.Content>
        </Card>
      )}
      <Button mode="text" onPress={() => router.back()} style={{marginTop: 20}}>Quay lại trang chủ</Button>
    </ScrollView>
  );
}