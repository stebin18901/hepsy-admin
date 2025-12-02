import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { useRouter } from "expo-router";
import registerban from "../../assets/images/registerban.png"

const { height } = Dimensions.get("window");

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return Alert.alert("Missing Fields", "Please fill in all the details.");
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "parents", userCred.user.uid), {
        name,
        email,
        joinedAt: new Date().toISOString(),
      });
      Alert.alert("Success", "Account created successfully!");
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", error.message);
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
        {/* Background Image */}
        <ImageBackground
          source={registerban}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "rgba(255,255,255,0.2)", "#f3f7ff"]}
            style={styles.gradientOverlay}
          />
        </ImageBackground>

        {/* Scrollable Form Card */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bottomCard}>
            <Text style={styles.title}>Create Account ✨</Text>
            <Text style={styles.subtitle}>
              Join as a parent to track your child’s learning
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
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
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creating..." : "Register"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.link}>Already have an account? Login</Text>
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
    height: height * 0.45,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
    marginTop: -60,
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
    paddingVertical: 45,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
    marginTop: 18,
    color: "#007AFF",
    fontWeight: "600",
  },
});
