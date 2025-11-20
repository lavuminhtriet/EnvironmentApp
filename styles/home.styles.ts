import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10 },
  headerTitle: { fontWeight: 'bold', color: '#2E7D32' },
  scrollContent: { padding: 20 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 15, color: '#333' },
  aqiCard: { borderRadius: 25, elevation: 4, marginBottom: 10 },
  aqiNumber: { fontSize: 80, fontWeight: 'bold', color: '#fff' },
  aqiText: { color: '#fff', fontWeight: 'bold', marginBottom: 5 },
  locationText: { color: 'rgba(255,255,255,0.8)', marginBottom: 15 },
  adviceBox: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 10, width: '100%' },
  adviceText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  grid: { marginTop: 30, paddingBottom: 40 },
  rowBtn: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  gridBtn: { flex: 1, borderRadius: 12 },
  fullBtn: { width: '100%', borderRadius: 12 }
});