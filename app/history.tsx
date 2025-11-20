import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, Alert, RefreshControl } from 'react-native';
import { Text, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';

interface Report {
  id: string;
  description: string;
  imageUrl: string;
  status: string;
  createdAt: any;
}

export default function HistoryScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchReports = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Lỗi', 'Bạn cần đăng nhập để xem lịch sử.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const q = query(
        collection(db, "reports"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const list: Report[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Report);
      });

      // Sắp xếp mới nhất lên đầu
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setReports(list);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải lịch sử báo cáo.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return '#4CAF50';
      case 'processing': return '#2196F3';
      default: return '#FFC107';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return 'Đã xử lý';
      case 'processing': return 'Đang xử lý';
      default: return 'Đã tiếp nhận';
    }
  };

  const renderItem = ({ item }: { item: Report }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Chip 
              style={{ backgroundColor: getStatusColor(item.status), height: 30 }} 
              textStyle={{ color: '#fff', fontSize: 12 }}
            >
              {getStatusText(item.status)}
            </Chip>
            <Text variant="bodySmall" style={{ color: '#888' }}>
              {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : '...'}
            </Text>
          </View>
          <Text variant="bodyMedium" numberOfLines={2} style={styles.desc}>
            {item.description}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>Lịch sử gửi báo cáo</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />
      ) : reports.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ marginBottom: 10 }}>Bạn chưa gửi báo cáo nào.</Text>
          <Chip icon="plus" onPress={() => router.push('/report' as any)}>Gửi báo cáo ngay</Chip>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchReports(); }} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  header: { fontWeight: 'bold', color: '#2E7D32', marginBottom: 20, textAlign: 'center' },
  card: { marginBottom: 15, backgroundColor: '#fff', borderRadius: 12 },
  cardContent: { flexDirection: 'row', padding: 10 },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 15, backgroundColor: '#eee' },
  info: { flex: 1, justifyContent: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  desc: { fontWeight: '500', color: '#333' },
  emptyState: { alignItems: 'center', marginTop: 100 }
});