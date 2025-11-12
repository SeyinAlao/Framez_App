// src/components/PostCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { formatDistanceToNow } from 'date-fns';

// 1. DATA TYPES (Unchanged)
export interface Post {
  id: string;
  userId: string;
  userDisplayName: string;
  content: string;
  imageUrl?: string;
  createdAt: Timestamp;
  likes: string[];
  comments: number;
}

interface PostCardProps {
  post: Post;
  currentUserId?: string;
}

// 2. CREATE THE POSTCARD COMPONENT
const PostCard: React.FC<PostCardProps> = ({ post, currentUserId }) => {
  const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;

  const timeAgo = post.createdAt
    ? formatDistanceToNow(post.createdAt.toDate()) + ' ago'
    : 'just now';
  const handleLike = async () => {
    if (!currentUserId) {
      Alert.alert("Login required", "You must be logged in to like a post.");
      return;
    }
    
    const postRef = doc(db, 'posts', post.id);

    try {
      if (isLiked) {
        // User has already liked, so UNLIKE
        await updateDoc(postRef, {
          likes: arrayRemove(currentUserId)
        });
      } else {
        // User has not liked, so LIKE
        await updateDoc(postRef, {
          likes: arrayUnion(currentUserId)
        });
      }
    } catch (error) {
      console.error("Error updating like: ", error);
      Alert.alert("Error", "Could not update like. Please try again.");
    }
  };
  const handleDelete = async () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              // This deletes the post document from Firestore
              const postRef = doc(db, 'posts', post.id);
              await deleteDoc(postRef);
              
            } catch (error) {
              console.error("Error deleting post: ", error);
              Alert.alert("Error", "Could not delete post.");
            }
          }
        }
      ]
    );
  };

  const handleComment = () => {
    Alert.alert('Navigate to Comments', 'This will open a new screen soon!');
  };


  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        {/* This new View groups the avatar and text together */}
        <View style={styles.headerLeft}>
          <Ionicons name="person-circle-outline" size={32} color="#888" style={styles.avatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.postAuthorName}>{post.userDisplayName}</Text>
            <Text style={styles.postTimestamp}>{timeAgo}</Text>
          </View>
        </View>
        
        {/* The delete button is now a direct sibling and won't be overlapped */}
        {currentUserId === post.userId && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={22} color="#888" />
          </TouchableOpacity>
        )}
      </View>
      {/* --- END OF LAYOUT FIX --- */}


      {/* Post Content */}
      {post.content ? <Text style={styles.postContent}>{post.content}</Text> : null}

      {/* Post Image */}
      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      ) : null}

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart'}
            size={24}
            color={isLiked ? '#FF5C58' : '#fff'}
          />
          <Text style={styles.actionText}>{post.likes.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleComment} style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 3. STYLESHEET
const styles = StyleSheet.create({
  postCard: {
    backgroundColor: '#111',
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between', 
  },
  headerLeft: { 
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
  },
  deleteButton: {
    padding: 4,
  },
  avatar: {
    marginRight: 8,
  },
  postAuthorName: {
    color: '#fff',
    fontWeight: '600',
  },
  postTimestamp: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  postContent: {
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    lineHeight: 22,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#050505',
  },
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default PostCard;