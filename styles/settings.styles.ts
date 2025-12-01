import { StyleSheet, Dimensions, Platform } from 'react-native';

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
        paddingBottom: 50 
    },

    
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0E4626',
        marginTop: 10,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginLeft: 5
    },

    
    settingsCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    
    
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5'
    },
    
    lastRow: { 
        borderBottomWidth: 0 
    },
    
    itemLeft: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1, 
        marginRight: 10 
    },
    iconBox: {
        width: 42, 
        height: 42,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    itemTitle: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#333', 
        marginBottom: 2 
    },
    itemDesc: { 
        fontSize: 13, 
        color: '#888' 
    },

    
    thresholdContainer: {
        marginTop: 5,
        marginBottom: 15,
        backgroundColor: '#F9FAFB',
        padding: 15,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    thresholdLabel: { 
        fontSize: 14, 
        color: '#555', 
        marginBottom: 10, 
        fontWeight: '600' 
    },
    thresholdRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        gap: 10 
    },
    thresholdBtn: {
        flex: 1,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#fff'
    },
    thresholdBtnActive: {
        backgroundColor: '#E8F5E9',
        borderColor: '#2E7D32',
        borderWidth: 2
    },
    note: { 
        fontSize: 12, 
        color: '#999', 
        fontStyle: 'italic', 
        marginTop: 10 
    },
    
   
    saveBtn: {
        backgroundColor: '#0fc118ff',
        borderRadius: 30,
        height: 56,
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#12ac17ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginTop: 10
    },
    saveBtnLabel: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        letterSpacing: 1, 
        color: '#fff' 
    },
    
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});