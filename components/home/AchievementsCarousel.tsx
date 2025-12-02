import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Award, TrendingUp, Calendar } from "lucide-react-native";

const AchievementCard = ({ icon, title, description, date, color }) => (
  <View style={[styles.card, { borderLeftColor: color }]}>
    <View style={styles.cardHeader}>
      <View style={styles.iconTitle}>
        <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
          {icon}
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.date}>{date}</Text>
    </View>
    <Text style={styles.description}>{description}</Text>
  </View>
);

export default function AchievementsCarousel() {
  const achievements = [
    {
      icon: <Award size={20} color="#ffd700" />,
      title: "Science Champion",
      description: "Top scorer in Science Olympiad",
      date: "2 days ago",
      color: "#ffd700",
    },
    {
      icon: <TrendingUp size={20} color="#4caf50" />,
      title: "14 Day Streak",
      description: "Consistent learning for 2 weeks",
      date: "1 week ago",
      color: "#4caf50",
    },
    {
      icon: <Award size={20} color="#1e88e5" />,
      title: "Math Top 10",
      description: "Ranked #8 in Mathematics",
      date: "3 days ago",
      color: "#1e88e5",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Achievements</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {achievements.map((achievement, index) => (
          <AchievementCard key={index} {...achievement} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  seeAll: {
    fontSize: 14,
    color: "#1e88e5",
    fontWeight: "600",
  },
  scrollContent: {
    gap: 16,
    paddingRight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: 280,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  iconTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});