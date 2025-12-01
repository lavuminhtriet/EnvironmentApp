import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FAFAFA' 
    },

    
    headerBar: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20, 
        paddingTop: Platform.OS === 'android' ? 45 : 15, 
        paddingBottom: 20, 
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        zIndex: 10
    },
    headerTitle: { 
        fontWeight: '900', 
        color: '#0E4626', 
        fontSize: 24, 
        letterSpacing: 0.5 
    },

    scrollContent: { 
        padding: 20,
        paddingBottom: 120 
    },

    
    cardSection: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)', 
        shadowColor: '#0E4626', 
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0E4626',
        marginLeft: 10,
        textTransform: 'uppercase',
        letterSpacing: 1
    },

    
    mediaContainer: {
        width: '100%',
        height: 280, 
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#F1F8E9', 
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#C8E6C9',
        borderStyle: 'dashed' 
    },
    mediaContainerFilled: {
        backgroundColor: '#000',
        borderWidth: 0,
        borderStyle: 'solid'
    },
    
    uploadPlaceholder: {
        alignItems: 'center'
    },
    uploadCircle: {
        width: 70, height: 70, borderRadius: 35,
        backgroundColor: '#fff',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 15,
        elevation: 2
    },
    uploadTextMain: {
        fontSize: 16, fontWeight: 'bold', color: '#2E7D32', marginBottom: 5
    },
    uploadTextSub: {
        fontSize: 13, color: '#558B2F'
    },

    previewImage: { width: '100%', height: '100%' },
    videoView: { width: '100%', height: '100%' },
    videoContainer: { width: '100%', height: '100%', backgroundColor: '#000' },

   
    floatingEditBtn: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6
    },
    floatingEditText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },

    
    descInput: {
        backgroundColor: '#FAFAFA', 
        borderRadius: 16,
        fontSize: 16,
        padding: 15,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        height: 140,
        textAlignVertical: 'top',
        color: '#333'
    },

    
    miniMapContainer: {
        height: 150,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee'
    },
    miniMap: {
        width: '100%', height: '100%'
    },
    locationTextContainer: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    locationAddress: {
        flex: 1, fontWeight: 'bold', color: '#455A64', fontSize: 14
    },
    changeLocBtn: {
        backgroundColor: '#E0F2F1',
        borderRadius: 20
    },

    
    submitBtnContainer: {
        marginHorizontal: 20,
        marginBottom: 30,
        marginTop: 10
    },
    submitBtn: {
        backgroundColor: '#D32F2F', 
        borderRadius: 30,
        height: 60, 
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#D32F2F',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    submitBtnLabel: {
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 1.5,
        color: '#fff'
    },

    
    modalContainer: { backgroundColor: '#fff', margin: 0, flex: 1 },
    modalHeader: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: '#fff', zIndex: 1
    },
    modalTitle: { fontWeight: 'bold', fontSize: 20, color: '#0E4626' },
    mapWrapper: { flex: 1 },
    confirmLocBtnContainer: { position: 'absolute', bottom: 40, left: 20, right: 20 },
    confirmLocBtn: { backgroundColor: '#0E4626', borderRadius: 30, height: 55, justifyContent: 'center', elevation: 5 }
});