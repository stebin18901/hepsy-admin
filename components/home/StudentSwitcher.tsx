import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { ChevronDown, User } from "lucide-react-native";

interface Student {
  id: string;
  fullName: string;
  grade: string;
  avatar?: string;
}

interface StudentSwitcherProps {
  student: Student;
  onPress: () => void;
}

export default function StudentSwitcher({ student, onPress }: StudentSwitcherProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.avatar}>
        <User size={20} color="#1e88e5" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{student.fullName}</Text>
        <Text style={styles.grade}>{student.grade}</Text>
      </View>
      <ChevronDown size={18} color="#666" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    width: "60%",
    maxWidth: 400,
    // Remove negative margins since we're using absolute positioning
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  grade: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
    fontWeight: "500",
  },
});