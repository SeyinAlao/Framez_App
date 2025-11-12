// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
// ✅ NEW IMPORT
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // <-- Import from the new library
import { db, auth } from '../firebase/config'; // Your Firebase config
import {
  collection,
  query,
  onSnapshot, // This is the real-time listener!
  orderBy,
  // Timestamp is no longer needed here
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';

// -----------------------------------------------------------------
// 1. IMPORT YOUR NEW POSTCARD AND POST INTERFACE
// -----------------------------------------------------------------
import PostCard, { Post } from '../components/PostCard'; // <-- IMPORTING

const HomeScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const netInfo = useNetInfo(); // Hook to get connection status

  const currentUserId = auth.currentUser?.uid;

  // This useEffect sets up the REAL-TIME listener
  useEffect(() => {
    // Define the query to fetch posts, ordered by newest first
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

    // onSnapshot is the real-time listener.
    const unsubscribe = onSnapshot(
      postsQuery,
      (querySnapshot) => {
        const fetchedPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedPosts.push({
        id: doc.id,
        ...data,
        likes: data.likes || [], // <-- This ensures 'likes' is always an array
        comments: data.comments || 0, // <-- Good to add this for comments too
        } as Post);
      });
        
        setPosts(fetchedPosts); // Update our state with the new posts
        setLoading(false);
      },
      (err) => {
        // Handle any errors
        console.error("Error fetching posts: ", err);
        setError("Failed to load posts. Please try again.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []); // The empty array [] means this runs ONCE when the component mounts

  // --- Render Functions for different states ---

  if (loading) {
    return (
      <View style={[styles.safeArea, styles.centerScreen]}>
        <ActivityIndicator size="large" color="#FF5C58" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.safeArea, styles.centerScreen]}>
        <Ionicons name="alert-circle-outline" size={60} color="red" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header: Title and Online/Offline Status */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <View style={styles.statusIndicator}>
          <Ionicons 
            name="wifi-outline"
            size={16} 
            color={netInfo.isConnected ? '#4CAF50' : '#888'} 
          />
          <Text style={[
            styles.statusText, 
            { color: netInfo.isConnected ? '#4CAF50' : '#888' }
          ]}>
            {netInfo.isConnected ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* The main list of posts */}
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          // --- 4. USE YOUR NEW POSTCARD COMPONENT ---
          <PostCard
            post={item}
            currentUserId={currentUserId}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        // This component shows when the list is empty
        ListEmptyComponent={
          <View style={[styles.centerScreen, styles.emptyListContainer]}>
            <Text style={styles.emptyText}>No posts yet.</Text>
            <Text style={styles.emptySubText}>Be the first to post!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// -----------------------------------------------------------------
// 4. STYLESHEET (The PostCard styles are now gone)
// -----------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyListContainer: { // Added this to make sure empty message isn't full-screen
    flex: 0,
    height: 300, 
  },
  loadingText: {
    marginTop: 10,
    color: '#888',
  },
  errorText: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
  },
  emptySubText: {
    color: '#888',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default HomeScreen;