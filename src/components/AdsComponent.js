import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import ImageSlider from 'react-native-image-slider'; // Use any image slider library you prefer
import {SliderBox} from 'react-native-image-slider-box';
import Carousel from 'react-native-reanimated-carousel';
const AdsComponent = ({ad}) => {
  return (
    <View style={styles.adContainer}>
      {ad.images.length > 1 ? (
        // <ImageSlider images={ad.images} style={styles.adImage}/>
        // <SliderBox
        //   images={ad.images}
        //   resizeMode="stretch"
        //   style={{aspectRatio: 19 / 9}}
        //   paginationBoxVerticalPadding={-5}
        //   autoplay={true}
        //   circleLoop
        //   dotStyle={{
        //     width: 7,
        //     height: 7,
        //     borderRadius: 7,
        //     // marginHorizontal: 10,
        //     padding: 0,
        //     margin: 0,
        //   }}
        // />
        
        <Carousel
        loop
        width={Dimensions.get('window').width}  // Full screen width
        height={200}  // Fixed height
        autoPlay={true}
        data={ad.images}  // Assuming ad.images is an array of image URLs
        scrollAnimationDuration={2000}
        // onSnapToItem={(index) => console.log('current index:', index)}
        renderItem={({ item }) => (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                }}
            >
                <Image
                    source={{ uri: item }}  // Display the image from URL
                    style={{
                        width: '100%',  // Full width
                        height: '100%',  // Full height (200px as set above)
                    }}
                    resizeMode="cover"  // Adjust the image's aspect ratio to fill the space
                />
            </View>
        )}
    />
    
      ) : (
        <Image
          source={{uri: ad.images[0]}}
          resizeMode="stretch"
          style={{aspectRatio: 19 / 9}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 10,
  },
  adImage: {
    // width: '100%',
    // aspectRatio : 19/9,
    // height: 180,
    // resizeMode : 'stretch',
    borderRadius: 5,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  adDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default AdsComponent;
