import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

interface DetailsScreenProps {
  creche: Post;
  onClose: () => void;
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
  short_description?: string;
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

const DetailsScreen: React.FC<DetailsScreenProps> = ({ creche, onClose }) => {
  if (!creche) {
    return <View style={styles.container}><Text>No data available</Text></View>;
  }

  const openLink = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
    }
  };

  const openWhatsApp = (number: string) => {
    if (number) {
      const url = `https://wa.me/${number}`;
      openLink(url);
    }
  };

  const onApplyPress = () => {
    // Implement your apply action here
    console.log('Apply button pressed');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome name="close" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {creche.logo_image && (
            <Image
              source={{ uri: creche.logo_image }}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          {creche.header_image && (
            <Image
              source={{ uri: creche.header_image }}
              style={styles.headerImage}
              resizeMode="cover"
            />
          )}
        </View>
        <Text style={styles.title}>{creche.title.rendered}</Text>
        <Text style={styles.detail}>Address: {creche.address}</Text>
        <Text style={styles.detail}>Price: {creche.price || 'N/A'}</Text>
        <Text style={styles.detail}>Registration: {creche.registered}</Text>
        {creche.short_description && <Text style={styles.detail}>Description: {creche.short_description}</Text>}
        <Text style={styles.description}>{creche.content.rendered}</Text>
        <TouchableOpacity style={styles.button} onPress={onApplyPress}>
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
        <View style={styles.socialMediaContainer}>
          {creche.facebook && (
            <TouchableOpacity onPress={() => openLink(creche.facebook!)}>
              <FontAwesome name="facebook" size={32} color="#3b5998" style={styles.icon} />
            </TouchableOpacity>
          )}
          {creche.whatsapp && (
            <TouchableOpacity onPress={() => openWhatsApp(creche.whatsapp!)}>
              <FontAwesome name="whatsapp" size={32} color="#25D366" style={styles.icon} />
            </TouchableOpacity>
          )}
          {creche.instagram && (
            <TouchableOpacity onPress={() => openLink(creche.instagram!)}>
              <FontAwesome name="instagram" size={32} color="#C13584" style={styles.icon} />
            </TouchableOpacity>
          )}
        </View>
        {/* Conditional rendering for the new boolean fields */}
        {creche.full_day_care === 'Yes' && (
          <View style={styles.iconContainer}>
            <MaterialIcons name="accessibility" size={32} color="orange" />
            <Text>Full-Day Care</Text>
          </View>
        )}
        {creche.half_day_care === 'Yes' && (
          <View style={styles.iconContainer}>
            <MaterialIcons name="accessibility" size={32} color="blue" />
            <Text>Half-Day Care</Text>
          </View>
        )}
        {creche.meals_and_snacks === 'Yes' && (
          <View style={styles.iconContainer}>
            <MaterialIcons name="restaurant" size={32} color="green" />
            <Text>Meals & Snacks</Text>
          </View>
        )}
        {creche.after_school_care === 'Yes' && (
          <View style={styles.iconContainer}>
            <MaterialIcons name="school" size={32} color="purple" />
            <Text>After-School Care</Text>
          </View>
        )}
        {creche.drop_in_care === 'Yes' && (
          <View style={styles.iconContainer}>
            <MaterialIcons name="today" size={32} color="red" />
            <Text>Drop-In Care</Text>
          </View>
        )}
        {creche.special_programs === 'Yes' && (
          <View style={styles.iconContainer}>
            <MaterialIcons name="star" size={32} color="gold" />
            <Text>Special Programs</Text>
          </View>
        )}
        {creche.emergency_occasional_care === 'Yes' && (
          <View style={styles.iconContainer}>
            <MaterialIcons name="emergency" size={32} color="blue" />
            <Text>Emergency Care</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    padding: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  headerImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  icon: {
    marginHorizontal: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default DetailsScreen;
