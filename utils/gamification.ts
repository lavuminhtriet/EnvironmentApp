import { db, auth } from '../firebaseConfig'; 
import { doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

export const addPoints = async (points: number, reason: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  
  try {
    // 1. Cộng điểm vào Firestore
    await updateDoc(userRef, {
      score: increment(points)
    });

    // 2. Kiểm tra thăng cấp (Logic FR-9.1.2)
    const userSnap = await getDoc(userRef);
    const currentScore = (userSnap.data()?.score || 0); // Lấy điểm hiện tại sau khi cộng
    
    let newBadge = 'Tân binh';
    // Quy định mốc điểm:
    if (currentScore >= 50 && currentScore < 200) newBadge = 'Người xanh';
    if (currentScore >= 200 && currentScore < 500) newBadge = 'Chiến binh môi trường';
    if (currentScore >= 500) newBadge = 'Thành phố sạch';

    const currentBadge = userSnap.data()?.badge || '';

    // Chỉ cập nhật và thông báo nếu Badge thay đổi và không phải Tân binh
    if (newBadge !== currentBadge && newBadge !== 'Tân binh') {
      await updateDoc(userRef, { badge: newBadge });
      Alert.alert(
        "🎉 THĂNG CẤP MỚI!", 
        `Chúc mừng! Bạn đã đạt danh hiệu: "${newBadge}"\nHãy tiếp tục bảo vệ môi trường nhé!`
      );
    } 

  } catch (error) {
    console.error("Lỗi cộng điểm:", error);
    // Nếu user mới chưa có doc thì tạo mới
    await setDoc(userRef, { score: points, badge: 'Tân binh' }, { merge: true });
  }
};