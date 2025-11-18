import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseNote } from '../types/note';

const FAVORITES_KEY = '@favorites_list';

export const saveFavorite = async (itemToAdd: CourseNote) => {
  try {
    const existingFavorites = await getFavorites();
    const isAlreadyFavorite = existingFavorites.some(item => item.id === itemToAdd.id);

    if (!isAlreadyFavorite) {
      const newFavorites = [...existingFavorites, itemToAdd];
      const serialized = JSON.stringify(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, serialized);

      console.log('-------------------------------------');
      console.log('⭐ Favorite saved');
      console.log('Item ID:', itemToAdd.id);
      console.log('Title  :', itemToAdd.title);
      console.log('Total favorites:', newFavorites.length);
      console.log('Payload:', serialized);
      console.log('-------------------------------------');
    } else {
      console.log('ℹ️ Item already stored in favorites (ID:', itemToAdd.id, ')');
    }
  } catch (error) {
    console.error('Failed to persist favorite item:', error);
    throw error;
  }
};

export const getFavorites = async (): Promise<CourseNote[]> => {
  try {
    const serialized = await AsyncStorage.getItem(FAVORITES_KEY);
    return serialized ? JSON.parse(serialized) : [];
  } catch (error) {
    console.error('Failed to read favorites from storage:', error);
    return [];
  }
};
