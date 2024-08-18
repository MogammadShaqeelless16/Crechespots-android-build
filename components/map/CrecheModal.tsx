import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

type CrecheModalProps = {
  visible: boolean;
  creche: { title: string; price: string } | null;
  onClose: () => void;
  theme: { color: string };
};

const CrecheModal: React.FC<CrecheModalProps> = ({ visible, creche, onClose, theme }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onClose}
  >
    <ThemedView style={styles.modalContainer}>
      <Text style={[styles.modalTitle, { color: theme.color }]}>{creche?.title}</Text>
      <Text style={[styles.modalPrice, { color: theme.color }]}>{creche?.price}</Text>
      <Text style={[styles.closeButton, { color: theme.color }]} onPress={onClose}>Close</Text>
    </ThemedView>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalTitle: {
    fontSize: 20,
  },
  modalPrice: {
    fontSize: 16,
  },
  closeButton: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default CrecheModal;
