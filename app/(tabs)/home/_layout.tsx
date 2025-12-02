import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#0d47a1",
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="notifications/details"
        options={{ title: "Notification Details" }}
      />
    </Stack>
  );
}
