// ModalContent.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import DetailsScreen from '../../components/home/DetialsScreen';
import { Post, defaultCreche } from '../creche/constants';

interface ModalContentProps {
  creche: Post | null;
  onClose: () => void;
}

const ModalContent: React.FC<ModalContentProps> = ({ creche, onClose }) => {
  return (
    <View style={styles.modalContent}>
      <DetailsScreen creche={creche || defaultCreche} onClose={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'backgroundColor',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    minHeight: '80%',
  },
});

export default ModalContent;
