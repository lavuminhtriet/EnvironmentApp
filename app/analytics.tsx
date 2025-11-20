import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, DataTable, Appbar, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, getCountFromServer } from 'firebase/firestore';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { styles } from '../styles/analytics.styles';

export default function AnalyticsScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  
  const [stats, setStats] = useState({
    reportsCount: 0,
    score: 0,
    wasteCount: 0,
    globalCount: 0 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let score = 0;
        let userReports = 0;

        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            score = userDoc.exists() ? userDoc.data().score || 0 : 0;
            const qReports = query(collection(db, "reports"), where("userId", "==", user.uid));
            const snapshotReports = await getCountFromServer(qReports);
            userReports = snapshotReports.data().count;
        }

        const qGlobal = query(collection(db, "reports"));
        const snapshotGlobal = await getCountFromServer(qGlobal);
        
        setStats({
            reportsCount: userReports,
            score: score,
            wasteCount: Math.floor(score / 5),
            globalCount: snapshotGlobal.data().count
        });

      } catch {
        // Bỏ qua lỗi log để tránh warning
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const handleExportPDF = async () => {
    if (!user) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập để xuất báo cáo.");
        return;
    }

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica'; padding: 20px; }
            h1 { color: #2E7D32; text-align: center; }
            .card { border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px; }
            .highlight { color: #1565C0; font-weight: bold; font-size: 20px; }
          </style>
        </head>
        <body>
          <h1>BÁO CÁO HOẠT ĐỘNG MÔI TRƯỜNG</h1>
          <p><strong>Người dùng:</strong> ${user.email}</p>
          <p><strong>Ngày xuất:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
          <hr />
          
          <div class="card">
            <h3>Tổng quan cá nhân</h3>
            <p>Số báo cáo đã gửi: <span class="highlight">${stats.reportsCount}</span></p>
            <p>Điểm thưởng hiện tại: <span class="highlight">${stats.score}</span></p>
            <p>Số lần phân loại rác (ước tính): <span class="highlight">${stats.wasteCount}</span></p>
          </div>

          <div class="card">
            <h3>Đóng góp cộng đồng</h3>
            <p>Tổng số báo cáo toàn hệ thống: <strong>${stats.globalCount}</strong></p>
          </div>

          <p style="text-align: center; margin-top: 50px; color: #666;">
            Cảm ơn bạn đã chung tay bảo vệ môi trường xanh! 🌿
          </p>
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

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2E7D32"/></View>;

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: '#fff', elevation: 4}}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Thống Kê & Báo Cáo" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="titleMedium" style={{marginBottom: 15, textAlign: 'center', color: '#666'}}>Tổng quan hoạt động</Text>

        <Card style={[styles.statCard, {backgroundColor: '#FFF3E0', width: '100%', marginBottom: 15}]}>
            <Card.Content style={{alignItems: 'center'}}>
                <Text variant="titleMedium">Cộng đồng chung tay</Text>
                <Text variant="displayMedium" style={{color: '#E65100', fontWeight: 'bold'}}>{stats.globalCount}</Text>
                <Text variant="bodySmall">Tổng số báo cáo vi phạm toàn hệ thống</Text>
            </Card.Content>
        </Card>

        <View style={styles.grid}>
            <Card style={[styles.statCard, {backgroundColor: '#E8F5E9', width: '48%'}]}>
                <Card.Content style={{alignItems: 'center'}}>
                    <Text variant="displaySmall" style={{color: '#2E7D32', fontWeight: 'bold'}}>{stats.reportsCount}</Text>
                    <Text variant="bodyMedium">Báo cáo của bạn</Text>
                </Card.Content>
            </Card>

            <Card style={[styles.statCard, {backgroundColor: '#E3F2FD', width: '48%'}]}>
                <Card.Content style={{alignItems: 'center'}}>
                    <Text variant="displaySmall" style={{color: '#1565C0', fontWeight: 'bold'}}>{stats.score}</Text>
                    <Text variant="bodyMedium">Điểm thưởng</Text>
                </Card.Content>
            </Card>
        </View>

        <Card style={styles.tableCard}>
            <Card.Title title="Chi tiết đóng góp" />
            <DataTable>
                <DataTable.Header>
                <DataTable.Title>Hoạt động</DataTable.Title>
                <DataTable.Title numeric>Số lượng</DataTable.Title>
                <DataTable.Title numeric>Điểm nhận</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                <DataTable.Cell>Gửi báo cáo</DataTable.Cell>
                <DataTable.Cell numeric>{stats.reportsCount}</DataTable.Cell>
                <DataTable.Cell numeric>{stats.reportsCount * 10}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                <DataTable.Cell>Phân loại rác</DataTable.Cell>
                <DataTable.Cell numeric>{stats.wasteCount}</DataTable.Cell>
                <DataTable.Cell numeric>{stats.wasteCount * 5}</DataTable.Cell>
                </DataTable.Row>
            </DataTable>
        </Card>

        <Button mode="contained" icon="file-pdf-box" style={styles.exportBtn} onPress={handleExportPDF}>Xuất Báo Cáo PDF</Button>
      </ScrollView>
    </View>
  );
}