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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
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

    scrollContent: { 
        padding: 20,
        paddingBottom: 100
    },

    // Section Title
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
        marginBottom: 15,
        marginLeft: 5
    },

    // Dashboard Card (Màu xanh lớn)
    dashboardCard: {
        backgroundColor: '#61ce77ff', 
        borderRadius: 25,
        padding: 25,
        marginBottom: 30,
        elevation: 8,
        shadowColor: '#2f935bff',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    dashboardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        justifyContent: 'center'
    },
    dashboardTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        letterSpacing: 1
    },
    dashboardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dashboardItem: {
        alignItems: 'center',
        flex: 1
    },
    dashboardValue: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFD700', 
        marginBottom: 5
    },
    dashboardLabel: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        fontWeight: '500'
    },
    dividerVertical: {
        width: 1,
        height: '70%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'center'
    },

    // Grid Container (Các thẻ nhỏ)
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 15
    },
    statCard: {
        width: (width - 55) / 2,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 25,
        paddingHorizontal: 15,
        marginBottom: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)'
    },
    iconBox: {
        width: 54,
        height: 54,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    statCardValue: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1B1B1B',
        marginBottom: 5
    },
    statCardLabel: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
        fontWeight: '500'
    },
    
    actionText: {
        marginTop: 15,
        fontSize: 12,
        color: '#0E4626',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },

    // Export Button
    exportBtn: {
        backgroundColor: '#4bde46ff',
        borderRadius: 30,
        marginTop: 30,
        height: 56,
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#B71C1C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
    },
    disclaimer: {
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
        fontSize: 12,
        fontStyle: 'italic'
    },
    
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});