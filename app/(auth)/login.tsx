import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import LoginBanner from "../../assets/images/loginbana.png";


const { height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim())
      return Alert.alert("Error", "Please fill in all fields.");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert("Success", "Welcome back!");
      router.replace("/");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* Top Image Background */}
        <ImageBackground
          source={LoginBanner}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "rgba(255,255,255,0.2)", "#f3f7ff"]}
            style={styles.gradientOverlay}
          />
        </ImageBackground>

        {/* Scrollable Bottom Card */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bottomCard}>
            <Text style={styles.title}>LOGIN</Text>

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
            >
              <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.bottomLink}>
                New user? Create an account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f7ff",
  },
  imageBackground: {
    width: "100%",
    height: height * 0.55,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
    marginTop: -50,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  bottomCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingVertical:40,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    bottom: 0
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#555",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D0D7E2",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#F8FAFF",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    marginTop: 15,
    color: "#007AFF",
    fontWeight: "500",
  },
  bottomLink: {
    textAlign: "center",
    marginTop: 10,
    color: "#007AFF",
    fontWeight: "600",
  },
});
