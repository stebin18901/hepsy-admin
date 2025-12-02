import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, AlertCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import { useActiveStudent } from "@/contexts/ActiveStudentContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: any;
  audience: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { activeStudent } = useActiveStudent();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!activeStudent?.schoolId) {
      setLoading(false);
      return;
    }
    
    const q = query(
      collection(db, "announcements"),
      where("schoolId", "==", activeStudent.schoolId),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, 
      (snap) => {
        const data = snap.docs.map((d) => ({ 
          id: d.id, 
          ...d.data() 
        } as Notification));
        
        const filtered = data.filter(a => 
          a.audience === "all" || a.audience === "parents" || a.audience === "both"
        );
        
        setNotifications(filtered);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [activeStudent?.schoolId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handleOpen = (notification: Notification) => {
    if (!notification?.id) {
      console.error("Missing ID in notification");
      return;
    }

    let timestampParam = "";
    if (notification.createdAt?.toDate) {
      timestampParam = notification.createdAt.toDate().getTime().toString();
    } else if (notification.createdAt?.seconds) {
      timestampParam = (notification.createdAt.seconds * 1000).toString();
    }

    router.push({
      pathname: "details",
      params: {
        id: notification.id,
        title: notification.title || "",
        message: notification.message || "",
        createdAt: timestampParam,
      },
    });
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      let date;
      if (timestamp.toDate) date = timestamp.toDate();
      else if (timestamp.seconds) date = new Date(timestamp.seconds * 1000);
      else date = new Date(parseInt(timestamp));
      
      return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return "";
    }
  };

  if (loading) return <LoadingView />;
  if (!notifications.length) return <EmptyView />;

  return (
    <LinearGradient colors={["#e8f0fe", "#ffffff"]} style={s.container}>
      <ScrollView
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1e88e5"]} />}
      >
        <Text style={s.heading}>Announcements</Text>
        <Text style={s.subheading}>Stay updated with school news</Text>

        {notifications.map((notification) => (
          <TouchableOpacity key={notification.id} style={s.card} onPress={() => handleOpen(notification)}>
            <LinearGradient colors={["#ffffff", "#f8fafc"]} style={s.innerCard}>
              <View style={s.iconBox}><Bell color="#1e88e5" size={20} /></View>
              <View style={s.textBox}>
                <Text style={s.title}>{notification.title}</Text>
                <Text numberOfLines={2} style={s.body}>{notification.message}</Text>
                <Text style={s.time}>{formatDate(notification.createdAt)}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const LoadingView = () => (
  <View style={s.center}>
    <ActivityIndicator size="large" color="#1e88e5" />
    <Text style={s.loadingText}>Loading announcements...</Text>
  </View>
);

const EmptyView = () => (
  <View style={s.center}>
    <AlertCircle color="#90a4ae" size={32} />
    <Text style={s.emptyText}>No announcements found</Text>
  </View>
);

const s = {
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  heading: { fontSize: 24, fontWeight: "800", color: "#263238", marginBottom: 4 },
  subheading: { fontSize: 14, color: "#607d8b", marginBottom: 20 },
  card: { marginBottom: 14, borderRadius: 14, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
  innerCard: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 14 },
  iconBox: { backgroundColor: "#e3f2fd", borderRadius: 10, padding: 10, marginRight: 12 },
  textBox: { flex: 1 },
  title: { fontSize: 15, fontWeight: "700", color: "#263238" },
  body: { fontSize: 13, color: "#607d8b", marginTop: 4, lineHeight: 18 },
  time: { fontSize: 11, color: "#90a4ae", marginTop: 6 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 8, color: "#546e7a" },
  emptyText: { fontSize: 16, color: "#90a4ae", marginTop: 8 },
};