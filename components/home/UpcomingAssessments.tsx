import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar, Clock, Book } from "lucide-react-native";

const AssessmentItem = ({ subject, type, date, time, priority = "medium" }) => {
  const priorityColors = {
    high: "#f44336",
    medium: "#ff9800",
    low: "#4caf50",
  };

  return (
    <View style={styles.assessmentItem}>
      <View style={styles.assessmentHeader}>
        <View style={styles.subjectContainer}>
          <Book size={16} color="#666" />
          <Text style={styles.subject}>{subject}</Text>
        </View>
        <View style={[styles.priority, { backgroundColor: priorityColors[priority] + "20" }]}>
          <Text style={[styles.priorityText, { color: priorityColors[priority] }]}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Text>
        </View>
      </View>
      <Text style={styles.type}>{type}</Text>
      <View style={styles.timeContainer}>
        <View style={styles.timeItem}>
          <Calendar size={14} color="#666" />
          <Text style={styles.timeText}>{date}</Text>
        </View>
        <View style={styles.timeItem}>
          <Clock size={14} color="#666" />
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

export default function UpcomingAssessments() {
  const assessments = [
    {
      subject: "Mathematics",
      type: "Unit Test - Algebra",
      date: "Tomorrow",
      time: "10:00 AM",
      priority: "high",
    },
    {
      subject: "General Knowledge",
      type: "Weekly Quiz",
      date: "Dec 15",
      time: "11:30 AM",
      priority: "medium",
    },
    {
      subject: "Science",
      type: "Lab Practical",
      date: "Monday",
      time: "2:00 PM",
      priority: "medium",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Assessments</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>View Calendar</Text>
        </TouchableOpacity>
      </View>
      {assessments.map((assessment, index) => (
        <AssessmentItem key={index} {...assessment} />
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
  assessmentItem: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  assessmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  subjectContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  subject: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  priority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "700",
  },
  type: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    gap: 16,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});