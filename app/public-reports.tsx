import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, RefreshControl } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, Appbar } from 'react-native-paper';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';

interface Report {
  id: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  status: string;
  createdAt: any;
  userEmail?: string; 
}


const VideoItem = ({ uri }: { uri: string }) => {
  const player = useVideoPlayer(uri, player => {
    player.muted = true;
    player.loop = true;
  });

  return (
    <View style={styles.mediaContainer}>
      <VideoView 
        style={styles.media} 
        player={player} 
        contentFit="cover" 
        nativeControls={false} 
      />
      <View style={styles.videoBadge}>
          <Text style={{fontSize: 10}}>▶️</Text>
      </View>
    </View>
  );
};

const MediaThumbnail = ({ uri, type }: { uri: string, type: 'image' | 'video' }) => {
  if (type === 'video') {
    return <VideoItem uri={uri} />;
  }
  return (
    <View style={styles.mediaContainer}>
        <Image source={{ uri: uri }} style={styles.media} resizeMode="cover" />
    </View>
  );
};

export default function PublicReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchReports = async () => {
    try {
      
      const q = query(
        collection(db, "reports"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const list: Report[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({ 
            id: doc.id, 
            description: data.description,
            mediaUrl: data.mediaUrl,   
            mediaType: data.mediaType || 'image', 
            status: data.status,
            createdAt: data.createdAt,
            userEmail: data.userEmail 
        } as Report);
      });

      setReports(list);
    } catch (error) {
      console.error(error);
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
      default: return '#FF9800';           
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
        
        <MediaThumbnail uri={item.mediaUrl} type={item.mediaType} />

        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Chip 
              style={{ backgroundColor: getStatusColor(item.status), height: 24, marginRight: 5 }} 
              textStyle={{ color: '#fff', fontSize: 10, lineHeight: 12 }}
            >
              {getStatusText(item.status)}
            </Chip>
            <Text variant="bodySmall" style={{ color: '#888', fontSize: 11 }}>
              {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : '...'}
            </Text>
          </View>
          
          {/* Hiển thị người báo cáo (ẩn bớt email cho gọn) */}
          <Text variant="labelSmall" style={{color: '#2E7D32', marginBottom: 2}}>
             Người báo: {item.userEmail?.split('@')[0] || 'Ẩn danh'}
          </Text>

          <Text variant="bodyMedium" numberOfLines={2} style={styles.desc}>
            {item.description || "Không có mô tả"}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: '#fff', elevation: 2}}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Báo cáo từ Cộng đồng" />
      </Appbar.Header>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchReports(); }} />
          }
          ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20, color: '#666'}}>Chưa có báo cáo nào.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  card: { marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, elevation: 1 },
  cardContent: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  
  mediaContainer: { width: 80, height: 80, borderRadius: 8, marginRight: 12, overflow: 'hidden', backgroundColor: '#eee', position: 'relative' },
  media: { width: '100%', height: '100%' },
  videoBadge: { position: 'absolute', bottom: 2, right: 2, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 4, padding: 2 },

  info: { flex: 1, justifyContent: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  desc: { fontWeight: '500', color: '#333' },
});