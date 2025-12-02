import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default function ProgressBar({ current, total }) {
  const progress = total ? ((current + 1) / total) * 100 : 0;
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.text}>Question {current + 1}/{total}</Text>
        <Text style={styles.text}>{Math.round(progress)}%</Text>
      </View>
      <View style={styles.line}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { margin: 20 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  text: { fontSize: 12, fontWeight: "700", color: "#475569" },
  line: {
    height: 8, backgroundColor: "#e2e8f0", borderRadius: 10, marginTop: 6
  },
  fill: { height: 8, backgroundColor: "#1e88e5", borderRadius: 10 }
});
