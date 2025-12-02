import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F5F7F8' 
    },
    
    // Header
    headerBar: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: 15, 
        paddingTop: Platform.OS === 'android' ? 45 : 50, 
        paddingBottom: 15, 
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        elevation: 3,
        zIndex: 10
    },
    headerTitle: { 
        fontWeight: '900', 
        color: '#0E4626', 
        fontSize: 22,
        letterSpacing: 0.5,
        textAlign: 'center',
        flex: 1,
        marginLeft: -24 
    },
    backBtn: { margin: 0 },

    // Tabs
    tabContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        marginBottom: 10
    },
    
    // Input Area
    inputCard: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginTop: 15,
        marginBottom: 10,
        borderRadius: 20,
        padding: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    inputField: {
        flex: 1,
        backgroundColor: '#F5F7F8',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        color: '#333'
    },
    mediaPreviewBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5
    },
    mediaStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1565C0',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10
    },
    postBtn: {
        backgroundColor: '#0E4626',
        borderRadius: 20,
    },

    // Posts
    postCard: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginBottom: 20,
        borderRadius: 20,
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    avatarSmall: {
        backgroundColor: '#E8F5E9',
        marginRight: 10
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333'
    },
    postTime: {
        fontSize: 12,
        color: '#888'
    },
    postContent: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
        marginBottom: 10
    },
    mediaWrapper: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
        marginBottom: 10
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
        marginTop: 5
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionText: {
        marginLeft: 5,
        color: '#666',
        fontWeight: '600'
    },

    // Groups
    groupCard: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    groupCover: {
        height: 120,
        width: '100%'
    },
    groupInfo: {
        padding: 15
    },
    groupName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0E4626',
        marginBottom: 4
    },
    groupMeta: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8
    },
    groupDesc: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20
    },
    joinBtn: {
        position: 'absolute',
        right: 15,
        top: 130,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#0E4626'
    },

    // Modals
    modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 20, height: '60%' },
    
    createGroupModal: { 
        backgroundColor: 'white', 
        padding: 25, 
        margin: 20, 
        borderRadius: 20,
        height: '80%',
        width: '90%',
        alignSelf: 'center'
    },
    modalTitle: { fontWeight: 'bold', fontSize: 20, color: '#0E4626', marginBottom: 15, textAlign: 'center' },
    
    modalInput: {
        marginBottom: 12,
        backgroundColor: '#fff',
        fontSize: 15,
        height: 50, 
    },
    modalInputOutline: {
        borderRadius: 12,
        borderColor: '#E0E0E0'
    },

    // Select Box
    selectBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        backgroundColor: '#FAFAFA',
        height: 54
    },
    selectText: { color: '#333', fontSize: 15 },
    placeholderText: { color: '#777', fontSize: 15 },
    disabledBox: { backgroundColor: '#F5F5F5', borderColor: '#EEE' },

    // Image Modal
    fullImageContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
    closeImgBtn: { position: 'absolute', top: 40, right: 20, zIndex: 99 },
    fullImage: { width: '100%', height: '80%' },

    // List Modal
    listModal: { backgroundColor: 'white', padding: 0, margin: 20, borderRadius: 20, height: '70%', overflow: 'hidden' },
    listHeader: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
    listItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    listItemText: { fontSize: 16, color: '#333' },

    // Success Modal
    successModal: {
        backgroundColor: 'white',
        padding: 30,
        margin: 20,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    successIconBox: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    successTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0E4626',
        marginBottom: 10
    },
    successDesc: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 24
    },
    successBtn: {
        backgroundColor: '#0E4626',
        borderRadius: 30,
        width: '100%',
        height: 50,
        justifyContent: 'center'
    }
});