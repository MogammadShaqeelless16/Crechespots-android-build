import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Modal, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Marker, Region, Polyline, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import LoadingIndicator from '@/components/home/LoadingIndicator';

// Utility function to calculate distance between two coordinates
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Define your themes here
const themes = {
  dark: {
    backgroundColor: '#333',
    color: '#fff',
    mapStyle: [
      { elementType: 'geometry', stylers: [{ color: '#212121' }] },
      { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
      { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
      { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181818' }] },
      { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#484848' }] },
      { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#373737' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
      { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
      { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] }
    ]
  },
  light: {
    backgroundColor: '#fff',
    color: '#000',
    mapStyle: [] // Default map style for light theme
  }
};

export default function TabTwoScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [creches, setCreches] = useState<Array<{ latitude: number; longitude: number; id: number, title: string, price: string }>>([]);
  const [selectedCreche, setSelectedCreche] = useState<{ title: string; price: string } | null>(null);
  const [trayVisible, setTrayVisible] = useState(false);
  const [directions, setDirections] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Change theme here

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Fetch creche data
      try {
        const response = await fetch('https://shaqeel.wordifysites.com/wp-json/wp/v2/creche');
        const data = await response.json();
        const formattedCreches = data.map((creche: any) => {
          const latitude = parseFloat(creche.latitude);
          const longitude = parseFloat(creche.longitude);

          return {
            latitude: isNaN(latitude) ? 0 : latitude, // Default to 0 if NaN
            longitude: isNaN(longitude) ? 0 : longitude, // Default to 0 if NaN
            id: creche.id,
            title: creche.title.rendered,
            price: creche.price, // Make sure the API provides this field
          };
        });

        setCreches(formattedCreches);
      } catch (error) {
        setErrorMsg('Failed to fetch creche data');
      }
    })();
  }, []);

  const initialRegion: Region | undefined = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01, // Zoom in closer
        longitudeDelta: 0.01, // Zoom in closer
      }
    : undefined;

  const closestCreches = useMemo(() => {
    if (!location) return [];

    return creches
      .map(creche => ({
        ...creche,
        distance: getDistance(location.latitude, location.longitude, creche.latitude, creche.longitude),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2); // Get the closest two creches
  }, [creches, location]);

  const handleDirection = (creche: { latitude: number; longitude: number }) => {
    setDirections([{ latitude: location?.latitude ?? 0, longitude: location?.longitude ?? 0 }, creche]);
  };

  const currentTheme = themes[theme];

  return (
    <ThemedView style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      {location ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation
            customMapStyle={currentTheme.mapStyle}
          >
            <UrlTile
              urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
            />
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title="Your Location"
            />
            {creches.map((creche) => (
              <Marker
                key={creche.id}
                coordinate={{ latitude: creche.latitude, longitude: creche.longitude }}
                onPress={() => setSelectedCreche({ title: creche.title, price: creche.price })}
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
                strokeColor={currentTheme.color}
                strokeWidth={2}
              />
            )}
          </MapView>

          <View style={[styles.trayContainer, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
            <FlatList
              data={closestCreches}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.trayItem}>
                  <Text style={[styles.trayTitle, { color: currentTheme.color }]}>{item.title}</Text>
                  <Text style={[styles.trayDistance, { color: theme === 'dark' ? '#ccc' : '#666' }]}>{item.distance.toFixed(2)} km</Text>
                  <TouchableOpacity onPress={() => handleDirection(item)}>
                    <Text style={[styles.directionButton, { color: currentTheme.color }]}>Get Directions</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <TouchableOpacity style={styles.toggleTrayButton} onPress={() => setTrayVisible(!trayVisible)}>
              <Text style={[styles.toggleTrayButtonText, { color: currentTheme.color }]}>{trayVisible ? 'Hide' : 'Show More'}</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={!!selectedCreche}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setSelectedCreche(null)}
          >
            <ThemedView style={styles.modalContainer}>
              <Text style={[styles.modalTitle, { color: currentTheme.color }]}>{selectedCreche?.title}</Text>
              <Text style={[styles.modalPrice, { color: currentTheme.color }]}>{selectedCreche?.price}</Text>
              <Text style={[styles.closeButton, { color: currentTheme.color }]} onPress={() => setSelectedCreche(null)}>Close</Text>
            </ThemedView>
          </Modal>
        </>
      ) : (
        <ThemedView style={styles.loadingContainer}>
          <LoadingIndicator />
          {errorMsg && <ThemedText>{errorMsg}</ThemedText>}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerImage: {
    width: 40,
    height: 40,
  },
  trayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 10,
  },
  trayItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  trayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trayDistance: {
    fontSize: 14,
  },
  directionButton: {
    fontSize: 14,
    marginTop: 5,
  },
  toggleTrayButton: {
    padding: 10,
    alignItems: 'center',
  },
  toggleTrayButtonText: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalTitle: {
    fontSize: 20,
  },
  modalPrice: {
    fontSize: 16,
  },
  closeButton: {
    fontSize: 18,
    marginTop: 20,
  },
});
