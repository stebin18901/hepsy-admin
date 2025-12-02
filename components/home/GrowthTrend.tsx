import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TrendingUp } from "lucide-react-native";

export default function GrowthTrend() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <TrendingUp size={24} color="#4caf50" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.score}>+6.8%</Text>
          <Text style={styles.label}>Improvement This Month</Text>
        </View>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Top 15%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f5f5f5",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e8f5e8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  score: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4caf50",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  badge: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "700",
  },
});