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

    // 2. Kiểm tra thăng cấp (Ví dụ: Đủ 100 điểm lên cấp Chiến binh)
    const userSnap = await getDoc(userRef);
    const currentScore = userSnap.data()?.score || 0;
    
    let newBadge = null;
    if (currentScore >= 50 && currentScore < 100) newBadge = 'Người Xanh';
    if (currentScore >= 100 && currentScore < 200) newBadge = 'Chiến Binh';
    if (currentScore >= 200) newBadge = 'Siêu Anh Hùng';

    if (newBadge) {
      await updateDoc(userRef, { badge: newBadge });
      Alert.alert("🎉 Chúc mừng!", `Bạn đã nhận được +${points} điểm và thăng cấp: ${newBadge}`);
    } else {
      Alert.alert("🎉 Tuyệt vời!", `Bạn đã nhận được +${points} điểm từ việc ${reason}.`);
    }

  } catch (error) {
    console.error("Lỗi cộng điểm:", error);
    // Nếu user chưa có field score thì tạo mới
    await setDoc(userRef, { score: points }, { merge: true });
  }
};