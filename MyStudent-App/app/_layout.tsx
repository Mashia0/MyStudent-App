// app/_layout.tsx
import React, { useEffect, useState } from 'react'; // <-- Impor useState
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as Notifications from 'expo-notifications';
import { SplashScreen } from 'expo-router'; // <-- Impor SplashScreen

// Mencegah splash screen tersembunyi otomatis
SplashScreen.preventAutoHideAsync(); // <-- Tambahkan ini


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: false, 
    shouldShowList: false,   
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
  
  // State untuk melacak apakah aplikasi siap
  const [appReady, setAppReady] = useState(false); // <-- Tambahkan state ini

  useEffect(() => {
    // Minta izin notifikasi
    registerForPushNotificationsAsync();

    async function prepareApp() {
      try {
        // Lakukan tugas async apa pun di sini (misal: memuat font, data)
        // Karena kita tidak menunggu apa-apa, kita bisa langsung lanjut
      } catch (e) {
        console.warn(e);
      } finally {
        // Tandai aplikasi sebagai siap dan sembunyikan splash screen
        setAppReady(true); // <-- Atur aplikasi sebagai siap
        SplashScreen.hideAsync(); // <-- Sembunyikan splash screen
      }
    }

    prepareApp();
  }, []); // <-- Efek ini hanya berjalan sekali

  useEffect(() => {
    // Navigasi HANYA JIKA aplikasi sudah siap
    if (!appReady) {
      return; // <-- Jangan lakukan apa-apa jika app belum siap
    }

    const inAuthGroup = segments[0] === 'auth';

    if (userToken && inAuthGroup) {
      
      router.replace('/(tabs)/index');
    } else if (!userToken && !inAuthGroup) {
      // Pengguna belum login dan tidak di grup auth, arahkan ke login
      router.replace('/auth/login'); 
    }
  }, [userToken, segments, router, appReady]);

  // Jangan render apapun sampai aplikasi siap, ini mencegah error
  if (!appReady) {
    return null;
  }

  // Setelah siap, render navigator
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="tabs" />
      <Stack.Screen name="detail/id" options={{ headerShown: true, title: 'Detail' }} />
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