import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

// Define the types for the props
interface PostItemProps {
  item: {
    title: {
      rendered: string;
    };
    registered: 'Yes' | 'No';
    address: string;
    price?: string;
    header_image?: string;
    content: {
      rendered: string;
    };
  };
  onPress: () => void;
}

const PostItem: React.FC<PostItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView style={styles.postContainer}>
        <View style={styles.postTitleContainer}>
          <ThemedText style={styles.postTitle}>{item.title.rendered}</ThemedText>
          {item.registered === 'Yes' && (
            <Image
              source={require('../../assets/images/Registere.png')} // Replace with the path to your registered.png
              style={styles.registeredIcon}
            />
          )}
        </View>
        <ThemedText style={styles.postAddress}>Address: {item.address}</ThemedText>
        {item.price && (
          <ThemedText style={styles.postPrice}>Price: {item.price}</ThemedText>
        )}
        {item.header_image && (
          <Image
            source={{ uri: item.header_image }}
            style={styles.postImage}
          />
        )}
        <ThemedText style={styles.postContent}>{item.content.rendered}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  postTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  registeredIcon: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  postAddress: {
    fontSize: 16,
    marginVertical: 5,
  },
  postPrice: {
    fontSize: 16,
    marginVertical: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
  postContent: {
    marginTop: 10,
    fontSize: 14,
  },
});

export default PostItem;
