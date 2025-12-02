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

  scrollContent: { padding: 20, paddingBottom: 50 },

  // Card Sections
  cardSection: { marginBottom: 25 },
  
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: {
      width: 32, height: 32, borderRadius: 8, 
      alignItems: 'center', justifyContent: 'center', marginRight: 10
  },
  cardLabel: { fontSize: 16, fontWeight: 'bold', color: '#000' },

  // Media Upload Area
  mediaContainer: {
      height: 220, backgroundColor: '#FAFAFA', borderRadius: 16,
      borderWidth: 1, borderColor: '#EEEEEE', borderStyle: 'dashed',
      justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
  },
  mediaContainerFilled: { borderStyle: 'solid', borderWidth: 0 },
  
  previewImage: { width: '100%', height: '100%' },
  videoContainer: { width: '100%', height: '100%' },
  videoView: { width: '100%', height: '100%' },

  uploadPlaceholder: { alignItems: 'center' },
  uploadTextMain: { fontSize: 14, fontWeight: 'bold', color: '#1B5E20', marginTop: 10 },
  uploadTextSub: { fontSize: 12, color: '#9E9E9E', marginTop: 2 },

  floatingEditBtn: {
      position: 'absolute', bottom: 10, right: 10,
      backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20
  },
  floatingEditText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  // Mini Map
  miniMapContainer: {
      height: 150, borderRadius: 16, overflow: 'hidden',
      borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 10
  },
  miniMap: { width: '100%', height: '100%' },

  locationTextContainer: { 
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      backgroundColor: '#FAFAFA', padding: 12, borderRadius: 12
  },
  locationAddress: { fontSize: 13, color: '#424242', flex: 1, marginRight: 10 },
  changeLocBtn: { borderColor: '#1B5E20', borderRadius: 8 },
  changeLocText: { fontSize: 11, color: '#1B5E20', fontWeight: 'bold' },

  // Input Description
  descInput: { backgroundColor: '#fff', minHeight: 100, fontSize: 15, lineHeight: 22 },

  // Submit Button
  submitBtnContainer: { padding: 20, borderTopWidth: 1, borderTopColor: '#F5F5F5', backgroundColor: '#fff' },
  submitBtn: { 
      backgroundColor: '#55c05cff', borderRadius: 12, height: 50, justifyContent: 'center',
      elevation: 3, shadowColor: '#428147ff', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.3, shadowRadius: 5
  },
  submitBtnLabel: { fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },

  // Modal
  modalContainer: { backgroundColor: '#fff', margin: 20, borderRadius: 20, height: '80%', overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  mapWrapper: { flex: 1, position: 'relative' },
  confirmLocBtnContainer: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  confirmLocBtn: { backgroundColor: '#55c05cff', borderRadius: 10 }
});