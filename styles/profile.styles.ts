import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', padding: 30, backgroundColor: '#F1F8E9' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#2E7D32', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  form: { padding: 20 },
  input: { marginBottom: 15, backgroundColor: '#fff' },
  saveBtn: { marginTop: 10, backgroundColor: '#2E7D32' } 
});