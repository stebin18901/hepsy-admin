import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AlertCircle, ArrowRight } from "lucide-react-native";

export default function WeakAreas() {
  const areas = [
    { name: "Fractions", progress: 65 },
    { name: "Algebra Basics", progress: 45 },
    { name: "Theory of Motion", progress: 30 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <AlertCircle size={20} color="#ff9800" />
          <Text style={styles.title}>Areas to Improve</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Practice</Text>
          <ArrowRight size={16} color="#1e88e5" />
        </TouchableOpacity>
      </View>
      
      {areas.map((area, index) => (
        <View key={index} style={styles.areaItem}>
          <View style={styles.areaHeader}>
            <Text style={styles.areaName}>{area.name}</Text>
            <Text style={styles.areaProgress}>{area.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${area.progress}%` }
              ]} 
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff8e1",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e65100",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: "#1e88e5",
    fontWeight: "600",
  },
  areaItem: {
    marginBottom: 16,
  },
  areaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  areaName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff8f00",
  },
  areaProgress: {
    fontSize: 14,
    fontWeight: "700",
    color: "#e65100",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#ffe0b2",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ff9800",
    borderRadius: 3,
  },
});