// LoadingIndicator.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const LoadingIndicator: React.FC = () => {
  return (
    <View style={styles.loadingContainer}>
      <Image
        source={require('../../assets/images/CrecheSpot_Splash.gif')} // Replace with the path to your loading.gif
        style={styles.loadingImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 100, // Adjust size as needed
    height: 100, // Adjust size as needed
  },
});

export default LoadingIndicator;
