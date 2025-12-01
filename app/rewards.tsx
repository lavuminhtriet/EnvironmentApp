import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Animated } from 'react-native'; 
import { Text, Button, IconButton, Portal, Modal, Avatar } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
import { auth, db } from '../firebaseConfig';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { styles } from '../styles/rewards.styles';

const Gifts = [
    { id: 1, name: "Trồng 1 cây xanh", cost: 50, icon: "https://img.icons8.com/color/96/tree-planting.png", desc: "Quyên góp điểm để trồng cây tại rừng phòng hộ." },
    { id: 2, name: "Voucher Cafe Xanh", cost: 100, icon: "https://img.icons8.com/color/96/discount--v1.png", desc: "Giảm 20% tại hệ thống đối tác GreenCoffee." },
    { id: 3, name: "Túi vải Canvas", cost: 200, icon: "https://img.icons8.com/color/96/shopping-bag.png", desc: "Túi vải thời trang, thân thiện môi trường." },
    { id: 4, name: "Bộ ống hút tre", cost: 150, icon: "https://img.icons8.com/color/96/bamboo.png", desc: "Bộ ống hút tái sử dụng kèm cọ rửa." },
];

export default function RewardsScreen() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [badge, setBadge] = useState('Tân binh');
  
  
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [selectedGift, setSelectedGift] = useState<any>(null);

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

  const onRedeemPress = (gift: any) => {
      setSelectedGift(gift);
      setConfirmVisible(true);
  };

  const handleConfirmRedeem = async () => {
      if (!selectedGift) return;
      setConfirmVisible(false);
      
      try {
          const userRef = doc(db, "users", auth.currentUser!.uid);
          await updateDoc(userRef, { score: increment(-selectedGift.cost) });
          
          
          setSuccessVisible(true);
      } catch {
          
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

        <Text style={styles.sectionTitle}>Danh sách quà tặng</Text>

        
        {Gifts.map(gift => {
            const canRedeem = score >= gift.cost;
            return (
                <View key={gift.id} style={styles.giftCard}>
                    <View style={styles.giftImageContainer}>
                        <Image source={{ uri: gift.icon }} style={styles.giftImage} resizeMode="contain" />
                    </View>
                    <View style={styles.giftContent}>
                        <Text style={styles.giftName}>{gift.name}</Text>
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
        })}

      </ScrollView>

      
      <Portal>
          <Modal visible={confirmVisible} onDismiss={() => setConfirmVisible(false)} contentContainerStyle={styles.modalContainer}>
             <View style={[styles.modalIconBox, {backgroundColor: '#FFF3E0'}]}>
                 <Avatar.Icon size={40} icon="gift-open" style={{backgroundColor: 'transparent'}} color='#EF6C00' />
             </View>
             <Text style={styles.modalTitle}>Xác nhận đổi quà</Text>
             <Text style={styles.modalDesc}>
                 Bạn có chắc muốn dùng <Text style={{fontWeight:'bold'}}>{selectedGift?.cost} điểm</Text> để đổi lấy "{selectedGift?.name}" không?
             </Text>
             <View style={styles.modalBtnRow}>
                 <Button mode="outlined" onPress={() => setConfirmVisible(false)} style={styles.cancelBtn} textColor="#666">Hủy</Button>
                 <Button mode="contained" onPress={handleConfirmRedeem} style={styles.confirmBtn}>Xác nhận</Button>
             </View>
          </Modal>
      </Portal>

      
      <Portal>
          <Modal visible={successVisible} onDismiss={() => setSuccessVisible(false)} contentContainerStyle={styles.modalContainer}>
             <View style={[styles.modalIconBox, {backgroundColor: '#E8F5E9'}]}>
                 <Avatar.Icon size={50} icon="check-circle" style={{backgroundColor: 'transparent'}} color='#4CAF50' />
             </View>
             <Text style={styles.modalTitle}>Đổi quà thành công!</Text>
             <Text style={styles.modalDesc}>
                 Chúc mừng! Quà tặng "{selectedGift?.name}" đã được thêm vào túi đồ của bạn.
             </Text>
             <Button mode="contained" onPress={() => setSuccessVisible(false)} style={styles.successBtn}>TUYỆT VỜI</Button>
          </Modal>
      </Portal>

    </View>
  );
}