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
        paddingTop: Platform.OS === 'android' ? 45 : 15, 
        paddingBottom: 15, 
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        elevation: 4,
        zIndex: 10
    },
    headerTitle: { 
        fontWeight: '900', 
        color: '#0E4626', 
        fontSize: 22,
        textAlign: 'center',
        flex: 1,
        marginLeft: -24
    },
    backBtn: { margin: 0 },

    scrollContent: { 
        padding: 20,
        paddingBottom: 100
    },

    // Membership Card (Thẻ thành viên)
    membershipCard: {
        height: 200,
        backgroundColor: '#0E4626', 
        borderRadius: 24,
        padding: 25,
        justifyContent: 'space-between',
        marginBottom: 25,
        elevation: 8,
        shadowColor: '#0E4626',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        overflow: 'hidden',
        position: 'relative'
    },
    
    cardPatternCircle: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.05)'
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 5
    },
    pointValue: {
        color: '#FFD700', 
        fontSize: 36,
        fontWeight: '900',
    },
    badgeContainer: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)'
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13
    },
    
    // Progress Bar
    progressSection: {
        marginTop: 10
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
        marginBottom: 8
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4CAF50', 
        borderRadius: 4
    },
    progressText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        textAlign: 'right'
    },

    // Section Title
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginLeft: 5
    },

    // Gift Items
    giftCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 15,
        flexDirection: 'row',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        overflow: 'hidden'
    },
    giftImageContainer: {
        width: 100,
        backgroundColor: '#F1F8E9',
        justifyContent: 'center',
        alignItems: 'center'
    },
    giftImage: {
        width: 60,
        height: 60
    },
    giftContent: {
        flex: 1,
        padding: 15,
        justifyContent: 'center'
    },
    giftName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0E4626',
        marginBottom: 5
    },
    giftCostRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    giftCost: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF9800',
        marginRight: 5
    },
    redeemBtn: {
        backgroundColor: '#66BB6A', 
        borderRadius: 20,
        alignSelf: 'flex-start',
        height: 36,
    },
    redeemBtnLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff'
    },
    disabledBtn: {
        backgroundColor: '#E0E0E0'
    },

    // Modals
    modalContainer: {
        backgroundColor: 'white',
        padding: 25,
        margin: 25,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 5
    },
    modalIconBox: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0E4626',
        marginBottom: 10,
        textAlign: 'center'
    },
    modalDesc: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22
    },
    modalBtnRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: 10
    },
    cancelBtn: {
        flex: 1,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 25
    },
    confirmBtn: {
        flex: 1,
        backgroundColor: '#0E4626',
        borderRadius: 25
    },
    successBtn: {
        width: '100%',
        backgroundColor: '#0E4626',
        borderRadius: 25
    }
});