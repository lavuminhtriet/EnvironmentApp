import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { TextInput, Button, Title, Text, Divider } from "react-native-paper";
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

// Sử dụng ID cứng trực tiếp để đảm bảo giá trị không bị lỗi (Client Id must be defined)
const GOOGLE_CLIENT_ID = "184252200932-ebbc2j7889bbbqncv8m620hkq2mdks7l.apps.googleusercontent.com";


export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // [FIX CUỐI CÙNG] Thêm iosClientId vào cấu hình
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: GOOGLE_CLIENT_ID,
        androidClientId: GOOGLE_CLIENT_ID, 
        iosClientId: GOOGLE_CLIENT_ID, // <-- DÒNG BỔ SUNG
    });

    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential).catch((error) => {
                Alert.alert("Lỗi", error.message);
                setLoading(false);
            });
        }
    }, [response]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace("/home");
            } else {
                setCheckingAuth(false);
            }
        });
        return unsubscribe;
    }, []);

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
            Alert.alert("Lỗi", "Đăng nhập thất bại!");
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        try {
            await signInAnonymously(auth);
        } catch (error) {
            Alert.alert("Lỗi", error.message);
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Nhập email để đặt lại mật khẩu");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Đã gửi", "Hãy kiểm tra email của bạn");
        } catch (error) {
            Alert.alert("Lỗi", error.message);
        }
    };

    if (checkingAuth) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={{ marginTop: 10 }}>Đang tải...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Title style={styles.title}>🌱 Environment App</Title>
            <Text style={styles.subtitle}>Chung tay bảo vệ môi trường</Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                autoCapitalize="none"
                style={styles.input}
            />

            <TextInput
                label="Mật khẩu"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
            />

            <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>
                Đăng nhập
            </Button>

            <TouchableOpacity onPress={handleResetPassword}>
                <Text style={styles.forgotPass}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <Button mode="text" onPress={handleGuestLogin} textColor="#666" style={{ marginTop: 10 }}>
                Tiếp tục với vai trò Khách (Guest)
            </Button>

            <View style={styles.divider}>
                <Divider style={{ flex: 1 }} />
                <Text style={{ marginHorizontal: 10 }}>HOẶC</Text>
                <Divider style={{ flex: 1 }} />
            </View>

            <Button
                mode="outlined"
                icon="google"
                onPress={() => promptAsync()}
                disabled={!request || loading}
                textColor="#DB4437"
                style={{ borderColor: "#DB4437" }}
            >
                Đăng nhập bằng Google
            </Button>

            <View style={styles.registerContainer}>
                <Text>Chưa có tài khoản? </Text>
                <TouchableOpacity onPress={() => router.push("/register")}>
                    <Text style={styles.registerLink}>Đăng ký ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: '#fff' },
    title: { fontSize: 32, fontWeight: "bold", textAlign: "center", color: "#2E7D32" },
    subtitle: { textAlign: "center", marginBottom: 20, color: "#666" },
    input: { marginBottom: 15, backgroundColor: '#fff' },
    button: { marginVertical: 10, backgroundColor: "#2E7D32" },
    forgotPass: { textAlign: "right", marginTop: 10, color: "#2E7D32", fontWeight: "bold" },
    divider: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
    registerContainer: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
    registerLink: { color: "#2E7D32", fontWeight: "bold" },
});