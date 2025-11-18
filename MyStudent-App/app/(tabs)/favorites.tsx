// app/(tabs)/favorites.tsx
import { getFavorites } from '../../services/storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CourseNote } from '../../types/note';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<CourseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const loadFavorites = async () => {
        setLoading(true);
        try {
          const favs = await getFavorites();
          setFavorites(favs);
          console.log('[favorites] loaded items:', favs.length);
        } catch (error) {
          console.error('[favorites] failed to load:', error);
        } finally {
          setLoading(false);
        }
      };
      loadFavorites();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your saved stories…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="favorite" size={24} color="#d32f2f" />
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerSubtitle}>{favorites.length} saved</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Your list is empty</Text>
          <Text style={styles.emptySubtext}>Tap the heart icon on any detail page to pin it here.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.item}
              onPress={() => router.push({
                pathname: '/detail/[id]',
                params: { id: item.id.toString() }
              })}
              activeOpacity={0.7}
            >
              <View style={styles.itemContent}>
                <View style={styles.itemIconContainer}>
                  <MaterialIcons name="favorite" size={20} color="#d32f2f" />
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemMeta}>
                    {item.courseCode || 'Course note'} · {item.weekLabel || 'Weekly note'}
                  </Text>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemPreview} numberOfLines={2}>
                    {item.body}
                  </Text>
                  <View style={styles.itemFooter}>
                    {item.focusArea ? (
                      <View style={styles.itemFooterPill}>
                        <MaterialIcons name="bookmark" size={14} color="#2563eb" />
                        <Text style={styles.itemFooterText}>{item.focusArea}</Text>
                      </View>
                    ) : null}
                    <View style={styles.itemFooterPill}>
                      <MaterialIcons name="tag" size={14} color="#666" />
                      <Text style={styles.itemFooterText}>#{item.id}</Text>
                    </View>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingVertical: 10,
  },
  item: { 
    backgroundColor: '#fff', 
    marginVertical: 6, 
    marginHorizontal: 16, 
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemMeta: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemTitle: { 
    fontSize: 16, 
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  itemFooterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  itemFooterText: {
    fontSize: 12,
    color: '#1f2937',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
