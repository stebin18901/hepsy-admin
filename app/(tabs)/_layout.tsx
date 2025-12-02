import React from "react";
import { Tabs, usePathname } from "expo-router";
import {
  Home,
  BarChart3,
  Users,
  ShoppingBag,
  User,
  School,
} from "lucide-react-native";

export default function TabsLayout() {
  const pathname = usePathname();

  // ✅ Hide the tab bar on nested routes (anything beyond main pages)
  const isMainRoute = [
    "/home",
    "/student",
    "/social",
    "/market",
    "/profile",
  ].includes(pathname);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1e88e5",
        tabBarInactiveTintColor: "#555",
        headerShown: false,
        // 👇 Hide navbar if not on main route
        tabBarStyle: isMainRoute ? {} : { display: "none" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="student"
        options={{
          title: "Student",
          tabBarIcon: ({ color, size }) => (
            <School color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="social"
        options={{
          title: "Social",
          tabBarIcon: ({ color, size }) => (
            <Users color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="market"
        options={{
          title: "Market",
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
