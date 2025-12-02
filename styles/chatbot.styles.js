import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F2F5F8' 
    },

    // Header
    headerBar: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: 15, 
        paddingTop: Platform.OS === 'android' ? 40 : 15, 
        paddingBottom: 15, 
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        elevation: 3,
        zIndex: 10
    },
    headerTitle: { 
        fontWeight: '800', 
        color: '#0E4626', 
        fontSize: 20,
        flex: 1,
        textAlign: 'center',
        marginLeft: -40
    },
    backBtn: { margin: 0 },

    // Chat Content
    chatContent: {
        paddingHorizontal: 15,
        paddingBottom: 20,
        paddingTop: 20
    },

    // Messages
    msgContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'flex-end'
    },
    msgRight: {
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        maxWidth: '80%'
    },
    msgLeft: {
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        maxWidth: '85%'
    },
    
    // Bubbles
    bubbleRight: {
        backgroundColor: '#0E4626',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 5, 
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: 15,
        elevation: 2
    },
    textRight: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 22
    },

    bubbleLeft: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 5, 
        borderBottomRightRadius: 20,
        padding: 15,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2
    },
    textLeft: {
        color: '#333',
        fontSize: 16,
        lineHeight: 22
    },

    // Avatar
    botAvatar: {
        marginRight: 10,
        backgroundColor: '#E8F5E9',
        borderWidth: 1,
        borderColor: '#fff',
        elevation: 2
    },

    // Suggestion Chips
    chipContainer: {
        paddingHorizontal: 15,
        paddingBottom: 10,
        height: 50
    },
    chipItem: {
        backgroundColor: '#E8F5E9',
        marginRight: 10,
        height: 36,
        borderRadius: 18
    },
    chipText: {
        color: '#2E7D32',
        fontWeight: '600'
    },

    // Input Area
    inputWrapper: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 25 : 10
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 16,
        maxHeight: 100,
        marginRight: 10,
        color: '#333'
    },
    
    // Mic Button
    micBtn: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F8E9',
        marginRight: 8
    },
    micBtnActive: {
        backgroundColor: '#FFEBEE', 
        borderWidth: 1,
        borderColor: '#EF5350'
    },
    
    // Send Button
    sendBtn: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0E4626', 
        elevation: 2
    },
    
    // Recording Overlay
    recordingText: {
        position: 'absolute',
        top: -30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#D32F2F',
        fontWeight: 'bold',
        fontSize: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingVertical: 5
    }
});