import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { ChevronDown, User, Bell } from "lucide-react-native";
import { useActiveStudent } from "@/contexts/ActiveStudentContext";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function HeaderCard() {
  const { activeStudent, clearStudent } = useActiveStudent();
  const router = useRouter();

  const handleSwitch = async () => {
    await clearStudent();
    router.replace("/accounts");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activeStudent && (
          <TouchableOpacity onPress={handleSwitch} style={styles.studentSwitcher}>
            <View style={styles.avatar}>
              <User size={20} color="#4A6CF7" />
            </View>

            <Text numberOfLines={1} style={styles.studentName}>
              {activeStudent.fullName}
            </Text>

            <ChevronDown size={18} color="#818181ff" />
          </TouchableOpacity>
        )}

        {/* Updated Badge with Icon */}
        <View style={styles.badge}>
          <Bell size={18} color="#4A6CF7" />
          <View style={styles.badgeDot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 22,
    shadowColor: "rgba(74, 108, 247, 0.5)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
    elevation: 14,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  studentSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#818181ff",
    maxWidth: width * 0.55,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8EDFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  studentName: {
    flex: 1,
    color: "#000000ff",
    fontSize: 17,
    fontWeight: "700",
    marginRight: 8,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    position: "absolute",
    top: 6,
    right: 6,
  },
});
