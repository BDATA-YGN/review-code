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
  const translateY = useSharedValue(0);
  const [categoryname, setCategoryName] = useState('');
  const [quantity, setQuantity] = useState(1); // Quantity state initialized to 1
  const productList = useSelector(
    state => state.LiveStreamSlice.liveProductList,
  );

  const getCategoryName = categoryId => {
    const category = marketCategory.find(cat => cat.category_id === categoryId);
    setCategoryName(category ? category.name : 'Category not found');
  };

  useEffect(() => {
    getCategoryName(productList[0]?.category);
  }, [productList[0]?.category]);

  useEffect(() => {
    if (modalVisible) {
      translateY.value = 0;
    }
  }, [modalVisible]);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: event => {
      'worklet';
      translateY.value = event.translationY;
    },
    onEnd: event => {
      'worklet';
      if (event.translationY > 150) {
        runOnJS(setModalVisible)(false);
      } else {
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const increaseQuantity = () => {
    if (quantity < productList[0]?.units) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1)); // Prevents quantity from going below 1
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0)',
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
              animatedStyle,
            ]}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <LiveStreamImageSlider
                images={productList[0]?.product_media_data}
              />
            </View>
            <SizedBox height={8} />
            <Text
              numberOfLines={1}
              style={{
                fontSize: fontSizes.size16,
                color: COLOR.Grey500,
                fontFamily: FontFamily.PoppinSemiBold,
              }}>
              {productList[0]?.name}
            </Text>
            <SizedBox height={8} />
            <Text
              numberOfLines={1}
              style={{
                fontSize: fontSizes.size16,
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
                alignItems: 'center',
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
                style={{padding: 10}}
                onPress={decreaseQuantity}>
                <View
                  activeOpacity={1}
                  style={{
                    backgroundColor: COLOR.Primary,
                    borderRadius: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={IconManager.decrease_icon}
                    style={{
                      width: 16,
                      height: 10,
                      marginVertical: 8,
                      marginHorizontal: 6,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              </TouchableOpacity>
              <SizedBox width={12} />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: fontSizes.size16,
                  color: COLOR.Grey500,
                  fontFamily: FontFamily.PoppinRegular,
                }}>
                {quantity}
              </Text>
              <SizedBox width={12} />
              <TouchableOpacity
                style={{padding: 10}}
                onPress={increaseQuantity}>
                <View
                  activeOpacity={1}
                  style={{
                    backgroundColor: COLOR.Primary,
                    borderRadius: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={IconManager.increase_icon}
                    style={{
                      width: 16,
                      height: 10,
                      marginVertical: 8,
                      marginHorizontal: 6,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <SizedBox height={8} />
            <Text
              numberOfLines={1}
              style={{
                fontSize: fontSizes.size18,
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
                  fontSize: fontSizes.size14,
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
                  fontSize: fontSizes.size14,
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
                  fontSize: fontSizes.size14,
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
                  fontSize: fontSizes.size14,
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
                fontSize: fontSizes.size14,
                color: COLOR.Grey500,
                fontFamily: FontFamily.PoppinRegular,
              }}>
              {productList[0]?.description}
            </Text>
            <SizedBox height={8} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: fontSizes.size14,
                  color: COLOR.Primary,
                  fontFamily: FontFamily.PoppinSemiBold,
                }}>
                Total Price
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: fontSizes.size14,
                  color: COLOR.Primary,
                  fontFamily: FontFamily.PoppinSemiBold,
                }}>
                {`${quantity * productList[0]?.price} Ks`}
              </Text>
            </View>
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
