import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Megaphone, Calendar, Upload } from "lucide-react-native";

const AnnouncementItem = ({ icon, title, description, time, isNew = false }) => (
  <View style={styles.announcementItem}>
    <View style={styles.iconContainer}>
      {icon}
    </View>
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {isNew && <View style={styles.newBadge}><Text style={styles.newText}>New</Text></View>}
      </View>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  </View>
);

export default function Announcements() {
  const announcements = [
    {
      icon: <Calendar size={20} color="#1e88e5" />,
      title: "PTM Scheduled",
      description: "Parent Teacher Meeting next Wednesday at 2:00 PM",
      time: "2 hours ago",
      isNew: true,
    },
    {
      icon: <Upload size={20} color="#4caf50" />,
      title: "New Assignment",
      description: "Mathematics Chapter 4 assignment uploaded",
      time: "1 day ago",
      isNew: true,
    },
    {
      icon: <Megaphone size={20} color="#ff9800" />,
      title: "Annual Day",
      description: "Registrations open for Annual Day celebrations",
      time: "2 days ago",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      {announcements.map((announcement, index) => (
        <AnnouncementItem key={index} {...announcement} />
      ))}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  seeAll: {
    fontSize: 14,
    color: "#1e88e5",
    fontWeight: "600",
  },
  announcementItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  newBadge: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
});