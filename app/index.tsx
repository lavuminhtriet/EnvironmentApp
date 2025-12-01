import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import { TextInput, Button, Text, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithCredential,
    signInAnonymously
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";


WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = "184252200932-ebbc2j7889bbbqncv8m620hkq2mdks7l.apps.googleusercontent.com"; 
const ANDROID_CLIENT_ID = "184252200932-na5r1iqresbua7jrh1mninlp28atgb6d.apps.googleusercontent.com"; 

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const redirectUri = "https://auth.expo.io/@net269gaming/environmentapp";

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: WEB_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: WEB_CLIENT_ID, 
        redirectUri: redirectUri
    });

    useEffect(() => {
        if (response?.type === "success") {
            setLoading(true);
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(() => {})
                .catch((error) => {
                    setLoading(false);
                    Alert.alert("Lỗi Firebase", error.message);
                });
        }
    }, [response]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setTimeout(() => router.replace("/home"), 500);
            } else {
                setCheckingAuth(false);
            }
        });
        return unsubscribe;
    }, [router]);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch {
            setLoading(false);
            Alert.alert("Đăng nhập thất bại", "Sai thông tin.");
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        try {
            await signInAnonymously(auth);
        } catch (error: any) {
            setLoading(false);
            Alert.alert("Lỗi", error.message);
            
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Yêu cầu", "Vui lòng nhập email để đặt lại mật khẩu.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Đã gửi", "Vui lòng kiểm tra email.");
        } catch (error: any) {
            Alert.alert("Lỗi", error.message);
        }
    };

    if (checkingAuth) return (
        <View style={[styles.center, {backgroundColor: '#fff'}]}>
            <ActivityIndicator size="large" color="#1B5E20"/>
        </View>
    );

    
    return (
        <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2074&auto=format&fit=crop' }} 
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardContainer}
                >
                    <View style={styles.cardContainer}>
                        
                        <View style={styles.headerContainer}>
                            <Text variant="displaySmall" style={styles.title}>ECO LIFE</Text>
                            <Text variant="bodyMedium" style={styles.subtitle}>Kiến tạo tương lai xanh</Text>
                        </View>

                        
                        <View style={styles.formContainer}>
                            
                            <TextInput 
                                label="Email" 
                                value={email} 
                                onChangeText={setEmail} 
                                mode="outlined" 
                                autoCapitalize="none" 
                                style={styles.input}
                                outlineColor="#A5D6A7" 
                                activeOutlineColor="#2E7D32" 
                                textColor="#1B5E20"
                                theme={{ roundness: 25 }} 
                                left={<TextInput.Icon icon="email-outline" color="#558B2F"/>}
                            />
                            
                            
                            <TextInput 
                                label="Mật khẩu" 
                                value={password} 
                                secureTextEntry 
                                onChangeText={setPassword} 
                                mode="outlined" 
                                style={styles.input}
                                outlineColor="#A5D6A7"
                                activeOutlineColor="#2E7D32"
                                textColor="#1B5E20"
                                theme={{ roundness: 25 }} 
                                left={<TextInput.Icon icon="lock-outline" color="#558B2F"/>}
                            />

                            <TouchableOpacity onPress={handleResetPassword} style={styles.forgotPassContainer}>
                                <Text style={styles.forgotPass}>Quên mật khẩu?</Text>
                            </TouchableOpacity>

                            <Button 
                                mode="contained" 
                                onPress={handleLogin} 
                                loading={loading} 
                                style={styles.primaryButton}
                                contentStyle={{ height: 50 }}
                                labelStyle={{ fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }}
                            >
                                ĐĂNG NHẬP
                            </Button>

                            <View style={styles.dividerContainer}>
                                <Divider style={styles.dividerLine} />
                                <Text style={styles.dividerText}>HOẶC</Text>
                                <Divider style={styles.dividerLine} />
                            </View>

                            <Button
                                mode="outlined"
                                icon="google"
                                onPress={() => promptAsync()}
                                disabled={!request}
                                textColor="#1B5E20"
                                style={styles.socialButton}
                                contentStyle={{ height: 48 }}
                            >
                                Google
                            </Button>

                            
                            <TouchableOpacity onPress={handleGuestLogin} style={styles.guestLink}>
                                <Text style={styles.guestText}>Trải nghiệm nhanh (Guest)</Text>
                            </TouchableOpacity>
                        </View>

                        
                        <View style={styles.footerContainer}>
                            <Text style={{color: '#555'}}>Chưa có tài khoản? </Text>
                            <TouchableOpacity onPress={() => router.push("/register")}>
                                <Text style={styles.registerLink}>Đăng ký ngay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    backgroundImage: { flex: 1, width: '100%', height: '100%' },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
        justifyContent: 'center',
        padding: 20,
    },
    keyboardContainer: { flex: 1, justifyContent: 'center' },
    
    
    cardContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        paddingVertical: 40,
        paddingHorizontal: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
    },

    
    headerContainer: { alignItems: 'center', marginBottom: 30 },
    title: { 
        fontWeight: "900", 
        color: "#1B5E20", 
        letterSpacing: 2,
        marginBottom: 5
    },
    subtitle: { 
        color: "#558B2F", 
        fontWeight: "500", 
        fontSize: 16,
        letterSpacing: 0.5 
    },

    
    formContainer: { width: '100%' },
    
    
    input: { 
        marginBottom: 15, 
        backgroundColor: '#F1F8E9', 
        fontSize: 16,
    },
    
    forgotPassContainer: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -5 },
    forgotPass: { 
        color: "#43A047", 
        fontWeight: "600",
        fontSize: 13
    },

    
    primaryButton: { 
        backgroundColor: "#2E7D32", 
        borderRadius: 25, 
        marginBottom: 10,
        elevation: 2, 
    },
    socialButton: { 
        borderColor: "#A5D6A7", 
        borderRadius: 25, 
        borderWidth: 1,
        backgroundColor: '#fff'
    },

    
    dividerContainer: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginVertical: 20 
    },
    dividerLine: { flex: 1, backgroundColor: '#CFD8DC' },
    dividerText: { 
        marginHorizontal: 10, 
        color: '#90A4AE', 
        fontSize: 12, 
        fontWeight: 'bold' 
    },

    
    guestLink: { alignItems: 'center', marginTop: 15 },
    guestText: { 
        color: "#78909C", 
        textDecorationLine: 'underline' 
    },
    footerContainer: { 
        flexDirection: "row", 
        justifyContent: "center", 
        marginTop: 30 
    },
    registerLink: { 
        color: "#1B5E20", 
        fontWeight: "bold",
        textDecorationLine: 'underline'
    },
});