// app/(tabs)/settings.tsx
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Button, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../../context/AuthContext'; // Sesuaikan path
import { useRouter } from 'expo-router';

// Fungsi untuk memicu notifikasi tes
async function scheduleTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Tes Notifikasi 🔔",
      body: 'Ini adalah notifikasi pengujian yang berhasil!',
    },
    trigger: { seconds: 2 }, // Tampilkan dalam 2 detik
  });
  console.log('Notifikasi tes dijadwalkan');
  Alert.alert('Notifikasi Terjadwal', 'Anda akan melihat notifikasi dalam 2 detik.');
}

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pengaturan</Text>

      {/* Item untuk Konfigurasi Notifikasi (Tugas #27) */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Aktifkan Notifikasi</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={() => setNotificationsEnabled(prev => !prev)}
          value={notificationsEnabled}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Mode Gelap</Text>
        <Switch
          onValueChange={() => setDarkModeEnabled(prev => !prev)}
          value={darkModeEnabled}
        />
      </View>

      {/* Tombol Tes Notifikasi (Tugas #27) */}
      <View style={styles.buttonContainer}>
        <Button 
          title="Kirim Tes Notifikasi" 
          onPress={scheduleTestNotification} 
        />
      </View>

      {/* Tombol Logout */}
      <View style={styles.buttonContainer}>
        <Button 
          title="Keluar (Sign Out)" 
          onPress={handleSignOut}
          color="red"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  settingText: { fontSize: 18 },
  buttonContainer: {
    marginTop: 30,
  }
});