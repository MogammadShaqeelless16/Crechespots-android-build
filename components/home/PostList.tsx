import React from 'react';
import { FlatList, Button, StyleSheet } from 'react-native';
import PostItem from '../../components/home/PostItem';
import { ThemedText } from '@/components/ThemedText';

interface PostListProps {
  posts: any[];
  onPostPress: (item: any) => void;
  loadMore: () => void;
  hasMore: boolean;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostPress, loadMore, hasMore }) => (
  <FlatList
    data={posts}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <PostItem item={item} onPress={() => onPostPress(item)} />
    )}
    ListFooterComponent={
      hasMore ? (
        <Button title="Load More" onPress={loadMore} />
      ) : (
        <ThemedText style={styles.endOfList}>No more posts</ThemedText>
      )
    }
  />
);

const styles = StyleSheet.create({
  endOfList: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default PostList;
