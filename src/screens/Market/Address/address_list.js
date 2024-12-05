import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Animated,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import COLOR from '../../../constants/COLOR';
import RADIUS from '../../../constants/RADIUS';
import IconManager from '../../../assets/IconManager';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import SPACING from '../../../constants/SPACING';
import SizedBox from '../../../commonComponent/SizedBox';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchAddress,
  makeDeteteAddress,
} from '../../../helper/Market/MarketHelper';
import ConfirmationDialog from '../MarketHelper/confirmation_dialog';
import CustomCheckBox from '../../../components/Button/CustomCheckBox';
import {setCheckedItem} from '../../../stores/slices/market_slice';
import ProductEmptyScreen from '../product_empty_screen';

const AddressList = ({route}) => {
  const navigation = useNavigation();
  const {darkMode} = route.params;
  const [isChecked, setChecked] = useState(false);
  const [codChecked, setCodChecked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false); // State for dialog visibility
  const [selectedAddressId, setSelectedAddressId] = useState(null); // State for selected address ID
  const addressList = useSelector(state => state.MarketSlice.addressList);
  const fetchAddressData = useSelector(
    state => state.MarketSlice.fetchAddressData,
  );
  const checkedItem = useSelector(state => state.MarketSlice.checkedItem);
  const dispatch = useDispatch();
  // const [checkedItemId, setCheckedItemId] = useState(null); // State to track the checked item
  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAddress(dispatch);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const dummyCartList = [];

  // useEffect(() => {
  //   setCheckedItemId(addressList.length > 0 ? addressList[0].id : null);
  // }, []);

  const handleDeletePress = id => {
    setSelectedAddressId(id);
    setDialogVisible(true);
  };

  const confirmDelete = () => {
    makeDeteteAddress(dispatch, selectedAddressId);
    setDialogVisible(false);
  };

  const handleEdit = address => {
    navigation.navigate('EditAddress', {address});
  };

  const numColumns = 1;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - (numColumns + 1) * 16) / numColumns;
  const itemWidthEdit = (screenWidth - (numColumns + 1) * 18) / numColumns;
  const heightToWidthRatio = 175 / 171;
  const itemHeight = itemWidth * heightToWidthRatio;
  const itemHeightEdit = itemWidthEdit * heightToWidthRatio;
  const extractHeight = itemHeight / 2.5;
  const extractHeightEdit = itemHeightEdit / 2.5;

  const translateY1 = useRef(new Animated.Value(0)).current;
  const translateY2 = useRef(new Animated.Value(0)).current;
  const translateY3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY1, {
            toValue: -8,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY1, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY2, {
            toValue: -8,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY2, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY3, {
            toValue: -8,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY3, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animate();
  }, [translateY1, translateY2, translateY3]);

  const handleCheckBox = item => {
    // setCheckedItemId(prevId => (prevId === id ? null : id)); // Toggle the checkbox
    {
      checkedItem !== null
        ? checkedItem.id === item.id
          ? dispatch(setCheckedItem(checkedItem))
          : dispatch(setCheckedItem(item))
        : null;
    }
  };

  const renderItem = ({item}) => (
    <View
      style={[
        styles.itemCart,
        {
          width: itemWidth,
          height: itemHeight / 3,
          backfaceVisibility: COLOR.Blue50,
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
        },
      ]}>
      <View
        style={{
          flexDirection: 'row',
          width: itemWidthEdit - 1,
          height: extractHeightEdit / 4,
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
          borderTopLeftRadius: RADIUS.rd8,
          borderTopRightRadius: RADIUS.rd8,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: SPACING.sp16,
        }}>
        <Text
          style={{
            fontFamily: FontFamily.PoppinSemiBold,
            fontSize: fontSizes.size16,
            color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
          }}>
          {item.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View>
            <CustomCheckBox
              value={checkedItem !== null ? checkedItem.id === item.id : null}
              darkMode={darkMode}
              onValueChange={() => handleCheckBox(item)}
              tintColorTrue={COLOR.Primary}
              tintColorFalse={COLOR.Primary}
            />
          </View>
          <SizedBox width={4} />
          <TouchableOpacity
            activeOpacity={0.8}
            style={{}}
            onPress={() => handleEdit(item)}>
            <Image
              source={
                darkMode === 'enable'
                  ? IconManager.editing_white
                  : IconManager.editing_light
              }
              style={{
                width: 18,
                height: 18,
                resizeMode: 'contain',
                margin: 4,
              }}
            />
          </TouchableOpacity>
          <SizedBox width={4} />
          <TouchableOpacity
            onPress={() => handleDeletePress(item.id)}
            activeOpacity={0.8}
            style={{}}>
            <Image
              source={
                darkMode === 'enable'
                  ? IconManager.delete_white
                  : IconManager.delete_light
              }
              style={{
                width: 18,
                height: 18,
                resizeMode: 'contain',
                margin: 4,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: itemWidthEdit - 1,
          height: extractHeightEdit / 1.8,
          borderBottomRightRadius: RADIUS.rd8,
          borderBottomLeftRadius: RADIUS.rd8,
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
          justifyContent: 'center',
          paddingHorizontal: SPACING.sp16,
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: FontFamily.PoppinRegular,
            fontSize: fontSizes.size14,
            color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
          }}>
          {item.phone}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: FontFamily.PoppinRegular,
            fontSize: fontSizes.size14,
            color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
          }}>
          {item.address}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: FontFamily.PoppinRegular,
            fontSize: fontSizes.size14,
            color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
          }}>
          {`${item.country}/${item.city}`}
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        paddingVertical: 16,
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('CreateAddress');
        }}
        style={{
          backgroundColor: COLOR.Primary,
          borderRadius: RADIUS.rd8,
          width: '90%',
          padding: 12,
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
          source={IconManager.add_product_white}
        />
        <SizedBox width={SPACING.sp8} />
        <Text
          style={{
            fontFamily: FontFamily.PoppinSemiBold,
            fontSize: fontSizes.size17,
            color: COLOR.White100,
          }}>
          Add New Address
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomWidth: 0.3,
          borderBottomColor: COLOR.Grey300,
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={{}}>
          <Image
            source={
              darkMode === 'enable'
                ? IconManager.back_dark
                : IconManager.back_light
            }
            style={{
              width: SPACING.sp18,
              height: SPACING.sp18,
              resizeMode: 'contain',
              margin: SPACING.sp16,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: FontFamily.PoppinRegular,
            fontSize: fontSizes.size16,
            color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
          }}>
          My Address
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('CreateAddress');
          }}>
          <Image
            source={
              darkMode === 'enable'
                ? IconManager.icon_add_white
                : IconManager.icon_add_primary
            }
            style={{width: 18, height: 18, resizeMode: 'contain', margin: 16}}
          />
        </TouchableOpacity>
      </View>
      {fetchAddressData ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:
              darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
            flexDirection: 'row',
          }}>
          <Animated.Text
            style={{
              color: COLOR.Primary,
              transform: [{translateY: translateY1}],
              marginHorizontal: 2,
              fontSize: 55,
            }}>
            .
          </Animated.Text>
          <Animated.Text
            style={{
              color: COLOR.Primary,
              transform: [{translateY: translateY2}],
              marginHorizontal: 2,
              fontSize: 55,
            }}>
            .
          </Animated.Text>
          <Animated.Text
            style={{
              color: COLOR.Primary,
              transform: [{translateY: translateY3}],
              marginHorizontal: 2,
              fontSize: 55,
            }}>
            .
          </Animated.Text>
        </View>
      ) : addressList.length > 0 ? (
        <View style={{flex: 1}}>
          <FlatList
            data={addressList}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            numColumns={numColumns}
            contentContainerStyle={{gap: 16, padding: 16, paddingBottom: 80}} // Added paddingBottom
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      ) : (
        <ProductEmptyScreen
          darkMode={darkMode}
          image={
            darkMode === 'enable'
              ? IconManager.product_empty_dark
              : IconManager.product_empty_light
          }
          header="No Address"
          body="Start adding your address"
        />
      )}
      <ConfirmationDialog
        headerLable={'Confirm Deletion'}
        visible={dialogVisible}
        onConfirm={confirmDelete}
        onCancel={() => setDialogVisible(false)}
        darkMode={darkMode}
        lableText={'Are you sure you want to delete this address?'}
        buttonOne={'Cancel'}
        buttonTwo={'Delete'}
      />
    </SafeAreaView>
  );
};

export default AddressList;

const styles = StyleSheet.create({
  item: {
    // backgroundColor: COLOR.Blue50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: RADIUS.rd8,
    paddingHorizontal: 8,
  },
  itemCart: {
    // backgroundColor: COLOR.Blue50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: RADIUS.rd8,
    padding: 8,
    borderWidth: 1,
    borderColor: COLOR.Primary,
  },
  title: {
    fontSize: 16,
    color: COLOR.White100,
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    paddingVertical: 16,
    alignItems: 'center',
  },
});
