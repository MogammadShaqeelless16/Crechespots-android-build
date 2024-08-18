import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Mock function to check authentication status
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Here, you should replace the following line with your actual authentication check
    const checkAuthStatus = async () => {
      // Simulate an API call or check from context
      setIsAuthenticated(false); // Set this based on actual auth status
    };

    checkAuthStatus();
  }, []);

  return isAuthenticated;
};

export default function TabTwoScreen() {
  const isAuthenticated = useAuth();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="send-sharp" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      {isAuthenticated ? (
        <>
          <ThemedText>This app includes example code to help you get started.</ThemedText>
          <Collapsible title="File-based routing">
            <ThemedText>
              This app has two screens:{' '}
              <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
              <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
            </ThemedText>
            <ThemedText>
              The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
              sets up the tab navigator.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/router/introduction">
              <ThemedText type="link">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>
          <Collapsible title="Android, iOS, and web support">
            <ThemedText>
              You can open this project on Android, iOS, and the web. To open the web version, press{' '}
              <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
            </ThemedText>
          </Collapsible>
          <Collapsible title="Images">
            <ThemedText>
              For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
              <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
              different screen densities
            </ThemedText>
            <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
            <ExternalLink href="https://reactnative.dev/docs/images">
              <ThemedText type="link">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>
          <Collapsible title="Custom fonts">
            <ThemedText>
              Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
              <ThemedText style={{ fontFamily: 'SpaceMono' }}>
                custom fonts such as this one.
              </ThemedText>
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
              <ThemedText type="link">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>
          <Collapsible title="Light and dark mode components">
            <ThemedText>
              This template has light and dark mode support. The{' '}
              <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
              what the user's current color scheme is, and so you can adjust UI colors accordingly.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
              <ThemedText type="link">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>
          <Collapsible title="Animations">
            <ThemedText>
              This template includes an example of an animated component. The{' '}
              <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
              the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText> library
              to create a waving hand animation.
            </ThemedText>
            {Platform.select({
              ios: (
                <ThemedText>
                  The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
                  component provides a parallax effect for the header image.
                </ThemedText>
              ),
            })}
          </Collapsible>
        </>
      ) : (
        <View style={styles.noAccessContainer}>
          <ThemedText style={styles.noAccessText}>
            Oh no! We see that you don’t have an account with us, so you can’t make an application to the creche. Please sign in and go to the login tab to create an account with us or log in if you already have one.
          </ThemedText>
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noAccessText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#f00', // or any color that fits your theme
  },
});
