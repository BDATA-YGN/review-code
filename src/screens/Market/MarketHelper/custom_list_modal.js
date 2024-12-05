import React, {useRef, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  FlatList,
  Animated,
  Alert,
} from 'react-native';
import SPACING from '../../../constants/SPACING';
import COLOR from '../../../constants/COLOR';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import SizedBox from '../../../commonComponent/SizedBox';
import {useDispatch} from 'react-redux';
import {
  fetchOrderList,
  filetrMarketList,
  filterMyProductList,
  filterOrderedList,
  filterPurchasedList,
  getMarket,
  getMyProduct,
  getPurchased,
} from '../../../helper/Market/MarketHelper';

const CustomListModal = ({
  visible,
  closeModal,
  darkMode,
  marketCategory,
  selectedCategory,
  setSelectedCategory,
  flatListHeight,
  slideAnim,
  layout,
  iconPrefixDark,
  iconPrefixLight,
  iconPostfixDark,
  iconPostfixLight,
  title,
  dispatch,
  filerType,
  keyword,
}) => {
  
  const fetchFilteredMarketList = (item) => {
     if(item.category_id == '0') {
      getMarket(dispatch);
     }else {
      filetrMarketList(dispatch, item.category_id , keyword)
     }
  }
  const fetchFilteredMyMarketList = (item) => {
    if(item.category_id == '0') {
     getMyProduct(dispatch);
     
    }else {
     filterMyProductList(dispatch, item.category_id , keyword)
     
    }
 }
 const fetchFilteredMyPurchasedList = (item) => {
  
  if(item.category_id == '0') {
   getPurchased(dispatch);
   
  }else {
   filterPurchasedList(dispatch, item.category_id, keyword)
   
  }
}
const fetchFilteredMyOrderList = (item) => {
  if(item.category_id == '0') {
  fetchOrderList(dispatch);
   
  }else {
   filterOrderedList(dispatch, item.category_id , keyword)
   
  }
}
  return (
    <Modal transparent={true} visible={visible} onRequestClose={closeModal}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={[styles.modalOverlay]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layout.height, 0],
                      }),
                    },
                  ],
                },
                {
                  backgroundColor:
                    darkMode === 'enable'
                      ? COLOR.DarkThemLight
                      : COLOR.White100,
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={
                      darkMode === 'enable' ? iconPrefixDark : iconPrefixLight
                    }
                    style={{width: 16, height: 16, resizeMode: 'contain'}}
                  />
                  <SizedBox width={SPACING.sp8} />
                  <Text
                    style={{
                      fontSize: fontSizes.size19,
                      fontFamily: FontFamily.PoppinSemiBold,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    }}>
                    {title}
                  </Text>
                </View>
                <TouchableOpacity onPress={closeModal} activeOpacity={0.7}>
                  <Image
                    source={
                      darkMode === 'enable' ? iconPostfixDark : iconPostfixLight
                    }
                    style={{width: 16, height: 16, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </View>
              <SizedBox height={SPACING.sp12} />
              <View
                style={{
                  width: '100%',
                  height: 0.5,
                  backgroundColor:
                    darkMode === 'enable' ? COLOR.White100 : COLOR.Grey200,
                }}
              />
              <View style={{height: flatListHeight}}>
                <FlatList
                  data={marketCategory}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <View
                      style={{
                        backgroundColor:
                          darkMode === 'enable'
                            ? COLOR.White100
                            : COLOR.Grey200,
                      }}>
                      <TouchableOpacity
                        style={{
                          marginBottom: 0.5,
                          backgroundColor:
                            item === selectedCategory
                              ? COLOR.PrimaryBlue50
                              : darkMode === 'enable'
                              ? COLOR.DarkThemLight
                              : COLOR.White100,
                        }}
                        activeOpacity={0.9}
                        onPress={() => {
                          setSelectedCategory(item);
                          switch (filerType) {
                            case 'MARKET':
                              fetchFilteredMarketList(item);
                              break;
                            case 'MY_MARKET':
                              fetchFilteredMyMarketList(item);
                              break;
                            case 'MY_PURCHASED':
                              fetchFilteredMyPurchasedList(item);
                              break;
                              case 'MY_ORDER':
                                fetchFilteredMyOrderList(item);
                                break;
                            default:
                              console.error('Invalid filter type');
                          }
                          
                          
                          closeModal();
                        }}>
                        <Text
                          style={{
                            paddingVertical: SPACING.sp12,
                            fontFamily: FontFamily.PoppinRegular,
                            fontSize: fontSizes.size16,
                            color:
                              item === selectedCategory
                                ? COLOR.White100
                                : darkMode === 'enable'
                                ? COLOR.White100
                                : COLOR.Grey600,
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  style={{
                    maxHeight: flatListHeight,
                  }}
                />
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    borderRadius: 10,
    padding: 16,
    justifyContent: 'center',
  },
};

export default CustomListModal;
