const fs = require("fs");
const path = require("path");

const homePath = path.join("app", "(tabs)", "home");
const subPages = [
  "notifications",
  "assignments",
  "schedule",
  "messages",
  "reports",
  "classes",
  "settings",
];
const componentFiles = [
  "NotificationCard.tsx",
  "QuickActions.tsx",
  "SectionHeading.tsx",
];

// ensure folder creation
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// make home + components folder
ensureDir(homePath);
ensureDir(path.join(homePath, "components"));

// generate sub pages
subPages.forEach((p) => {
  const dir = path.join(homePath, p);
  ensureDir(dir);
  const filePath = path.join(dir, "index.tsx");
  const content = `
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ${p.charAt(0).toUpperCase() + p.slice(1)}Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>${p.charAt(0).toUpperCase() + p.slice(1)} Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  text: { fontSize: 20, fontWeight: "600", color: "#333" },
});
`;
  fs.writeFileSync(filePath, content.trim());
});

// create Notification Details inside notifications/
const notifDetailsDir = path.join(homePath, "notifications");
const notifDetailsPath = path.join(notifDetailsDir, "details.tsx");
const notifDetailsContent = `
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function NotificationDetails() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Details</Text>
      <Text style={styles.subtitle}>This is a dummy details page for notifications.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fafafa" },
  title: { fontSize: 22, fontWeight: "700", color: "#1e88e5", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#555", textAlign: "center", width: "80%" },
});
`;
fs.writeFileSync(notifDetailsPath, notifDetailsContent.trim());

// component templates
componentFiles.forEach((file) => {
  const filePath = path.join(homePath, "components", file);
  let content = "";

  if (file === "NotificationCard.tsx") {
    content = `
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function NotificationCard() {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push("/(tabs)/home/notifications/details")}>
      <Text style={styles.title}>New Notification</Text>
      <Text style={styles.subtitle}>Tap to view details</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 14, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
  title: { fontSize: 16, fontWeight: "700", color: "#1e88e5" },
  subtitle: { fontSize: 13, color: "#555", marginTop: 4 },
});
    `;
  } else if (file === "QuickActions.tsx") {
    content = `
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const actions = [
  { title: "Assignments", path: "/(tabs)/home/assignments" },
  { title: "Schedule", path: "/(tabs)/home/schedule" },
  { title: "Messages", path: "/(tabs)/home/messages" },
  { title: "Reports", path: "/(tabs)/home/reports" },
  { title: "Classes", path: "/(tabs)/home/classes" },
  { title: "Settings", path: "/(tabs)/home/settings" },
];

export default function QuickActions() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {actions.map((a, i) => (
        <TouchableOpacity key={i} style={styles.action} onPress={() => router.push(a.path)}>
          <Text style={styles.text}>{a.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 12 },
  action: { width: "48%", backgroundColor: "#e3f2fd", paddingVertical: 14, borderRadius: 10, marginBottom: 12, alignItems: "center" },
  text: { fontSize: 15, color: "#1e88e5", fontWeight: "600" },
});
    `;
  } else if (file === "SectionHeading.tsx") {
    content = `
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
    `;
  }

  fs.writeFileSync(filePath, content.trim());
});

// create _layout.tsx (navigation handler)
const layoutContent = `
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="notifications/details" options={{ title: "Notification Details" }} />
    </Stack>
  );
}
`;
fs.writeFileSync(path.join(homePath, "_layout.tsx"), layoutContent.trim());

// main index file
const mainFile = `
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import QuickActions from "./components/QuickActions";
import NotificationCard from "./components/NotificationCard";
import SectionHeading from "./components/SectionHeading";

export default function Home() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SectionHeading title="Quick Access" subtitle="Navigate easily" />
      <QuickActions />
      <SectionHeading title="Notifications" subtitle="Stay updated" />
      <NotificationCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa", padding: 16 },
});
`;
fs.writeFileSync(path.join(homePath, "index.tsx"), mainFile.trim());

console.log("✅ Home setup created successfully with layout & navigation!");
