import React, {useEffect, useState} from 'react';
import {Modal, View, Text, TouchableOpacity, Image} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import COLOR from '../../../../constants/COLOR';
import IconManager from '../../../../assets/IconManager';
import {FontFamily, fontSizes} from '../../../../constants/FONT';
import SizedBox from '../../../../commonComponent/SizedBox';
import LiveStreamImageSlider from '../../../../commonComponent/liveStreamImageSlider';
import {useSelector} from 'react-redux';
import {marketCategory} from '../../../../constants/CONSTANT_ARRAY';

const LiveProductModal = ({modalVisible, setModalVisible, selectedVideo}) => {
  const translateY = useSharedValue(0); // Keeps track of vertical movement
  const [categoryname, setCategoryName] = useState('');
  const productList = useSelector(
    state => state.LiveStreamSlice.liveProductList,
  );

  const getCategoryName = categoryId => {
    const category = marketCategory.find(cat => cat.category_id === categoryId);
    if (category) {
      setCategoryName(category.name);
    } else {
      setCategoryName('Category not found');
    }
  };

  useEffect(() => {
    getCategoryName(productList[0]?.category);
  }, [productList[0]?.category]);

  // Reset modal position when it becomes visible
  useEffect(() => {
    if (modalVisible) {
      translateY.value = 0; // Reset translationY when modal is shown
    }
  }, [modalVisible]);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: event => {
      'worklet';
      translateY.value = event.translationY; // Track drag
    },
    onEnd: event => {
      'worklet';
      if (event.translationY > 150) {
        runOnJS(setModalVisible)(false); // Close modal if dragged down enough
      } else {
        translateY.value = withSpring(0); // Reset to initial position if not dragged down enough
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setModalVisible(false);
        }}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0)', // Adjusted opacity
        }}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              {
                backgroundColor: 'white',
                padding: 16,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              },
              animatedStyle, // Apply animated style for drag gesture
            ]}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LiveStreamImageSlider
                images={productList[0]?.product_media_data}
              />
            </View>
            <SizedBox height={8} />
            <Text
              numberOfLines={1}
              style={{
                fontSize: fontSizes.size17,
                color: COLOR.Grey500,
                fontFamily: FontFamily.PoppinSemiBold,
              }}>
              {productList[0]?.name}
            </Text>
            <SizedBox height={8} />
            <Text
              numberOfLines={1}
              style={{
                fontSize: fontSizes.size23,
                color: COLOR.Primary,
                fontFamily: FontFamily.PoppinSemiBold,
              }}>
              {`${productList[0]?.price} Ks`}
            </Text>
            <SizedBox height={8} />
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: fontSizes.size16,
                  color: COLOR.Grey500,
                  fontFamily: FontFamily.PoppinRegular,
                }}>
                {`QTY : `}
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  backgroundColor: COLOR.Primary,
                  borderRadius: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {}}>
                <Image
                  source={IconManager.decrease_icon}
                  style={{
                    width: 16,
                    height: 10,
                    margin: 6,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
              <SizedBox width={12} />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: fontSizes.size16,
                  color: COLOR.Grey500,
                  fontFamily: FontFamily.PoppinRegular,
                }}>
                {productList[0]?.units}
              </Text>
              <SizedBox width={12} />
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  backgroundColor: COLOR.Primary,
                  borderRadius: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {}}>
                <Image
                  source={IconManager.increase_icon}
                  style={{
                    width: 16,
                    height: 10,
                    margin: 6,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>
            <SizedBox height={8} />
            <Text
              numberOfLines={1}
              style={{
                fontSize: fontSizes.size23,
                color: COLOR.Grey500,
                fontFamily: FontFamily.PoppinSemiBold,
              }}>
              Product Details
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: fontSizes.size16,
                  color: COLOR.Grey500,
                  fontFamily: FontFamily.PoppinRegular,
                  width: '30%',
                }}>
                Type
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  width: '70%',
                  fontSize: fontSizes.size16,
                  color: COLOR.Grey500,
                  fontFamily: FontFamily.PoppinRegular,
                }}>
                : {productList[0]?.condition === '0' ? 'New' : 'Used'}
              </Text>
            </View>
            <SizedBox height={8} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: fontSizes.size16,
                  color: COLOR.Grey500,
                  fontFamily: FontFamily.PoppinRegular,
                  width: '30%',
                }}>
                Category
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  width: '70%',
                  fontSize: fontSizes.size16,
                  color: COLOR.Grey500,
                  fontFamily: FontFamily.PoppinRegular,
                }}>
                {`: ${categoryname}`}
              </Text>
            </View>
            <SizedBox height={8} />
            <Text
              numberOfLines={1}
              style={{
                fontSize: fontSizes.size16,
                color: COLOR.Grey500,
                fontFamily: FontFamily.PoppinRegular,
              }}>
              {productList[0]?.description}
            </Text>
            <SizedBox height={12} />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: COLOR.Primary,
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: COLOR.White100,
                  fontFamily: FontFamily.PoppinSemiBold,
                  fontSize: fontSizes.size16,
                }}>
                Buy Now
              </Text>
            </TouchableOpacity>
            <SizedBox height={8} />
          </Animated.View>
        </PanGestureHandler>
      </TouchableOpacity>
    </Modal>
  );
};

export default LiveProductModal;
