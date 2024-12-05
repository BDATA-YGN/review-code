import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Modal,
  Animated,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import RADIUS from '../../constants/RADIUS';
import IconManager from '../../assets/IconManager';
import SPACING from '../../constants/SPACING';
import ImageSlider from '../../commonComponent/ImageSlider';
import {FontFamily, fontSizes} from '../../constants/FONT';
import SizedBox from '../../commonComponent/SizedBox';
import {formatPrice} from '../../helper/PriceFormat';
import {marketCategory, shareOptions} from '../../constants/CONSTANT_ARRAY';
import AppReaction from './reaction_comment_share/app_reaction';
import AppComment from './reaction_comment_share/app_comment';
import AppShare from './reaction_comment_share/app_share';
import ConfirmationDialog from './MarketHelper/confirmation_dialog';
import {
  emojiList,
  getPostById,
  makeDeteteProduct,
} from '../../helper/Market/MarketHelper';
import {useDispatch, useSelector} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import CustomToast from './MarketHelper/custom_toast';
import ModalComponent from '../../commonComponent/ModalComponent';
import { submitGetCurrencies } from '../../helper/ApiModel';

const ProductDetails = ({route}) => {
  const layout = useWindowDimensions();
  const navigation = useNavigation();
  const {darkMode, product , currencies} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0]; // Initial value for opacity: 0
  const [dialogVisible, setDialogVisible] = useState(false); // State for dialog visibility
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const dummyData = [{data: 'Dummy', id: 1101}];

  const postData = useSelector(state => state.MarketSlice.postData);
  const fetchPostById = useSelector(state => state.MarketSlice.fetchPostById);
  const [openShareModal, setOpenModal] = useState(false);
  const pageList = useSelector(state => state.MarketSlice.pageList);
  const groupList = useSelector(state => state.MarketSlice.groupList);
  const formattedDescription = product.description.replace(/&lt;br&gt;/g, '\n');
  

  useEffect(() => {

    getPostById(dispatch, product.post_id);
    emojiList(dispatch);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // fetchAddress(dispatch);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const showToast = () => {
    setToastVisible(true);
  };
  const handleCopyLink = () => {
    showToast();
    Clipboard.setString(product.url);
    setModalVisible(false);
  };

  const startLoading = () => {
    setLoading(true);
  };

  const closeLoading = () => {
    setLoading(false);
  };

  const handleDeletePress = id => {
    setModalVisible(false);
    setDialogVisible(true);
  };

  const confirmDelete = () => {
    makeDeteteProduct(
      dispatch,
      product.post_id,
      handleCloseDialog,
      navigation,
      startLoading,
      closeLoading,
    );
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  const findCategoryName = categoryId => {
    const category = marketCategory.find(cat => cat.category_id === categoryId);
    return category ? category.name : null;
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const renderItem = () => (
    <View>
      <ImageSlider images={product?.images} />
      <View
        style={{
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        }}>
        <CustomToast
          message="Link copied!"
          visible={toastVisible}
          onHide={() => setToastVisible(false)}
        />
        <Text
          style={{
            marginTop: SPACING.sp16,
            fontFamily: FontFamily.PoppinBold,
            fontSize: fontSizes.size19,
            marginHorizontal: SPACING.sp16,
            color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
          }}>
          {product?.name}
        </Text>
        <Text
          style={{
            marginHorizontal: SPACING.sp16,
            fontFamily: FontFamily.PoppinSemiBold,
            fontSize: fontSizes.size14,
            color: darkMode === 'enable' ? COLOR.Primary : COLOR.Primary,
          }}>
           {currencies?.[product?.currency]?.currency ? `${formatPrice(product?.price)} ${currencies[product?.currency].currency}` : ''}

        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: SPACING.sp16,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditProduct', {
                product: product,
                darkMode: darkMode,
              });
            }}
            activeOpacity={0.8}
            style={styles.buttonEdit}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: SPACING.sp18,
                  height: SPACING.sp18,
                  resizeMode: 'contain',
                }}
                source={IconManager.editing_white}
              />
              <SizedBox width={SPACING.sp8} />
              <Text style={styles.buttonTextLight}>Edit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOpenModal(!openShareModal)}
            activeOpacity={0.8}
            style={[styles.buttonShare]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: SPACING.sp18,
                  height: SPACING.sp18,
                  resizeMode: 'contain',
                }}
                source={IconManager.share_lightMode}
              />
              <SizedBox width={SPACING.sp8} />
              <Text style={[styles.buttonTextLightShare]}>Share</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderBottomWidth: 0.3,
            marginHorizontal: SPACING.sp16,
            borderBottomColor:
              darkMode === 'enable' ? COLOR.White100 : COLOR.Primary,
          }}
        />
        <View>
          <Text
            style={{
              margin: SPACING.sp16,
              fontFamily: FontFamily.PoppinBold,
              fontSize: fontSizes.size18,
              color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
            }}>
            Seller Information
          </Text>
          <TouchableOpacity
            style={{
              justifyContent: 'flex-start',
              marginHorizontal: SPACING.sp16,
              marginBottom: SPACING.sp16,
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => navigation.navigate('OtherUserProfile', {
              otherUserData: product.user_data,
              userId: product.user_data.user_id,
            })}
            >
            <Image
              source={{uri: product?.user_data.avatar}}
              style={{
                width: 45,
                height: 45,
                borderRadius: 20,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                marginLeft: SPACING.sp16,
                fontFamily: FontFamily.PoppinSemiBold,
                fontSize: fontSizes.size15,
                color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
              }}>
                {product?.user_data.first_name} {''} {product?.user_data.last_name}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderBottomWidth: 0.3,
            marginHorizontal: SPACING.sp16,
            marginBottom: SPACING.sp16,
            borderBottomColor:
              darkMode === 'enable' ? COLOR.White100 : COLOR.Primary,
          }}
        />
        <View>
          <Text
            style={{
              marginHorizontal: SPACING.sp16,
              // marginBottom: SPACING.sp16,
              fontFamily: FontFamily.PoppinBold,
              fontSize: fontSizes.size16,
              color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
            }}>
            Product Details
          </Text>
          <View
            style={{
              justifyContent: 'flex-start',
              marginHorizontal: SPACING.sp16,
              marginBottom: SPACING.sp16,
              marginTop: SPACING.sp8,
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginLeft: SPACING.sp4,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  width: '30%',
                  fontSize: fontSizes.size14,
                  fontFamily: FontFamily.PoppinSemiBold,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey400,
                }}>
                Type
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  width: '70%',
                  fontSize: fontSizes.size14,
                  fontFamily: FontFamily.PoppinSemiBold,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                }}>
                : Brand New
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginLeft: SPACING.sp4,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  width: '30%',
                  fontSize: fontSizes.size14,
                  fontFamily: FontFamily.PoppinSemiBold,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey400,
                }}>
                Status
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  width: '70%',
                  fontSize: fontSizes.size14,
                  fontFamily: FontFamily.PoppinSemiBold,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                }}>
                {`: ${product?.units <= 0 ? 'Unavailable' : 'In Stock'}`} ({product?.units})
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginLeft: SPACING.sp4,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  width: '30%',
                  fontSize: fontSizes.size14,
                  fontFamily: FontFamily.PoppinSemiBold,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey400,
                }}>
                Location
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  width: '70%',
                  fontSize: fontSizes.size14,
                  fontFamily: FontFamily.PoppinSemiBold,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                }}>
                {`: ${product?.location}`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginLeft: SPACING.sp4,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  width: '30%',
                  fontSize: fontSizes.size14,
                  fontFamily: FontFamily.PoppinSemiBold,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey400,
                }}>
                Reviews
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  width: '70%',
                  fontSize: fontSizes.size14,
                  fontFamily: FontFamily.PoppinSemiBold,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                }}>
                {`: ${product?.reviews_count} Reviews`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginLeft: SPACING.sp4,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  width: '30%',
                  fontSize: fontSizes.size14,
                  fontFamily: FontFamily.PoppinSemiBold,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey400,
                }}>
                Category
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  width: '70%',
                  fontSize: fontSizes.size14,
                  fontFamily: FontFamily.PoppinSemiBold,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                }}>
                {`: ${findCategoryName(product?.category)}`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: SPACING.sp8,
              }}>
              <Text
                // numberOfLines={2}
                style={{
                  width: '100%',
                  fontSize: fontSizes.size14,
                  fontFamily: FontFamily.PoppinSemiBold,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                }}>
                {formattedDescription}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 0.3,
            marginHorizontal: SPACING.sp16,
            marginBottom: SPACING.sp16,
            borderBottomColor:
              darkMode === 'enable' ? COLOR.White100 : COLOR.Primary,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: SPACING.sp16,
          }}>
          <AppReaction darkMode={darkMode} />
          <AppComment darkMode={darkMode} />
          <AppShare
            darkMode={darkMode}
            openShareModal={openShareModal}
            setOpenModal={setOpenModal}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // backgroundColor: 'pink',
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
      }}>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={COLOR.Primary} />
        </View>
      )}
      <ConfirmationDialog
        headerLable={'Confirm Deletion'}
        visible={dialogVisible}
        onConfirm={confirmDelete}
        onCancel={() => setDialogVisible(false)}
        darkMode={darkMode}
        lableText={'Are you sure you want to delete this product?'}
        buttonOne={'Cancel'}
        buttonTwo={'Delete'}
      />
      <View style={{position: 'relative'}}>
        <View style={[styles.appBarIconWrapper]}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.goBack()}>
            <Image
              source={IconManager.light_dark_back}
              tintColor={COLOR.PrimaryBlue50}
              style={{
                width: SPACING.sp24,
                height: SPACING.sp24,
                resizeMode: 'contain',
                marginHorizontal: SPACING.sp16,
                marginVertical: SPACING.sp12,
                // backgroundColor: 'black',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.moreIconContainer]}
            onPress={() => {
              openModal();
            }}>
            <Image
              source={IconManager.more_dark}
              tintColor={COLOR.PrimaryBlue50}
              style={{
                width: SPACING.sp22,
                height: SPACING.sp24,
                resizeMode: 'contain',
                marginHorizontal: SPACING.sp16,
                marginVertical: SPACING.sp12,
                // backgroundColor: 'black',
              }}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={dummyData}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingBottom: 16}} // Added paddingBottom
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
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
                    marginHorizontal: SPACING.sp16,
                    marginTop: SPACING.sp16,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      styles.modalText,
                      {
                        color:
                          darkMode === 'enable'
                            ? COLOR.White100
                            : COLOR.Grey500,
                      },
                    ]}>
                    More
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      closeModal();
                    }}>
                    <Image
                      source={
                        darkMode === 'enable'
                          ? IconManager.close_dark
                          : IconManager.close_light
                      }
                      style={{width: 18, height: 18, resizeMode: 'contain'}}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0.4,
                    marginTop: SPACING.sp16,
                    borderBottomColor:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Primary,
                  }}
                />
                <View
                  style={{
                    marginHorizontal: SPACING.sp16,
                    marginBottom: SPACING.sp16,
                    width: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      closeModal();
                      navigation.navigate('EditProduct', {
                        product: product,
                        darkMode: darkMode,
                      });
                    }}
                    style={{justifyContent: 'flex-start', width: '100%'}}>
                    <Text
                      style={{
                        marginVertical: SPACING.sp10,
                        fontFamily: FontFamily.PoppinRegular,
                        fontSize: fontSizes.size14,
                        color:
                          darkMode === 'enable'
                            ? COLOR.White100
                            : COLOR.Grey500,
                      }}>
                      Edit Product
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      handleDeletePress();
                    }}
                    style={{justifyContent: 'flex-start', width: '100%'}}>
                    <Text
                      style={{
                        marginVertical: SPACING.sp10,
                        fontFamily: FontFamily.PoppinRegular,
                        fontSize: fontSizes.size14,
                        color:
                          darkMode === 'enable'
                            ? COLOR.White100
                            : COLOR.Grey500,
                      }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      handleCopyLink();
                    }}
                    style={{justifyContent: 'flex-start', width: '100%'}}>
                    <Text
                      style={{
                        marginVertical: SPACING.sp10,
                        fontFamily: FontFamily.PoppinRegular,
                        fontSize: fontSizes.size14,
                        color:
                          darkMode === 'enable'
                            ? COLOR.White100
                            : COLOR.Grey500,
                      }}>
                      Copy Link
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setModalVisible(false);
                      setOpenModal(!openShareModal);
                    }}
                    style={{justifyContent: 'flex-start', width: '100%'}}>
                    <Text
                      style={{
                        marginTop: SPACING.sp10,
                        fontFamily: FontFamily.PoppinRegular,
                        fontSize: fontSizes.size14,
                        color:
                          darkMode === 'enable'
                            ? COLOR.White100
                            : COLOR.Grey500,
                      }}>
                      Share
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <ModalComponent
        openModal={openShareModal}
        closeModal={() => setOpenModal(false)}
        options={shareOptions}
        postid={postData.post_id}
        post={postData}
        reaction={null}
        groupList={groupList}
        pageList={pageList}
        message={"You can't share!"}
        posts={postData}
        isReactEnable={false}
        doReaction={false}
        darkMode={darkMode}
        isMarket="SHARE_MARKET"
      />
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure the overlay is on top
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: COLOR.White100,
    borderRadius: RADIUS.rd12,
    marginHorizontal: SPACING.sp32,
  },
  modalText: {
    fontSize: fontSizes.size19,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  slider: {
    width: Platform.OS === 'android' ? '107%' : '100%',
    height: Platform.OS === 'android' ? 50 : 40, // Adjust height for Android
    marginVertical: 20, // Add vertical margin for spacing
  },
  sliderValueText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  modalCloseButton: {
    textAlign: 'center',
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
  },
  reactionStyle: {
    // backgroundColor: COLOR.Primary,
    borderRadius: SPACING.sp8,
    width: '32%',
    // height: SPACING.sp40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonEdit: {
    backgroundColor: COLOR.Primary,
    borderRadius: SPACING.sp8,
    width: '60%',
    height: SPACING.sp40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonShare: {
    backgroundColor: COLOR.Blue100,
    borderRadius: SPACING.sp8,
    width: '36%',
    height: SPACING.sp40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextLight: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size12,
    color: COLOR.White,
  },
  buttonTextLightShare: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size12,
    color: COLOR.Grey500,
  },
  appBarIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 48,
    // alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
});
