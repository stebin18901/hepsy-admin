import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, CheckCircle, Clock, FileText } from "lucide-react-native";

export default function AssignmentCard({ item, onPress }) {
  const statusMap = {
    completed: {
      text: "Completed",
      color: "#43a047",
      icon: <CheckCircle size={14} color="#43a047" />,
    },
    pending: {
      text: "Pending",
      color: "#fb8c00",
      icon: <Clock size={14} color="#fb8c00" />,
    },
    published: {
      text: "Active",
      color: "#1e88e5",
      icon: <FileText size={14} color="#1e88e5" />,
    },
    draft: {
      text: "Draft",
      color: "#9e9e9e",
      icon: <Clock size={14} color="#9e9e9e" />,
    },
  };

  const status = statusMap[item.status] || { text: "Unknown", color: "#757575" };
  const isDisabled = item.status === "completed";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[styles.wrapper, isDisabled && { opacity: 0.65 }]}
    >
      <LinearGradient
        colors={["#ffffff", "#f5f9ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Title + Status */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          <View
            style={[
              styles.statusBadge,
              {
                borderColor: status.color,
                backgroundColor: status.color + "1A", // transparent accent
              },
            ]}
          >
            {status.icon}
            <Text style={[styles.statusText, { color: status.color }]}>
              {"  " + status.text}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <Text style={styles.instructions} numberOfLines={2}>
          {item.instructions || "No instructions provided."}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Calendar size={14} color="#1e88e5" />
          <Text style={styles.footerText}>
            {item.dueDate ? `Due ${item.dueDate}` : "No due date"}
          </Text>
        </View>

        {/* Glow Accent */}
        <LinearGradient
          colors={[status.color + "20", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glowOverlay}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },

  card: {
    borderRadius: 18,
    padding: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 5,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0d47a1",
    flex: 1,
    marginRight: 12,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  instructions: {
    color: "#455a64",
    marginVertical: 8,
    fontSize: 13.5,
    lineHeight: 20,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  footerText: {
    color: "#607d8b",
    fontSize: 12.5,
    fontWeight: "500",
  },

  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },
});
