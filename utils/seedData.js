import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { Alert } from 'react-native'; 











export const seedInitialData = async () => {
  try {

    Alert.alert("Đang xử lý...", "Đang đẩy dữ liệu lên Firebase, vui lòng đợi..."); 








    const mapRef = collection(db, 'map_points');
    await addDoc(mapRef, { lat: 10.7712, lng: 106.6900, title: 'Điểm thu gom Nhựa (Q1)', type: 'plastic' });
    await addDoc(mapRef, { lat: 10.7850, lng: 106.6900, title: 'Trạm Xử lý Rác Điện tử', type: 'electronic' });
    await addDoc(mapRef, { lat: 10.7650, lng: 106.6850, title: 'Thùng rác Y tế', type: 'medical' });
    await addDoc(mapRef, { lat: 10.7800, lng: 106.7050, title: 'Điểm đổi Pin Cũ', type: 'battery' });









    const layerRef = collection(db, 'map_layers');
    await addDoc(layerRef, { lat: 10.7750, lng: 106.7020, radius: 800, color: 'rgba(255, 87, 34, 0.4)', type: 'aqi' });
    await addDoc(layerRef, { lat: 10.7700, lng: 106.6950, radius: 500, color: 'rgba(156, 39, 176, 0.3)', type: 'noise' });
    await addDoc(layerRef, { lat: 10.7900, lng: 106.7100, radius: 700, color: 'rgba(3, 169, 244, 0.3)', type: 'water' });









    const giftRef = collection(db, 'gifts');
    await addDoc(giftRef, { name: "Cây sen đá mini", cost: 30, icon: "https://img.icons8.com/color/96/plant.png", desc: "Giúp không gian xanh mát." });
    await addDoc(giftRef, { name: "Voucher 50K Tái chế", cost: 80, icon: "https://img.icons8.com/color/96/voucher.png", desc: "Giảm giá khi bán phế liệu." });
    await addDoc(giftRef, { name: "Bộ đựng thủy tinh", cost: 350, icon: "https://img.icons8.com/color/96/glass.png", desc: "Thay thế hộp nhựa dùng một lần." });
    await addDoc(giftRef, { name: "Vé xem phim", cost: 120, icon: "https://img.icons8.com/color/96/movie.png", desc: "Vé CGV hoặc Lotte." });
    await addDoc(giftRef, { name: "Hạt giống hoa", cost: 40, icon: "https://img.icons8.com/color/96/seed.png", desc: "Gói hạt giống ngẫu nhiên." });
    await addDoc(giftRef, { name: "Bình giữ nhiệt tre", cost: 250, icon: "https://img.icons8.com/color/96/thermos.png", desc: "Chất liệu thân thiện môi trường." });
    await addDoc(giftRef, { name: "Voucher sách 100K", cost: 150, icon: "https://img.icons8.com/color/96/book.png", desc: "Áp dụng tại nhà sách Phương Nam." });
    await addDoc(giftRef, { name: "Túi lưới đựng rau", cost: 20, icon: "https://img.icons8.com/color/96/shopping-bag-loaded.png", desc: "Giảm túi nilon khi đi chợ." });
    await addDoc(giftRef, { name: "Bàn chải tre", cost: 35, icon: "https://img.icons8.com/color/96/toothbrush.png", desc: "Thân tre tự nhiên." });
    await addDoc(giftRef, { name: "Gói Compost nhỏ", cost: 100, icon: "https://img.icons8.com/color/96/soil.png", desc: "Phân hữu cơ ủ tại nhà." });







    
    Alert.alert("✅ Thành công", "Dữ liệu thật đã được tạo trên Firebase! Bạn có thể xóa nút 'Nạp Data' đi.");
  } catch (e) {
    Alert.alert("❌ Lỗi Nạp Data", "Kiểm tra Rules hoặc kết nối: " + e.message);
  }
};