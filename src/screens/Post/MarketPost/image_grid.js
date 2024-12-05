import React, {useEffect, useState} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import COLOR from '../../../constants/COLOR';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import {useNavigation} from '@react-navigation/native';
import {fetchCredentialData} from '../../../helper/Market/MarketHelper';
import {marketCategory} from '../../../constants/CONSTANT_ARRAY';

const ImageGrid = ({data, darkMode}) => {
  const navigation = useNavigation();
  const [user_id, setUserId] = useState(0);

  const getUserId = async () => {
    const userId = await fetchCredentialData();
    return userId; // Ensure this is the correct value
  };

  const setId = async () => {
    const id = await getUserId();
    setUserId(id);
  };

  useEffect(() => {
    setId();
  }, []);
  const marketImageClick = () => {
    data?.user_id === user_id
      ? navigation.navigate('ProductDetails', {
          darkMode: darkMode,
          product: data,
          user_id: user_id,
        })
      : navigation.navigate('OtherProductDetails', {
          darkMode: darkMode,
          product: data,
          user_id: user_id,
        });
  };

  const findCategoryName = categoryId => {
    const category = marketCategory.find(cat => cat.category_id === categoryId);
    return category ? category.name : null;
  };

  const renderImages = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          marketImageClick();
        }}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: data?.images[0]?.image}}
            style={styles.singleImage}
          />
          {/* Overlay View */}
          <View style={styles.overlay}>
            <View style={{flex: 3}}>
              <Text
                numberOfLines={1}
                style={[
                  styles.overlayText,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.Grey500 : COLOR.Grey500,
                  },
                ]}>
                {data?.name}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.overlayText,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.Grey500 : COLOR.Grey500,
                  },
                ]}>
                {findCategoryName(data?.category)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                marketImageClick();
              }}
              activeOpacity={0.8}
              style={{
                flex: 1,
                backgroundColor: COLOR.Primary,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 8,
                borderRadius: 8,
              }}>
              <Text
                style={{
                  fontFamily: FontFamily.PoppinSemiBold,
                  fontSize: fontSizes.size14,
                  color: COLOR.White100,
                }}>
                Shop Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // const renderImages = () => {
  //   return (
  //     <TouchableOpacity
  //       activeOpacity={0.8}
  //       onPress={() => {
  //         marketImageClick();
  //       }}>
  //       <Image
  //         source={{uri: data?.images[0]?.image}}
  //         style={styles.singleImage}
  //       />
  //     </TouchableOpacity>
  //   );
  // switch (data?.images?.length) {
  //   case 1:
  //     return (
  //       <TouchableOpacity
  //         activeOpacity={0.8}
  //         onPress={() => {
  //           marketImageClick();
  //         }}>
  //         <Image
  //           source={{uri: data?.images[0]?.image}}
  //           style={styles.singleImage}
  //         />
  //       </TouchableOpacity>
  //     );
  //   case 2:
  //     return (
  //       <TouchableOpacity
  //         activeOpacity={0.8}
  //         onPress={() => {
  //           marketImageClick();
  //         }}>
  //         <View style={styles.row}>
  //           <Image
  //             source={{uri: data?.images[0]?.image}}
  //             style={styles.twoImages}
  //           />
  //           <Image
  //             source={{uri: data?.images[1]?.image}}
  //             style={styles.twoImages}
  //           />
  //         </View>
  //       </TouchableOpacity>
  //     );
  //   case 3:
  //     return (
  //       <TouchableOpacity
  //         activeOpacity={0.8}
  //         onPress={() => {
  //           marketImageClick();
  //         }}>
  //         <View style={styles.row}>
  //           <Image
  //             source={{uri: data?.images[0]?.image}}
  //             style={styles.threeImageLarge}
  //           />
  //           <View style={styles.column}>
  //             <Image
  //               source={{uri: data?.images[1]?.image}}
  //               style={styles.threeImageSmall}
  //             />
  //             <View style={styles.imageWithTextContainer}>
  //               <Image
  //                 source={{uri: data?.images[2]?.image}}
  //                 style={styles.threeImageSmall}
  //               />
  //               {/* <View style={styles.overlayContainer}>
  //               <Text style={styles.largeText}>4+</Text>
  //             </View> */}
  //             </View>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //     );
  //   default:
  //     return (
  //       <TouchableOpacity
  //         activeOpacity={0.8}
  //         onPress={() => {
  //           marketImageClick();
  //         }}>
  //         <View style={styles.row}>
  //           <Image
  //             source={{uri: data?.images[0]?.image}}
  //             style={styles.threeImageLarge}
  //           />
  //           <View style={styles.column}>
  //             <Image
  //               source={{uri: data?.images[1]?.image}}
  //               style={styles.threeImageSmall}
  //             />
  //             <View style={styles.imageWithTextContainer}>
  //               <Image
  //                 source={{uri: data?.images[2]?.image}}
  //                 style={styles.threeImageSmall}
  //               />
  //               <View style={styles.overlayContainer}>
  //                 <Text style={styles.largeText}>4+</Text>
  //               </View>
  //             </View>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //     );

  // case 4:
  //   return (
  //     <View style={styles.row}>
  //       <View style={styles.column}>
  //         <Image source={{uri: images[0]}} style={styles.fourImageLarge} />
  //       </View>
  //       <View style={styles.column}>
  //         <Image source={{uri: images[1]}} style={styles.fourImageSmall} />
  //         <Image source={{uri: images[2]}} style={styles.fourImageSmall} />
  //         <Image source={{uri: images[3]}} style={styles.fourImageSmall} />
  //       </View>
  //     </View>
  //   );
  // case 5:
  //   return (
  //     <View>
  //       <View style={styles.row}>
  //         <Image source={{uri: images[0]}} style={styles.five_twoImages} />
  //         <Image source={{uri: images[1]}} style={styles.five_twoImages} />
  //       </View>
  //       <View style={styles.row}>
  //         <View style={styles.imageContainer}>
  //           <Image
  //             source={{uri: images[2]}}
  //             style={styles.five_threeImages}
  //           />
  //           {/* <Text style={styles.overlayText}>Image Text 1</Text> */}
  //         </View>
  //         <View style={styles.imageContainer}>
  //           <Image
  //             source={{uri: images[3]}}
  //             style={styles.five_threeImages}
  //           />
  //           {/* <Text style={styles.overlayText}>Image Text 2</Text> */}
  //         </View>
  //         <View style={styles.imageContainer}>
  //           <Image
  //             source={{uri: images[4]}}
  //             style={styles.five_threeImages}
  //           />
  //           {/* <Text style={styles.overlayText}>Image Text 3</Text> */}
  //         </View>
  //       </View>
  //     </View>
  //   );

  // default:
  //   return (
  //     <View style={styles.defaultContainer}>
  //       <View style={styles.leftColumn}>
  //         <Image
  //           source={{uri: images[0]}}
  //           style={styles.defaultTwoImages}
  //         />
  //         <Image
  //           source={{uri: images[1]}}
  //           style={styles.defaultTwoImages}
  //         />
  //       </View>
  //       <View style={styles.rightColumn}>
  //         <Image
  //           source={{uri: images[2]}}
  //           style={styles.defaultThreeImages}
  //         />
  //         <Image
  //           source={{uri: images[3]}}
  //           style={styles.defaultThreeImages}
  //         />
  //         <View style={styles.defaultImageContainer}>
  //           <Image
  //             source={{uri: images[4]}}
  //             style={styles.defaultThreeImages}
  //           />
  //           <View style={styles.overlayContainer}>
  //             <Text style={styles.largeText}>5+</Text>
  //           </View>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // }
  // };

  return <View style={styles.container}>{renderImages()}</View>;
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    justifyContent: 'space-between',
  },
  singleImage: {
    width: '100%',
    height: 300,
    borderRadius: 4,
    resizeMode: 'cover',
  },
  twoImages: {
    width: '50%',
    height: 250,
    borderRadius: 4,
  },
  threeImageLarge: {
    width: '48%',
    height: 250,
    borderRadius: 4,
  },
  threeImageSmall: {
    width: '100%',
    height: 125,
    borderRadius: 4,
  },
  imageWithTextContainer: {
    position: 'relative',
    width: '100%',
    height: 125,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
  },
  largeText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size23,
    color: COLOR.White100,
  },
  five_twoImages: {
    width: '50%',
    height: 125,
    borderRadius: 4,
    // resizeMode: 'contain',
  },
  five_threeImages: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  defaultContainer: {
    flexDirection: 'row',
  },
  leftColumn: {
    width: '50%',
    // paddingRight: 5,
  },
  rightColumn: {
    width: '50%',
    // paddingLeft: 5,
  },
  defaultTwoImages: {
    width: '100%',
    height: 135,
    borderRadius: 4,
  },
  defaultThreeImages: {
    width: '100%',
    height: 90,
    borderRadius: 4,
  },
  defaultImageContainer: {
    width: '100%',
    height: 90,
    position: 'relative',
  },
  singleImage: {
    width: '100%',
    height: 280,
    borderRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: 14,
  },
  overlay: {
    flexDirection: 'row',
    position: 'absolute',
    paddingHorizontal: 8,
    top: '65%',
    left: 0,
    width: '100%',
    height: '35%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Semi-transparent background
  },
  overlayText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size18,
    color: COLOR.White100,
  },
});

export default ImageGrid;
