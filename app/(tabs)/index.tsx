import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Button, KeyboardAvoidingView, Platform } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import SearchBar from '../../components/home/SearchBar';
import PostItem from '../../components/home/PostItem';
import LoadingIndicator from '../../components/home/LoadingIndicator';
import LocationDisplay from '../../components/home/LocationDisplay';
import ErrorMessage from '../../components/home/ErrorMessage';
import { NavigationProp } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Modal from 'react-native-modal';
import DetailsScreen from '../../components/home/DetialsScreen'; // Adjust import path if necessary

interface HomeScreenProps {
  navigation: NavigationProp<any>; // Adjust 'any' to the specific type if using typed navigation
}

interface Post {
  id: number;
  title: {
    rendered: string;
  };
  registered: 'Yes' | 'No';
  address: string;
  price?: string;
  header_image?: string;
  logo_image?: string;
  facebook?: string;
  whatsapp?: string;
  instagram?: string;
  content: {
    rendered: string;
  };
  description?: string;
  latitude: number;
  longitude: number;
  full_day_care?: 'Yes' | 'No';
  half_day_care?: 'Yes' | 'No';
  meals_and_snacks?: 'Yes' | 'No';
  after_school_care?: 'Yes' | 'No';
  drop_in_care?: 'Yes' | 'No';
  special_programs?: 'Yes' | 'No';
  emergency_occasional_care?: 'Yes' | 'No';
}

const defaultCreche: Post = {
  id: 0,
  title: {
    rendered: 'No Title',
  },
  registered: 'No',
  address: 'No Address',
  price: 'No Price',
  header_image: '',
  logo_image: '',
  facebook: '',
  whatsapp: '',
  instagram: '',
  content: {
    rendered: 'No Content',
  },
  description: '',
  latitude: 0,
  longitude: 0,
  full_day_care: 'No',
  half_day_care: 'No',
  meals_and_snacks: 'No',
  after_school_care: 'No',
  drop_in_care: 'No',
  special_programs: 'No',
  emergency_occasional_care: 'No',
};

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedCreche, setSelectedCreche] = useState<Post | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false); // State for pull-to-refresh

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access location was denied');
      return;
    }

    const userLocation = await Location.getCurrentPositionAsync({});
    setLocation(userLocation);
  };

  const fetchPosts = (pageNumber: number) => {
    setLoading(true);
    axios
      .get(`https://shaqeel.wordifysites.com/wp-json/wp/v2/creche?_page=${pageNumber}&_per_page=10`)
      .then((response) => {
        const newPosts: Post[] = response.data.map((post: any) => ({
          id: post.id,
          title: post.title,
          registered: post.registered,
          address: post.address,
          price: post.price,
          header_image: post.header_image,
          logo_image: post.logo_image,
          facebook: post.facebook,
          whatsapp: post.whatsapp,
          instagram: post.instagram,
          content: post.content,
          description: post.description,
          latitude: post.latitude,
          longitude: post.longitude,
          full_day_care: post.full_day_care,
          half_day_care: post.half_day_care,
          meals_and_snacks: post.meals_and_snacks,
          after_school_care: post.after_school_care,
          drop_in_care: post.drop_in_care,
          special_programs: post.special_programs,
          emergency_occasional_care: post.emergency_occasional_care,
        }));


        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setFilteredPosts(prevPosts => [...prevPosts, ...newPosts]);
        setHasMore(response.data.length > 0);
        setLoading(false);
        setRefreshing(false); // Stop refreshing when data is fetched
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        setRefreshing(false); // Stop refreshing on error
      });
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterPosts(text);
  };

  const filterPosts = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();

    const updatedPosts = posts.filter((post) => {
      const title = post.title.rendered.toLowerCase();
      const address = post.address ? post.address.toLowerCase() : '';
      const price = post.price ? post.price.toString() : '';

      return (
        title.includes(lowerCaseQuery) ||
        address.includes(lowerCaseQuery) ||
        price.includes(lowerCaseQuery)
      );
    });

    setFilteredPosts(updatedPosts);
  };

  const loadMorePosts = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePress = (item: Post) => {
    setSelectedCreche(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCreche(null);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1); // Reset page to 1 to reload the first page of posts
    setPosts([]); // Clear existing posts to fetch fresh data
    fetchPosts(1); // Fetch posts from the first page
  }, []);

  if (loading && page === 1) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage message={`Error: ${error}`} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={styles.innerContainer}>
        <SearchBar onSearch={handleSearch} searchText={searchQuery} />
        <LocationDisplay location={location} />
        <FlatList
          data={filteredPosts}
          keyExtractor={(item, index) => `${item.id}-${index}`} // Use index to ensure uniqueness
          renderItem={({ item }) => (
            <PostItem item={item} onPress={() => handlePress(item)} />
          )}
          ListFooterComponent={
            hasMore ? (
              <Button title="Load More" onPress={loadMorePosts} />
            ) : (
              <ThemedText style={styles.endOfList}>No more posts</ThemedText>
            )
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </ThemedView>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        onSwipeComplete={closeModal}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <DetailsScreen creche={selectedCreche || defaultCreche} onClose={closeModal} />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  endOfList: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#888',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    minHeight: '80%', // Set the modal content to occupy 80% of the screen height
  },
});

export default HomeScreen;
