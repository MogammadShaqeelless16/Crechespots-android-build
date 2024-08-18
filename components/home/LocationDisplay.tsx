import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText'; // Adjust the import path as necessary
import { getAddressFromCoords } from '../../utils/reverseGeocode'; // Adjust the import path as necessary

interface LocationDisplayProps {
  location: { coords: { latitude: number; longitude: number } } | null;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ location }) => {
  const [address, setAddress] = useState<string>('Fetching address...');

  useEffect(() => {
    const fetchAddress = async () => {
      if (location) {
        const { latitude, longitude } = location.coords;
        const fetchedAddress = await getAddressFromCoords(latitude, longitude);
        setAddress(fetchedAddress);
      }
    };

    fetchAddress();
  }, [location]);

  if (!location) return null;

  return (
    <View style={styles.container}>
      <FontAwesome name="map-marker" size={24} color="red" />
      <ThemedText style={styles.text}>{address}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default LocationDisplay;
