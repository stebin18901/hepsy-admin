import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SectionHeading({ title, subtitle, actionText, onActionPress }) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {actionText && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.action}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "700", color: "#263238" },
  subtitle: { fontSize: 13, color: "#607d8b" },
  action: { fontSize: 13, color: "#1e88e5", fontWeight: "600" },
});