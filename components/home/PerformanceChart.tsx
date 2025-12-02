import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

export default function PerformanceChart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [65, 72, 78, 75, 82, 85],
        color: () => "#1e88e5",
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(30, 136, 229, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#1e88e5",
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Performance Trend</Text>
        <Text style={styles.subtitle}>Last 6 months</Text>
      </View>
      <LineChart
        data={data}
        width={width - 48}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withVerticalLines={false}
        withHorizontalLines={false}
        withShadow={false}
      />
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
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
});