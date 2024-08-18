import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LoadingIndicator from '@/components/home/LoadingIndicator';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type LoadingComponentProps = {
  errorMsg: string | null;
};

const LoadingComponent: React.FC<LoadingComponentProps> = ({ errorMsg }) => (
  <ThemedView style={styles.loadingContainer}>
    <LoadingIndicator />
    {errorMsg && <ThemedText>{errorMsg}</ThemedText>}
  </ThemedView>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingComponent;
