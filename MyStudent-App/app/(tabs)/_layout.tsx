// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      {/* Layar Beranda (Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          headerShown: true,
          headerTitle: 'Favorit Saya',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="favorite" color={color} />,
        }}
      />

      {/* Layar Pengaturan (Tugas #21) */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: true,
          headerTitle: 'Pengaturan',
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 16 }}>
              <MaterialIcons name="notifications" size={24} color={Colors[colorScheme].tint} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="settings" color={color} />,
        }}
      />

    </Tabs>
  );
}