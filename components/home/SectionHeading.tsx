import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
}

export default function SectionHeading({ title, subtitle, actionText, onActionPress }: SectionHeadingProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {actionText && (
        <TouchableOpacity onPress={onActionPress} style={styles.actionButton}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8, // Reduced top margin
    marginBottom: 16,
    paddingHorizontal: 20, // Consistent horizontal padding
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 20, // Slightly smaller for better hierarchy
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e88e5",
  },
});