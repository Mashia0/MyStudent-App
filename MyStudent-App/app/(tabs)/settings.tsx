// app/(tabs)/settings.tsx
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

interface MenuItem {
  id: string;
  label: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  badge?: string;
}

async function scheduleTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tes Notifikasi 🔔',
      body: 'Ini adalah notifikasi pengujian yang berhasil!',
    },
    trigger: null,
  });
  Alert.alert('Notifikasi Terjadwal', 'Notifikasi berhasil dikirim!');
}

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        id: 'profile',
        label: 'Profil Saya',
        subtitle: 'Kelola data akun dan kata sandi',
        icon: 'person',
      },
      {
        id: 'privacy',
        label: 'Privasi & Keamanan',
        subtitle: 'Atur verifikasi dua langkah',
        icon: 'lock',
      },
      {
        id: 'language',
        label: 'Bahasa Aplikasi',
        subtitle: 'Indonesia (Default)',
        icon: 'language',
      },
      {
        id: 'help',
        label: 'Pusat Bantuan',
        subtitle: 'FAQ dan kontak dukungan',
        icon: 'help-outline',
        badge: 'Baru',
      },
    ],
    [],
  );

  const handleToggleNotification = async () => {
    if (!notificationsEnabled) {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Izin Dibutuhkan',
          'Aktifkan izin notifikasi pada pengaturan perangkat Anda.',
        );
        return;
      }
    }

    setNotificationsEnabled((prev) => !prev);
  };

  const handleSignOut = () => {
    signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.greeting}>Halo, Student!</Text>
          <Text style={styles.greetingSubtitle}>Kelola preferensi aplikasi kamu</Text>
        </View>
        <MaterialIcons name="account-circle" size={48} color="#4c6ef5" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Menu Pengaturan</Text>
        <Text style={styles.sectionSubtitle}>Pilih menu untuk menyesuaikan aplikasi</Text>
      </View>

      {menuItems.map((item) => (
        <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.75}>
          <View style={styles.menuIcon}>
            <MaterialIcons name={item.icon} size={22} color="#4c6ef5" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          </View>
          {item.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          ) : null}
          <MaterialIcons name="chevron-right" size={24} color="#c1c7d0" />
        </TouchableOpacity>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Notifikasi</Text>
        <Text style={styles.sectionSubtitle}>
          Atur preferensi pemberitahuan dan lakukan tes notifikasi
        </Text>
      </View>

      <View style={styles.settingItem}>
        <View>
          <Text style={styles.settingText}>Aktifkan Notifikasi</Text>
          <Text style={styles.settingDescription}>Izinkan aplikasi mengirim pemberitahuan</Text>
        </View>
        <Switch
          trackColor={{ false: '#d7dce5', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#4c6ef5' : '#f4f3f4'}
          onValueChange={handleToggleNotification}
          value={notificationsEnabled}
        />
      </View>

      <View style={styles.settingItem}>
        <View>
          <Text style={styles.settingText}>Mode Gelap</Text>
          <Text style={styles.settingDescription}>Sesuaikan tampilan dengan cahaya rendah</Text>
        </View>
        <Switch
          trackColor={{ false: '#d7dce5', true: '#81b0ff' }}
          thumbColor={darkModeEnabled ? '#4c6ef5' : '#f4f3f4'}
          onValueChange={() => setDarkModeEnabled((prev) => !prev)}
          value={darkModeEnabled}
        />
      </View>

      <TouchableOpacity
        style={styles.notificationButton}
        onPress={scheduleTestNotification}
        activeOpacity={0.85}
      >
        <MaterialIcons name="notifications-active" size={20} color="#fff" />
        <Text style={styles.notificationButtonText}>Kirim Tes Notifikasi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dangerButton} onPress={handleSignOut} activeOpacity={0.85}>
        <MaterialIcons name="logout" size={20} color="#fff" />
        <Text style={styles.dangerButtonText}>Keluar dari Akun</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f8',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c1f2e',
  },
  greetingSubtitle: {
    marginTop: 4,
    color: '#6b7280',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1f2e',
  },
  sectionSubtitle: {
    color: '#6b7280',
    marginTop: 4,
    fontSize: 13,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9edff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1f2e',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#ff7a45',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1f2e',
  },
  settingDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  notificationButton: {
    backgroundColor: '#4c6ef5',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  notificationButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  dangerButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});