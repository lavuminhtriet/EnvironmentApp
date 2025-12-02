import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Button, ActivityIndicator, IconButton, Avatar } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, getCountFromServer, getDocs } from 'firebase/firestore';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { styles } from '../styles/analytics.styles';

export default function AnalyticsScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  
  const [stats, setStats] = useState({
    userReports: 0,
    userScore: 0,
    communityReports: 0, 
    recycledWaste: 0,    
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      let score = 0;
      let myReports = 0;

      if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          score = userDoc.exists() ? userDoc.data().score || 0 : 0;
          
          const qReports = query(collection(db, "reports"), where("userId", "==", user.uid));
          const snapshotReports = await getCountFromServer(qReports);
          myReports = snapshotReports.data().count;
      }

      const qGlobalReports = query(collection(db, "reports"));
      const snapshotGlobal = await getCountFromServer(qGlobalReports);
      const totalReports = snapshotGlobal.data().count;

      // Logic thật hơn: Giả sử trung bình mỗi báo cáo giúp xử lý 2kg rác
      const estimatedWaste = totalReports * 2; 

      setStats({
          userReports: myReports,
          userScore: score,
          communityReports: totalReports,
          recycledWaste: estimatedWaste 
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  // (Phần handleExportPDF giữ nguyên, chỉ copy lại để đảm bảo file đầy đủ)
  const handleExportPDF = async () => {
    if (!user) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập để xuất báo cáo.");
        return;
    }

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; background-color: #f9f9f9; }
            .header { text-align: center; margin-bottom: 30px; }
            h1 { color: #0E4626; margin-bottom: 5px; }
            .card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .label { font-weight: bold; color: #555; font-size: 14px; }
            .value { font-size: 28px; color: #000; font-weight: bold; margin-top: 5px; }
            .highlight { color: #0E4626; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BÁO CÁO TÁC ĐỘNG MÔI TRƯỜNG</h1>
            <p>Người dùng: ${user.email} | Ngày: ${new Date().toLocaleDateString('vi-VN')}</p>
          </div>
          <div class="card">
            <h3 style="color: #0E4626; border-bottom: 1px solid #eee; padding-bottom: 10px;">👤 Thống Kê Cá Nhân</h3>
            <div style="display: flex; justify-content: space-between;">
                <div><div class="label">Số báo cáo đã gửi</div><div class="value">${stats.userReports}</div></div>
                <div><div class="label">Điểm thưởng tích lũy</div><div class="value highlight">${stats.userScore}</div></div>
            </div>
          </div>
          <div class="card" style="background-color: #E8F5E9;">
            <h3 style="color: #0E4626; border-bottom: 1px solid #ccc; padding-bottom: 10px;">🌍 Dashboard Cộng Đồng</h3>
            <div style="display: flex; justify-content: space-between;">
                <div><div class="label">Tổng báo cáo hệ thống</div><div class="value">${stats.communityReports}</div></div>
                <div><div class="label">Rác tái chế (Ước tính)</div><div class="value" style="color: #1565C0;">${stats.recycledWaste} kg</div></div>
            </div>
          </div>
          <div class="footer">Environment App - Chung tay vì một hành tinh xanh 🌿</div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch {
      Alert.alert("Lỗi", "Không thể tạo file PDF.");
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#0E4626"/></View>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerBar}>
        <IconButton icon="arrow-left" onPress={() => router.back()} iconColor="#0E4626" size={26} style={styles.backBtn} />
        <Text style={styles.headerTitle}>Thống Kê</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStats(); }} />} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Tác động từ cộng đồng</Text>
        <TouchableOpacity activeOpacity={0.9} style={styles.dashboardCard} onPress={() => router.push('/community')}>
            <View style={styles.dashboardHeader}>
                <Avatar.Icon size={36} icon="earth" style={{backgroundColor: 'rgba(255,255,255,0.2)'}} color='#fff' />
                <Text style={styles.dashboardTitle}>MỌI NGƯỜI ĐÃ BÁO CÁO</Text>
            </View>
            <View style={styles.dashboardRow}>
                <View style={styles.dashboardItem}>
                    <Text style={styles.dashboardValue}>{stats.communityReports}</Text>
                    <Text style={styles.dashboardLabel}>Báo cáo vi phạm</Text>
                </View>
                <View style={styles.dividerVertical} />
                <View style={styles.dashboardItem}>
                    <Text style={styles.dashboardValue}>{stats.recycledWaste}</Text>
                    <Text style={styles.dashboardLabel}>Kg rác tái chế</Text>
                </View>
            </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Hoạt động của bạn</Text>
        <View style={styles.gridContainer}>
            <TouchableOpacity activeOpacity={0.8} style={styles.statCard} onPress={() => router.push('/history')}>
                <View style={[styles.iconBox, {backgroundColor: '#E3F2FD'}]}>
                    <Avatar.Icon size={30} icon="file-document-edit-outline" style={{backgroundColor:'transparent'}} color='#1565C0' />
                </View>
                <Text style={styles.statCardValue}>{stats.userReports}</Text>
                <Text style={styles.statCardLabel}>Báo cáo đã gửi</Text>
                <Text style={styles.actionText}>Xem lịch sử →</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} style={styles.statCard} onPress={() => router.push('/rewards')}>
                <View style={[styles.iconBox, {backgroundColor: '#FFF3E0'}]}>
                    <Avatar.Icon size={30} icon="trophy-outline" style={{backgroundColor:'transparent'}} color='#E65100' />
                </View>
                <Text style={[styles.statCardValue, {color: '#E65100'}]}>{stats.userScore}</Text>
                <Text style={styles.statCardLabel}>Điểm thưởng</Text>
                <Text style={styles.actionText}>Đổi quà ngay →</Text>
            </TouchableOpacity>
        </View>

        <Button mode="contained" icon="file-pdf-box" style={styles.exportBtn} onPress={handleExportPDF} labelStyle={{fontSize: 16, fontWeight: 'bold'}}>
            XUẤT BÁO CÁO PDF
        </Button>
        <Text style={styles.disclaimer}>*Dữ liệu tái chế được ước tính dựa trên hoạt động chung.</Text>
      </ScrollView>
    </View>
  );
}