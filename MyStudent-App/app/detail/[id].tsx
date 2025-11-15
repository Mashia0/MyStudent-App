import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';
import { saveFavorite } from '../../services/storage'; // Kita akan buat ini

// Tipe data untuk item
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export default function DetailScreen() {
 // BENAR
const params = useLocalSearchParams();
const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [itemData, setItemData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Ambil data spesifik untuk ID ini
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then(response => response.json())
        .then(json => setItemData(json))
        .catch(error => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddToFavorites = async () => {
    if (itemData) {
      // (Tugas #16) Panggil fungsi penyimpanan
      await saveFavorite(itemData);
      Alert.alert('Sukses', `${itemData.title} disimpan ke favorit!`);
      console.log('Menambahkan ke favorit:', itemData.title);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (!itemData) {
    return <View style={styles.container}><Text>Item tidak ditemukan.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{itemData.title}</Text>
      <Text style={styles.description}>{itemData.body}</Text>
      <Button title="Tambahkan ke Favorit" onPress={handleAddToFavorites} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 24 },
});