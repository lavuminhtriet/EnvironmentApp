import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff' 
    },

    // Map View
    map: {
        width: '100%',
        height: '100%',
    },

    // Header
    headerContainer: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 40 : 20,
        left: 15,
        right: 15,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    headerTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0E4626',
        marginLeft: 10
    },
    headerIconBtn: {
        margin: 0,
    },

    // Filter Chips
    filterContainer: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 100 : 80,
        left: 0,
        right: 0,
        zIndex: 9,
        height: 50,
    },
    filterContent: {
        paddingHorizontal: 15,
        alignItems: 'center',
        paddingRight: 20
    },
    filterChip: {
        height: 36,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    filterChipSelected: {
        backgroundColor: '#0E4626', 
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0E4626'
    },
    filterTextSelected: {
        color: '#fff'
    },

    // Layer FAB Group (Nút chọn lớp bản đồ)
    layerFabGroup: {
        position: 'absolute',
        right: 15,
        top: 180, 
        zIndex: 20, 
        alignItems: 'flex-end',
        gap: 15 
    },
    
    // Layer Row
    layerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 5
    },

    // Layer Button
    layerBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    
    mainLayerBtn: {
        backgroundColor: '#0E4626', 
    },
   
    layerBtnActive: {
        backgroundColor: '#E8F5E9',
        borderWidth: 2,
        borderColor: '#0E4626'
    },

    // Layer Label (Chú thích bên cạnh nút)
    layerLabelCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    layerLabelText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333'
    },

    // Loading State
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7F8'
    },
    loadingText: {
        marginTop: 15,
        color: '#0E4626',
        fontSize: 16,
        fontWeight: '600'
    }
});