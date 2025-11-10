// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites_list';

// Tipe data untuk item (pastikan sama dengan di layar detail)
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const saveFavorite = async (itemToAdd: Post) => {
  try {
    const existingFavorites = await getFavorites();
    const isAlreadyFavorite = existingFavorites.find(item => item.id === itemToAdd.id);
    if (!isAlreadyFavorite) {
      const newFavorites = [...existingFavorites, itemToAdd];
      const jsonValue = JSON.stringify(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, jsonValue);
      console.log('Item berhasil disimpan:', jsonValue); // (Untuk Tangkapan Layar Tugas #17)
    } else {
      console.log('Item sudah ada di favorit');
    }
  } catch (e) {
    console.error('Gagal menyimpan favorit', e);
  }
};

export const getFavorites = async (): Promise<Post[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Gagal mengambil favorit', e);
    return [];
  }
};