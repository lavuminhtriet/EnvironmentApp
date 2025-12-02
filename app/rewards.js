import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image } from 'react-native'; 
import { Text, Button, IconButton, Portal, Modal, Avatar, ActivityIndicator } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
import { auth, db } from '../firebaseConfig';
import { doc, onSnapshot, updateDoc, increment, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { styles } from '../styles/rewards.styles';

export default function RewardsScreen() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [badge, setBadge] = useState('Tân binh');
  const [gifts, setGifts] = useState([]); // Dữ liệu thật
  const [loading, setLoading] = useState(true);
  
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);

  // 1. Lắng nghe điểm số Realtime
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setScore(data.score || 0);
        setBadge(data.badge || 'Tân binh');
      }
    });
    return () => unsub();
  }, []);

  // 2. Tải danh sách quà từ Firestore
  useEffect(() => {
      const fetchGifts = async () => {
          try {
              const q = query(collection(db, "gifts"), orderBy("cost", "asc"));
              const snapshot = await getDocs(q);
              const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setGifts(list);
          } catch (e) { 
              console.log("Lỗi tải quà:", e); 
          } finally {
              setLoading(false);
          }
      };
      fetchGifts();
  }, []);

  const onRedeemPress = (gift) => {
      setSelectedGift(gift);
      setConfirmVisible(true);
  };

  const handleConfirmRedeem = async () => {
      if (!selectedGift) return;
      setConfirmVisible(false);
      
      try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, { score: increment(-selectedGift.cost) });
          setSuccessVisible(true);
      } catch (error) {
          console.log("Lỗi đổi quà:", error);
      }
  };

  const maxScore = 500;
  const progressPercent = Math.min((score / maxScore) * 100, 100);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerBar}>
        <IconButton icon="arrow-left" onPress={() => router.back()} iconColor="#0E4626" size={26} style={styles.backBtn} />
        <Text style={styles.headerTitle}>Đổi Quà</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.membershipCard}>
            <View style={styles.cardPatternCircle} />
            <View style={styles.cardTopRow}>
                <View>
                    <Text style={styles.cardLabel}>Điểm tích lũy</Text>
                    <Text style={styles.pointValue}>{score}</Text>
                </View>
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>⭐ {badge}</Text>
                </View>
            </View>
            <View style={styles.progressSection}>
                <Text style={[styles.cardLabel, {marginBottom: 5}]}>Tiến độ thăng hạng</Text>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, {width: `${progressPercent}%`}]} />
                </View>
                <Text style={styles.progressText}>{score} / {maxScore} điểm</Text>
            </View>
        </View>

        <Text style={styles.sectionTitle}>Kho quà tặng</Text>

        {loading ? <ActivityIndicator size="large" color="#0E4626" /> : gifts.length === 0 ? (
            <Text style={{textAlign:'center', marginTop: 20, color:'#888'}}>Chưa có quà nào trong kho.</Text>
        ) : (
            gifts.map(gift => {
                const canRedeem = score >= gift.cost;
                return (
                    <View key={gift.id} style={styles.giftCard}>
                        <View style={styles.giftImageContainer}>
                            <Image source={{ uri: gift.icon || 'https://img.icons8.com/color/96/gift.png' }} style={styles.giftImage} resizeMode="contain" />
                        </View>
                        <View style={styles.giftContent}>
                            <Text style={styles.giftName}>{gift.name}</Text>
                            <Text numberOfLines={1} style={{fontSize: 12, color:'#666', marginBottom:5}}>{gift.desc}</Text>
                            <View style={styles.giftCostRow}>
                                <Avatar.Icon size={20} icon="star-circle" style={{backgroundColor:'transparent', margin:0}} color='#FF9800' />
                                <Text style={styles.giftCost}>{gift.cost} điểm</Text>
                            </View>
                            <Button 
                                mode="contained" 
                                compact 
                                disabled={!canRedeem}
                                style={[styles.redeemBtn, !canRedeem && styles.disabledBtn]} 
                                labelStyle={styles.redeemBtnLabel}
                                onPress={() => onRedeemPress(gift)}
                            >
                                {canRedeem ? "Đổi ngay" : "Chưa đủ điểm"}
                            </Button>
                        </View>
                    </View>
                );
            })
        )}

      </ScrollView>

      <Portal>
          <Modal visible={confirmVisible} onDismiss={() => setConfirmVisible(false)} contentContainerStyle={styles.modalContainer}>
             <View style={[styles.modalIconBox, {backgroundColor: '#FFF3E0'}]}>
                 <Avatar.Icon size={40} icon="gift-open" style={{backgroundColor: 'transparent'}} color='#EF6C00' />
             </View>
             <Text style={styles.modalTitle}>Xác nhận đổi quà</Text>
             <Text style={styles.modalDesc}>
                 Bạn muốn dùng <Text style={{fontWeight:'bold'}}>{selectedGift?.cost} điểm</Text> để đổi "{selectedGift?.name}"?
             </Text>
             <View style={styles.modalBtnRow}>
                 <Button mode="outlined" onPress={() => setConfirmVisible(false)} style={styles.cancelBtn} textColor="#666">Hủy</Button>
                 <Button mode="contained" onPress={handleConfirmRedeem} style={styles.confirmBtn}>Xác nhận</Button>
             </View>
          </Modal>

          <Modal visible={successVisible} onDismiss={() => setSuccessVisible(false)} contentContainerStyle={styles.modalContainer}>
             <View style={[styles.modalIconBox, {backgroundColor: '#E8F5E9'}]}>
                 <Avatar.Icon size={50} icon="check-circle" style={{backgroundColor: 'transparent'}} color='#4CAF50' />
             </View>
             <Text style={styles.modalTitle}>Thành công!</Text>
             <Text style={styles.modalDesc}>
                 Mã quà tặng đã được gửi vào hộp thư của bạn.
             </Text>
             <Button mode="contained" onPress={() => setSuccessVisible(false)} style={styles.successBtn}>TUYỆT VỜI</Button>
          </Modal>
      </Portal>
    </View>
  );
}