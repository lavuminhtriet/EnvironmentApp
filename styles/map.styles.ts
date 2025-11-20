import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  map: { width: '100%', height: '100%' },
  legend: {
      position: 'absolute',
      bottom: 20,
      left: 10,
      right: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: 10,
      borderRadius: 10,
      elevation: 5
  },
  legendText: {
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#333'
  }
});