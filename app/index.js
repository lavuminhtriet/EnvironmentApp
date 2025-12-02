import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { TextInput, Button, Text, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, onAuthStateChanged, signInAnonymously, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Colors, Fonts } from '@/constants/theme'; 

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Kiểm tra trạng thái đăng nhập
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
        if (!email || !password) return Alert.alert("Yêu cầu", "Vui lòng nhập đầy đủ thông tin.");
        setLoading(true);
        try { 
            await signInWithEmailAndPassword(auth, email, password); 
        } catch (error) { 
            setLoading(false); 
            Alert.alert("Đăng nhập thất bại", "Email hoặc mật khẩu không chính xác."); 
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        try {
            await signInAnonymously(auth);
        } catch (e) {
            setLoading(false);
            Alert.alert("Lỗi", "Không thể đăng nhập chế độ khách: " + e.message);
        }
    };

    // --- BỔ SUNG LOGIC FR-1.1.3: Đặt lại mật khẩu ---
    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert("Yêu cầu", "Vui lòng nhập Email của bạn vào ô bên trên để nhận link đặt lại mật khẩu.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Đã gửi", "Vui lòng kiểm tra hộp thư email để đặt lại mật khẩu.");
        } catch (error) {
            Alert.alert("Lỗi", "Không thể gửi email. Vui lòng kiểm tra lại địa chỉ email.");
        }
    };
    // ------------------------------------------------

    if (checkingAuth) return <View style={styles.center}><ActivityIndicator size="large" color={Colors.light.primary}/></View>;

    const themeColor = Colors.light;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardView}>
                
                <View style={styles.headerContainer}>
                    <Text style={[styles.logoText, { color: themeColor.text, fontFamily: Fonts.ios.serifTitle }]}>ECO LIFE</Text>
                    <Text style={[styles.tagline, { color: themeColor.icon }]}>Kiến tạo tương lai xanh</Text>
                </View>

                <View style={styles.formContainer}>
                    <TextInput 
                        label="Email" value={email} onChangeText={setEmail} 
                        mode="flat"
                        style={styles.input}
                        textColor={themeColor.text}
                        underlineColor={themeColor.border}
                        activeUnderlineColor={themeColor.primary}
                        contentStyle={styles.inputContent}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        left={<TextInput.Icon icon="email-outline" color={themeColor.icon} size={20}/>} 
                    />
                    
                    <TextInput 
                        label="Mật khẩu" value={password} secureTextEntry onChangeText={setPassword} 
                        mode="flat"
                        style={styles.input}
                        textColor={themeColor.text}
                        underlineColor={themeColor.border}
                        activeUnderlineColor={themeColor.primary}
                        contentStyle={styles.inputContent}
                        left={<TextInput.Icon icon="lock-outline" color={themeColor.icon} size={20} />} 
                    />

                    {/* FR-1.1.3: Nút quên mật khẩu đã có logic */}
                    <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPass}>
                        <Text style={{color: themeColor.icon, fontSize: 13, fontWeight: '500'}}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    <Button 
                        mode="contained" onPress={handleLogin} loading={loading} 
                        style={[styles.primaryBtn, { backgroundColor: themeColor.primary }]} 
                        contentStyle={styles.btnContent} 
                        labelStyle={styles.primaryBtnLabel}>
                        ĐĂNG NHẬP
                    </Button>

                    <View style={styles.dividerContainer}>
                        <Divider style={styles.divider} />
                        <Text style={[styles.orText, { color: themeColor.icon, backgroundColor: themeColor.background }]}>HOẶC</Text>
                    </View>

                    <Button 
                        mode="outlined" 
                        onPress={handleGuestLogin} 
                        loading={loading}
                        style={[styles.socialBtn, { borderColor: themeColor.border }]} 
                        icon="account-outline" 
                        textColor={themeColor.text} 
                        labelStyle={styles.socialBtnLabel}
                    >
                        Tiếp tục với vai trò Khách
                    </Button>
                </View>

                <View style={styles.footer}>
                    <Text style={{color: themeColor.icon, fontSize: 14}}>Bạn chưa có tài khoản? </Text>
                    <TouchableOpacity onPress={() => router.push("/register")}>
                        <Text style={[styles.registerLink, { color: themeColor.primary }]}>Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#fff' },
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 30 },
    keyboardView: { flex: 1, justifyContent: 'center' },
    
    headerContainer: { alignItems: 'center', marginBottom: 50 },
    logoText: { fontSize: 36, fontWeight: "bold", letterSpacing: 3, marginBottom: 8 },
    tagline: { fontSize: 16, letterSpacing: 1, fontWeight: '300', textTransform: 'uppercase' },

    formContainer: { width: '100%' },
    input: { backgroundColor: 'transparent', marginBottom: 15, fontSize: 16, height: 55 },
    inputContent: { paddingLeft: 10 },
    
    forgotPass: { alignSelf: 'flex-end', marginBottom: 30, marginTop: -5 },
    
    primaryBtn: { borderRadius: 4, elevation: 0 },
    btnContent: { height: 54 },
    primaryBtnLabel: { fontSize: 15, fontWeight: '700', letterSpacing: 1.5 },

    dividerContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginVertical: 30 },
    divider: { width: '100%', height: 1, backgroundColor: '#E0E0E0' },
    orText: { position: 'absolute', paddingHorizontal: 15, fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },

    socialBtn: { borderRadius: 4, borderWidth: 1, height: 50, justifyContent: 'center' },
    socialBtnLabel: { fontSize: 14, fontWeight: '600' },

    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40, paddingBottom: 20 },
    registerLink: { fontWeight: "700", textDecorationLine: 'underline' }
});