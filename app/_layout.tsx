import { useEffect } from "react";
import { Slot, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { ActiveStudentProvider } from "@/contexts/ActiveStudentContext";

function RootNavigator() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    // 🧠 Only handle unauthenticated case here
    if (!user) router.replace("/(auth)/login");
    // ✅ If user exists, do nothing — let app/index.tsx handle flow
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // ✅ Once logged in, show app screens normally
  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ActiveStudentProvider>
        <RootNavigator />
      </ActiveStudentProvider>
      
    </AuthProvider>
  );
}
