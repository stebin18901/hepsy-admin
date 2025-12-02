import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "expo-router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Email Sent", "Password reset link sent to your email!");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput style={styles.input} placeholder="Enter your email" value={email} onChangeText={setEmail} />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});