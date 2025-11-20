import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
// [FIX CẢNH BÁO] Đã xóa Modal, Portal, Provider thừa
import { Text, Card, Button, RadioButton, Appbar, SegmentedButtons } from 'react-native-paper'; 
import { useRouter } from 'expo-router';

// Dữ liệu bài viết
const Articles = [
  { id: 1, title: 'Phân loại rác tại nguồn', desc: 'Học cách phân biệt rác hữu cơ, vô cơ và tái chế.', img: 'https://img.freepik.com/free-vector/waste-sorting-concept_23-2148602266.jpg' },
  { id: 2, title: 'Tác hại của rác nhựa', desc: 'Nhựa mất bao lâu để phân hủy? Tại sao nó nguy hiểm?', img: 'https://img.freepik.com/free-vector/no-plastic-concept_23-2148556129.jpg' },
  { id: 3, title: 'Lối sống Zero Waste', desc: '5 bước đơn giản để bắt đầu lối sống không rác thải.', img: 'https://img.freepik.com/free-vector/zero-waste-elements_23-2148542603.jpg' },
];

// Dữ liệu Tra cứu thủ công 
const WasteCategories = [
    { id: 'organic', name: 'Rác Hữu Cơ', icon: 'https://img.icons8.com/color/96/apple.png', color: '#C8E6C9', desc: 'Thức ăn thừa, vỏ rau củ, bã trà, cà phê.\n-> Dùng làm phân bón hoặc thức ăn chăn nuôi.' },
    { id: 'recycle', name: 'Rác Tái Chế', icon: 'https://img.icons8.com/color/96/plastic.png', color: '#BBDEFB', desc: 'Giấy, báo, thùng carton, vỏ lon, chai nhựa.\n-> Gom lại để bán phế liệu hoặc tái sản xuất.' },
    { id: 'inorganic', name: 'Rác Vô Cơ', icon: 'https://img.icons8.com/color/96/trash.png', color: '#FFE0B2', desc: 'Túi nilon bẩn, sành sứ vỡ, tã bỉm.\n-> Bỏ vào thùng rác màu vàng/cam để chôn lấp.' },
    { id: 'haz', name: 'Chất Thải Hại', icon: 'https://img.icons8.com/color/96/biohazard.png', color: '#FFCDD2', desc: 'Pin, bóng đèn, chai lọ hóa chất, thuốc tây.\n-> Mang đến điểm thu gom chuyên dụng, KHÔNG bỏ chung rác thường.' },
    { id: 'e-waste', name: 'Rác Điện Tử', icon: 'https://img.icons8.com/color/96/monitor.png', color: '#E1BEE7', desc: 'Điện thoại hư, máy tính, dây sạc.\n-> Mang đến các trạm thu hồi thiết bị điện tử (Việt Nam Tái Chế).' },
];

const QuizData = [
  { question: "Rác thải nào sau đây là rác Hữu cơ?", options: ["Túi nilon", "Vỏ chuối", "Pin cũ", "Chai thủy tinh"], correct: "Vỏ chuối" },
  { question: "Thời gian để chai nhựa phân hủy là bao lâu?", options: ["10 năm", "100 năm", "450 - 1000 năm", "Vĩnh viễn"], correct: "450 - 1000 năm" }
];

export default function LearnScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'learn' | 'lookup' | 'quiz'>('learn'); 
  
  // Quiz state
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string>('');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = () => {
    if (selected === QuizData[currentQ].correct) {
      setScore(score + 1);
      Alert.alert("Chính xác! 🎉");
    } else {
      Alert.alert("Sai rồi!", `Đáp án đúng là: ${QuizData[currentQ].correct}`);
    }
    if (currentQ < QuizData.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected('');
    } else {
      setFinished(true);
    }
  };

  return (
    <View style={styles.container}>
       <Appbar.Header style={{backgroundColor: '#fff'}}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Học tập & Nhận thức" />
      </Appbar.Header>

      <View style={{padding: 15, paddingBottom: 5}}>
        <SegmentedButtons
            value={tab}
            onValueChange={val => setTab(val as any)}
            buttons={[
            { value: 'learn', label: 'Bài viết' },
            { value: 'lookup', label: 'Tra cứu' }, 
            { value: 'quiz', label: 'Đố vui' },
            ]}
        />
      </View>

      <ScrollView contentContainerStyle={{padding: 15}}>
        {tab === 'learn' && (
          Articles.map(article => (
            <Card key={article.id} style={styles.articleCard}>
              <Card.Cover source={{ uri: article.img }} style={{height: 140}} />
              <Card.Title title={article.title} titleStyle={{fontWeight: 'bold'}} />
              <Card.Content><Text>{article.desc}</Text></Card.Content>
              <Card.Actions><Button>Đọc ngay</Button></Card.Actions>
            </Card>
          ))
        )}

        {tab === 'lookup' && (
             <View>
                 <Text variant="titleMedium" style={{marginBottom: 10, textAlign: 'center'}}>Danh mục phân loại rác</Text>
                 {WasteCategories.map(cat => (
                     <TouchableOpacity key={cat.id} onPress={() => Alert.alert(cat.name, cat.desc)}>
                        <Card style={[styles.catCard, {backgroundColor: cat.color}]}>
                            <View style={styles.catRow}>
                                <Image source={{uri: cat.icon}} style={{width: 60, height: 60, marginRight: 15}} />
                                <View style={{flex: 1}}>
                                    <Text variant="titleMedium" style={{fontWeight: 'bold'}}>{cat.name}</Text>
                                    <Text variant="bodySmall" numberOfLines={2}>{cat.desc}</Text>
                                </View>
                            </View>
                        </Card>
                     </TouchableOpacity>
                 ))}
             </View>
        )}

        {tab === 'quiz' && (
          !finished ? (
            <Card style={styles.quizCard}>
              <Card.Title title={`Câu hỏi ${currentQ + 1}/${QuizData.length}`} />
              <Card.Content>
                <Text variant="titleLarge" style={{marginBottom: 20}}>{QuizData[currentQ].question}</Text>
                <RadioButton.Group onValueChange={val => setSelected(val)} value={selected}>
                  {QuizData[currentQ].options.map((opt, index) => (
                    <View key={index} style={styles.radioOption}>
                      <RadioButton value={opt} />
                      <Text>{opt}</Text>
                    </View>
                  ))}
                </RadioButton.Group>
                <Button mode="contained" onPress={handleAnswer} disabled={!selected} style={{marginTop: 20}}>
                  Trả lời
                </Button>
              </Card.Content>
            </Card>
          ) : (
            <View style={{alignItems: 'center', marginTop: 50}}>
              <Text variant="headlineMedium" style={{fontWeight: 'bold', color: '#2E7D32'}}>Hoàn thành!</Text>
              <Text variant="titleMedium">Điểm số: {score}/{QuizData.length}</Text>
              <Button mode="contained" onPress={() => {setFinished(false); setCurrentQ(0); setScore(0)}} style={{marginTop: 20}}>Làm lại</Button>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  articleCard: { marginBottom: 15, backgroundColor: '#fff' },
  quizCard: { padding: 10, backgroundColor: '#fff' },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  catCard: { marginBottom: 10, padding: 10, borderRadius: 12 },
  catRow: { flexDirection: 'row', alignItems: 'center' }
});