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
import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useActiveStudent } from "@/contexts/ActiveStudentContext";

export default function StudentSubjects() {
  const { activeStudent } = useActiveStudent();
  const className = String(activeStudent?.className || "");
  const numericClass = className.replace(/[^0-9]/g, "") || "6";

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "quizzes"));
        const subs = new Set();
        snap.forEach((d) => {
          const md = d.data()?.metadata || {};
          if (String(md.class) === numericClass && md.subject) subs.add(md.subject);
        });
        setSubjects(Array.from(subs));
      } finally {
        setLoading(false);
      }
    };
    if (activeStudent) run();
  }, [activeStudent]);

  const handleCreateTeam = () => {
    // Navigate to team creation page - we'll create this later
    router.push({
      pathname: "/(tabs)/student/create-team",
    });
  };

  if (!activeStudent)
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>No student selected</Text>
      </View>
    );

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#42a5f5" />
      </View>
    );

  // Fun emojis for subjects
  const subjectIcons = {
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

  return (
    <LinearGradient
      colors={["#E3F2FD", "#FFFFFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Header */}
        <LinearGradient
          colors={["#04254dff", "#044b88ff", "#0b65aeff"]}
          start={{ x: 1, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.hero}
        >
          <Text style={styles.title}>🎯 Do & Learn</Text>
          <Text style={styles.sub}>
            Class {className} • Academic Year {numericClass}
          </Text>
        </LinearGradient>

        {/* Team Creation Banner */}
        <Pressable onPress={() =>
          router.push({
            pathname: "/student/create-team",
            
          })
        } style={styles.teamBannerContainer}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.teamBanner}
          >
            <View style={styles.teamBannerContent}>
              <View style={styles.teamBannerTextContainer}>
                <Text style={styles.teamBannerTitle}>Create Your Team! 🚀</Text>
                <Text style={styles.teamBannerSubtitle}>
                  Collaborate with classmates and learn together
                </Text>
              </View>
              <View style={styles.teamBannerIcon}>
                <Text style={styles.teamBannerArrow}>➡️</Text>
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        {/* Subject Grid */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Select a Subject</Text>

          <View style={styles.grid}>
            {subjects.length > 0 ? (
              subjects.map((s, i) => {
                const gradients = [
                  ["#89F7FE", "#66A6FF"], // cool blue
                  ["#FAD0C4", "#FFD1FF"], // peach-pink
                  ["#84FAB0", "#8FD3F4"], // teal-blue
                  ["#A1C4FD", "#C2E9FB"], // sky blue
                  ["#F6D365", "#FDA085"], // orange
                  ["#FFDEE9", "#B5FFFC"], // pastel
                ];
                const colorSet = gradients[i % gradients.length];

                const icon =
                  subjectIcons[s.toLowerCase()] ||
                  subjectIcons[
                  Object.keys(subjectIcons).find((key) =>
                    s.toLowerCase().includes(key)
                  ) || ""
                  ] ||
                  "📚";

                return (
                  <Pressable
                    key={s}
                    style={{ width: "47%" }}
                    android_ripple={{ color: "#ffffff33" }}
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/student/chapters",
                        params: { subject: s, cls: numericClass, label: className },
                      })
                    }
                  >
                    <LinearGradient
                      colors={colorSet}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.subjectCard}
                    >
                      <Text style={styles.subjectEmoji}>{icon}</Text>
                      <Text style={styles.subjectText}>{s}</Text>
                    </LinearGradient>
                  </Pressable>
                );
              })
            ) : (
              <Text style={[styles.muted, { textAlign: "center", width: "100%" }]}>
                No subjects found.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f6fc",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  muted: {
    color: "#94a3b8",
    fontWeight: "600",
  },

  /** Hero Header **/
  hero: {
    paddingTop: 40,
    paddingBottom: 36,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: "#1565C0",
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  sub: {
    fontSize: 15,
    color: "#E3F2FD",
    marginTop: 8,
    fontWeight: "600",
  },

  /** Team Creation Banner **/
  teamBannerContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#667eea",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  teamBanner: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  teamBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamBannerTextContainer: {
    flex: 1,
  },
  teamBannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  teamBannerSubtitle: {
    fontSize: 14,
    color: "#E3E3FF",
    fontWeight: "500",
  },
  teamBannerIcon: {
    marginLeft: 10,
  },
  teamBannerArrow: {
    fontSize: 20,
  },

  /** Card Container **/
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: "#90CAF9",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1565C0",
    marginBottom: 20,
    textAlign: "left",
  },

  /** Grid **/
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18,
  },

  /** Subject Card **/
  subjectCard: {
    borderRadius: 20,
    paddingVertical: 26,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  subjectEmoji: {
    fontSize: 30,
    marginBottom: 6,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
    textTransform: "capitalize",
  },
});