import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { ThemedView } from '../ThemedView';

// Define the types for the props
interface SearchBarProps {
  onSearch: (text: string) => void;
  searchText: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchText }) => (
  <ThemedView style={styles.container}>
    <TextInput
      style={styles.input}
      placeholder="Search by title, address, or price"
      placeholderTextColor="#888" // This could be themed if needed
      value={searchText}
      onChangeText={onSearch}
    />
  </ThemedView>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc', // This should be managed by ThemedView
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff', // This should be managed by ThemedView
  },
});

export default SearchBar;
