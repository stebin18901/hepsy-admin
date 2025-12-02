import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";

export default function Chapters() {
  const { subject, cls, label } = useLocalSearchParams<{
    subject: string;
    cls: string;
    label?: string;
  }>();

  const [chapters, setChapters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "quizzes"));
        const setCh = new Set<string>();
        snap.forEach((d) => {
          const md = (d.data() as any)?.metadata || {};
          if (
            md.subject === subject &&
            String(md.class) === String(cls) &&
            md.chapter
          ) {
            setCh.add(md.chapter);
          }
        });
        setChapters(Array.from(setCh));
      } finally {
        setLoading(false);
      }
    };
    if (subject && cls) run();
  }, [subject, cls]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#42a5f5" />
      </View>
    );

  // Subject emojis
  const subjectIcons: Record<string, string> = {
    math: "🧮",
    science: "🧪",
    english: "📘",
    social: "🌍",
    computer: "💻",
    gk: "🧠",
    physics: "⚛️",
    chemistry: "⚗️",
    biology: "🧬",
    hindi: "📝",
  };

  const icon =
    subjectIcons[subject?.toLowerCase()] ||
    subjectIcons[
      Object.keys(subjectIcons).find((key) =>
        subject?.toLowerCase().includes(key)
      ) || ""
    ] ||
    "📚";

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* HEADER */}
      <LinearGradient
        colors={["#42a5f5", "#5c6bc0", "#7e57c2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroEmoji}>{icon}</Text>
        <Text style={styles.title}>{subject}</Text>
        <Text style={styles.sub}>Class {label || cls}</Text>
      </LinearGradient>

      {/* SECTION TITLE */}
      <Text style={styles.section}>📖 Chapters</Text>

      {/* CHAPTER LIST */}
      <View style={styles.listContainer}>
        {chapters.length > 0 ? (
          chapters.map((c, i) => (
            <Pressable
              key={c}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/student/concepts",
                  params: { subject, cls, chapter: c, label },
                })
              }
              android_ripple={{ color: "#ffffff55" }}
              style={styles.chapterRowWrapper}
            >
              <LinearGradient
                colors={["#e0f7fa", "#e3f2fd"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.chapterRow}
              >
                <Text style={styles.chapterNumber}>📘 {i + 1}</Text>
                <Text style={styles.chapterTitle}>{c}</Text>
              </LinearGradient>
            </Pressable>
          ))
        ) : (
          <Text style={[styles.muted, { marginTop: 24, textAlign: "center" }]}>
            No chapters found.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#f2f7ff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    elevation: 8,
  },
  heroEmoji: {
    fontSize: 42,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  sub: {
    fontSize: 14,
    color: "#e3f2fd",
    marginTop: 6,
    fontWeight: "600",
  },
  section: {
    marginTop: 28,
    marginLeft: 20,
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  listContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  chapterRowWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    elevation: 2,
  },
  chapterRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  chapterNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e88e5",
    width: 50,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    flexShrink: 1,
  },
  muted: {
    color: "#64748b",
    fontWeight: "700",
  },
});
