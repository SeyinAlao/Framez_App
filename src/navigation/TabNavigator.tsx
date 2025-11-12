// src/navigation/TabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import CreateScreen from "../screens/CreateScreen";
import ProfileScreen from "../screens/ProfileScreen";
import  LogoutScreen  from "../screens/LogoutScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="add-circle-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="log-out-outline" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
