import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  BookOpen,
  Bell,
  FileText,
  Calendar,
} from "lucide-react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();

  const quickActions = [
    { label: "Assignments", icon: FileText, route: "/home/assignments" },
    { label: "Notifications", icon: Bell, route: "/home/notifications" },
    { label: "Schedule", icon: Calendar, route: "/home/schedule" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Top Banner --- */}
        <LinearGradient
          colors={["#04254dff", "#07356eff", "#0c52a9ff"]}
          start={{ x: 1, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroSection}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Welcome Back 👋</Text>
            <Text style={styles.heroSubtitle}>
              Continue your learning journey
            </Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.heroButton}>
              <LinearGradient
                colors={["#ffffff", "#f2f7ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroButtonInner}
              >
                <Text style={styles.heroButtonText}>View Progress</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* --- Quick Access --- */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.9}
                  style={styles.actionCard}
                  onPress={() => router.push(action.route)}
                >
                  <LinearGradient
                    colors={["#E3F2FD", "#FFFFFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconCircle}
                  >
                    <Icon size={28} color="#1976d2" />
                  </LinearGradient>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* --- Notifications --- */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          <LinearGradient
            colors={["#ffffff", "#f6faff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.notificationCard}
          >
            <Bell color="#1e88e5" size={24} />
            <View style={styles.notificationText}>
              <Text style={styles.notificationTitle}>
                Exam Schedule Released
              </Text>
              <Text style={styles.notificationBody}>
                Check your upcoming exams for next week. Stay prepared!
              </Text>
            </View>
          </LinearGradient>

          <TouchableOpacity
            onPress={() => router.push("/home/notifications")}
            style={styles.viewAllBtn}
            activeOpacity={0.75}
          >
            <LinearGradient
              colors={["#1565C0", "#42A5F5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.viewAllGradient}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const CARD_WIDTH = (width - 60) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },
  scrollContent: {
    paddingBottom: 50,
  },

  /** Hero Banner **/
  heroSection: {
    height: 220,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: "#1565C0",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  heroOverlay: {
    zIndex: 2,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#E3F2FD",
    fontSize: 14,
    marginTop: 4,
  },
  heroButton: {
    marginTop: 18,
    alignSelf: "flex-start",
    borderRadius: 12,
    overflow: "hidden",
  },
  heroButtonInner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  heroButtonText: {
    color: "#1565C0",
    fontWeight: "700",
    fontSize: 14,
  },

  /** Card Container **/
  cardContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: "#90CAF9",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D47A1",
    marginBottom: 16,
  },

  /** Quick Actions **/
  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionCard: {
    width: CARD_WIDTH,
    alignItems: "center",
    marginBottom: 22,
  },
  iconCircle: {
    width: 74,
    height: 74,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1976d2",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  actionLabel: {
    fontSize: 13.5,
    color: "#263238",
    marginTop: 10,
    fontWeight: "600",
    textAlign: "center",
  },

  /** Notifications **/
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#90CAF9",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  notificationText: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D47A1",
  },
  notificationBody: {
    fontSize: 13.5,
    color: "#607D8B",
    marginTop: 4,
    lineHeight: 18,
  },

  /** View All Button **/
  viewAllBtn: {
    alignSelf: "flex-end",
    marginTop: 14,
    borderRadius: 10,
    overflow: "hidden",
  },
  viewAllGradient: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#42A5F5",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  viewAllText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13.5,
  },
});
