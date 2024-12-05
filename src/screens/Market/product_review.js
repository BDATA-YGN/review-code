import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import ActionAppBar from "../../commonComponent/ActionAppBar";
import { useNavigation } from "@react-navigation/native";
import COLOR from "../../constants/COLOR";
import { FontFamily } from "../../constants/FONT";
import IconManager from "../../assets/IconManager";
import SPACING from "../../constants/SPACING";
import RADIUS from "../../constants/RADIUS";
import IconPic from "../../components/Icon/IconPic";
import { useState } from "react";
import ActionButton from "../../components/Button/ActionButton";
import ImagePicker from 'react-native-image-crop-picker';
import { submitReviewProduct } from "../../helper/ApiModel";
import AppLoading from "../../commonComponent/Loading";

const ProductReview = ({ route }) => {
    const { darkMode, product_id } = route.params;
    const [rating, setRating] = useState(0); // To track user rating
    const [reviewText, setReviewText] = useState(""); // To track the text input
    const navigation = useNavigation();
    const [reviewPhotos , setReviewPhotos] = useState([]);
    const [Loading , setLoading] = useState(false);

    // Function to handle click on star
    const handleStarPress = (starValue) => {
        setRating(starValue);
    };

    const pickImage = () => {
        ImagePicker.openPicker({
            multiple: true,
            mediaType: 'photo',
            forceJpg : true,
            cropping: true,
        })
        .then(images => {
            // Update state to include all selected images
            const newPhotos = images.map(image => image.path); // Extract paths
            setReviewPhotos(prevPhotos => [...prevPhotos, ...newPhotos]); // Append new photos
        })
        .catch(error => {
            console.error('Image picker error:', error);
        });
    };
    


    const handleRemovePhoto = (image) => {
        setReviewPhotos(prevPhotos => prevPhotos.filter(photo => photo !== image));
    };
      const renderHeader = () => (
        <TouchableOpacity activeOpacity={0.7} onPress={pickImage}>
          <View style={styles.photoContainer}>
            <Image source={IconManager.choose_photo} resizeMode="contain" style={styles.croppedImageStyle} />
          </View>
        </TouchableOpacity>
      );

      const renderItem = ({ item ,index}) => (
        <View key={index} style={styles.photoContainer}>
          <Image
            source={{ uri: item }}
            style={styles.croppedImageStyle}
          />
          <TouchableOpacity
            style={styles.removePhotoButton}
            onPress={() => handleRemovePhoto(item)}
          >
            <Text style={styles.removePhotoButtonText}>x</Text>
          </TouchableOpacity>
        </View>
      );
    

      const handleReview = async () => {
        console.log(reviewPhotos);
        setLoading(true)
        
        try {
          // Trigger the loading state
          const response = await submitReviewProduct('review',reviewText ,rating , product_id , reviewPhotos );
            console.log(response);
            
          if (response.api_status === 200) {
            setLoading(false)
            navigation.navigate('ReviewCompleted', {darkMode : darkMode})
          } else {
            setLoading(false)
            console.error('Failed to review product:', response);
          
          }
        } catch (error) {
            setLoading(false)
          console.error('Error reviewing product:', error);
          // Handle API errors, show an error message, or retry logic
        }
      };
      

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor:
                    darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
            }}>
            <ActionAppBar appBarText="Review" backpress={() => navigation.goBack()} darkMode={darkMode} />
            <View style={{ padding: 16 }}>
                <View style={{ backgroundColor: COLOR.White, padding: 16, borderRadius: 8 , gap : 10 }}>
                    <View style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'center' , justifyContent : 'space-between' }}>
                        {/* Five Stars */}
                        <Text style={{ fontFamily: FontFamily.PoppinSemiBold, fontSize: 18, color: COLOR.Grey500}}>Rating</Text>

                        <View style={styles.starsContainer}>
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={0.7}
                                        onPress={() => handleStarPress(starValue)}
                                    >
                                        <Image
                                            source={IconManager.star} // Single star image
                                            style={{
                                                width: 24,
                                                height: 24,
                                                tintColor: starValue <= rating ? COLOR.Primary : COLOR.Grey300, // Blue for selected stars, Grey for unselected
                                            }}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                    <View>
                    {reviewPhotos.length === 0 ? (
                        <TouchableOpacity activeOpacity={0.7} onPress={() => pickImage()}>
                            <View style={styles.dottedCardStyle}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <IconPic
                                        source={IconManager.photoGallery}
                                        width={50}
                                        height={50}
                                    />
                                    <Text
                                        style={[
                                            styles.textStylePrimary,
                                            {
                                                color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey300,
                                            },
                                        ]}>
                                        Upload Image
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ): (
                        <View style={styles.photoRowContainer}>
                        {renderHeader()}
                        {reviewPhotos.map((photo, index) => renderItem({ item: photo, index }))}
                      </View>
                    )}
                    </View>

                    {/* TextArea for user input */}
                    <View>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            style={[
                                styles.textArea,
                                {
                                    color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                                    backgroundColor: darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White,
                                },
                            ]}
                            placeholder="Write a review"
                            placeholderTextColor={darkMode === 'enable' ? COLOR.White : COLOR.Grey300}
                            value={reviewText}
                            onChangeText={setReviewText}
                            color = {darkMode === 'enable' ? COLOR.White : COLOR.Grey300}
                        />
                    </View>

                    {/* Submit Button */}
                    <View>
                        <ActionButton text="Submit" onPress = {handleReview}/>
                    </View>
                </View>
            </View>

            {Loading && <AppLoading/>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    photoContainer: {
        margin: 5,
        position: 'relative',
    },
    croppedImageStyle: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 5,
    },
    removePhotoButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: COLOR.Primary,
        borderRadius: RADIUS.rd25,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removePhotoButtonText: {
        color: 'white',
    },
    dottedCardStyle: {
        borderWidth: 1,
        borderColor: COLOR.Grey300,
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStylePrimary: {
        fontFamily: FontFamily.PoppinRegular,
        fontSize: 16,
    },
    textArea: {
        height: 120,
        borderColor: COLOR.Grey300,
        borderWidth: 0.5,
        borderRadius: RADIUS.rd8,
        padding: 10,
        fontFamily: FontFamily.PoppinRegular,
        fontSize: 16,
        textAlignVertical: 'top', // Ensures the text starts from the top of the TextArea
    },
    photoContainer: {
        margin: 5,
        position: 'relative',
      },
      croppedImageStyle: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 5,
      },
      removePhotoButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: COLOR.Primary,
        borderRadius: RADIUS.rd25, // Assuming the button has a width and height of 20px
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      removePhotoButtonText: {
        color: 'white',
    
      },
      dottedCardStyle: {
        borderWidth: 1,
        borderColor: COLOR.Grey300,
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 24,
        // height: 200,
        alignItems: 'center',
        justifyContent: 'center',
      },
      textStylePrimary: {
        fontFamily: FontFamily.PoppinRegular,
        fontSize: 16,
      },
      photoRowContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
});

export default ProductReview;
