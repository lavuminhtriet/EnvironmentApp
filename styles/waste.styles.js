import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  // Header
  headerBar: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 40 : 15,
    paddingBottom: 10, paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5'
  },
  headerTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#000000', 
    flex: 1, textAlign: 'center'
  },
  backBtn: { margin: 0 },

  scrollContent: { padding: 20, paddingBottom: 50 },

  sectionLabel: {
      fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 10,
      textTransform: 'uppercase', letterSpacing: 1
  },

  // Scanner Section
  scannerSection: { marginBottom: 25 },
  imageBox: {
      height: 250, backgroundColor: '#FAFAFA', borderRadius: 4,
      justifyContent: 'center', alignItems: 'center',
      borderWidth: 1, borderColor: '#EEEEEE', borderStyle: 'dashed',
      overflow: 'hidden'
  },
  imageBoxFilled: { borderStyle: 'solid', borderWidth: 0, backgroundColor: '#000' },
  
  placeholderContent: { alignItems: 'center' },
  uploadHint: { marginTop: 10, color: '#9E9E9E', fontSize: 14, fontWeight: '500' },
  
  previewImage: { width: '100%', height: '100%' },
  editBadge: {
      position: 'absolute', bottom: 15, flexDirection: 'row', alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4
  },
  editBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12, marginRight: 5 },

  // Input Section
  inputSection: { marginBottom: 25 },
  textInput: { backgroundColor: '#fff', fontSize: 16 },
  
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 15, gap: 10 },
  chipItem: { backgroundColor: '#F5F5F5', borderRadius: 4 }, // Chip vuông
  chipText: { color: '#000', fontWeight: '500' },

  // Analyze Button
  analyzeBtn: { 
      backgroundColor: '#1B5E20', borderRadius: 4, height: 52, justifyContent: 'center',
      elevation: 3, shadowColor: '#1B5E20', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5
  },
  analyzeBtnLabel: { fontSize: 16, fontWeight: 'bold', letterSpacing: 1, color: '#fff' },

  // Result Card
  resultCard: { 
      marginTop: 30, backgroundColor: '#F9F9F9', borderRadius: 4, padding: 20,
      borderWidth: 1, borderColor: '#E0E0E0',
      borderLeftWidth: 4, borderLeftColor: '#1B5E20'
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 10 },
  resultDivider: { height: 1, backgroundColor: '#EEEEEE', marginBottom: 15 },
  resultText: { fontSize: 16, lineHeight: 26, color: '#212121' },

  // Modal
  modalContainer: { backgroundColor: '#fff', margin: 20, borderRadius: 4, padding: 0, overflow: 'hidden' },
  modalHeader: { 
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
      padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' 
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  optionBtn: { 
      flexDirection: 'row', alignItems: 'center', padding: 20, 
      borderBottomWidth: 1, borderBottomColor: '#FAFAFA' 
  },
  optionText: { fontSize: 16, marginLeft: 20, color: '#000' },
  cancelBtn: { padding: 15, alignItems: 'center' },
  cancelText: { color: '#D32F2F', fontWeight: 'bold' }
});