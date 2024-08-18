import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet , View, FlatList, ActivityIndicator, Image, TouchableOpacity, Modal, Button, ScrollView, RefreshControl, Linking } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationDisplay from '@/components/home/LocationDisplay';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText'; // Adjust import path if necessary
import { ThemedView } from '@/components/ThemedView'; // Adjust import path if necessary

// Define types
type YoastHeadJson = {
  og_image?: { url: string }[];
};

type Post = {
  id: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  yoast_head_json?: YoastHeadJson;
  link?: string;
};

type LocationData = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

const NewsScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const navigation = useNavigation();

  // Function to fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://www.plainsman.co.za/wp-json/wp/v2/posts');
      let rawData = response.data;

      // Clean HTML/JS if necessary
      if (typeof rawData === 'string') {
        rawData = rawData
          .replace(/<script.*?<\/script>/gs, '')
          .replace(/<!--.*?-->/gs, '');
      }

      // Parse JSON data
      const parsedData: Post[] = JSON.parse(rawData);

      // Generate unique IDs if not present
      const processedPosts = parsedData.map((post: any, index: number) => ({
        id: post.id || `${index}-${Date.now()}`,
        title: post.title || { rendered: 'No title' },
        content: post.content || { rendered: 'No content' },
        yoast_head_json: post.yoast_head_json || {},
        link: post.link || '',
      }));

      // Update state and store in AsyncStorage
      setPosts(processedPosts);
      await AsyncStorage.setItem('cachedPosts', JSON.stringify(processedPosts));
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Load from cache if there's an error
      const cachedPosts = await AsyncStorage.getItem('cachedPosts');
      if (cachedPosts) {
        setPosts(JSON.parse(cachedPosts));
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    // Fetch location on component mount
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation({ coords });
    })();

    fetchPosts();
  }, []);

  const handlePress = (post: Post) => {
    setSelectedPost(post);
  };

  const renderItem = ({ item }: { item: Post }) => {
    if (!item || !item.title || !item.title.rendered || !item.content || !item.content.rendered) {
      console.error('Invalid post data:', item);
      return null;
    }

    const snippet = item.content.rendered.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
    const imageUrl = item.yoast_head_json?.og_image?.[0]?.url || 'https://via.placeholder.com/150';
    const authorMatch = item.content.rendered.match(/content="([^"]*)"/);
    const authorName = authorMatch ? authorMatch[1] : 'Unknown Author';

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>{item.title.rendered}</ThemedText>
          <ThemedText style={styles.snippet}>{snippet}</ThemedText>
          <ThemedText style={styles.author}>By: {authorName}</ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Your Local News</ThemedText>
      {location && <LocationDisplay location={location} />}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<ThemedText>No posts available</ThemedText>}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
      <View style={styles.footer}>
        <LocationDetails />
      </View>

      <Modal
        visible={!!selectedPost}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedPost(null)}
      >
        <ThemedView style={styles.modalContainer}>
          {selectedPost && (
            <ScrollView style={styles.modalContent}>
              <ThemedText style={styles.modalTitle}>{selectedPost.title.rendered}</ThemedText>
              <Image
                source={{ uri: selectedPost.yoast_head_json?.og_image?.[0]?.url || 'https://via.placeholder.com/150' }}
                style={styles.modalImage}
              />
              <ThemedText style={styles.modalContentText}>{selectedPost.content.rendered.replace(/<[^>]*>/g, '')}</ThemedText>
              <Button title="Read more" onPress={() => {
                if (selectedPost.link) {
                  Linking.openURL(selectedPost.link);
                }
              }} />
              <Button title="Close" onPress={() => setSelectedPost(null)} />
            </ScrollView>
          )}
        </ThemedView>
      </Modal>
    </ThemedView>
  );
};

const LocationDetails = () => (
  <ThemedView style={styles.locationDetails}>
    <ThemedText>Location Details Component</ThemedText>
    {/* Add your location details content here */}
  </ThemedView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  snippet: {
    fontSize: 14,
    color: '#666',
  },
  author: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  locationDetails: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  modalContentText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default NewsScreen;
