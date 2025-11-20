import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: { padding: 15, paddingBottom: 5, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputContainer: { padding: 15, backgroundColor: '#fff', marginBottom: 10 },
  input: { backgroundColor: '#fff', marginBottom: 5 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  card: { marginHorizontal: 15, marginBottom: 15, backgroundColor: '#fff' },
  removeBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 10, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }
});