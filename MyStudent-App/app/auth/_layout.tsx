// app/(auth)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

// Ini adalah layout untuk grup (auth)
export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Masuk' }} />
      <Stack.Screen name="signup" options={{ title: 'Daftar' }} />
    </Stack>
  );
}