import React, { useState, useEffect, useContext } from 'react';
import { View, Button, Linking, StyleSheet, Image } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useAuthRequest } from 'expo-auth-session';
import { HelloWave } from '../../components/HelloWave'; // Adjust the import path as necessary
import { auth0Config } from '../../auth/authConfig'; // Ensure the correct import path
import { AuthContext } from '../../context/AuthContext'; // Adjust the import path as necessary
import { LoginScreenNavigationProp } from '../../navigation/types'; // Adjust the import path as necessary
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useContext(AuthContext);
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: auth0Config.clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: auth0Config.redirectUri,
    },
    {
      authorizationEndpoint: `https://${auth0Config.domain}/authorize`,
      tokenEndpoint: `https://${auth0Config.domain}/oauth/token`,
    }
  );

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;

      console.log('Authorization Code:', code); // Debug: log authorization code

      fetch(`https://${auth0Config.domain}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: auth0Config.clientId,
          code,
          redirect_uri: auth0Config.redirectUri,
        }),
      })
        .then(res => {
          console.log('Token Exchange Response:', res); // Debug: log response
          return res.json();
        })
        .then(data => {
          console.log('Token Data:', data); // Debug: log token data
          if (data.access_token) {
            // Save the tokens and navigate to profile screen
            signIn(data.access_token);
            navigation.navigate('Profile'); // Ensure 'Profile' is the correct route name
          } else {
            console.error('No access token received');
          }
        })
        .catch(error => {
          console.error('Token exchange error:', error);
        });
    }
  }, [response]);

  const handleSignUp = () => {
    if (termsAccepted && privacyAccepted) {
      promptAsync();
    } else {
      alert('You must accept the terms and conditions and privacy policy to continue.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.headerContainer}>
        <HelloWave />
        <ThemedText style={styles.header}>Hi there!</ThemedText>
      </View>

      <ThemedText style={styles.info}>
        We see you don't have an account with us. To create an account, please use the sign-up button below.
        But first, read the Terms and Conditions and the Privacy Policy, and ensure you agree with them.
      </ThemedText>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={termsAccepted ? 'checked' : 'unchecked'}
          onPress={() => setTermsAccepted(!termsAccepted)}
        />
        <ThemedText style={styles.label}>
          I agree to the{' '}
          <ThemedText
            style={styles.link}
            onPress={() => Linking.openURL('https://yourapp.com/terms-and-conditions')}
          >
            Terms and Conditions
          </ThemedText>
        </ThemedText>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={privacyAccepted ? 'checked' : 'unchecked'}
          onPress={() => setPrivacyAccepted(!privacyAccepted)}
        />
        <ThemedText style={styles.label}>
          I agree to the{' '}
          <ThemedText
            style={styles.link}
            onPress={() => Linking.openURL('https://yourapp.com/privacy-policy')}
          >
            Privacy Policy
          </ThemedText>
        </ThemedText>
      </View>

      <Button
        title="Sign Up"
        onPress={handleSignUp}
        disabled={!request || !termsAccepted || !privacyAccepted}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginLeft: 8,
  },
  link: {
    color: 'blue',
  },
});
