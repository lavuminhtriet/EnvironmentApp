import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FAFAFA' 
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
        
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
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
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
    },
    segmentBtn: {
        backgroundColor: '#F5F7F8',
        borderColor: 'transparent',
        height: 45
    },

    // Scroll View
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 120
    },

    // Article Cards
    articleCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        marginBottom: 25,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#0E4626', 
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    articleImage: {
        width: '100%',
        height: 220, 
    },
    articleOverlay: {
        
    },
    articleContent: { 
        padding: 20,
    },
    articleTag: {
        color: '#2E7D32',
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
        marginBottom: 5,
        letterSpacing: 1
    },
    articleTitle: {
        fontSize: 20,
        fontWeight: '900', 
        color: '#1B1B1B',
        marginBottom: 8,
        lineHeight: 28
    },
    articleDesc: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        marginBottom: 20
    },
    readMoreBtn: {
        borderColor: '#0E4626',
        borderWidth: 1.5,
        borderRadius: 25,
        alignSelf: 'flex-start',
        paddingHorizontal: 5
    },

    // Categories / Lookup
    catCard: {
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    catIconBox: {
        width: 64,
        height: 64,
        borderRadius: 20, 
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    catIcon: { width: 36, height: 36 },
    catInfo: { flex: 1 },
    catName: { fontSize: 17, fontWeight: 'bold', color: '#499a6cff', marginBottom: 4 },
    catDesc: { fontSize: 13, color: '#777', lineHeight: 18 },

    // Quiz Section
    quizContainer: { 
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 30,
        elevation: 8,
        shadowColor: '#0E4626',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        minHeight: 450,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F1F8E9'
    },
    quizHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        alignSelf: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20
    },
    questionCount: { fontSize: 14, fontWeight: '800', color: '#2E7D32', marginLeft: 8 },
    questionText: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#1B1B1B', 
        marginBottom: 35, 
        lineHeight: 32, 
        textAlign: 'center' 
    },
    
    // Quiz Answers
    answerBtn: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#FAFAFA', 
        paddingVertical: 18, 
        paddingHorizontal: 20, 
        borderRadius: 18, 
        marginBottom: 15, 
        borderWidth: 1, 
        borderColor: '#EEE',
        elevation: 1
    },
    answerBtnSelected: { 
        backgroundColor: '#E8F5E9', 
        borderColor: '#2E7D32',
        borderWidth: 2,
        elevation: 0
    },
    answerText: { fontSize: 16, color: '#444', fontWeight: '500', flex: 1, marginLeft: 15 },
    answerTextSelected: { color: '#0E4626', fontWeight: 'bold' },
    
    // Quiz Submit
    quizSubmitBtn: {
        backgroundColor: '#0E4626',
        borderRadius: 30,
        marginTop: 30,
        height: 56,
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#0E4626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
    },

    // Quiz Result
    resultView: { 
        backgroundColor: '#fff', borderRadius: 30, padding: 40, alignItems: 'center', 
        elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20,
    },
    scoreTitle: { fontSize: 26, fontWeight: '900', color: '#0E4626', marginTop: 20 }, 
    scoreValue: { fontSize: 72, fontWeight: '900', color: '#FFB300', marginVertical: 10 }, 
    scoreSub: { fontSize: 16, color: '#666', marginBottom: 35, textAlign: 'center' }, 
    retryBtn: { backgroundColor: '#0E4626', borderRadius: 30, width: '100%', height: 50, justifyContent: 'center' },

    // Feedback Modal
    feedbackModal: { backgroundColor: 'white', padding: 30, margin: 25, borderRadius: 30, alignItems: 'center', elevation: 10 },
    feedbackIconBox: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    feedbackTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    feedbackDesc: { fontSize: 16, textAlign: 'center', marginBottom: 30, color: '#555', lineHeight: 24 },
    feedbackBtn: { width: '100%', borderRadius: 25, height: 50, justifyContent: 'center' },

    // Content Modal
    modalContainer: { backgroundColor: '#fff', margin: 0, flex: 1 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'android' ? 45 : 20, paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff' },
    modalScroll: { padding: 0 }, 
    modalImg: { width: '100%', height: 250 }, 
    modalContentBox: { padding: 25 },
    modalTitle: { fontSize: 24, fontWeight: '900', color: '#0E4626', marginBottom: 15, lineHeight: 32 }, 
    modalBody: { fontSize: 17, lineHeight: 28, color: '#333', paddingBottom: 50 },

    // Lookup Modal
    lookupModal: {
        backgroundColor: 'white', padding: 30, margin: 20, borderRadius: 30, alignItems: 'center', elevation: 10
    },
    lookupIconWrapper: {
        width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 25, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 10,
    },
    lookupIconLarge: { width: 60, height: 60 },
    lookupTitle: { fontSize: 26, fontWeight: '900', color: '#1B1B1B', marginBottom: 10, textAlign: 'center' },
    lookupDesc: { fontSize: 17, color: '#444', textAlign: 'center', lineHeight: 26, marginBottom: 35 },
    lookupCloseBtn: { backgroundColor: '#44c17aff', borderRadius: 25, width: '100%', height: 55, justifyContent: 'center' },
    
    radioOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 }
});