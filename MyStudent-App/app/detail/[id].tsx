import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getFavorites, saveFavorite } from '../../services/storage';
import { CourseNote } from '../../types/note';

export default function DetailScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [itemData, setItemData] = useState<CourseNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const courseCode = Array.isArray(params.courseCode) ? params.courseCode[0] : params.courseCode;
  const instructor = Array.isArray(params.instructor) ? params.instructor[0] : params.instructor;
  const weekLabel = Array.isArray(params.weekLabel) ? params.weekLabel[0] : params.weekLabel;
  const focusArea = Array.isArray(params.focusArea) ? params.focusArea[0] : params.focusArea;

  useEffect(() => {
    if (id) {
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then(response => response.json())
        .then(json => {
          const enriched: CourseNote = {
            ...json,
            courseCode: courseCode || json.courseCode,
            instructor: instructor || json.instructor,
            weekLabel: weekLabel || json.weekLabel,
            focusArea: focusArea || json.focusArea,
          };
          setItemData(enriched);
        })
        .catch(error => {
          console.error('Error fetching detail:', error);
          Alert.alert('Something went wrong', 'We could not load this article. Please try again later.');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    const watchFavorites = async () => {
      const stored = await getFavorites();
      if (id) {
        setIsFavorite(stored.some(note => note.id === Number(id)));
      }
    };
    watchFavorites();
  }, [id]);

  const handleAddToFavorites = async () => {
    if (!itemData || isFavorite) {
      return;
    }
    try {
      setSaving(true);
      await saveFavorite({
        ...itemData,
        courseCode,
        instructor,
        weekLabel,
        focusArea,
      });
      setIsFavorite(true);
      Alert.alert('Saved', `"${itemData.title}" has been added to your favorites.`);
      console.log('Saved to favorites:', itemData.title);
    } catch (error) {
      Alert.alert('Could not save', 'Please try saving this article again.');
      console.error('Error saving favorite:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading detailed view…</Text>
      </View>
    );
  }

  if (!itemData) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#999" />
        <Text style={styles.errorText}>We couldn’t find that article</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        {courseCode ? (
          <View style={styles.idBadge}>
            <MaterialIcons name="class" size={16} color="#007AFF" />
            <Text style={styles.idText}>{courseCode}</Text>
          </View>
        ) : null}
        {weekLabel ? (
          <View style={styles.weekBadge}>
            <MaterialIcons name="event-note" size={16} color="#007AFF" />
            <Text style={styles.idText}>{weekLabel}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.titleContainer}>
        <MaterialIcons name="article" size={28} color="#007AFF" style={styles.titleIcon} />
        <Text style={styles.title}>{itemData.title}</Text>
      </View>

      {instructor || focusArea ? (
        <View style={styles.metaRow}>
          {instructor ? (
            <View style={styles.metaPill}>
              <MaterialIcons name="person" size={16} color="#4b5563" />
              <Text style={styles.metaPillText}>Lecturer: {instructor}</Text>
            </View>
          ) : null}
          {focusArea ? (
            <View style={styles.metaPill}>
              <MaterialIcons name="local-library" size={16} color="#4b5563" />
              <Text style={styles.metaPillText}>{focusArea}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.divider} />

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionLabel}>Summary</Text>
        <Text style={styles.description}>{itemData.body}</Text>
      </View>

      <TouchableOpacity 
        style={[styles.favoriteButton, isFavorite && styles.favoriteButtonDisabled]}
        onPress={handleAddToFavorites}
        activeOpacity={0.8}
        disabled={isFavorite || saving}
      >
        <MaterialIcons
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={20}
          color="#fff"
        />
        <Text style={styles.favoriteButtonText}>
          {isFavorite ? 'Saved to Favorites' : saving ? 'Saving…' : 'Save to Favorites'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  contentContainer: {
    padding: 20,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  idText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  weekBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  metaPillText: {
    fontSize: 13,
    color: '#111827',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  titleIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  title: { 
    flex: 1,
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 32,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: { 
    fontSize: 16, 
    lineHeight: 24,
    color: '#333',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  favoriteButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
});