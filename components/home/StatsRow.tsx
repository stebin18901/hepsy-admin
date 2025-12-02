// FifaPerformanceCard.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp, Award, Star } from "lucide-react-native";

type Props = {
  performance?: number;   // 0-100
  rank?: number | string; // e.g., 12 or "#12"
  grade?: string;         // e.g., "A+"
  avatarUrl?: string;     // web image url
};

const getCardTheme = (performance: number) => {
  if (performance >= 90) {
    return {
      // Black + combo (electric highlight)
      gradient: ["#0C0D10", "#21242B"],
      edge: "rgba(164, 164, 164, 0.9)", // violet accent
      label: "#C6C8CE",
      value: "#FFFFFF",
      accent: "rgba(164, 164, 164, 0.9)",
      divider: "rgba(255,255,255,0.12)",
      reflection: ["rgba(255,255,255,0.18)", "rgba(255,255,255,0.02)"],
    };
  }
  if (performance >= 80) {
    return {
      // Gold + reflective combo
      gradient: ["#F6D772", "#E9B73E"],
      edge: "rgba(255, 240, 170, 0.95)",
      label: "#5B4205",
      value: "#3A2B00",
      accent: "#9C6F00",
      divider: "rgba(58,43,0,0.25)",
      reflection: ["rgba(255,255,255,0.35)", "rgba(255,255,255,0.06)"],
    };
  }
  if (performance >= 70) {
    return {
      // Silver / teal
      gradient: ["#E8EDF5", "#A8D9E7"],
      edge: "rgba(210, 230, 245, 0.95)",
      label: "#2A5661",
      value: "#0E2B31",
      accent: "#1C919F",
      divider: "rgba(14,43,49,0.15)",
      reflection: ["rgba(255,255,255,0.4)", "rgba(255,255,255,0.05)"],
    };
  }
  return {
    // Bronze / red (under 70)
    gradient: ["#E1A070", "#B4593F"],
    edge: "rgba(255, 206, 173, 0.9)",
    label: "#3C1E13",
    value: "#2A0B07",
    accent: "#8C2E1C",
    divider: "rgba(42,11,7,0.2)",
    reflection: ["rgba(255,255,255,0.28)", "rgba(255,255,255,0.04)"],
  };
};

export default function FifaPerformanceCard({
  performance = 88,
  rank = 12,
  grade = "A+",
  avatarUrl = "https://api.dicebear.com/7.x/adventurer/png?seed=Alex", // illustrated avatar from web
}: Props) {
  const theme = getCardTheme(performance);

  // Soft bounce on press
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 12,
      bounciness: 10,
    }).start();
  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 12,
      bounciness: 12,
    }).start();

  // normalize rank display
  const rankText = typeof rank === "number" ? `#${rank}` : `${rank}`;

  return (
    <View style={styles.wrapper}>
      <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <LinearGradient
            colors={theme.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, { borderColor: theme.edge }]}
          >
            {/* Glossy angled reflection */}
            <LinearGradient
              colors={theme.reflection}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.reflection}
            />

            {/* Content */}
            <View style={styles.content}>
              {/* LEFT: stacked stats */}
              <View style={styles.left}>
                {/* Performance */}
                <View style={styles.row}>
                  <View style={[styles.iconBadge, { backgroundColor: "rgba(255,255,255,0.14)" }]}>
                    <TrendingUp size={18} color={theme.value} />
                  </View>
                  <View style={styles.textBlock}>
                    <Text style={[styles.value, { color: theme.value }]}>
                      {performance}%
                    </Text>
                    <Text style={[styles.label, { color: theme.label }]}>
                      PERFORMANCE
                    </Text>
                  </View>
                  {/* trend dummy */}
                  <View style={[styles.lozenge, { borderColor: theme.accent }]}>
                    <Text style={[styles.lozengeText, { color: theme.accent }]}>
                      +2.1%
                    </Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.divider }]} />

                {/* Rank */}
                <View style={styles.row}>
                  <View style={[styles.iconBadge, { backgroundColor: "rgba(255,255,255,0.14)" }]}>
                    <Award size={18} color={theme.value} />
                  </View>
                  <View style={styles.textBlock}>
                    <Text style={[styles.value, { color: theme.value }]}>
                      {rankText}
                    </Text>
                    <Text style={[styles.label, { color: theme.label }]}>
                      CLASS RANK
                    </Text>
                  </View>
                  <View style={[styles.lozenge, { borderColor: theme.accent }]}>
                    <Text style={[styles.lozengeText, { color: theme.accent }]}>
                      ↑ 3
                    </Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.divider }]} />

                {/* Grade */}
                <View style={styles.row}>
                  <View style={[styles.iconBadge, { backgroundColor: "rgba(255,255,255,0.14)" }]}>
                    <Star size={18} color={theme.value} />
                  </View>
                  <View style={styles.textBlock}>
                    <Text style={[styles.value, { color: theme.value }]}>{grade}</Text>
                    <Text style={[styles.label, { color: theme.label }]}>OVERALL GRADE</Text>
                  </View>
                </View>
              </View>

              {/* RIGHT: avatar */}
              <View style={styles.right}>
                <View style={[styles.avatarWrap, { borderColor: theme.edge }]}>
                  <Image
                    source={{ uri: avatarUrl }}
                    resizeMode="cover"
                    style={styles.avatar}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 18,
    marginTop: 16,
  },
  card: {
    borderRadius: 24,
    borderWidth: 2,
    overflow: "hidden",

    // depth
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  reflection: {
    position: "absolute",
    top: -10,
    left: -30,
    right: -30,
    height: 90,
    transform: [{ rotate: "-11deg" }],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  left: {
    flex: 1.2,
    gap: 10,
  },
  right: {
    flex: 0.9,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 11,
    fontWeight: "400",
    letterSpacing: 1.3,
    opacity: 0.9,
  },
  lozenge: {
    paddingVertical: 4,
  },
  lozengeText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  divider: {
    height: 1.5,
    width: "100%",
    borderRadius: 1,
  },
  avatarWrap: {
    width: 112,
    height: 112,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.1)",

    // subtle inner glow frame
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
});
