import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

// Update TrayComponentProps to include latitude and longitude
type TrayComponentProps = {
    creches: Array<{ id: number; title: string; distance: number; latitude: number; longitude: number }>;
    onDirectionPress: (creche: { latitude: number; longitude: number }) => void;
    theme: { color: string; backgroundColor: string };
    trayVisible: boolean;
    onToggleTray: () => void;
  };
  
  const TrayComponent: React.FC<TrayComponentProps> = ({ creches, onDirectionPress, theme, trayVisible, onToggleTray }) => (
    <View style={[styles.trayContainer, { backgroundColor: theme.backgroundColor }]}>
      <FlatList
        data={creches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.trayItem}>
            <Text style={[styles.trayTitle, { color: theme.color }]}>{item.title}</Text>
            <Text style={[styles.trayDistance, { color: theme.color }]}>{item.distance.toFixed(2)} km</Text>
            <TouchableOpacity onPress={() => onDirectionPress({ latitude: item.latitude, longitude: item.longitude })}>
              <Text style={[styles.directionButton, { color: theme.color }]}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.toggleTrayButton} onPress={onToggleTray}>
        <Text style={[styles.toggleTrayButtonText, { color: theme.color }]}>{trayVisible ? 'Hide' : 'Show More'}</Text>
      </TouchableOpacity>
    </View>
  );
  

const styles = StyleSheet.create({
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
});

export default TrayComponent;
