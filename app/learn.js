import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, SegmentedButtons, Modal, Portal, IconButton, Avatar } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
// Import styles từ file bên ngoài
import { styles } from '../styles/learn.styles'; 

const Articles = [
  { 
    id: 1, 
    title: 'Nghệ thuật Phân loại rác tại nguồn', 
    tag: 'KIẾN THỨC',
    desc: 'Biến rác thải thành tài nguyên chỉ với vài bước đơn giản tại nhà.', 
    img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
    content: `Phân loại rác tại nguồn là hành động thiết thực giúp giảm tải áp lực lên các bãi chôn lấp và tiết kiệm tài nguyên.\n\n1. Rác hữu cơ (Thùng xanh lá):\nBao gồm thức ăn thừa, rau củ quả hư hỏng, bã trà, bã cà phê... Loại này có thể ủ thành phân bón (Compost) cho cây trồng.\n\n2. Rác tái chế (Thùng trắng/xanh dương):\nBao gồm giấy báo, thùng carton, vỏ lon nhôm, chai nhựa sạch... Hãy làm sạch sơ bộ và phơi khô trước khi bỏ vào thùng.\n\n3. Rác vô cơ (Thùng vàng/cam):\nLà những loại rác còn lại không thể tái chế như túi nilon bẩn, sành sứ vỡ, tã bỉm, vỏ bánh kẹo... Loại này sẽ được đưa đi chôn lấp đúng quy định.`
  },
  { 
    id: 2, 
    title: 'Hiểm họa từ "Cái chết trắng"', 
    tag: 'CẢNH BÁO',
    desc: 'Rác thải nhựa đang âm thầm hủy hoại đại dương và sức khỏe con người như thế nào?', 
    img: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=2070&auto=format&fit=crop',
    content: `Rác thải nhựa đang là vấn nạn "ô nhiễm trắng" toàn cầu.\n\n⏳ Thời gian phân hủy:\nMột chai nhựa mất từ 450 - 1000 năm để phân hủy hoàn toàn. Túi nilon cũng mất hàng trăm năm.\n\n🐟 Hạt vi nhựa (Microplastics):\nNhựa không thực sự biến mất mà vỡ vụn thành hạt vi nhựa. Cá và sinh vật biển ăn phải chúng, và cuối cùng hạt vi nhựa quay trở lại cơ thể con người qua chuỗi thức ăn, gây rối loạn hormone và các bệnh nguy hiểm.\n\n🛑 Hành động ngay:\nHạn chế sử dụng nhựa dùng một lần (ống hút, túi nilon, ly nhựa). Hãy mang theo túi vải và bình nước cá nhân!`
  },
  { 
    id: 3, 
    title: 'Sống xanh (Zero Waste) cho người mới', 
    tag: 'LỐI SỐNG',
    desc: '5 quy tắc vàng giúp bạn bắt đầu lối sống bền vững ngay hôm nay.', 
    img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=1964&auto=format&fit=crop',
    content: `Zero Waste (Không rác thải) là lối sống nhằm giảm thiểu tối đa lượng rác thải ra môi trường. Hãy áp dụng quy tắc 5R:\n\n1. Refuse (Từ chối):\nNói KHÔNG với những thứ không cần thiết (tờ rơi quảng cáo, túi nilon khi mua đồ nhỏ, ống hút nhựa).\n\n2. Reduce (Tiết giảm):\nMua sắm ít đi, chỉ mua đồ thật sự cần thiết. Sống tối giản.\n\n3. Reuse (Tái sử dụng):\nDùng lại chai lọ, túi vải, hộp đựng nhiều lần thay vì đồ dùng 1 lần.\n\n4. Recycle (Tái chế):\nChỉ tái chế những gì không thể từ chối hay giảm thiểu.\n\n5. Rot (Phân hủy):\nỦ rác hữu cơ thành phân bón cho cây trồng tại nhà.`
  },
];

const WasteCategories = [
    { id: 'organic', name: 'Rác Hữu Cơ', icon: 'https://img.icons8.com/color/96/apple.png', color: '#E8F5E9', desc: 'Thức ăn thừa, vỏ rau củ, bã trà, cà phê. Dùng làm phân bón.' },
    { id: 'recycle', name: 'Rác Tái Chế', icon: 'https://img.icons8.com/color/96/plastic.png', color: '#E3F2FD', desc: 'Giấy, báo, vỏ lon, chai nhựa sạch. Gom bán phế liệu.' },
    { id: 'inorganic', name: 'Rác Vô Cơ', icon: 'https://img.icons8.com/color/96/trash.png', color: '#FFF3E0', desc: 'Túi nilon bẩn, sành sứ vỡ, tã bỉm. Chôn lấp.' },
    { id: 'haz', name: 'Chất Thải Hại', icon: 'https://img.icons8.com/color/96/biohazard.png', color: '#FFEBEE', desc: 'Pin, bóng đèn, hóa chất. Thu gom riêng.' },
    { id: 'e-waste', name: 'Rác Điện Tử', icon: 'https://img.icons8.com/color/96/monitor.png', color: '#F3E5F5', desc: 'Điện thoại, máy tính hư. Mang đến điểm thu hồi.' },
];

const QuizData = [
  { question: "Loại rác nào sau đây CÓ THỂ tái chế?", options: ["Túi nilon bẩn", "Vỏ chai nhựa sạch", "Tã giấy đã dùng"], answer: "Vỏ chai nhựa sạch" },
  { question: "Hành động nào giúp tiết kiệm điện?", options: ["Bật đèn khi trời sáng", "Tắt thiết bị khi không dùng", "Mở cửa tủ lạnh lâu"], answer: "Tắt thiết bị khi không dùng" },
  { question: "Thời gian phân hủy của chai nhựa là?", options: ["10 năm", "100 năm", "450 - 1000 năm"], answer: "450 - 1000 năm" },
];

export default function LearnScreen() {
  const router = useRouter();
  const [tab, setTab] = useState('articles');
  
  const [visibleModal, setVisibleModal] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  const [lookupVisible, setLookupVisible] = useState(false);
  const [currentCat, setCurrentCat] = useState(null);

  const [currentQ, setCurrentQ] = useState(0);

  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const openArticle = (article) => { setCurrentArticle(article); setVisibleModal(true); };
  const openLookup = (cat) => { setCurrentCat(cat); setLookupVisible(true); };

  const handleCheckAnswer = () => {
    if (!selectedOption) { Alert.alert("Chưa chọn!", "Vui lòng chọn một đáp án."); return; }
    const correct = selectedOption === QuizData[currentQ].answer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
    setFeedbackVisible(true);
  };

  const handleNextQuestion = () => {
    setFeedbackVisible(false);
    if (currentQ < QuizData.length - 1) {
      setCurrentQ(currentQ + 1); setSelectedOption('');
    } else { setShowResult(true); }
  };

  const resetQuiz = () => { setCurrentQ(0); setScore(0); setSelectedOption(''); setShowResult(false); };

  return (
    <View style={styles.container}>
       <Stack.Screen options={{ headerShown: false }} />
       
       {/* Header */}
       <View style={styles.headerBar}>
            <IconButton icon="arrow-left" onPress={() => router.back()} iconColor="#0E4626" size={26} style={styles.backBtn} />
            <Text style={styles.headerTitle}>Góc Học Tập</Text>
            <View style={{width: 40}} /> 
       </View>

       {/* Tabs */}
       <View style={styles.tabContainer}>
            <SegmentedButtons
                value={tab}
                onValueChange={setTab}
                buttons={[
                { value: 'articles', label: 'Bài viết', icon: 'book-open-page-variant' },
                { value: 'lookup', label: 'Tra cứu', icon: 'magnify' }, 
                { value: 'quiz', label: 'Đố vui', icon: 'gamepad-variant' },
                ]}
                style={styles.segmentBtn}
                theme={{ colors: { secondaryContainer: '#0E4626', onSecondaryContainer: '#fff' } }}
            />
       </View>

       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
           
            {/* Articles Tab */}
            {tab === 'articles' && (
                <View>
                    {Articles.map(item => (
                        <TouchableOpacity key={item.id} activeOpacity={0.95} onPress={() => openArticle(item)} style={styles.articleCard}>
                            <Image source={{ uri: item.img }} style={styles.articleImage} resizeMode="cover" />
                            <View style={styles.articleContent}>
                                <Text style={styles.articleTag}>{item.tag}</Text>
                                <Text style={styles.articleTitle}>{item.title}</Text>
                                <Text style={styles.articleDesc} numberOfLines={2}>{item.desc}</Text>
                                <Button mode="outlined" onPress={() => openArticle(item)} style={styles.readMoreBtn} labelStyle={{color:'#54bb81ff', fontSize: 12}} icon="arrow-right" contentStyle={{flexDirection:'row-reverse'}}>Đọc tiếp</Button>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Lookup Tab */}
            {tab === 'lookup' && (
                <View>
                    {WasteCategories.map(cat => (
                        <TouchableOpacity key={cat.id} onPress={() => openLookup(cat)} activeOpacity={0.8}>
                            <View style={styles.catCard}>
                                <View style={[styles.catIconBox, {backgroundColor: cat.color}]}>
                                    <Image source={{uri: cat.icon}} style={styles.catIcon} />
                                </View>
                                <View style={styles.catInfo}>
                                    <Text style={styles.catName}>{cat.name}</Text>
                                    <Text style={styles.catDesc} numberOfLines={1}>{cat.desc}</Text>
                                </View>
                                <IconButton icon="chevron-right" size={20} iconColor="#ccc" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Quiz Tab */}
            {tab === 'quiz' && (
                <View>
                    {showResult ? (
                        <View style={styles.resultView}>
                            <Avatar.Icon size={100} icon={score === QuizData.length ? "trophy" : "emoticon-happy"} style={{backgroundColor: score === QuizData.length ? '#FFD700' : '#C8E6C9'}} color={score === QuizData.length ? '#fff' : '#0E4626'} />
                            <Text style={styles.scoreTitle}>Hoàn thành!</Text>
                            <Text style={styles.scoreValue}>{score}/{QuizData.length}</Text>
                            <Text style={styles.scoreSub}>Câu trả lời đúng</Text>
                            <Button mode="contained" onPress={resetQuiz} style={styles.retryBtn} icon="refresh" labelStyle={{fontSize: 16, fontWeight: 'bold'}}>Chơi lại</Button>
                        </View>
                    ) : (
                        <View style={styles.quizContainer}>
                            <View style={styles.quizHeader}>
                                <Avatar.Icon size={24} icon="help" style={{backgroundColor: '#FFF8E1'}} color='#FF9800' />
                                <Text style={styles.questionCount}>Câu hỏi {currentQ + 1}/{QuizData.length}</Text>
                            </View>
                            <Text style={styles.questionText}>{QuizData[currentQ].question}</Text>
                            
                            {QuizData[currentQ].options.map((opt, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    style={[styles.answerBtn, selectedOption === opt && styles.answerBtnSelected]} 
                                    onPress={() => setSelectedOption(opt)}
                                    activeOpacity={0.8}
                                >
                                    {/* Radio button giả lập */}
                                    <View style={{
                                        width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: selectedOption === opt ? '#0E4626' : '#aaa',
                                        justifyContent: 'center', alignItems: 'center', marginRight: 15
                                    }}>
                                        {selectedOption === opt && <View style={{width: 12, height: 12, borderRadius: 6, backgroundColor: '#0E4626'}} />}
                                    </View>
                                    <Text style={[styles.answerText, selectedOption === opt && styles.answerTextSelected]}>
                                        {opt}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                            <Button 
                                mode="contained" 
                                onPress={handleCheckAnswer} 
                                style={styles.quizSubmitBtn} 
                                labelStyle={{fontSize: 18, fontWeight: 'bold', color: '#fff'}}
                            >
                                Kiểm tra
                            </Button>
                        </View>
                    )}
                </View>
            )}
       </ScrollView>

       {/* Article Detail Modal */}
       <Portal>
            <Modal visible={visibleModal} onDismiss={() => setVisibleModal(false)} contentContainerStyle={styles.modalContainer}>
                <View style={{flex:1}}>
                    <View style={styles.modalHeader}>
                        <IconButton icon="close" onPress={() => setVisibleModal(false)} iconColor="#333" size={28}/>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#0E4626'}}>Bài viết</Text>
                        <View style={{width: 48}}/>
                    </View>
                    <ScrollView contentContainerStyle={styles.modalScroll}>
                        {currentArticle && (
                            <>
                                <Image source={{ uri: currentArticle.img }} style={styles.modalImg} resizeMode="cover" />
                                <View style={styles.modalContentBox}>
                                    <Text style={styles.articleTag}>{currentArticle.tag}</Text>
                                    <Text style={styles.modalTitle}>{currentArticle.title}</Text>
                                    <Text style={styles.modalBody}>{currentArticle.content}</Text>
                                </View>
                            </>
                        )}
                    </ScrollView>
                </View>
            </Modal>
       </Portal>

       {/* Lookup Detail Modal */}
       <Portal>
            <Modal visible={lookupVisible} onDismiss={() => setLookupVisible(false)} contentContainerStyle={styles.lookupModal}>
               {currentCat && (
                   <>
                        <View style={[styles.lookupIconWrapper, {backgroundColor: currentCat.color}]}>
                            <Image source={{ uri: currentCat.icon }} style={styles.lookupIconLarge} />
                        </View>
                        <Text style={styles.lookupTitle}>{currentCat.name}</Text>
                        <Text style={styles.lookupDesc}>{currentCat.desc}</Text>
                        <Button mode="contained" onPress={() => setLookupVisible(false)} style={styles.lookupCloseBtn} labelStyle={{fontSize: 16, fontWeight:'bold'}}>Đóng</Button>
                   </>
               )}
            </Modal>
       </Portal>

       {/* Quiz Feedback Modal */}
       <Portal>
           <Modal visible={feedbackVisible} onDismiss={() => {}} contentContainerStyle={styles.feedbackModal} dismissable={false}>
               <View style={[styles.feedbackIconBox, {backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE'}]}>
                   <Avatar.Icon size={48} icon={isCorrect ? "check" : "close"} style={{backgroundColor: 'transparent'}} color={isCorrect ? '#4CAF50' : '#D32F2F'} />
               </View>
               <Text style={[styles.feedbackTitle, {color: isCorrect ? '#2E7D32' : '#D32F2F'}]}>{isCorrect ? "Chính xác! 🎉" : "Sai rồi! 😓"}</Text>
               <Text style={styles.feedbackDesc}>{isCorrect ? "Bạn đã nhận được điểm. Hãy tiếp tục nhé!" : `Đáp án đúng là: "${QuizData[currentQ]?.answer}"`}</Text>
               <Button mode="contained" onPress={handleNextQuestion} style={[styles.feedbackBtn, {backgroundColor: isCorrect ? '#0E4626' : '#D32F2F'}]} labelStyle={{color:'#fff', fontWeight: 'bold'}}>{currentQ < QuizData.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}</Button>
           </Modal>
       </Portal>
    </View>
  );
}