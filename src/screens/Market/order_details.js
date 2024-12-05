import React, {useEffect, useId, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import RADIUS from '../../constants/RADIUS';
import IconManager from '../../assets/IconManager';
import {FontFamily, fontSizes} from '../../constants/FONT';
import SPACING from '../../constants/SPACING';
import ProductEmptyScreen from './product_empty_screen';
import {useDispatch, useSelector} from 'react-redux';
import {addMarketItem} from '../../stores/slices/market_slice';
import {formatPrice} from '../../helper/PriceFormat';
import {
  fetchCredentialData,
  filetrMarketList,
  sendInvoice,
} from '../../helper/Market/MarketHelper';
import CustomListModal from './MarketHelper/custom_list_modal';
import {marketCategory} from '../../constants/CONSTANT_ARRAY';
import LoadingDots from './MarketHelper/loading_dots';
import ProgressButton from './MarketHelper/ProgressButton';
import SuccessedDialogNoAction from './MarketHelper/success_dialog_no_action';
import ActionButton from '../../components/Button/ActionButton';
import { submitChangeOrderStatus } from '../../helper/ApiModel';

const OrderedDetails = ({route}) => {
  const navigation = useNavigation();
  const {darkMode, data} = route.params;
  const dispatch = useDispatch();
  const addressList = useSelector(state => state.MarketSlice.addressList);
  const isSendInvoiceMail = useSelector(
    state => state.MarketSlice.isSendInvoiceMail,
  );
  const dummyData = [{data: 'Data', id: 'my_id'}];
  const fetchMarketData = useSelector(
    state => state.MarketSlice.fetchMarketData,
  );
  const [statusModalVisible , setStatusModalVisible] = useState(false);
  const [cancelModalVisible , setCancelModalVisible] = useState(false);
  const [shippedModalVisible , setShippedModalVisible] = useState(false);
  const [selectedOrderStatus , setSelectedOrderStatus] = useState("");
 
  const slideAnim = useState(new Animated.Value(0))[0]; 
  const layout = useWindowDimensions();

  useEffect(() => {
    setSelectedOrderStatus(data.orders[0].status)
    console.log(selectedOrderStatus);
    
  },[])

  const sendInvoieToMail = orderHashId => {
    sendInvoice(dispatch, orderHashId, handleShowDialog);
  };

 

  const handleChangeStatus = async (status) => {
   
    setStatusModalVisible(false)
    if (status === 'canceled') {
      setCancelModalVisible(true);
    } else if (status === 'shipped') {
      setShippedModalVisible(true);
    } else {
      // Call the status change handler only after the state has been updated
      await handleChangeOrderStatus(data.order_hash_id, status);
      // After the API response, update the state again if necessary
    }
  };
  

  const handleChangeOrderStatus = async (order_hash_id , status) => {
    setShippedModalVisible(false)
    setCancelModalVisible(false)
    try {
      // Trigger the loading state
      const response = await submitChangeOrderStatus('change_status', order_hash_id, status);
  
      if (response.api_status === 200) {
        setSelectedOrderStatus(status)
        // Handle successful response, maybe update the UI to reflect the status change
        console.log('Order status changed successfully:', response);
      } else {
        console.error('Failed to change order status:', response);
        // Show an error message to the user
      }
    } catch (error) {
      console.error('Error changing order status:', error);
      // Handle API errors, show an error message, or retry logic
    }
  };
  

  const renderItem = ({item, index}) => {
    
    
    return (
      <View
        style={[
          styles.card_view,
          {
            backgroundColor:
              darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
            marginBottom: 16,
          },
        ]}>
        <View style={{gap: 8}}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Image
              source={{uri: item.product.images[0].image}}
              style={[
                styles.image,
                {flex: 1, marginRight: 8, resizeMode: 'contain'},
              ]}
            />
            {/* <Text>{item.product.images[0].id}</Text> */}
            <View
              style={{
                flex: 3.2,
                gap: 4,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text
                style={[
                  styles.header,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey900,
                  },
                ]}>
                {item.product.name}
              </Text>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text
                  style={[
                    styles.body,
                    {
                      flex: 0.9,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  Price
                </Text>
                <Text
                  style={[
                    styles.body,
                    {
                      flex: 0.5,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  :
                </Text>
                <Text
                  style={[
                    styles.body,
                    {
                      flex: 3,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  {formatPrice(item.price)}
                </Text>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text
                  style={[
                    styles.body,
                    {
                      flex: 0.9,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  Qty
                </Text>
                <Text
                  style={[
                    styles.body,
                    {
                      flex: 0.5,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  :
                </Text>
                <Text
                  style={[
                    styles.body,
                    {
                      flex: 3,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  {item.units}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderDetails = () => {
    return (
      <View>
        <View
          style={{flexDirection: 'row', marginHorizontal: 16, marginTop: 16}}>
          <Text
            style={[
              styles.body,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            Status :{' '}
          </Text>
          <Text
            style={[
              styles.body,
              {
                paddingHorizontal: 16,
                borderRadius: 4,
                borderWidth: 0.3,
                borderColor: COLOR.Primary,
                color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
              },
            ]}>
            {selectedOrderStatus ? selectedOrderStatus : 'null'}
          </Text>
        </View>
        <View
          style={{
            backgroundColor:
              darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
            borderRadius: 8,
            margin: 16,
            padding: 16,
          }}>
          <Text
            style={[
              styles.fadeHeader,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            Delivery Address
          </Text>
          {data.orders[0].address.length > 0 ? (
            <View
              style={{
                gap: 16,
                marginHorizontal: 16,
                marginTop: 16,
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Image
                  source={
                    darkMode === 'enable'
                      ? IconManager.user_dark
                      : IconManager.user_light
                  }
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    marginRight: 8,
                    tintColor: COLOR.Grey300,
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.fade,
                    {
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  {data.orders[0].address[0].name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Image
                  source={
                    darkMode === 'enable'
                      ? IconManager.phone_dark
                      : IconManager.phone_light
                  }
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    marginRight: 8,
                    tintColor: COLOR.Grey300,
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.fade,
                    {
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  {data.orders[0].address[0].phone}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Image
                  source={
                    darkMode === 'enable'
                      ? IconManager.location_dark
                      : IconManager.location_light
                  }
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    marginRight: 8,
                    tintColor: COLOR.Grey300,
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.fade,
                    {
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  {data.orders[0].address[0].city}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Image
                  source={
                    darkMode === 'enable'
                      ? IconManager.address_grey
                      : IconManager.address_grey
                  }
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    marginRight: 8,
                    tintColor: COLOR.Grey300,
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.fade,
                    {
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  {data.orders[0].address[0].address}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                gap: 16,
                marginHorizontal: 16,
                marginTop: 16,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
              }}>
              <Text
                style={[
                  styles.fade,
                  {
                    color: darkMode === 'enable' ? COLOR.Grey50 : COLOR.Grey300,
                    paddingVertical: 32,
                  },
                ]}>
                No address to show!
              </Text>
            </View>
          )}
        </View>
        <View style={{marginHorizontal: 16}}>
          <FlatList
            data={data.orders}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            // columnWrapperStyle={{gap: 16}}
          />
        </View>
        <View
          style={{
            backgroundColor:
              darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
            marginHorizontal: 16,
            padding: 16,
            borderRadius: 8,
          }}>
          <Text
            style={[
              styles.fadeHeader,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            Payment Information
          </Text>
          <View
            style={{
              gap: 16,
              marginTop: 16,
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={[
                  styles.fade,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    flex: 1,
                  },
                ]}>
                Payment Type
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.dark,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    flex: 1,
                    textAlign: 'right',
                  },
                ]}>
                {data.orders[0].payment_type === 0
                  ? 'Wallet'
                  : 'Cash On Delivery'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={[
                  styles.fade,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    flex: 1,
                  },
                ]}>
                Subtotal
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.dark,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    flex: 1,
                    textAlign: 'right',
                  },
                ]}>
                {`Ks ${formatPrice(data.price)}`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={[
                  styles.fade,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    flex: 1,
                  },
                ]}>
                Commission
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.dark,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    flex: 1,
                    textAlign: 'right',
                  },
                ]}>
                {`Ks ${formatPrice(data.commission)}`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={[
                  styles.fade,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    flex: 1,
                  },
                ]}>
                Final Price
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.dark,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    flex: 1,
                    textAlign: 'right',
                  },
                ]}>
                {`Ks ${formatPrice(data.final_price)}`}
              </Text>
            </View>
          </View>
        </View>
        {/* <ProgressButton
          onPressButton={() => {
            sendInvoieToMail(data.order_hash_id);
          }}
          text="Send Invoice"
          darkMode={darkMode}
          isLoading={isSendInvoiceMail}
        /> */}
  {data.orders[0].payment_type === 0   ? (
         <>
          {selectedOrderStatus === 'placed' || selectedOrderStatus === 'accepted' || selectedOrderStatus === 'packed' ? (
        <View style={{ padding: 16 }}>
          <ActionButton text={selectedOrderStatus === 'packed' ?  "Ready to Ship": "Change Status"} onPress={() => selectedOrderStatus === 'packed' ? setShippedModalVisible(true) : setStatusModalVisible(true)} />
        </View>
      ) : null}

       {selectedOrderStatus === 'shipped' && 
       <View style ={{ padding : 16}}>
           <View style = {{backgroundColor : COLOR.Blue300, paddingHorizontal : 16 , paddingVertical : 8 , borderRadius : 8 }}>
              <Text style = {{fontFamily : FontFamily.PoppinRegular , fontSize : 13, color : COLOR.White}}>If the order status wasn't set to delivered within 60 days from the order date, it will be automatically be sent to "Delivered".</Text>
          </View>
       </View>
      }
    </>
  ) : null}
   
     
       

       <Modal
    animationType="fade"
    transparent={true}
    visible={statusModalVisible}
    onRequestClose={() => setStatusModalVisible(false)}>
    <TouchableOpacity style={styles.modalContainer} onPress={() => setStatusModalVisible(false)}>
      <TouchableOpacity activeOpacity={1} style={[styles.modalContent,darkMode == 'enable' ? {backgroundColor: COLOR.DarkThemLight} : {backgroundColor: COLOR.White}]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalHeaderText,darkMode == 'enable' ? {color : COLOR.White} : {color: COLOR.Grey500,}]}>Status</Text>
          <TouchableOpacity onPress={() => setStatusModalVisible(false)} style={styles.iconWrapper}>
            <Image source={darkMode == 'enable' ? IconManager.close_dark : IconManager.close_light} style={styles.closeIcon} resizeMode='contain'/>
          </TouchableOpacity>
        </View>
        <View style={[styles.modalHeaderBottomBorder,darkMode == 'enable' ? { borderBottomColor: COLOR.White} : { borderBottomColor: COLOR.Grey100}]} />
        <View style={{padding: 16, rowGap: 16}}>
          {/* {OrderStatus.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleChangeStatus(item)}
              >
               
                <View key={index} style = {styles.itemContent}>
              
                  <Text style = {[styles.itemContentText,darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            ))} */}


            {selectedOrderStatus === 'placed' &&
             <TouchableOpacity
                onPress={() => handleChangeStatus('canceled')}
              >
                <View  style = {styles.itemContent}>
                  <Text style = {[styles.itemContentText,darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Canceled</Text>
                </View>
              </TouchableOpacity>
              }

            

              {selectedOrderStatus === 'placed' &&
              <TouchableOpacity
                onPress={() => handleChangeStatus('accepted')}
              >
                <View  style = {styles.itemContent}>
                  <Text style = {[styles.itemContentText,darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Accepted</Text>
                </View>
              </TouchableOpacity>
               }
              {selectedOrderStatus === 'placed' || selectedOrderStatus === 'accepted' ?
              <TouchableOpacity
                onPress={() => handleChangeStatus('packed')}
              >
                <View  style = {styles.itemContent}>
                  <Text style = {[styles.itemContentText,darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Packed</Text>
                </View>
              </TouchableOpacity>
              : null
              }

            {selectedOrderStatus === 'placed' || selectedOrderStatus === 'accepted' || selectedOrderStatus === 'packed' ?
              <TouchableOpacity
                onPress={() => handleChangeStatus('shipped')}
              >
                <View  style = {styles.itemContent}>
                  <Text style = {[styles.itemContentText,darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Shipped</Text>
                </View>
              </TouchableOpacity>
              : null
            }
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>




  <Modal
    animationType="slide"
    transparent={true}
    visible={cancelModalVisible}
    onRequestClose={() => setCancelModalVisible(false)}>
    <TouchableOpacity style={styles.closeModalContainer} onPress={() => setCancelModalVisible(false)}>
      <TouchableOpacity activeOpacity={1} style={[styles.closeModalContent,darkMode == 'enable' ? {backgroundColor: COLOR.DarkThemLight} : {backgroundColor: COLOR.White}]}>
        <View style={{ flexDirection : 'column' , alignItems : 'center', padding : 16 , gap : 10}}>
         
           <Image source={IconManager.modalClose} style={{width : 30 , height : 30}} resizeMode='contain'/>
           <Text style ={styles.slidemodalText}>Are you sure to cancel this order?</Text>
           <TouchableOpacity  activeOpacity={0.85} style={styles.redButtonStyle} onPress={() => handleChangeOrderStatus(data.order_hash_id , 'canceled')}>
            <Text style={styles.text}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity  activeOpacity={0.85} style={styles.outlineButtonStyle} onPress={() => setCancelModalVisible(false)}>
            <Text style={styles.outlineText}>Cancel</Text>
          </TouchableOpacity>
        </View>
       
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>

  <Modal
    animationType="slide"
    transparent={true}
    visible={shippedModalVisible}
    onRequestClose={() => setShippedModalVisible(false)}>
    <TouchableOpacity style={styles.closeModalContainer} onPress={() => setShippedModalVisible(false)}>
      <TouchableOpacity activeOpacity={1} style={[styles.closeModalContent,darkMode == 'enable' ? {backgroundColor: COLOR.DarkThemLight} : {backgroundColor: COLOR.White}]}>
        <View style={{ flexDirection : 'column' , alignItems : 'center', padding : 16 , gap : 10}}>
         
           <Image source={IconManager.shippedIconLight} style={{width : 30 , height : 30}} resizeMode='contain'/>
           <Text style ={styles.slidemodalText}>Are you sure the item is shipped to buyer?</Text>
           <TouchableOpacity  activeOpacity={0.85} style={styles.shippedButtonStyle} onPress={() => handleChangeOrderStatus(data.order_hash_id , 'shipped')}>
            <Text style={styles.text}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity  activeOpacity={0.85} style={styles.outlineButtonStyle} onPress={() => setShippedModalVisible(false)}>
            <Text style={styles.outlineText}>Cancel</Text>
          </TouchableOpacity>
        </View>
       
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
      </View>
    );
  };
  const [isDialogVisible, setDialogVisible] = useState(false);
  const handleShowDialog = () => {
    setDialogVisible(true);
  };
  const handleCloseDialog = () => {
    setDialogVisible(false);
    // navigation.goBack();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
      }}>
      <SuccessedDialogNoAction
        headerLabel="Invoice"
        visible={isDialogVisible}
        onButtonPress={handleCloseDialog}
        darkMode={darkMode}
        labelText="We have sent you an email, Please check your inbox/spam."
        buttonText="OK"
      />
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
          Orders Detail
        </Text>
        <TouchableOpacity activeOpacity={0.7} style={{marginRight: 32}} />
      </View>
      <FlatList
        data={dummyData}
        showsVerticalScrollIndicator={false}
        renderItem={renderDetails}
        keyExtractor={item => item.id}
        //   columnWrapperStyle={{gap: 16}}
      />
    </SafeAreaView>
  );
};

export default OrderedDetails;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: COLOR.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  header: {
    fontSize: fontSizes.size14,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  body: {
    fontSize: fontSizes.size14,
    fontFamily: FontFamily.PoppinRegular,
  },
  image: {
    width: 75,
    height: 75,
    borderWidth: 0.3,
    borderColor: COLOR.Primary,
  },
  card_view: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 0.3,
    borderColor: COLOR.Primary,
  },
  invoiceNoStyle: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size12,
    color: COLOR.Primary,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginTop: 8,
    marginRight: 16,
  },
  item: {
    backgroundColor: COLOR.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: RADIUS.rd16,
    padding: 8,
  },
  title: {
    fontSize: 16,
    color: COLOR.White100,
    textAlign: 'center',
    marginTop: 8,
  },
  dark: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size14,
  },
  fade: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
  },
  fadeHeader: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 15,
    width: '82.31%',
  },
  modalContentText: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color : COLOR.Grey500
  },
  modalHeader: {
    padding: SPACING.lg,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderBottomBorder: {
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    fontSize: fontSizes.size19,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  iconWrapper : {
    padding : SPACING.xs,
  },
  closeIcon : {
    width : 16,
    height : 16,
},
icon : {
  width : 24,
  height : 24,
},
  itemContent : {
    flexDirection: 'row',
     columnGap: 10,
      alignItems : 'center'
  },
  itemContentText : {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
  },
  
  closeModalContainer: {
    flex: 1,
    // justifyContent: 'start',
    // alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  closeModalContent : {
    borderRadius: 15,
    width : '100%',
  },
  redButtonStyle: { 
    backgroundColor: '#D93838', 
    padding: SPACING.xxs, 
    borderRadius: RADIUS.xxs,
    justifyContent: 'center',
    alignItems: 'center',
    width : '100%'
},
text: {
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.White50,
    fontSize: fontSizes.size15
},
outlineButtonStyle : {
  // backgroundColor: '#D93838', 
  padding: SPACING.xxs, 
  borderRadius: RADIUS.xxs,
  borderWidth : 1,
  borderColor : COLOR.Grey300,
  justifyContent: 'center',
  alignItems: 'center',
  width : '100%'
},
outlineText : {
  fontFamily: FontFamily.PoppinSemiBold,
  color: COLOR.Primary,
  fontSize: fontSizes.size15
},
slidemodalText : {
  fontFamily: FontFamily.PoppinSemiBold,
  color: COLOR.Grey500,
  fontSize: fontSizes.size15
},
shippedButtonStyle: { 
  backgroundColor: COLOR.Primary, 
  padding: SPACING.xxs, 
  borderRadius: RADIUS.xxs,
  justifyContent: 'center',
  alignItems: 'center',
  width : '100%'
},
});

