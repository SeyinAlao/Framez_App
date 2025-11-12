import React, { useState, useEffect } from 'react';
// ✅ NEW IMPORT
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // <-- Import from the new library
import { db, auth } from '../firebase/config';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import PostCard, { Post } from '../components/PostCard'; 

type ViewMode = 'grid' | 'feed';
const GridItem: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <View style={styles.gridItem}>
      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={styles.gridImage} />
      ) : (
        <View style={styles.gridTextContainer}>
          <Text style={styles.gridText} numberOfLines={5}>
            {post.content}
          </Text>
        </View>
      )}
    </View>
  );
};
interface ProfileHeaderProps {
  postCount: number;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ postCount, viewMode, setViewMode }) => {
  const currentUser = auth.currentUser;

  if (!currentUser) return null;
  const initials = (currentUser.displayName || 'NN')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.userInfoContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.userNameContainer}>
          <Text style={styles.userName}>{currentUser.displayName}</Text>
          <Text style={styles.userEmail}>{currentUser.email}</Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>{postCount}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>0</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>0</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'grid' && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode('grid')}
        >
          <Ionicons 
            name="grid" 
            size={22} 
            color={viewMode === 'grid' ? '#FF5C58' : '#888'} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'feed' && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode('feed')}
        >
          <Ionicons 
            name="list" 
            size={24} 
            color={viewMode === 'feed' ? '#FF5C58' : '#888'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ProfileScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid'); 
  
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const postsQuery = query(
      collection(db, 'posts'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      (querySnapshot) => {
        const fetchedPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedPosts.push({
            id: doc.id,
            ...data,
            likes: data.likes || [],
            comments: data.comments || 0,
          } as Post);
        });
        setPosts(fetchedPosts);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching user posts: ", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return (
      <View style={[styles.safeArea, styles.centerScreen]}>
        <ActivityIndicator size="large" color="#FF5C58" />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerScreen]}>
        <Text style={styles.emptyText}>Please log in to see your profile.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={posts}
        key={viewMode}
        numColumns={viewMode === 'grid' ? 3 : 1}
        
        ListHeaderComponent={
          <ProfileHeader 
            postCount={posts.length}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        }
        
        renderItem={({ item }) => {
          if (viewMode === 'grid') {
            return <GridItem post={item} />;
          }
          return (
            <PostCard
              post={item}
              currentUserId={currentUser.uid}
            />
          );
        }}
        
        keyExtractor={(item) => item.id}
        
        ListEmptyComponent={
          <View style={styles.centerScreen}>
            <Text style={styles.emptyText}>You haven't posted anything yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

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
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
  headerContainer: {
    backgroundColor: '#000',
    paddingBottom: 0,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF5C58',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userNameContainer: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#888',
    fontSize: 16,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  toggleButtonActive: {
    borderBottomColor: '#FF5C58', 
    borderBottomWidth: 2,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
    backgroundColor: '#111',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  gridText: {
    color: '#888',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default ProfileScreen;