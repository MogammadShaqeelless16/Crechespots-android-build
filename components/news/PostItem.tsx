import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface Post {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  featured_media?: {
    source_url: string;
  };
}

interface PostItemProps {
  post: Post;
  onPress: (post: Post) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onPress }) => {
  if (!post || !post.title || !post.title.rendered || !post.content || !post.content.rendered) {
    return null; // Handle cases where post data might be incomplete
  }

  const snippet = post.content.rendered; // Already cleaned in NewsScreen

  // Fallback image URL if featured_media is not available
  const imageUrl = post.featured_media?.source_url || 'https://via.placeholder.com/150';

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(post)}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{post.title.rendered}</Text>
        <Text style={styles.snippet}>{snippet}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default PostItem;
