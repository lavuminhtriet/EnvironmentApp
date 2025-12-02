import { db, auth } from '../firebaseConfig';
import { doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import { Alert } from 'react-native'; // <--- ĐÃ THÊM IMPORT ALERT CẦN THIẾT

export const addPoints = async (points, reason) => {
  const user = auth.currentUser;
  if (!user || user.isAnonymous) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để tích điểm.");
      throw new Error("Người dùng chưa đăng nhập hoặc đang ở chế độ khách."); 
  }

  const userRef = doc(db, "users", user.uid);
  
  try {
    // 1. Thử cộng điểm (UPDATE)
    await updateDoc(userRef, {
      score: increment(points)
    });

  } catch (initialError) {
    // Nếu UPDATE thất bại (Document không tồn tại), thử tạo mới
    if (initialError.code === 'not-found' || initialError.message.includes('No document to update')) {
        try {
            await setDoc(userRef, { 
                score: points,
                displayName: user.displayName || user.email?.split('@')[0] || 'Người dùng mới',
                email: user.email,
                badge: 'Tân binh'
            }, { merge: true });
            
        } catch (setDocError) {
            console.error("LỖI CỘNG ĐIỂM (SETDOC FAIL):", setDocError);
            throw new Error(`Transaction thất bại: ${setDocError.message}`);
        }
    } else {
        console.error("LỖI CỘNG ĐIỂM (UPDATE FAIL):", initialError);
        throw new Error(`Lỗi cập nhật: ${initialError.message}`);
    }
  }

  // 2. Kiểm tra thăng cấp
  try {
    const userSnap = await getDoc(userRef);
    const currentScore = userSnap.data()?.score || 0;
    
    let newBadge = null;
    if (currentScore >= 50 && currentScore < 100) newBadge = 'Người Xanh';
    if (currentScore >= 100 && currentScore < 200) newBadge = 'Chiến Binh';
    if (currentScore >= 200) newBadge = 'Siêu Anh Hùng';

    if (newBadge && userSnap.data()?.badge !== newBadge) {
      await updateDoc(userRef, { badge: newBadge });
      Alert.alert("🎉 Chúc mừng!", `Bạn đã nhận được +${points} điểm và thăng cấp: ${newBadge}`);
    } else {
      Alert.alert("🎉 Tuyệt vời!", `Bạn đã nhận được +${points} điểm từ việc ${reason}.`);
    }
  } catch (error) {
    console.error("Lỗi kiểm tra huy hiệu:", error);
    Alert.alert("Lỗi", "Đã cộng điểm nhưng không kiểm tra được huy hiệu.");
  }
};