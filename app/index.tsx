import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/(auth)/login");
        return;
      }
      try {
        const q = query(collection(db, "studentAccounts"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        router.replace(snap.empty ? "/create-account" : "/accounts");
      } catch (err) {
        console.error("Auth gate error:", err);
        router.replace("/(auth)/login");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );

  return null;
}
