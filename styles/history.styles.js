import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5' 
  },
  
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 40 : 15,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 3,
  },
  
  backBtn: { margin: 0 },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0E4626',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Để cân đối với nút back
  },

  listContent: {
    padding: 15,
    paddingBottom: 50,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  mediaBox: {
    height: 200,
    width: '100%',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  media: {
    width: '100%',
    height: '100%',
  },

  videoBadge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
    width: 50,
    height: 50,
  },

  infoBox: {
    padding: 15,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusText: {
    fontWeight: 'bold',
    fontSize: 12,
  },

  dateText: {
    color: '#999',
    fontSize: 12,
  },

  descText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    padding: 20,
  },

  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 15,
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 24,
  },

  createBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 25,
  }
});