import React from "react";
import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#1565C0" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
        presentation: "card",
      }}
    />
  );
}
