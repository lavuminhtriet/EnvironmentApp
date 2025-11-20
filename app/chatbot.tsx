import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Text, Appbar, ActivityIndicator, IconButton, Surface, Avatar, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { styles } from '../styles/chatbot.styles';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

export default function ChatbotScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Chào bạn! Tôi là trợ lý môi trường AI. Bạn muốn hỏi gì?', sender: 'bot', timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const callGeminiAI = async (query: string) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Bạn là chuyên gia môi trường. Hãy trả lời thân thiện và ngắn gọn: ${query}` }] }]
          })
        }
      );
      const data = await response.json();
      if (data.error) return "Lỗi AI: " + (data.error.message || "Không thể tạo trả lời.");
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Tôi chưa có câu trả lời phù hợp.";
    } catch { return "Không thể kết nối AI. Hãy kiểm tra mạng hoặc thử lại."; }
  };

  const sendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: textToSend, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);
    Keyboard.dismiss();
    
    Speech.stop();
    setIsSpeaking(false);

    const botText = await callGeminiAI(textToSend);
    const botMsg: Message = { id: (Date.now() + 1).toString(), text: botText, sender: 'bot', timestamp: Date.now() };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
    speakText(botText);
  };

  const speakText = (text: string) => {
    setIsSpeaking(true);
    Speech.speak(text, {
        language: 'vi-VN',
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
    });
  };

  const stopSpeaking = () => { Speech.stop(); setIsSpeaking(false); };

  useEffect(() => { setTimeout(() => { flatListRef.current?.scrollToEnd({ animated: true }); }, 150); }, [messages]);
  useEffect(() => { return () => { Speech.stop(); } }, []);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.msgContainer, isUser ? styles.msgRight : styles.msgLeft]}>
        {!isUser && <Avatar.Icon size={32} icon="robot" style={{ backgroundColor: '#1976D2', marginRight: 8 }} />}
        <Surface style={[styles.msgBubble, isUser ? styles.bubbleRight : styles.bubbleLeft]} elevation={1}>
          <Text style={{ color: isUser ? '#fff' : '#000' }}>{item.text}</Text>
        </Surface>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#fff', elevation: 4 }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Trợ lý AI" />
        {isSpeaking && <Appbar.Action icon="volume-off" onPress={stopSpeaking} color="#D32F2F" />}
      </Appbar.Header>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 15, paddingBottom: 30 }}
        style={{ flex: 1 }}
      />

      {/* [MỚI] Nút gợi ý theo mùa - FR-5.3 */}
      <View style={{paddingHorizontal: 10, paddingBottom: 5}}>
          <Chip 
            icon="sprout" 
            onPress={() => sendMessage("Gợi ý cho tôi 3 hành động bảo vệ môi trường phù hợp với mùa này ở Việt Nam")} 
            style={{alignSelf: 'center', backgroundColor: '#E8F5E9'}}
          >
            Gợi ý hành động mùa này
          </Chip>
      </View>

      {loading && (
        <View style={{ padding: 10, alignItems: 'center' }}>
          <ActivityIndicator animating={true} color="#1976D2" />
          <Text style={{ fontSize: 12, color: '#666' }}>AI đang suy nghĩ...</Text>
        </View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputArea}>
          <TextInput style={styles.input} placeholder="Gõ câu hỏi..." value={inputText} onChangeText={setInputText} onSubmitEditing={() => sendMessage()} />
          <IconButton icon="send" mode="contained" containerColor="#1976D2" iconColor="#fff" size={24} onPress={() => sendMessage()} disabled={loading} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}