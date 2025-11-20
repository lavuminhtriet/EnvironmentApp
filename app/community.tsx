import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Card, Avatar, IconButton, TextInput, ActivityIndicator, SegmentedButtons, Portal, Modal, Button, FAB } from 'react-native-paper';
import { auth, db, storage } from '../firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av'; // [MỚI] Import Video Player
import { useRouter } from 'expo-router';
import { styles } from '../styles/community.styles';

interface Post {
  id: string;
  userName: string;
  content: string;
  mediaUrl?: string; // Đổi tên từ imageUrl thành mediaUrl
  mediaType?: 'image' | 'video'; // [MỚI] Lưu loại media
  likes: number;
  createdAt: any;
}

interface Group {
    id: string;
    name: string;
    desc: string;
    members: number;
    image: string;
}

export default function CommunityScreen() {
  const [tab, setTab] = useState<'feed' | 'groups'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  
  const [newPost, setNewPost] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image'); // [MỚI]
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  
  const [visibleComment, setVisibleComment] = useState(false);
  
  const [groups, setGroups] = useState<Group[]>([
    { id: '1', name: 'Cộng đồng Xanh Quận 1', desc: 'Yêu môi trường, ghét rác thải', members: 1250, image: 'https://img.freepik.com/free-vector/eco-friendly-people_23-2148522245.jpg' },
    { id: '2', name: 'Hội Tái chế Sài Gòn', desc: 'Trao đổi đồ cũ, gom pin', members: 3400, image: 'https://img.freepik.com/free-vector/people-recycling-concept_23-2148523550.jpg' },
  ]);
  const [visibleCreateGroup, setVisibleCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Post[] = [];
      snapshot.forEach((doc) => { list.push({ id: doc.id, ...doc.data() } as Post); });
      setPosts(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'], // [MỚI] Cho phép cả Video
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) {
        setMediaUri(result.assets[0].uri);
        setMediaType(result.assets[0].type === 'video' ? 'video' : 'image');
    }
  };

  const uploadMedia = async (uri: string) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const ext = mediaType === 'video' ? 'mp4' : 'jpg';
        const filename = `community/${Date.now()}.${ext}`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
    } catch { return null; }
  };

  const handlePost = async () => {
    if (!newPost.trim() && !mediaUri) { Alert.alert("Thông báo", "Hãy viết gì đó hoặc chọn ảnh/video."); return; }
    if (!user) { Alert.alert("Lỗi", "Vui lòng đăng nhập."); return; }
    setPosting(true);
    try {
      let downloadUrl = null;
      if (mediaUri) downloadUrl = await uploadMedia(mediaUri);
      await addDoc(collection(db, "community_posts"), {
        userId: user.uid, userName: user.email?.split('@')[0], content: newPost,
        mediaUrl: downloadUrl, mediaType: mediaType, // Lưu info media
        likes: 0, createdAt: serverTimestamp()
      });
      setNewPost(''); setMediaUri(null);
    } catch { Alert.alert("Lỗi", "Đăng bài thất bại."); } finally { setPosting(false); }
  };

  const handleLike = async (postId: string) => {
      try { await updateDoc(doc(db, "community_posts", postId), { likes: increment(1) }); } catch {}
  };

  const handleCreateGroup = () => {
      if (!newGroupName.trim()) return;
      const newGroup: Group = {
          id: Date.now().toString(),
          name: newGroupName,
          desc: newGroupDesc,
          members: 1,
          image: 'https://img.freepik.com/free-vector/save-earth-concept_23-2148525429.jpg'
      };
      setGroups([newGroup, ...groups]);
      setNewGroupName(''); setNewGroupDesc(''); setVisibleCreateGroup(false);
      Alert.alert("Thành công", "Nhóm mới đã được tạo!");
  };

  const renderPost = ({ item }: { item: Post }) => (
    <Card style={styles.card}>
      <Card.Title title={item.userName} subtitle={item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString('vi-VN') : 'Vừa xong'} left={(props) => <Avatar.Icon {...props} icon="account" style={{backgroundColor: '#4CAF50'}} />} />
      <Card.Content>
        <Text variant="bodyMedium" style={{fontSize: 16, marginBottom: 10}}>{item.content}</Text>
        
        {/* [MỚI] Render Video hoặc Ảnh */}
        {item.mediaUrl && (
            item.mediaType === 'video' ? (
                <Video
                    style={{ width: '100%', height: 200, marginTop: 5, backgroundColor: '#000' }}
                    source={{ uri: item.mediaUrl }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping={false}
                />
            ) : (
                <Card.Cover source={{ uri: item.mediaUrl }} style={{marginTop: 5, backgroundColor: '#eee'}} />
            )
        )}
      </Card.Content>
      <Card.Actions>
        <IconButton icon="heart-outline" onPress={() => handleLike(item.id)} />
        <Text>{item.likes}</Text>
        <IconButton icon="comment-outline" onPress={() => setVisibleComment(true)} />
        <Text>Bình luận</Text>
        <View style={{flex:1}}/>
        <IconButton icon="share-variant" onPress={() => {}} />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{fontWeight: 'bold', color: '#2E7D32'}}>Cộng Đồng Xanh</Text>
        <IconButton icon="close" onPress={() => router.back()} />
      </View>

      <View style={{paddingHorizontal: 15, marginBottom: 10}}>
        <SegmentedButtons value={tab} onValueChange={val => setTab(val as any)} buttons={[{ value: 'feed', label: 'Bảng tin' }, { value: 'groups', label: 'Nhóm' }]} density="small" />
      </View>

      {tab === 'feed' ? (
        <>
            <View style={styles.inputContainer}>
                <TextInput mode="outlined" placeholder="Chia sẻ..." value={newPost} onChangeText={setNewPost} style={styles.input} multiline />
                <View style={styles.actionRow}>
                    <IconButton icon="camera" onPress={pickMedia} iconColor="#2E7D32" />
                    {mediaUri && (
                        mediaType === 'video' ? (
                             <View style={{position: 'relative', marginRight: 10, justifyContent: 'center'}}>
                                <Text style={{fontSize: 10, color: 'blue'}}>[Video đã chọn]</Text>
                                <TouchableOpacity style={styles.removeBadge} onPress={() => setMediaUri(null)}><Text style={{color: 'white', fontSize: 10}}>X</Text></TouchableOpacity>
                             </View>
                        ) : (
                            <View style={{position: 'relative', marginRight: 10}}>
                                <Image source={{uri: mediaUri}} style={{width: 40, height: 40, borderRadius: 4}} />
                                <TouchableOpacity style={styles.removeBadge} onPress={() => setMediaUri(null)}><Text style={{color: 'white', fontSize: 10}}>X</Text></TouchableOpacity>
                            </View>
                        )
                    )}
                    <View style={{flex: 1}} />
                    <IconButton icon="send" mode="contained" containerColor="#2E7D32" iconColor="#fff" onPress={handlePost} disabled={posting} />
                </View>
            </View>
            {loading ? <ActivityIndicator size="large" color="#2E7D32" style={{marginTop: 20}} /> : <FlatList data={posts} keyExtractor={(item) => item.id} renderItem={renderPost} contentContainerStyle={{paddingBottom: 80}} />}
        </>
      ) : (
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={{padding: 15, paddingBottom: 80}}>
                {groups.map(group => (
                    <Card key={group.id} style={{marginBottom: 15}}>
                        <Card.Cover source={{uri: group.image}} style={{height: 140}}/>
                        <Card.Title title={group.name} subtitle={`${group.members} thành viên - ${group.desc}`} right={(props) => <Button mode="outlined" compact onPress={() => Alert.alert("Đã gửi yêu cầu!")}>Tham gia</Button>} />
                    </Card>
                ))}
            </ScrollView>
            <FAB icon="plus" style={{position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#2E7D32'}} color="#fff" onPress={() => setVisibleCreateGroup(true)} label="Tạo nhóm" />
        </View>
      )}

      <Portal>
        <Modal visible={visibleComment} onDismiss={() => setVisibleComment(false)} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10}}>
            <Text variant="titleMedium" style={{marginBottom: 10}}>Bình luận</Text>
            <View style={{height: 150, justifyContent: 'center', alignItems: 'center'}}><Text style={{color: '#888'}}>Chưa có bình luận nào.</Text></View>
            <TextInput placeholder="Viết bình luận..." mode="outlined" right={<TextInput.Icon icon="send" />} />
        </Modal>

        <Modal visible={visibleCreateGroup} onDismiss={() => setVisibleCreateGroup(false)} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10}}>
            <Text variant="headlineSmall" style={{marginBottom: 15, color: '#2E7D32', fontWeight: 'bold', textAlign: 'center'}}>Tạo Nhóm Mới</Text>
            <TextInput label="Tên nhóm" value={newGroupName} onChangeText={setNewGroupName} mode="outlined" style={{marginBottom: 10, backgroundColor: '#fff'}} />
            <TextInput label="Mô tả ngắn" value={newGroupDesc} onChangeText={setNewGroupDesc} mode="outlined" style={{marginBottom: 20, backgroundColor: '#fff'}} />
            <Button mode="contained" onPress={handleCreateGroup} buttonColor="#2E7D32">Tạo ngay</Button>
        </Modal>
      </Portal>
    </View>
  );
}