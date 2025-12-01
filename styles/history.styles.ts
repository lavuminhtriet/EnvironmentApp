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

    
    listContent: {
        padding: 20,
        paddingBottom: 50
    },

    
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)'
    },
    mediaBox: {
        width: 90,
        height: 90,
        borderRadius: 16,
        backgroundColor: '#F1F8E9',
        marginRight: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    media: { width: '100%', height: '100%' },
    videoBadge: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 24, height: 24,
        borderRadius: 12,
        justifyContent: 'center', 
        alignItems: 'center'
    },

    infoBox: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 2
    },
    
    
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500',
        marginTop: 4
    },

    
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase'
    },

    
    descText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '600',
        lineHeight: 22,
    },

    
    emptyState: {
        alignItems: 'center',
        marginTop: 80,
        padding: 20
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 15,
        marginBottom: 25,
        textAlign: 'center',
        lineHeight: 24
    },
    createBtn: {
        backgroundColor: '#0E4626',
        borderRadius: 25,
        paddingHorizontal: 20,
        height: 48,
        justifyContent: 'center'
    }
});