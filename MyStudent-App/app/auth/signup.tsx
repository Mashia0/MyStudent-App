// app/(auth)/signup.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext'; // Sesuaikan path

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn } = useAuth(); // Kita panggil signIn setelah daftar

  const handleSignUp = () => {
    if (!username || !email || !password) {
      setError('Semua kolom harus diisi'); // Untuk Tugas #7
      return;
    }
    console.log('Mendaftar dengan:', username, email);
    setError('');
    // Asumsikan pendaftaran berhasil, langsung login
    signIn();
    // Pindah ke halaman utama (tabs)
    router.replace('/(tabs)/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Akun Baru</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Nama Pengguna"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Kata Sandi"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Daftar" onPress={handleSignUp} />
      <Text style={styles.link} onPress={() => router.push('/(auth)/login')}>
        Sudah punya akun? Masuk
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 5 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
  link: { color: 'blue', textAlign: 'center', marginTop: 20 },
});