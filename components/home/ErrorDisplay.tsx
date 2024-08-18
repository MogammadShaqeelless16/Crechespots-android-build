import React from 'react';
import { View, StyleSheet } from 'react-native';
import ErrorMessage from '../../components/home/ErrorMessage';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <View style={styles.container}>
    <ErrorMessage message={message} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ErrorDisplay;
