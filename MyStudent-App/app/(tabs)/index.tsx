// app/(tabs)/index.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CourseNote } from '../../types/note';

const sampleMetadata = [
  {
    courseCode: 'PHY 210',
    instructor: 'Dr. Amelia Brooks',
    weekLabel: 'Week 05 ‧ Quantum Models',
    focusArea: 'Key formulas & derivations',
  },
  {
    courseCode: 'ECO 102',
    instructor: 'Prof. Daniel Rivera',
    weekLabel: 'Week 03 ‧ Market Dynamics',
    focusArea: 'Case study breakdown',
  },
  {
    courseCode: 'HIS 140',
    instructor: 'Dr. Sophie Laurent',
    weekLabel: 'Seminar Prep ‧ Cultural Shifts',
    focusArea: 'Discussion prompts',
  },
  {
    courseCode: 'BIO 221',
    instructor: 'Dr. Isaac Pereira',
    weekLabel: 'Lab Notes ‧ Cell Respiration',
    focusArea: 'Experiment recap',
  },
  {
    courseCode: 'PSY 115',
    instructor: 'Dr. Maya Thornton',
    weekLabel: 'Lecture 07 ‧ Cognitive Biases',
    focusArea: 'Exam pointers',
  },
  {
    courseCode: 'CS 301',
    instructor: 'Prof. Leonard Silva',
    weekLabel: 'Sprint Review ‧ Algorithms',
    focusArea: 'Whiteboard summary',
  },
] as const;

const HomeHeader = () => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      <Image 
        source={require('../../assets/images/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View>
        <Text style={styles.headerTitle}>MyStudent App</Text>
        <Text style={styles.headerSubtitle}>Fresh insights and curated study notes</Text>
      </View>
    </View>
  </View>
);

export default function HomeScreen() {
  const [data, setData] = useState<CourseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching posts from API...');
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        const curated = json.map((item: CourseNote, index: number) => {
          const meta = sampleMetadata[index];
          if (!meta) {
            return item;
          }
          return {
            ...item,
            ...meta,
          };
        });
        setData(curated);
        console.log('✅ API loaded successfully:', json.length, 'items');
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }: { item: CourseNote }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => router.push({
        pathname: "/detail/[id]",
        params: { 
          id: item.id.toString(),
          courseCode: item.courseCode,
          instructor: item.instructor,
          weekLabel: item.weekLabel,
          focusArea: item.focusArea,
        } 
      })}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <MaterialIcons name="menu-book" size={24} color="#2563eb" style={styles.itemIcon} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemMeta}>
            {item.courseCode || 'Course note'} · {item.weekLabel || 'Weekly note'}
          </Text>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {item.instructor ? (
            <Text style={styles.itemInstructor}>{item.instructor}</Text>
          ) : null}
          <Text style={styles.itemPreview} numberOfLines={2}>
            {item.body}
          </Text>
          {item.focusArea ? (
            <View style={styles.itemBadge}>
              <MaterialIcons name="bookmark" size={14} color="#2563eb" />
              <Text style={styles.itemBadgeText}>{item.focusArea}</Text>
            </View>
          ) : null}
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HomeHeader /> 
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading personalized articles…</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>Today’s highlight</Text>
              <Text style={styles.heroTitle}>Discover ideas that keep you motivated</Text>
              <Text style={styles.heroSubtitle}>
                Tap on any article to open a detailed summary with actionable insights.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="rss-feed" size={40} color="#9ca3af" />
              <Text style={styles.emptyTitle}>Content is taking a short break</Text>
              <Text style={styles.emptySubtitle}>
                Pull to refresh or try again in a few moments.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f4f5fb' 
  },
  header: { 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e0e0e0',
    paddingTop: 50,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: { 
    width: 40, 
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  listContent: {
    paddingVertical: 10,
    paddingBottom: 20,
  },
  heroCard: {
    backgroundColor: '#111827',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    padding: 18,
  },
  heroLabel: {
    color: '#a5b4fc',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#d1d5db',
    lineHeight: 20,
    fontSize: 14,
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
  itemIcon: {
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
  itemInstructor: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 6,
  },
  itemPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  itemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  itemBadgeText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});