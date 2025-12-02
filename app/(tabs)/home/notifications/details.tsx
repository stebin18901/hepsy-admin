import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Paperclip } from "lucide-react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/config";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: any;
  attachments?: any[];
}

export default function NotificationDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!params.id) {
        console.error("Missing ID parameter");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "announcements", params.id as string);
        const snap = await getDoc(docRef);
        
        if (snap.exists()) {
          setNotification({ id: snap.id, ...snap.data() } as Notification);
        } else {
          // Fallback to params
          setNotification({
            id: params.id as string,
            title: params.title as string || "No Title",
            message: params.message as string || "No message",
            createdAt: params.createdAt ? { toDate: () => new Date(parseInt(params.createdAt as string)) } : null,
          });
        }
      } catch (err) {
        console.error("Error loading:", err);
        // Fallback to params on error
        setNotification({
          id: params.id as string,
          title: params.title as string || "No Title",
          message: params.message as string || "No message",
          createdAt: params.createdAt ? { toDate: () => new Date(parseInt(params.createdAt as string)) } : null,
        });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [params.id]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown date";
    try {
      let date;
      if (timestamp.toDate) date = timestamp.toDate();
      else if (timestamp.seconds) date = new Date(timestamp.seconds * 1000);
      else date = new Date(parseInt(timestamp));
      return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return "Invalid date";
    }
  };

  if (loading) return <LoadingView />;
  if (!notification) return <ErrorView router={router} />;

  return (
    <LinearGradient colors={["#f0f4f7", "#ffffff"]} style={s.container}>
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
        <ArrowLeft size={18} color="#1e88e5" />
        <Text style={s.backText}>Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.scrollContent}>
        <View style={s.card}>
          <Text style={s.title}>{notification.title}</Text>
          <Text style={s.date}>{formatDate(notification.createdAt)}</Text>
          <Text style={s.body}>{notification.message}</Text>
          
          <View style={s.attachments}>
            <Paperclip size={14} color="#1e88e5" />
            <View style={s.attachList}>
              {notification.attachments?.length ? (
                notification.attachments.map((file, i) => (
                  <TouchableOpacity key={i}>
                    <Text style={s.attachText}>📎 {file.name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={s.noAttachText}>No attachments</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const LoadingView = () => (
  <View style={s.center}>
    <ActivityIndicator size="large" color="#1e88e5" />
    <Text>Loading...</Text>
  </View>
);

const ErrorView = ({ router }: any) => (
  <View style={s.center}>
    <Text>Notification not found</Text>
    <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
      <ArrowLeft size={18} color="#1e88e5" />
      <Text style={s.backText}>Go Back</Text>
    </TouchableOpacity>
  </View>
);

const s = {
  container: { flex: 1, padding: 16 },
  scrollContent: { flexGrow: 1 },
  backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 16, paddingVertical: 8 },
  backText: { marginLeft: 8, color: "#1e88e5", fontWeight: "600", fontSize: 16 },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 18, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  title: { fontSize: 18, fontWeight: "800", color: "#263238", marginBottom: 6 },
  date: { fontSize: 12, color: "#78909c", marginBottom: 10 },
  body: { fontSize: 14, color: "#37474f", lineHeight: 22 },
  attachments: { flexDirection: "row", alignItems: "flex-start", marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#eee" },
  attachList: { marginLeft: 8, flex: 1 },
  attachText: { color: "#1e88e5", fontSize: 13, fontWeight: "600", marginBottom: 4 },
  noAttachText: { color: "#90a4ae", fontSize: 13, fontStyle: "italic" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
};