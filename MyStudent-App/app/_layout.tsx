// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as Notifications from 'expo-notifications'; // Untuk Izin Notifikasi (Tugas 26)

// Konfigurasi Notifikasi (Tugas 26)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Gagal mendapatkan izin notifikasi!');
    return;
  }
}

const InitialLayout = () => {
  const { userToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Minta izin notifikasi saat aplikasi dimuat
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (userToken && inAuthGroup) {
      // Pengguna sudah login tapi masih di grup auth, arahkan ke home
      router.replace('/(tabs)/');
    } else if (!userToken && !inAuthGroup) {
      // Pengguna belum login dan tidak di grup auth, arahkan ke login
      router.replace('/(auth)/login');
    }
  }, [userToken, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="detail/[id]" options={{ headerShown: true, title: 'Detail' }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}