import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native'; // Đã xóa Image
import { Text, Card, ProgressBar, Button, Avatar, Chip } from 'react-native-paper';
import { auth, db } from '../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

export default function RewardsScreen() {
  const [score, setScore] = useState(0);
  const [badge, setBadge] = useState('Tân binh');
  
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setScore(data.score || 0);
        setBadge(data.badge || 'Tân binh');
      }
    });
    return () => unsub();
  }, []);

  const progress = Math.min(score / 200, 1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={80} icon="trophy" style={{backgroundColor: '#FFC107'}} />
        <Text variant="headlineMedium" style={{marginTop: 10, fontWeight: 'bold'}}>{score} Điểm</Text>
        <Chip icon="star" style={{marginTop: 5, backgroundColor: '#E1F5FE'}}>{badge}</Chip>
      </View>

      <Card style={styles.card}>
        <Card.Title title="Tiến độ thăng cấp" />
        <Card.Content>
          <ProgressBar progress={progress} color="#2E7D32" style={{height: 10, borderRadius: 5}} />
          <Text style={{marginTop: 5, textAlign: 'right'}}>{score}/200 để đạt max cấp</Text>
        </Card.Content>
      </Card>

      <Text variant="titleLarge" style={styles.sectionTitle}>Đổi Quà (Demo)</Text>
      
      <View style={styles.grid}>
        <Card style={styles.giftCard}>
          <Card.Cover source={{ uri: 'https://img.icons8.com/color/96/tree-planting.png' }} style={styles.giftImg} />
          <Card.Content>
            <Text variant="titleMedium">Trồng 1 cây xanh</Text>
            <Text style={{color: '#666'}}>50 Điểm</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" disabled={score < 50} compact>Đổi</Button>
          </Card.Actions>
        </Card>

        <Card style={styles.giftCard}>
          <Card.Cover source={{ uri: 'https://img.icons8.com/color/96/discount--v1.png' }} style={styles.giftImg} />
          <Card.Content>
            <Text variant="titleMedium">Voucher Cafe</Text>
            <Text style={{color: '#666'}}>100 Điểm</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" disabled={score < 100} compact>Đổi</Button>
          </Card.Actions>
        </Card>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F5F5F5', flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: 30 },
  card: { marginBottom: 20, backgroundColor: '#fff' },
  sectionTitle: { fontWeight: 'bold', marginBottom: 15, color: '#333' },
  grid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  giftCard: { width: '48%', marginBottom: 10 },
  giftImg: { height: 100, backgroundColor: '#fff' }
});