import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  header: { fontWeight: 'bold', color: '#D32F2F', marginBottom: 5 },
  subHeader: { color: '#666', marginBottom: 20 },
  imageCard: { height: 200, marginBottom: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', overflow: 'hidden' },
  imagePreview: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' },
  input: { marginBottom: 20, backgroundColor: '#fff' },
  locationBox: { marginBottom: 30, flexDirection: 'row', alignItems: 'center' },
  submitBtn: { backgroundColor: '#D32F2F' }
});