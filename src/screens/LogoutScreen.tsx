// src/screens/LogoutScreen.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { auth } from '../firebase/config'; // Check this import path!

const LogoutScreen = () => {
  useEffect(() => {
    // As soon as this screen loads, sign the user out.
    // The onAuthStateChanged listener in App.tsx will see this,
    // set 'user' to null, and switch to AuthStack.
    auth.signOut();
  }, []);

  // Show a loader while logging out
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default LogoutScreen;