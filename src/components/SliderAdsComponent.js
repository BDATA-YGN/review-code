import React from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SliderAdsComponent = ({ads}) => {
  return (
    <ScrollView horizontal pagingEnabled style={styles.slider}>
      {ads.map((ad, index) => (
        <TouchableOpacity
          key={ad.id}
          style={styles.adContainer}
          onPress={() => {
            /* Handle ad click */
          }}>
          <Image source={{uri: ad.imageUrl}} style={styles.adImage} />
          <Text style={styles.adTitle}>{ad.title}</Text>
          <Text style={styles.adDescription}>{ad.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  slider: {
    marginVertical: 10,
  },
  adContainer: {
    width: 300, // Adjust width based on your design
    marginRight: 10,
  },
  adImage: {
    width: '100%',
    height: 150,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  adDescription: {
    fontSize: 14,
    color: 'gray',
  },
});

export default SliderAdsComponent;
