import * as Notifications from 'expo-notifications';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

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
    alert('We were unable to enable push notifications. You can update this in system settings anytime.');
  }
}

const InitialLayout = () => {
  const { userToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const prepareApp = async () => {
      try {
        // siapkan resource lain jika diperlukan
      } catch (error) {
        console.warn(error);
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  useEffect(() => {
    if (!appReady) {
      return;
    }

    const firstSegment = segments[0] as string | undefined;
    const inAuthGroup =
      firstSegment === 'login' || firstSegment === 'signup' || firstSegment === '(auth)';
    const inProtectedGroup =
      firstSegment === '(tabs)' ||
      firstSegment === 'explore' ||
      firstSegment === 'favorites' ||
      firstSegment === 'settings' ||
      firstSegment === 'detail';

    if (userToken && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!userToken && inProtectedGroup) {
      router.replace('/(auth)/login');
    }
  }, [userToken, segments, router, appReady]);

  if (!appReady) {
    return null;
  }

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
