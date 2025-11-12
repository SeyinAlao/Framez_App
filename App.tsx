import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './src/firebase/config'; 
import AuthStack from './src/navigation/AuthStack';
import TabNavigator from './src/navigation/TabNavigator';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe; 
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f4f4f4',
        }}
      >
        <ActivityIndicator size="large" color="#6b88d6ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {user ? <TabNavigator /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
