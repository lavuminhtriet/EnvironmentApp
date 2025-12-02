import { StyleSheet, Dimensions, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F2F5F8' 
    },
    
    // Header
    headerBackground: {
        backgroundColor: '#0E4626',
        height: 160, 
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: Platform.OS === 'android' ? 20 : 0, 
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1, 
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    
    // Back Button
    backBtn: {
        position: 'absolute',
        left: 15,
        top: Platform.OS === 'android' ? 40 : 50, 
        zIndex: 20,
        backgroundColor: 'rgba(0,0,0,0.1)', 
    },

    // Avatar Section
    avatarContainer: {
        marginTop: -60, 
        alignItems: 'center',
        zIndex: 10, 
        marginBottom: 15
    },
    avatarWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 5, 
        borderColor: '#fff', 
        backgroundColor: '#fff',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 60
    },
    editBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#FF9800', 
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        elevation: 5,
        zIndex: 11
    },
    userName: {
        marginTop: 12,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1B1B1B'
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginTop: 2
    },

    // Main Content
    mainContent: {
        paddingHorizontal: 20,
        paddingBottom: 50
    },

    // Card Section (Form)
    cardSection: {
        backgroundColor: '#ffffffff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginTop: 10
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0E4626',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 1,
        borderLeftWidth: 3,
        borderLeftColor: '#FF9800',
        paddingLeft: 10
    },
    inputGroup: {
        marginBottom: 15
    },
    inputLabel: {
        fontSize: 13,
        color: '#555',
        marginBottom: 6,
        fontWeight: '600'
    },
    inputField: {
        backgroundColor: '#fff',
        fontSize: 16,
        height: 50,
        borderRadius: 10,
        color: '#000'
    },
    inputOutline: {
        borderColor: '#E0E0E0',
        borderRadius: 10
    },

    // Buttons
    saveBtn: {
        backgroundColor: '#4fb809ff', 
        borderRadius: 12,
        height: 55,
        justifyContent: 'center',
        marginBottom: 25,
        elevation: 5,
        shadowColor: '#0E4626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    saveBtnLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 1
    },

    // Menu Section
    menuSection: {
        marginTop: 0
    },
    menuItem: {
        backgroundColor: '#ffffffff',
        borderRadius: 12,
        marginBottom: 12,
        elevation: 1,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)'
    },
    
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});