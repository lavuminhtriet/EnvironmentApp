import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F5F7F8' 
    },

    
    headerBar: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: 15, 
        paddingTop: Platform.OS === 'android' ? 40 : 15, 
        paddingBottom: 15, 
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        elevation: 2,
        zIndex: 10
    },
    headerTitle: { 
        fontWeight: '800', 
        color: '#0E4626', 
        fontSize: 20,
        flex: 1,
        textAlign: 'center',
        marginLeft: -40
    },
    backBtn: { margin: 0 },

    scrollContent: { 
        padding: 20,
        paddingBottom: 100
    },

   
    scannerSection: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        alignItems: 'center'
    },
    scannerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0E4626',
        marginBottom: 15,
        alignSelf: 'flex-start',
        marginLeft: 5
    },
    imageBox: {
        width: '100%',
        height: 280,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#C8E6C9',
        borderStyle: 'dashed',
        backgroundColor: '#F1F8E9',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative'
    },
    imageBoxFilled: {
        borderWidth: 0,
        backgroundColor: '#000'
    },
    previewImage: { width: '100%', height: '100%' },
    uploadHint: { marginTop: 10, color: '#558B2F', fontWeight: '500' },
    
    floatingCamBtn: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    floatingCamText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 5 },

    
    inputSection: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 10,
        textTransform: 'uppercase'
    },
    textInput: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        fontSize: 16,
        height: 50,
        color: '#000'
    },
    inputOutline: {
        borderColor: '#eee',
        borderRadius: 12
    },

    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10
    },
    chipItem: {
        backgroundColor: '#E8F5E9',
        borderRadius: 20,
    },
    chipText: {
        color: '#2E7D32',
        fontWeight: '600'
    },

    analyzeBtn: {
        backgroundColor: '#0E4626',
        borderRadius: 30,
        height: 56,
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#0E4626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginTop: 10
    },
    analyzeBtnLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#fff'
    },

    
    resultCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginTop: 30,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#C8E6C9',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 }
    },
    resultHeader: {
        backgroundColor: '#E8F5E9',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#C8E6C9'
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginLeft: 10
    },
    resultContent: {
        padding: 20
    },
    resultText: {
        fontSize: 16,
        lineHeight: 26,
        color: '#333'
    },

    
    modalContainer: {
        backgroundColor: 'white',
        padding: 25,
        margin: 20,
        borderRadius: 24,
        elevation: 5
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0E4626',
        marginBottom: 20,
        textAlign: 'center'
    },
    optionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7F8',
        padding: 15,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee'
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 15
    },
    cancelBtn: {
        marginTop: 10,
        alignItems: 'center',
        padding: 10
    },
    cancelText: {
        color: '#D32F2F',
        fontWeight: 'bold',
        fontSize: 15
    }
}); 