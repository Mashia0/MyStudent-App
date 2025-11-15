// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons'; // Gunakan ikon bawaan
import { Colors } from '@/constants/theme'; // Gunakan Colors dari proyek Anda
import { useColorScheme } from '@/hooks/use-color-scheme'; // Gunakan hook dari proyek Anda

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
      }}>
      {/* Layar Beranda (Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
        }}
      />
      
      {/* Layar Favorit (Tugas #18) */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          headerShown: true, // Tampilkan header untuk layar ini
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="favorite" color={color} />,
        }}
      />

      {/* Layar Pengaturan (Tugas #21) */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="settings" color={color} />,
        }}
      />

      {/* Hapus atau beri komentar pada layar 'explore' jika tidak diperlukan */}
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      /> */}
    </Tabs>
  );
}