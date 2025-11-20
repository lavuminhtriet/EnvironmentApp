import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#F1F8E9' },
  header: { textAlign: 'center', fontWeight: 'bold', color: '#2E7D32', marginBottom: 20 },
  card: { marginBottom: 20, backgroundColor: '#fff' },
  input: { backgroundColor: '#fff', marginBottom: 10 },
  previewImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 15, resizeMode: 'contain', backgroundColor: '#f0f0f0' },
  analyzeBtn: { backgroundColor: '#4CAF50', marginTop: 5 },
  resultCard: { backgroundColor: '#fff', borderLeftWidth: 5, borderLeftColor: '#4CAF50' },
  resultText: { fontSize: 16, lineHeight: 24, color: '#333' }
});