import React, {forwardRef, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import COLOR from '../../constants/COLOR';
import {FontFamily, fontSizes} from '../../constants/FONT';
import PIXEL from '../../constants/PIXEL';
import SizedBox from '../../commonComponent/SizedBox';
import SPACING from '../../constants/SPACING';
import {formatPrice} from '../../helper/PriceFormat';
import RADIUS from '../../constants/RADIUS';
import IconManager from '../../assets/IconManager';
import {timeFormat} from '../../helper/Formatter';
import {formatDateTime} from '../../helper/DateFormatter';
import ProgressButton from './MarketHelper/ProgressButton';
import { useDispatch, useSelector } from 'react-redux';
import { sendInvoice } from '../../helper/Market/MarketHelper';
import SuccessedDialogNoAction from './MarketHelper/success_dialog_no_action';

const InvoiceViewShot = forwardRef(
  ({darkMode, product, isAdjust, userInfoData, addressList}, ref) => {
    const dummyData = [{data: 'DUMMY', id: 'DUMMY'}];
    const dispatch = useDispatch();
    const [isDialogVisible, setDialogVisible] = useState(false);
    const handleShowDialog = () => {
      setDialogVisible(true);
    };
    const handleCloseDialog = () => {
      setDialogVisible(false);
      // navigation.goBack();
    };
    const isSendInvoiceMail = useSelector(
      state => state.MarketSlice.isSendInvoiceMail,
    );
    

    const findInfoById = (id, infoType) => {
      const addressObject = addressList.find(item => item.id === id);
      if (!addressObject) return `${infoType} not found`;
    
      switch (infoType) {
        case 'address':
          return addressObject.address;
        case 'phone':
          return addressObject.phone;
        case 'name':
          return addressObject.name;
        default:
          return 'Invalid info type';
      }
    };
    

    console.log('products',product);
    

    
    const sendInvoieToMail = orderHashId => {
      sendInvoice(dispatch, orderHashId, handleShowDialog);
    };

    return (
      <View
        style={{
          flex: 1,
          width: isAdjust && '100%',
          paddingVertical: 16,
        }}>
    
           <SuccessedDialogNoAction
        headerLabel="Invoice"
        visible={isDialogVisible}
        onButtonPress={handleCloseDialog}
        darkMode={darkMode}
        labelText="We have sent you an email, Please check your inbox/spam."
        buttonText="OK"
      />
        <ViewShot
          style={{flex: 1}}
          ref={ref}
          options={{format: 'jpg', quality: 1}}>
          <View
            style={{
              // padding: PIXEL.px15,
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
              flex: 1,
              borderTopRightRadius: isAdjust && RADIUS.rd16,
              borderTopLeftRadius: isAdjust && RADIUS.rd16,
            }}>
            <FlatList
              data={dummyData} // Array of products
              keyExtractor={(item, index) => index.toString()} // Unique key for each item
              renderItem={({item}) => (
                <View>
                  <View style={styles.invoiceHeader}>
                    <Image
                      source={IconManager.logo_light}
                      style={styles.image}
                    />
                    <Image
                      source={
                        darkMode === 'enable'
                          ? IconManager.myspace_dark
                          : IconManager.myspace_light
                      }
                      style={styles.myspace}
                    />
                  </View>
                  <SizedBox height={16} />

                  <View style={{backgroundColor: COLOR.Primary, padding: 16}}>
                    <View style={{flexDirection: 'row', display: 'flex'}}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.thick,
                          {flex: 1, color: COLOR.White100},
                        ]}>
                        Invoice
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.bigthin,
                          {flex: 4, color: COLOR.White100},
                        ]}>
                        {`- #${product.order_hash_id}`}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', display: 'flex'}}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.thick,
                          {
                            flex: 1,
                            color: COLOR.White100,
                          },
                        ]}>
                        Date
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.bigthin,
                          {
                            flex: 4,
                            color: COLOR.White100,
                          },
                        ]}>
                        {`- ${formatDateTime(product.timestamp)}`}
                      </Text>
                    </View>
                  </View>
                  <View style={{padding: 16}}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.thick,
                        {
                          flex: 1,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey600,
                        },
                      ]}>
                      Seller Information
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.thin,
                        {
                          flex: 1,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey600,
                        },
                      ]}>
                      {product.orders.length > 0
                        ? `${product.orders[0].product.user_data.first_name} ${product.orders[0].product.user_data.last_name}`
                        : 'Unknown User'}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.thin,
                        {
                          flex: 1,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey600,
                        },
                      ]}>
                      {product.orders.length > 0
                        ? `${product.orders[0].product.user_data.phone_number}`
                        : '000-000-000'}
                    </Text>
                    <SizedBox height={16} />

                    <Text
                      numberOfLines={1}
                      style={[
                        styles.thick,
                        {
                          flex: 1,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey600,
                        },
                      ]}>
                      Buyer Information
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.thin,
                        {
                          flex: 1,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey600,
                        },
                      ]}>
                      {findInfoById(product.orders[0]?.address_id, 'name')}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.thin,
                        {
                          flex: 1,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey600,
                        },
                      ]}>
                      {findInfoById(product.orders[0]?.address_id, 'address')}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.thin,
                        {
                          flex: 1,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey600,
                        },
                      ]}>
                      {findInfoById(product.orders[0]?.address_id, 'phone')}
                    </Text>
                    <SizedBox height={16} />

                    <Text
                      numberOfLines={1}
                      style={[
                        styles.thick,
                        {
                          flex: 1,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey600,
                        },
                      ]}>
                      Status
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.thin,
                        {
                          flex: 1,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey600,
                        },
                      ]}>
                      {product.orders[0]?.status}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={{padding: 16}}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.thick,
                          {
                            flex: 2,
                            color:
                              darkMode === 'enable'
                                ? COLOR.White100
                                : COLOR.Grey600,
                          },
                        ]}>
                        Description
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.thick,
                          {
                            flex: 1,
                            color:
                              darkMode === 'enable'
                                ? COLOR.White100
                                : COLOR.Grey600,
                            textAlign: 'right',
                          },
                        ]}>
                        Total Amount
                      </Text>
                    </View>
                    <SizedBox height={16} />
                    <FlatList
                      data={product.orders} // Array of products
                      keyExtractor={(item, index) => index.toString()} // Unique key for each item
                      renderItem={({item}) => (
                        <View>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.thin,
                                {
                                  flex: 2,
                                  color:
                                    darkMode === 'enable'
                                      ? COLOR.White100
                                      : COLOR.Grey600,
                                },
                              ]}>
                              {item.product.name}
                            </Text>
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.thin,
                                {
                                  flex: 1,
                                  color:
                                    darkMode === 'enable'
                                      ? COLOR.White100
                                      : COLOR.Grey600,
                                  textAlign: 'right',
                                },
                              ]}>
                              {`Ks ${item.final_price}`}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.thinness,
                              {
                                color:
                                  darkMode === 'enable'
                                    ? COLOR.White100
                                    : COLOR.Grey600,
                              },
                            ]}>
                            {`Qty - ${item.units}    x    Price - ${item.product.price}`}
                          </Text>
                        </View>
                      )}
                      ItemSeparatorComponent={() => <SizedBox height={16} />} // Add spacing between items
                    />
                  </View>
                  <View style={styles.divider} />
                  <View style={{padding: 16}}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.thin,
                          {
                            flex: 2,
                            color:
                              darkMode === 'enable'
                                ? COLOR.White100
                                : COLOR.Grey600,
                          },
                        ]}>
                        Sub-total
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.thin,
                          {
                            flex: 1,
                            color:
                              darkMode === 'enable'
                                ? COLOR.White100
                                : COLOR.Grey600,
                            textAlign: 'right',
                          },
                        ]}>
                        {`Ks ${formatPrice(product.price)}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.thin,
                          {
                            flex: 2,
                            color:
                              darkMode === 'enable'
                                ? COLOR.White100
                                : COLOR.Grey600,
                          },
                        ]}>
                        Commission
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.thin,
                          {
                            flex: 1,
                            color:
                              darkMode === 'enable'
                                ? COLOR.White100
                                : COLOR.Grey600,
                            textAlign: 'right',
                          },
                        ]}>
                        {`Ks ${formatPrice(product.commission)}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.thin,
                          {
                            flex: 2,
                            color:
                              darkMode === 'enable'
                                ? COLOR.White100
                                : COLOR.Grey600,
                          },
                        ]}>
                        Payment Type
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.thin,
                          {
                            flex: 1,
                            color:
                              darkMode === 'enable'
                                ? COLOR.White100
                                : COLOR.Grey600,
                            textAlign: 'right',
                          },
                        ]}>
                        {/* {`Ks ${formatPrice(product.final_price)}`} */}
                        {product.orders[0]?.payment_type == 0 ? 'Wallet' : 'Cash On Delivery'}
                      </Text>
                    </View>
                  </View>
                  <View style={{paddingHorizontal: 16}}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.thick,
                          {
                            flex: 2,
                            color:
                              darkMode === 'enable'
                                ? COLOR.White100
                                : COLOR.Grey600,
                          },
                        ]}>
                        Total
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.thick,
                          {
                            flex: 1,
                            color:
                              darkMode === 'enable'
                                ? COLOR.White100
                                : COLOR.Grey600,
                            textAlign: 'right',
                          },
                        ]}>
                        {`Ks ${formatPrice(product.final_price)}`}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        </ViewShot>
           
       <View style ={{paddingHorizontal : 20}}>
       <ProgressButton
          onPressButton={() => {
            sendInvoieToMail(product.order_hash_id);
          }}
          text="Send invoice to mail"
          darkMode={darkMode}
          isLoading={isSendInvoiceMail}
        />
       </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  divider: {
    marginHorizontal: 16,
    height: 1, // Thickness of the divider
    backgroundColor: '#CCCCCC', // Color of the divider
  },
  image: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  myspace: {
    height: 48,
    width: 128,
    marginLeft: 8,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 20,
    fontFamily: FontFamily.PoppinRegular,
    fontWeight: '700',
  },
  headerInvoice: {
    fontSize: 16,
    fontFamily: FontFamily.PoppinRegular,
    fontWeight: '700',
  },
  invoiceNo: {
    fontSize: 14,
    fontFamily: FontFamily.PoppinRegular,
  },
  invoiceHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  thick: {
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  bigthin: {
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinRegular,
  },
  thin: {
    fontSize: fontSizes.size14,
    paddingTop: 4,
    fontFamily: FontFamily.PoppinRegular,
  },
  thinness: {
    fontSize: fontSizes.size12,
    fontFamily: FontFamily.PoppinRegular,
  },
});

export default InvoiceViewShot;
