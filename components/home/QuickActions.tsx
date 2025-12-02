import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { BookOpen, Calendar, MessageCircle, FileText, Video, Settings } from "lucide-react-native";

const ActionButton = ({ icon, label, onPress, color = "#1e88e5" }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
      {React.cloneElement(icon, { size: 20, color })}
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function QuickActions() {
  const actions = [
    { icon: <BookOpen />, label: "Assignments", color: "#1e88e5" },
    { icon: <Calendar />, label: "Schedule", color: "#ff9800" },
    { icon: <MessageCircle />, label: "Messages", color: "#4caf50" },
    { icon: <FileText />, label: "Reports", color: "#9c27b0" },
    { icon: <Video />, label: "Classes", color: "#f44336" },
    { icon: <Settings />, label: "Settings", color: "#607d8b" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {actions.map((action, index) => (
          <ActionButton key={index} {...action} />
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  scrollContent: {
    gap: 16,
    paddingRight: 20,
  },
  actionButton: {
    alignItems: "center",
    minWidth: 70,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});