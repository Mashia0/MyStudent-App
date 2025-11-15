// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';

// Tipe data untuk item
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Komponen Header (Tugas #12)
const HomeHeader = () => (
  <View style={styles.header}>
    <Image 
      source={{ uri: 'https://via.placeholder.com/150x50.png?text=LOGO' }} // Ganti dengan URL logo Anda
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

export default function HomeScreen() {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // (Tugas #19) Ambil data dari API
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.item}
      // (Tugas #14) Navigasi ke detail dengan [id]
      onPress={() => router.push({
        pathname: "/detail/[id]",
        params: { id: item.id.toString() } 
})}
    >
      <Text style={styles.itemTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HomeHeader /> 
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
}

// Pastikan hanya ada SATU 'const styles'
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    backgroundColor: '#f8f8f8', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd',
    // Tambahkan padding atas untuk menghindari status bar
    paddingTop: 50, 
    height: 90,
  },
  logo: { width: 120, height: 40 },
  item: { backgroundColor: '#f9f9f9', padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 5 },
  itemTitle: { fontSize: 16 },
});