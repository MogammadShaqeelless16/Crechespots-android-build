import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { auth0Config } from '../../auth/authConfig'; // Import Auth0 config

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const idToken = await SecureStore.getItemAsync('idToken');
      if (idToken) {
        fetch(`https://${auth0Config.domain}/userinfo`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })
          .then(response => response.json())
          .then(profile => setUser(profile))
          .catch(error => console.error('Error fetching user profile:', error));
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('idToken');
    // Redirect to login or initial screen
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {user.name}!</Text>
      <Text style={styles.text}>Email: {user.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});
