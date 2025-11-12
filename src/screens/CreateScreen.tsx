// src/screens/CreateScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../firebase/config'; 
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
const CLOUDINARY_CLOUD_NAME = 'df9r7glzw';
const CLOUDINARY_UPLOAD_PRESET = 'framez_uploads';

const CreateScreen = () => {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need to access your camera roll to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9, 
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        Alert.alert('Error', 'Image must be less than 5MB');
        return;
      }
      setImageUri(asset.uri);
    }
  };
  const handleRemoveImage = () => {
    setImageUri(null);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageUri) {
      Alert.alert('Error', 'Please add some content or an image');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to post.');
      return;
    }
    
    setIsUploading(true);

    try {
      let imageUrl: string | null = null;
      if (imageUri) {
        imageUrl = await uploadImageToCloudinary(imageUri);
      }
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        userEmail: user.email, 
        userDisplayName: user.displayName || user.email, 
        content: content.trim(),
        imageUrl: imageUrl, 
        createdAt: serverTimestamp(),
        likes: [], 
        comments: 0, 
      });
      Alert.alert('Success!', 'Your post has been created.');
      setContent('');
      handleRemoveImage();
      
    } catch (error: any) {
      console.error('Error creating post:', error);
      Alert.alert('Error', error.message || 'Failed to create post. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const uploadImageToCloudinary = async (uri: string): Promise<string> => {
    const formData = new FormData();
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    if (Platform.OS === 'web') {

      if (uri.startsWith('blob:')) {
        const response = await fetch(uri);
        const blobData = await response.blob();
        
        const file = new File([blobData], 'user_image.jpg', { type: blobData.type });
        
        formData.append('file', file);
      } else {
        formData.append('file', uri);
      }

    } else {
      const filename = uri.split('/').pop()!;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      
      formData.append('file', { uri, name: filename, type } as any);
    }


    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: (Platform.OS === 'web') ? {
      } : {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cloudinary Upload Error Response:', data);
      throw new Error(data.error.message || 'Cloudinary upload failed');
    }

    return data.secure_url;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create Post</Text>
          
          <TextInput
            placeholder="What's on your mind?"
            placeholderTextColor="#888"
            value={content}
            onChangeText={setContent}
            multiline
            style={styles.textarea}
          />

          {imageUri && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity onPress={handleRemoveImage} style={styles.removeImageButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.outlineButton]}
              onPress={handleImageSelect}
              disabled={isUploading}
            >
              <Ionicons name="image-outline" size={20} color="#FF5C58" style={styles.icon} />
              <Text style={[styles.buttonText, styles.outlineButtonText]}>Add Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button, 
                styles.solidButton, 
                (isUploading || (!content.trim() && !imageUri)) && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={isUploading || (!content.trim() && !imageUri)}
            >
              {isUploading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" style={styles.icon} />
                  <Text style={styles.buttonText}>Posting...</Text>
                </>
              ) : (
                <Text style={styles.buttonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000', 
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  textarea: {
    minHeight: 128,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF5C58',
  },
  solidButton: {
    backgroundColor: '#FF5C58',
  },
  disabledButton: {
    backgroundColor: '#FF5C58',
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineButtonText: {
    color: '#FF5C58',
  },
  icon: {
    marginRight: 8,
  },
});

export default CreateScreen;