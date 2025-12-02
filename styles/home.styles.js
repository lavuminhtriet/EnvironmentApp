import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA', paddingTop: 50 },
    
    // Header
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        marginBottom: 15,
        height: 80 
    },
    headerLeft: {
        justifyContent: 'center',
        flex: 1
    },
    greetingText: { 
        fontWeight: 'bold', 
        color: '#0E4626', 
        fontSize: 22 
    }, 
    
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        backgroundColor: '#E8F5E9', 
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#C8E6C9'
    },
    badgeText: {
        color: '#2E7D32',
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 5
    },

    avatarContainer: { elevation: 5 }, 

    scrollContent: { paddingHorizontal: 20 },

    // Tip Card
    tipContainer: { 
        flexDirection: 'row', backgroundColor: '#F1F8E9', borderRadius: 16, padding: 15, marginBottom: 25,
        borderWidth: 1, borderColor: '#DCEDC8'
    },
    tipIconBox: { marginRight: 12, justifyContent: 'center' },
    tipTitle: { fontWeight: 'bold', color: '#33691E', marginBottom: 4, fontSize: 14 },
    tipContent: { color: '#558B2F', fontSize: 13, fontStyle: 'italic' },

    sectionTitle: { fontWeight: '700', color: '#0E4626', marginBottom: 15, fontSize: 18 },

    // Stats Row
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    statCard: { 
        width: '48%', padding: 15, borderRadius: 20, 
        borderWidth: 1, 
        justifyContent: 'space-between', height: 110
    },
    statValue: { fontSize: 32, fontWeight: '900' },
    statLabel: { fontSize: 12, color: '#888', marginTop: -5 },
    statStatus: { fontWeight: 'bold', fontSize: 13, marginTop: 10 },

    // Location
    locationBadge: { 
        backgroundColor: '#ECEFF1', borderRadius: 12, padding: 10, marginBottom: 25, alignItems: 'center' 
    },
    locationText: { fontWeight: 'bold', color: '#455A64', marginBottom: 2 },
    adviceText: { color: '#607D8B', fontSize: 12, textAlign: 'center' },

    // Campaign Card
    campaignCard: {
        width: 260, backgroundColor: '#fff', borderRadius: 16, padding: 12, marginRight: 12,
        borderWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center'
    },
    campaignDateBox: { 
        backgroundColor: '#E0F2F1', borderRadius: 10, padding: 8, alignItems: 'center', marginRight: 12, minWidth: 50
    },
    campaignDateText: { fontWeight: 'bold', color: '#00695C', fontSize: 16 },
    campaignMonthText: { color: '#00695C', fontSize: 10 },
    campaignTitle: { fontWeight: 'bold', color: '#333', fontSize: 14, marginBottom: 4 },
    campaignLoc: { color: '#888', fontSize: 12 },
    joinBtn: { borderRadius: 20, marginLeft: 5, backgroundColor: '#0E4626' },
    emptyState: { padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#eee', borderRadius: 12, borderStyle: 'dashed' },

    // Bento Grid
    bentoGrid: { gap: 12 },
    bentoRow: { flexDirection: 'row', gap: 12 },
    bentoItem: { 
        flex: 1, borderRadius: 20, padding: 15, 
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)'
    },
    bentoLarge: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 25 
    },
    bentoContent: { flex: 1 },
    bentoTitle: { fontWeight: 'bold', fontSize: 15 },
    bentoDesc: { fontSize: 11, color: '#666', marginTop: 2 },

    // Footer
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 8 },
    footerBtn: { flex: 1, borderColor: '#ddd', borderRadius: 12 }
});