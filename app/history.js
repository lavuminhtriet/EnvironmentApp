import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, Alert, RefreshControl } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, IconButton, Button, Avatar } from 'react-native-paper';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter, Stack } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { styles } from '../styles/history.styles';

const VideoItem = ({ uri }) => {
  const player = useVideoPlayer(uri, player => {
    player.muted = true; 
    player.loop = true;
  });

  return (
    <View style={styles.mediaBox}>
      <VideoView 
        style={styles.media} 
        player={player} 
        contentFit="cover" 
        nativeControls={false} 
      />
      <View style={styles.videoBadge}>
          <Avatar.Icon size={16} icon="play" style={{backgroundColor:'transparent'}} color='#fff' />
      </View>
    </View>
  );
};

const MediaThumbnail = ({ uri, type }) => {
  if (type === 'video') {
    return <VideoItem uri={uri} />;
  }
  return (
    <View style={styles.mediaBox}>
        <Image source={{ uri: uri }} style={styles.media} resizeMode="cover" />
    </View>
  );
};

export default function HistoryScreen() {
  const [reports, setReports] = useState([]);
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
      const list = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({ 
            id: doc.id, 
            description: data.description,
            mediaUrl: data.mediaUrl,   
            mediaType: data.mediaType || 'image', 
            status: data.status,
            createdAt: data.createdAt
        });
      });

      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'resolved': 
        return { bg: '#E8F5E9', text: '#2E7D32', label: 'Đã xử lý' }; 
      case 'processing': 
        return { bg: '#E3F2FD', text: '#1565C0', label: 'Đang xử lý' }; 
      default: 
        return { bg: '#FFF3E0', text: '#EF6C00', label: 'Đã tiếp nhận' }; 
    }
  };

  const renderItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View style={styles.card}>
        <MediaThumbnail uri={item.mediaUrl} type={item.mediaType} />
        <View style={styles.infoBox}>
          <View style={styles.cardHeaderRow}>
             <View style={[styles.statusBadge, {backgroundColor: statusStyle.bg}]}>
                 <Text style={[styles.statusText, {color: statusStyle.text}]}>{statusStyle.label}</Text>
             </View>
             <Text style={styles.dateText}>
               {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : '...'}
             </Text>
          </View>
          <Text numberOfLines={2} style={styles.descText}>
            {item.description || "Không có mô tả"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerBar}>
          <IconButton icon="arrow-left" onPress={() => router.back()} iconColor="#0E4626" size={26} style={styles.backBtn} />
          <Text style={styles.headerTitle}>Lịch Sử Báo Cáo</Text>
          <View style={{width: 40}} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0E4626" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchReports(); }} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
               <Avatar.Icon size={80} icon="file-document-outline" style={{backgroundColor: '#E8F5E9'}} color='#2E7D32' />
               <Text style={styles.emptyText}>Bạn chưa gửi báo cáo nào.{"\n"}Hãy chung tay bảo vệ môi trường nhé!</Text>
               <Button mode="contained" onPress={() => router.push('/report')} style={styles.createBtn} labelStyle={{fontWeight:'bold', fontSize: 16}}>Gửi báo cáo ngay</Button>
            </View>
          }
        />
      )}
    </View>
  );
}