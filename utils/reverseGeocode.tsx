import * as Location from 'expo-location';

export const getAddressFromCoords = async (latitude: number, longitude: number): Promise<string> => {
  try {
    // Get an array of results from reverse geocoding
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });

    // Ensure results is an array and has at least one element
    if (results && results.length > 0) {
      // Access the first result from the array
      const result = results[0];

      // Extract street from the result
      const { street } = result;

      // Return the street if available
      if (street) {
        return street;
      }

      // Return a default message if street is not available
      return 'Street address not available';
    }

    return 'Location details not available';
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Error fetching address';
  }
};
