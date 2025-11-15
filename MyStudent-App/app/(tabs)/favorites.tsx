// app/(tabs)/favorites.tsx
import { getFavorites } from '@/services/storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, Button, TouchableOpacity, View } from 'react-native';


interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Post[]>([]);
  const router = useRouter();

  // useFocusEffect akan berjalan setiap kali layar ini dibuka
  useFocusEffect(
    React.useCallback(() => {
      const loadFavorites = async () => {
        const favs = await getFavorites();
        setFavorites(favs);
        console.log("Data favorit dimuat:", favs);
      };
      loadFavorites();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.item}
            onPress={() => router.push({
              pathname: '/detail/[id]',
              params: { id: item.id.toString() }
})}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Belum ada item favorit.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  item: { backgroundColor: '#f9f9f9', padding: 20, marginVertical: 8, borderRadius: 5 },
  itemTitle: { fontSize: 16 },
});
