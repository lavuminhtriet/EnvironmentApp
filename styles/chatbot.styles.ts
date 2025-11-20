import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  msgContainer: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-end' },
  msgRight: { justifyContent: 'flex-end', alignSelf: 'flex-end' },
  msgLeft: { justifyContent: 'flex-start', alignSelf: 'flex-start' },
  msgBubble: { padding: 12, borderRadius: 20, maxWidth: '75%' },
  bubbleRight: { backgroundColor: '#1976D2', borderBottomRightRadius: 4 },
  bubbleLeft: { backgroundColor: '#fff', borderBottomLeftRadius: 4 },
  inputArea: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#ddd' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, fontSize: 16 }
});