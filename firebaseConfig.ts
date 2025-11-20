import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
// @ts-ignore: Bỏ qua lỗi kiểm tra dòng này vì VS Code đang hiểu nhầm
import { initializeAuth, getReactNativePersistence, Auth, getAuth } from 'firebase/auth';
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// 1. Định nghĩa kiểu rõ ràng cho app
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Định nghĩa kiểu cho biến auth là 'Auth'
let auth: Auth;

try {
  // Cố gắng khởi tạo với AsyncStorage
  auth = initializeAuth(app, {
    // @ts-ignore: Thêm dòng này để bỏ qua lỗi đỏ nếu nó vẫn hiện ở đây
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch {
  // [ĐÃ FIX] Xóa hẳn biến lỗi trong catch -> catch {}
  // Nếu đã khởi tạo rồi (do Hot Reload), lấy lại instance cũ
  auth = getAuth(app);
}

export { auth };
// 3. Định nghĩa kiểu cho db và storage
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);