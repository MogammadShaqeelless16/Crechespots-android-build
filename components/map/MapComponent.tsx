import React, { useMemo } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { ThemedView } from '@/components/ThemedView';

type MapComponentProps = {
  location: { latitude: number; longitude: number } | null;
  creches: Array<{ latitude: number; longitude: number; id: number }>;
  directions: Array<{ latitude: number; longitude: number }>;
  theme: { mapStyle: any[]; backgroundColor: string };
  onCrechePress: (creche: { title: string; price: string }) => void;
};

const MapComponent: React.FC<MapComponentProps> = ({ location, creches, directions, theme, onCrechePress }) => {
  const initialRegion: Region | undefined = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : undefined;

  return (
    <MapView
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation
      customMapStyle={theme.mapStyle}
    >
      {location && (
        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="Your Location" />
      )}
      {creches.map((creche) => (
        <Marker
          key={creche.id}
          coordinate={{ latitude: creche.latitude, longitude: creche.longitude }}
          onPress={() => onCrechePress({ title: '', price: '' })}
        >
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4506/4506230.png' }}
            style={styles.markerImage}
          />
        </Marker>
      ))}
      {directions.length === 2 && (
        <Polyline
          coordinates={directions}
          strokeColor={theme.backgroundColor}
          strokeWidth={2}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerImage: {
    width: 40,
    height: 40,
  },
});

export default MapComponent;
