import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Alert, ScrollView, Share, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Avatar, IconButton, TextInput, ActivityIndicator, SegmentedButtons, Portal, Modal, Button, FAB } from 'react-native-paper';

import { auth, db, storage } from '../firebaseConfig'; 

import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, Stack } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';

// Import Styles
import { styles } from '../styles/community.styles';

const VIETNAM_LOCATIONS = {
    "TP. Hồ Chí Minh": {
        "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cô Giang", "Phường Cầu Kho", "Phường Đa Kao", "Phường Tân Định", "Phường Phạm Ngũ Lão", "Phường Nguyễn Cư Trinh", "Phường Nguyễn Thái Bình", "Phường Cầu Ông Lãnh"],
        "Quận 3": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường Võ Thị Sáu"],
        "Quận 7": ["Phường Tân Phong", "Phường Tân Phú", "Phường Bình Thuận", "Phường Phú Thuận", "Phường Tân Hưng", "Phường Tân Kiểng", "Phường Tân Quy", "Phường Phú Mỹ", "Phường Tân Thuận Đông", "Phường Tân Thuận Tây"],
        "TP. Thủ Đức": ["Phường Thảo Điền", "Phường An Phú", "Phường Bình Thọ", "Phường Linh Trung", "Phường Linh Chiểu", "Phường Linh Tây", "Phường Linh Đông", "Phường Linh Xuân", "Phường Tam Bình", "Phường Tam Phú", "Phường Hiệp Bình Chánh", "Phường Hiệp Bình Phước"],
        "Quận Bình Thạnh": ["Phường 1", "Phường 2", "Phường 3", "Phường 5", "Phường 6", "Phường 7", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 17", "Phường 19", "Phường 21", "Phường 22", "Phường 24", "Phường 25", "Phường 26", "Phường 27", "Phường 28"],
        "Quận Gò Vấp": ["Phường 1", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16", "Phường 17"],
        "Huyện Củ Chi": ["Thị trấn Củ Chi", "Xã Phú Hòa Đông", "Xã Tân Thạnh Tây", "Xã Tân Thạnh Đông", "Xã Tân Phú Trung", "Xã Tân Thông Hội", "Xã Phước Vĩnh An", "Xã Hòa Phú", "Xã Bình Mỹ", "Xã Nhuận Đức", "Xã Phạm Văn Cội", "Xã An Nhơn Tây", "Xã Trung Lập Hạ", "Xã Trung Lập Thượng"],
    },
    "Hà Nội": {
        "Quận Ba Đình": ["Phường Phúc Xá", "Phường Trúc Bạch", "Phường Vĩnh Phúc", "Phường Cống Vị", "Phường Liễu Giai", "Phường Nguyễn Trung Trực", "Phường Quán Thánh", "Phường Ngọc Hà", "Phường Điện Biên", "Phường Đội Cấn", "Phường Ngọc Khánh", "Phường Kim Mã", "Phường Giảng Võ", "Phường Thành Công"],
        "Quận Hoàn Kiếm": ["Phường Phúc Tân", "Phường Đồng Xuân", "Phường Hàng Mã", "Phường Hàng Buồm", "Phường Hàng Đào", "Phường Hàng Bồ", "Phường Cửa Đông", "Phường Cửa Nam", "Phường Hàng Gai", "Phường Hàng Bạc", "Phường Hàng Trống", "Phường Lý Thái Tổ", "Phường Phan Chu Trinh", "Phường Tràng Tiền"],
        "Quận Tây Hồ": ["Phường Phú Thượng", "Phường Nhật Tân", "Phường Tứ Liên", "Phường Quảng An", "Phường Xuân La", "Phường Yên Phụ", "Phường Bưởi", "Phường Thụy Khuê"],
        "Quận Cầu Giấy": ["Phường Nghĩa Đô", "Phường Quan Hoa", "Phường Dịch Vọng", "Phường Dịch Vọng Hậu", "Phường Trung Hòa", "Phường Nghĩa Tân", "Phường Mai Dịch", "Phường Yên Hòa"],
        "Quận Đống Đa": ["Phường Cát Linh", "Phường Văn Miếu", "Phường Quốc Tử Giám", "Phường Láng Thượng", "Phường Ô Chợ Dừa", "Phường Hàng Bột", "Phường Nam Đồng", "Phường Trung Liệt", "Phường Khâm Thiên", "Phường Thổ Quan", "Phường Phương Liên", "Phường Quang Trung", "Phường Trung Phụng", "Phường Trung Tự", "Phường Kim Liên", "Phường Phương Mai", "Phường Ngã Tư Sở", "Phường Khương Thượng", "Phường Thịnh Quang", "Phường Láng Hạ"],
    },
    "Đà Nẵng": {
        "Quận Hải Châu": ["Phường Hải Châu I", "Phường Hải Châu II", "Phường Thạch Thang", "Phường Thanh Bình", "Phường Thuận Phước", "Phường Hòa Thuận Đông", "Phường Hòa Thuận Tây", "Phường Nam Dương", "Phường Phước Ninh", "Phường Bình Hiên", "Phường Bình Thuận", "Phường Hòa Cường Bắc", "Phường Hòa Cường Nam"],
        "Quận Sơn Trà": ["Phường Thọ Quang", "Phường Nại Hiên Đông", "Phường Mân Thái", "Phường An Hải Bắc", "Phường Phước Mỹ", "Phường An Hải Tây", "Phường An Hải Đông"],
        "Quận Ngũ Hành Sơn": ["Phường Mỹ An", "Phường Khuê Mỹ", "Phường Hòa Quý", "Phường Hòa Hải"],
        "Quận Thanh Khê": ["Phường Tam Thuận", "Phường Thanh Khê Tây", "Phường Thanh Khê Đông", "Phường Xuân Hà", "Phường Tân Chính", "Phường Chính Gián", "Phường Vĩnh Trung", "Phường Thạc Gián", "Phường An Khê", "Phường Hòa Khê"],
    },
    "Quảng Ngãi": {
        "TP. Quảng Ngãi": ["Phường Trần Phú", "Phường Lê Hồng Phong", "Phường Nguyễn Nghiêm", "Phường Chánh Lộ", "Phường Nghĩa Lộ", "Phường Nghĩa Chánh", "Phường Quảng Phú", "Phường Trương Quang Trọng", "Xã Tịnh Khê", "Xã Tịnh Ấn Tây", "Xã Nghĩa Dõng", "Xã Nghĩa Dũng"],
        "Huyện Bình Sơn": ["Thị trấn Châu Ổ", "Xã Bình Thạnh", "Xã Bình Đông", "Xã Bình Chánh", "Xã Bình Nguyên", "Xã Bình Long", "Xã Bình Trị"],
        "Huyện Sơn Tịnh": ["Xã Tịnh Hà", "Xã Tịnh Thọ", "Xã Tịnh Phong", "Xã Tịnh Bắc", "Xã Tịnh Sơn", "Xã Tịnh Minh"],
        "Huyện Tư Nghĩa": ["Thị trấn La Hà", "Thị trấn Sông Vệ", "Xã Nghĩa Trung", "Xã Nghĩa Thương", "Xã Nghĩa Phương", "Xã Nghĩa Hiệp"],
        "Huyện Lý Sơn": ["Xã An Vĩnh", "Xã An Hải", "Xã An Bình"],
    },
    "Bình Thuận": {
        "TP. Phan Thiết": ["Phường Bình Hưng", "Phường Đức Long", "Phường Đức Nghĩa", "Phường Đức Thắng", "Phường Ham Tiến", "Phường Hưng Long", "Phường Lạc Đạo", "Phường Mũi Né", "Phường Phú Hài", "Phường Phú Tài", "Phường Phú Thủy", "Phường Phú Trinh", "Phường Thanh Hải", "Phường Xuân An", "Xã Phong Nẫm", "Xã Tiến Lợi", "Xã Tiến Thành", "Xã Thiện Nghiệp"],
        "Thị xã La Gi": ["Phường Phước Hội", "Phường Phước Lộc", "Phường Tân An", "Phường Tân Thiện", "Phường Bình Tân", "Xã Tân Phước", "Xã Tân Hải", "Xã Tân Tiến", "Xã Tân Bình"],
        "Huyện Tuy Phong": ["Thị trấn Liên Hương", "Thị trấn Phan Rí Cửa", "Xã Phan Dũng", "Xã Phong Phú", "Xã Vĩnh Hảo", "Xã Vĩnh Tân", "Xã Phú Lạc", "Xã Phước Thể", "Xã Hòa Minh", "Xã Chí Công", "Xã Bình Thạnh"],
        "Huyện Bắc Bình": ["Thị trấn Chợ Lầu", "Thị trấn Lương Sơn", "Xã Phan Sơn", "Xã Phan Lâm", "Xã Bình An", "Xã Phan Điền", "Xã Hải Ninh", "Xã Sông Lũy", "Xã Phan Tiến", "Xã Sông Bình", "Xã Phan Thanh", "Xã Hồng Thái", "Xã Phan Hiệp", "Xã Bình Tân", "Xã Phan Hòa", "Xã Phan Rí Thành", "Xã Hòa Thắng", "Xã Hồng Phong"],
        "Huyện Phú Quý": ["Xã Tam Thanh", "Xã Ngũ Phụng", "Xã Long Hải"],
    }
};

const PostMedia = ({ uri, type, onImagePress }) => {
    const videoRef = useRef(null);
    if (type === 'video') {
        return (
            <View style={styles.mediaWrapper}>
                <Video ref={videoRef} style={{ width: '100%', height: '100%' }} source={{ uri: uri }} useNativeControls resizeMode={ResizeMode.CONTAIN} isLooping shouldPlay={false} />
            </View>
        );
    }
    return (
        <TouchableOpacity onPress={() => onImagePress(uri)} activeOpacity={0.9}>
            <View style={styles.mediaWrapper}>
                <Image source={{ uri: uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
        </TouchableOpacity>
    );
};

export default function CommunityScreen() {
    const [tab, setTab] = useState('feed');
    const [posts, setPosts] = useState([]);
    const [groups, setGroups] = useState([]);

    const [newPost, setNewPost] = useState('');
    const [mediaUri, setMediaUri] = useState(null);
    const [mediaType, setMediaType] = useState('image');
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);

    const [visibleComment, setVisibleComment] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);

    const [visibleCreateGroup, setVisibleCreateGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [groupCoverUri, setGroupCoverUri] = useState(null);

    const [showProvinceModal, setShowProvinceModal] = useState(false);
    const [showDistrictModal, setShowDistrictModal] = useState(false);
    const [showWardModal, setShowWardModal] = useState(false);
    const [viewImageUri, setViewImageUri] = useState(null);

    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const router = useRouter();
    const user = auth.currentUser;

    useEffect(() => {
        const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = [];
            snapshot.forEach((doc) => { list.push({ id: doc.id, ...doc.data() }); });
            setPosts(list);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (tab === 'groups') {
            const q = query(collection(db, "groups"), orderBy("createdAt", "desc"));
            const unsub = onSnapshot(q, (snapshot) => {
                const list = [];
                snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
                setGroups(list);
            });
            return unsub;
        }
    }, [tab]);

    const pickMedia = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images', 'videos'], allowsEditing: true, quality: 0.5 });
        if (!result.canceled) {
            setMediaUri(result.assets[0].uri);
            setMediaType(result.assets[0].type === 'video' ? 'video' : 'image');
        }
    };

    const pickGroupCover = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [16, 9], quality: 0.5 });
        if (!result.canceled) {
            setGroupCoverUri(result.assets[0].uri);
        }
    };

    const uploadMedia = async (uri, path = 'community') => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const ext = 'jpg';
            const filename = `${path}/${Date.now()}.${ext}`;
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
            if (mediaUri) {
                const ext = mediaType === 'video' ? 'mp4' : 'jpg';
                const response = await fetch(mediaUri);
                const blob = await response.blob();
                const filename = `community/${Date.now()}.${ext}`;
                const storageRef = ref(storage, filename);
                await uploadBytes(storageRef, blob);
                downloadUrl = await getDownloadURL(storageRef);
            }
            await addDoc(collection(db, "community_posts"), {
                userId: user.uid, userName: user.displayName || user.email?.split('@')[0], content: newPost, mediaUrl: downloadUrl, mediaType: mediaType, likes: 0, createdAt: serverTimestamp()
            });
            setNewPost(''); setMediaUri(null);
        } catch { Alert.alert("Lỗi", "Đăng bài thất bại."); } finally { setPosting(false); }
    };

    const handleLike = async (postId) => { try { await updateDoc(doc(db, "community_posts", postId), { likes: increment(1) }); } catch { } };
    const handleSharePost = async (content) => { try { await Share.share({ message: `Mẹo sống xanh: ${content} - Environment App` }); } catch { } };

    const openCommentModal = (postId) => {
        setSelectedPostId(postId); setVisibleComment(true);
        const q = query(collection(db, `community_posts/${postId}/comments`), orderBy("createdAt", "desc"));
        onSnapshot(q, (snapshot) => { setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); });
    };

    const handleSendComment = async () => {
        if (!commentText.trim() || !selectedPostId || !user) return;
        try { await addDoc(collection(db, `community_posts/${selectedPostId}/comments`), { text: commentText, userId: user.uid, userName: user.displayName || user.email?.split('@')[0], createdAt: serverTimestamp() }); setCommentText(''); } catch { }
    };

    const handleCreateGroup = async () => {
        // KIỂM TRA ĐĂNG NHẬP (SỬA LỖI KHÔNG PHẢN HỒI)
        if (!user) {
            Alert.alert("Yêu cầu", "Bạn cần đăng nhập để tạo nhóm!");
            return;
        }

        if (!newGroupName.trim() || !selectedProvince || !selectedDistrict) { 
            Alert.alert("Thiếu thông tin", "Vui lòng nhập tên nhóm, tỉnh và huyện."); 
            return; 
        }

        const fullArea = selectedWard ? `${selectedWard}, ${selectedDistrict}, ${selectedProvince}` : `${selectedDistrict}, ${selectedProvince}`;

        let coverUrl = 'https://img.freepik.com/free-vector/save-earth-concept_23-2148525429.jpg';

        try {
            if (groupCoverUri) {
                const uploaded = await uploadMedia(groupCoverUri, 'groups');
                if (uploaded) coverUrl = uploaded;
            }

            await addDoc(collection(db, "groups"), {
                name: newGroupName,
                desc: newGroupDesc,
                area: fullArea,
                province: selectedProvince,
                district: selectedDistrict,
                ward: selectedWard,
                members: 1,
                createdBy: user.uid,
                image: coverUrl,
                createdAt: serverTimestamp()
            });
            setNewGroupName(''); setNewGroupDesc(''); setSelectedProvince(''); setSelectedDistrict(''); setSelectedWard(''); setGroupCoverUri(null); setVisibleCreateGroup(false);

            setSuccessMessage(`Nhóm "${newGroupName}" đã được tạo thành công!`);
            setSuccessModalVisible(true);

        } catch (e) { console.log(e); Alert.alert("Lỗi", "Không thể tạo nhóm."); }
    };

    const renderPost = ({ item }) => (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <Avatar.Icon size={40} icon="account" style={styles.avatarSmall} color='#0E4626' />
                <View>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.postTime}>{item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString('vi-VN') : 'Vừa xong'}</Text>
                </View>
            </View>
            <Text style={styles.postContent}>{item.content}</Text>
            {item.mediaUrl && <PostMedia uri={item.mediaUrl} type={item.mediaType || 'image'} onImagePress={(uri) => setViewImageUri(uri)} />}
            <View style={styles.postActions}>
                <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.actionBtn}>
                    <IconButton icon="heart-outline" size={20} iconColor="#D32F2F" style={{ margin: 0 }} />
                    <Text style={styles.actionText}>{item.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openCommentModal(item.id)} style={styles.actionBtn}>
                    <IconButton icon="comment-outline" size={20} iconColor="#1565C0" style={{ margin: 0 }} />
                    <Text style={styles.actionText}>Bình luận</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSharePost(item.content)} style={styles.actionBtn}>
                    <IconButton icon="share-variant" size={20} iconColor="#555" style={{ margin: 0 }} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const lightGreenButtonStyle = { backgroundColor: '#66BB6A', borderRadius: 8, marginTop: 10 };
    const lightGreenButtonLabel = { color: 'white', fontWeight: 'bold', fontSize: 16 };

    const successModalStyle = {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 20,
        alignItems: 'center'
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.headerBar}>
                <IconButton icon="arrow-left" onPress={() => router.back()} iconColor="#0E4626" size={26} style={styles.backBtn} />
                <Text style={styles.headerTitle}>Cộng Đồng Xanh</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.tabContainer}>
                <SegmentedButtons value={tab} onValueChange={setTab} buttons={[{ value: 'feed', label: 'Bảng tin', icon: 'newspaper' }, { value: 'groups', label: 'Nhóm', icon: 'account-group' }]} theme={{ colors: { secondaryContainer: '#0E4626', onSecondaryContainer: '#fff' } }} />
            </View>

            {tab === 'feed' ? (
                <>
                    <View style={styles.inputCard}>
                        <View style={styles.inputRow}>
                            <Avatar.Icon size={40} icon="pencil" style={styles.avatarSmall} color='#0E4626' />
                            <TextInput placeholder="Chia sẻ mẹo sống xanh..." value={newPost} onChangeText={setNewPost} style={styles.inputField} multiline />
                        </View>
                        {mediaUri && (
                            <View style={styles.mediaPreviewBar}>
                                <Text style={styles.mediaStatus}>{mediaType === 'video' ? '📹 Video đã chọn' : '🖼️ Ảnh đã chọn'}</Text>
                                <IconButton icon="close-circle" size={20} onPress={() => setMediaUri(null)} />
                            </View>
                        )}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                            <IconButton icon="camera" onPress={pickMedia} iconColor="#0E4626" size={26} />
                            <Button mode="contained" onPress={handlePost} loading={posting} disabled={posting || (!newPost && !mediaUri)} style={lightGreenButtonStyle} labelStyle={lightGreenButtonLabel}>Đăng</Button>
                        </View>
                    </View>
                    {loading ? <ActivityIndicator size="large" color="#0E4626" style={{ marginTop: 20 }} /> : <FlatList data={posts} keyExtractor={(item) => item.id} renderItem={renderPost} contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false} />}
                </>
            ) : (
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
                        {groups.map(group => (
                            <View key={group.id} style={styles.groupCard}>
                                <Image source={{ uri: group.image }} style={styles.groupCover} resizeMode="cover" />
                                <View style={styles.groupInfo}>
                                    <Text style={styles.groupName}>{group.name}</Text>
                                    <Text style={styles.groupMeta}>👥 {group.members} thành viên • 📍 {group.area || 'Toàn quốc'}</Text>
                                    <Text style={styles.groupDesc} numberOfLines={2}>{group.desc}</Text>
                                    <Button mode="outlined" onPress={() => Alert.alert("Đã gửi yêu cầu!")} style={styles.joinBtn} labelStyle={{ color: '#0E4626' }} compact>Tham gia</Button>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    <FAB 
                        icon="plus" 
                        // SỬA LỖI: zIndex và Elevation để nút nổi lên trên
                        style={{ position: 'absolute', margin: 20, right: 0, bottom: 0, backgroundColor: '#0E4626', zIndex: 100, elevation: 10 }} 
                        color="#fff" 
                        onPress={() => setVisibleCreateGroup(true)} 
                        label="Tạo nhóm" 
                    />
                </View>
            )}

            <Portal>

                <Modal visible={visibleComment} onDismiss={() => setVisibleComment(false)} contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Bình luận</Text>
                    <FlatList data={comments} keyExtractor={(item) => item.id} renderItem={({ item }) => (<View style={{ marginBottom: 10, backgroundColor: '#F5F7F8', padding: 10, borderRadius: 12 }}><Text style={{ fontWeight: 'bold', color: '#0E4626' }}>{item.userName}</Text><Text>{item.text}</Text></View>)} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <TextInput placeholder="Viết bình luận..." style={[styles.inputField, { flex: 1, marginRight: 10 }]} value={commentText} onChangeText={setCommentText} />
                        <IconButton icon="send" mode="contained" containerColor="#0E4626" iconColor="#fff" onPress={handleSendComment} />
                    </View>
                </Modal>


                <Modal visible={!!viewImageUri} onDismiss={() => setViewImageUri(null)} contentContainerStyle={styles.fullImageContainer}>
                    <TouchableOpacity style={styles.closeImgBtn} onPress={() => setViewImageUri(null)}><Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>ĐÓNG X</Text></TouchableOpacity>
                    {viewImageUri && <Image source={{ uri: viewImageUri }} style={styles.fullImage} resizeMode="contain" />}
                </Modal>


                <Modal visible={visibleCreateGroup} onDismiss={() => setVisibleCreateGroup(false)} contentContainerStyle={styles.createGroupModal}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalTitle}>Tạo Nhóm Mới</Text>
                            <TouchableOpacity onPress={pickGroupCover} style={{ width: '100%', height: 150, backgroundColor: '#F0F0F0', borderRadius: 10, marginBottom: 15, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                {groupCoverUri ? <Image source={{ uri: groupCoverUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" /> : <View style={{ alignItems: 'center' }}><Avatar.Icon size={40} icon="image-plus" style={{ backgroundColor: 'transparent' }} color='#0E4626' /><Text style={{ color: '#888' }}>Chọn ảnh bìa nhóm</Text></View>}
                            </TouchableOpacity>

                            <TextInput
                                label="Tên nhóm"
                                value={newGroupName}
                                onChangeText={setNewGroupName}
                                mode="outlined"
                                style={styles.modalInput}
                                outlineStyle={styles.modalInputOutline}
                                activeOutlineColor="#0E4626"
                                textColor="#333"
                            />
                            <TouchableOpacity onPress={() => setShowProvinceModal(true)} style={styles.selectBox}><Text style={selectedProvince ? styles.selectText : styles.placeholderText}>{selectedProvince || "Chọn Tỉnh/TP ▼"}</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowDistrictModal(true)} disabled={!selectedProvince} style={[styles.selectBox, !selectedProvince && styles.disabledBox]}><Text style={selectedDistrict ? styles.selectText : styles.placeholderText}>{selectedDistrict || "Chọn Quận/Huyện ▼"}</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowWardModal(true)} disabled={!selectedDistrict} style={[styles.selectBox, !selectedDistrict && styles.disabledBox]}><Text style={selectedWard ? styles.selectText : styles.placeholderText}>{selectedWard || "Chọn Phường/Xã ▼"}</Text></TouchableOpacity>

                            <TextInput
                                label="Mô tả ngắn"
                                value={newGroupDesc}
                                onChangeText={setNewGroupDesc}
                                mode="outlined"
                                style={styles.modalInput}
                                outlineStyle={styles.modalInputOutline}
                                activeOutlineColor="#0E4626"
                                textColor="#333"
                                multiline={true}
                                numberOfLines={3}
                            />


                            <Button mode="contained" onPress={handleCreateGroup} style={lightGreenButtonStyle} labelStyle={lightGreenButtonLabel}>Tạo & Lưu trữ</Button>
                            <View style={{ height: 20 }} />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Modal>


                <Modal visible={successModalVisible} onDismiss={() => setSuccessModalVisible(false)} contentContainerStyle={successModalStyle}>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.successIconBox}>
                            <Avatar.Icon size={60} icon="check" style={{ backgroundColor: 'transparent' }} color='#4CAF50' />
                        </View>
                        <Text style={styles.successTitle}>Thành Công!</Text>
                        <Text style={styles.successDesc}>{successMessage}</Text>
                        <Button
                            mode="contained"
                            onPress={() => setSuccessModalVisible(false)}
                            style={styles.successBtn}
                            labelStyle={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}
                        >
                            TUYỆT VỜI
                        </Button>
                    </View>
                </Modal>


                <Modal visible={showProvinceModal} onDismiss={() => setShowProvinceModal(false)} contentContainerStyle={styles.listModal}><View style={styles.listHeader}><Text style={styles.modalTitle}>Chọn Tỉnh/TP</Text></View><FlatList data={Object.keys(VIETNAM_LOCATIONS)} renderItem={({ item }) => <TouchableOpacity style={styles.listItem} onPress={() => { setSelectedProvince(item); setSelectedDistrict(''); setSelectedWard(''); setShowProvinceModal(false); }}><Text style={styles.listItemText}>{item}</Text></TouchableOpacity>} /><Button onPress={() => setShowProvinceModal(false)}>Đóng</Button></Modal>
                <Modal visible={showDistrictModal} onDismiss={() => setShowDistrictModal(false)} contentContainerStyle={styles.listModal}><View style={styles.listHeader}><Text style={styles.modalTitle}>Chọn Quận/Huyện</Text></View><FlatList data={selectedProvince ? Object.keys(VIETNAM_LOCATIONS[selectedProvince]) : []} renderItem={({ item }) => <TouchableOpacity style={styles.listItem} onPress={() => { setSelectedDistrict(item); setSelectedWard(''); setShowDistrictModal(false); }}><Text style={styles.listItemText}>{item}</Text></TouchableOpacity>} /><Button onPress={() => setShowDistrictModal(false)}>Đóng</Button></Modal>
                <Modal visible={showWardModal} onDismiss={() => setShowWardModal(false)} contentContainerStyle={styles.listModal}><View style={styles.listHeader}><Text style={styles.modalTitle}>Chọn Phường/Xã</Text></View><FlatList data={(selectedProvince && selectedDistrict) ? VIETNAM_LOCATIONS[selectedProvince][selectedDistrict] : []} renderItem={({ item }) => <TouchableOpacity style={styles.listItem} onPress={() => { setSelectedWard(item); setShowWardModal(false); }}><Text style={styles.listItemText}>{item}</Text></TouchableOpacity>} /><Button onPress={() => setShowWardModal(false)}>Đóng</Button></Modal>
            </Portal>
        </View>
    );
}