import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  useWindowDimensions,
  TextInput,
  ScrollView,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet
} from 'react-native';
import React, { useCallback } from 'react';
import COLOR from '../../constants/COLOR';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import IconManager from '../../assets/IconManager';
import SPACING from '../../constants/SPACING';
import { FontFamily, fontSizes } from '../../constants/FONT';
import SizedBox from '../../commonComponent/SizedBox';
import { Keyboard } from 'react-native';
import { invoiceTransaction } from '../../constants/CONSTANT_ARRAY';
import { useState, useEffect } from 'react';
import { setFetchDarkMode } from '../../stores/slices/DarkModeSlice';
import { retrieveStringData, storeKeys } from '../../helper/AsyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-native';
import ActionButton from '../../components/Button/ActionButton';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Alert } from 'react-native';
import { getTransaction, getWalletAmt } from '../../helper/Wallet/WalletThunk';
import { styles } from './WalletStyle';
import BalanceList from './Balance';
import PostShimmer from '../../components/Post/PostShimmer';
import { requestTransactionList, requestWalletAmount } from '../../helper/Wallet/WalletModel';
import { debounce } from 'lodash';  // Import lodash debounce

const Wallet = (props) => {
  // I'm really sorry for writing this complex code. Please pardon me I have no choice.
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(10);
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0]; // Initial value for opacity: 0
  const [isLoading, setIsLoading] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const flatListHeight = screenHeight / 4.5;
  const transactionListHeight = screenHeight / 1.8;
  const DatePickerHeight = screenHeight / 2.25;
  const NoDatePickerHeight = screenHeight / 10;
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(""); // State to hold filtered transactions
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // State to control DatePicker visibility
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [page ,setPage] = useState(1);
  const [walletAmount , setWalletAmount] = useState("");
  const [transactionList , setTransactionList] = useState([]);
  const [isFiltered, setFilterd] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);



  const handleGetWalletAmount = async () => {
    try {
      const data = await requestWalletAmount();
      if (data.api_status === 200) {
        setWalletAmount(data.message);
      }
    } catch (error) {
      console.error('Error fetching wallet amount:', error);
    }
  };

//   useFocusEffect(
//     useCallback(() => {
//         const refreshData = async () => {
//             await handleGetWalletAmount(); // Fetch and update wallet amount
//             setTransactionList([]); // Clear the transaction list to prevent duplicates
//             await fetchTransactions(); // Fetch and update transactions
//         };

//         refreshData();
//     }, [filteredTransactions, selectedDate, selectedEndDate, page , isFiltered]) // Include dependencies here
// );
  


    useEffect(() => {
        handleGetWalletAmount()
        fetchTransactions();
    }, [page, filteredTransactions , isFiltered]);


    const fetchTransactions = async () => {
      try {
          setIsLoading(true);
          const response = await requestTransactionList(
              filteredTransactions, 
              limit, 
              page, 
              selectedDate, 
              selectedEndDate
          );
          if(response.api_status === 200) {
              setIsRefreshing(false);
              response.message.length === 0 ? setHasMore(false) : setHasMore(true);
              if(limit === 1){
              
                setTransactionList(response.message)
              }else{
                setTransactionList(prevTransactions => [
                  ...prevTransactions, 
                  ...response.message
              ]);
              }
             
          }
          // Assuming response.message is the array of transactions
         
  
      } catch (error) {
        setIsRefreshing(false);
          console.error(error);
      } finally {
        setIsRefreshing(false);
          setIsLoading(false); // Set loading to false whether successful or failed
      }
  };
  

    const handleLoadMore = () => {
        setPage(page + 1);
    };

  

  const getHeight = () => {
    if (isDatePickerVisible || isEndDatePickerVisible) {
      return DatePickerHeight;
    } else {
      return NoDatePickerHeight;
    }
  };
  const handleConfirm = date => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setSelectedDate(formattedDate); // Set the date in the desired format
    setDatePickerVisible(false);
  };

  const handleEndDateConfirm = date => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setSelectedEndDate(formattedDate); // Set the date in the desired format
    setEndDatePickerVisible(false);
  };

  const handleResetDate = () => {
    setSelectedDate('');
    setSelectedEndDate('');
    setDatePickerVisible(false);
    setEndDatePickerVisible(false);
  };
  

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  const showEndDatePicker = () => {
    setEndDatePickerVisible(true);
  };
  const getDarkModeTheme = async () => {
    try {
      const darkModeValue = await retrieveStringData({
        key: storeKeys.darkTheme,
      });
      if (darkModeValue !== null || darkModeValue !== undefined) {
        setDarkMode(darkModeValue);
      }
    } catch (error) {
      console.error('Error retrieving dark mode theme:', error);
    }
  };
  useEffect(() => {
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);
  const openModalTransaction = () => {
    setModalFilterVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const openModalCalendar = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const handleDone = () => {
      
      setFilterd(!isFiltered)
       setTransactionList([]); // Reset transactions when filter changes
       if(selectedTransaction?.name === 'ALL'){
          // setSelectedTransaction(null);
          setFilteredTransactions("");
       }else{
        setFilteredTransactions(selectedTransaction?.name);
       }
        
          setPage(1);
        
        // Reset to first page
        closeModalTransaction();
    // Keyboard.dismiss();
  };
  const closeModalTransaction = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalFilterVisible(false); // Close the modal by setting the visibility to false
    });
  };
  const closeModalCalendar = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false); // Close the modal by setting the visibility to false
    });
  };

  const validateDates = () => {
    if (dayjs(selectedDate).isAfter(dayjs(selectedEndDate))) {
      Alert.alert("Invalid Date Selection", "The start time must be less than the end time.");
      return false;
    }
    return true;
  };
  const handleDateAndTime = () => {
    if (!selectedDate || !selectedEndDate) {
      Alert.alert("Error", "Please fill in both the start and end dates.");
      return false;  // Indicate that the check failed
    }
    return true;  // Indicate that the check passed
  };

  const handleOkPress = () => {
    if (handleDateAndTime() && validateDates()) {
  
      setFilterd(!isFiltered)
      setTransactionList([]);
      setFilteredTransactions("");
      closeModalCalendar();
      setPage(1);
  
  
    Keyboard.dismiss();
    } else {
      // Handle any other cases if needed
      // For instance, you might want to add a specific else block if there's other logic to handle
    }
  };

  const onRefresh =  () => {
    setTransactionList([])
    setIsRefreshing(true);
    setPage(1);
    //  fetchTransactions();
   
  };

  const renderEmptyComponent = () => {
    if (isLoading) {
      return null;
    }
    return (
      <View style={{alignItems: 'center', ustifyContent: 'center'}}>
        <SizedBox height={SPACING.xxxxl} />
        <Text style={darkMode == 'enable' ? styles.DnoText : styles.noText}>
          No transaction to show
        </Text>
        <SizedBox height={SPACING.xxxxl} />
      </View>
    );
  };

  
  
 
  const renderFooter = () => {
    if (!isLoading) return null;
    return transactionList.length == 0 ? <PostShimmer darkMode={darkMode} /> : <ActivityIndicator size="large" />;
  };
  const renderItem = ({ item, index }) => (
    <View key={index}>
      <SizedBox height={SPACING.xxxl} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {(() => {
          switch ((item.kind)) {
            case 'SENT':
              return <View style={styles.sentCard}>
                <Text style={styles.sentText}>SENT</Text>
              </View>
            case 'PURCHASE':
              return <View style={styles.purchaseCard}>
                <Text style={styles.purchaseText}>PURCHASE</Text>
              </View>
              case 'SALES':
                return <View style={styles.successCard}>
                  <Text style={styles.successText}>SALES</Text>
                </View>
            case 'SALE':
              return <View style={styles.successCard}>
                <Text style={styles.successText}>SALE</Text>
              </View>
              case 'RECEIVED':
                return <View style={styles.successCard}>
                  <Text style={styles.successText}>RECEIVED</Text>
                </View>
                case 'WALLET':
                  return <View style={styles.successCard}>
                    <Text style={styles.successText}>WALLET</Text>
                  </View>
                   case 'PRO':
                    return <View style={styles.proCard}>
                      <Text style={styles.proText}>PRO</Text>
                    </View>
            default:
              return null
          }
        })()}
        <Text style={darkMode == 'enable' ? styles.DdateText : styles.dateText}>{item.transaction_dt}</Text>
      </View>
      <SizedBox height={SPACING.sp5} />
      <View style={darkMode == 'enable' ? styles.DtextCard : styles.textCard}>
        <Text style={darkMode == 'enable' ? styles.DtitleText : styles.titleText}>
          {item.notes}
        </Text>
        <SizedBox height={SPACING.sm} />
        <Text style={darkMode == 'enable' ? styles.DdateText : styles.dateText}>Amount - Ks{item.amount}</Text>
      </View>
    </View>
  );
  return (
    
    
    <SafeAreaView style={darkMode == 'enable' ? styles.DsafeAreaView : styles.safeAreaView}>
      <ActionAppBar
        appBarText="Wallets & Credits"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />
      <BalanceList darkMode={darkMode} amt={walletAmount} />
      <View style={darkMode == 'enable' ? styles.Dcard : styles.card}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={darkMode == 'enable' ? styles.Dcurrent : styles.current}>Transactions</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={openModalTransaction}
              activeOpacity={0.8}
              style={{ marginEnd: SPACING.sm }}>
              <Image
               source={
                darkMode === 'enable'
                  ? selectedTransaction === null
                    ? IconManager.invoice_filter_dark
                    : IconManager.filtered_dark
                  : selectedTransaction === null
                  ? IconManager.invoice_filter_light
                  : IconManager.filtered_light
              }
              resizeMode="contain"
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={openModalCalendar} activeOpacity={0.8}>
              <Image
                source={
                  darkMode == 'enable'
                    ? selectedDate && selectedEndDate ? IconManager.filtered_calendar_dark
                     : IconManager.invoice_calendar_dark
                     : selectedDate && selectedEndDate
                    ? IconManager.filtered_calendar_light
                    : IconManager.invoice_calendar_light
                }
                resizeMode="contain"
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={transactionList}
          keyExtractor={(item, index) => `${item.id}_${index}`} 
          renderItem={renderItem}
          style={{ height: transactionListHeight }}
          // onEndReached={handleLoadMore}
          onEndReached={hasMore ? handleLoadMore : null}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={renderFooter}
        />
      </View>
      <Modal
        transparent={true}
        visible={modalFilterVisible}
        onRequestClose={closeModalTransaction}>
        <TouchableWithoutFeedback onPress={closeModalTransaction}>
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
                  {/* Rest of the modal content */}
                </View>
                <SizedBox height={SPACING.sp10} />
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 0.9, alignItems: 'center' }}>
                    <Text style={darkMode == 'enable' ? styles.Dcurrent : styles.current}>
                      Filter with transaction type
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{ flex: 0.1 }}
                    onPress={closeModalTransaction}>
                    <Image
                      source={darkMode == 'enable' ? IconManager.close_dark : IconManager.close_light}
                      resizeMode="contain"
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ height: flatListHeight }}>
                  <View style={styles.flexRowWrap}>
                    {invoiceTransaction.map((item, index) => {
                      let isActive = selectedTransaction === item;
                      let backgroundColor = isActive
                        ? COLOR.Primary
                        : darkMode === 'enable'
                          ? COLOR.DarkFadeLight
                          : COLOR.Grey500;
                      let color = isActive
                        ? COLOR.White
                        : darkMode === 'enable'
                          ? COLOR.White100
                          : COLOR.White100;
                      return (
                        <Pressable
                          key={index}
                          activeOpacity={0.9}
                          onPress={() => {
                            setSelectedTransaction(item);
                          }}
                          style={[styles.outlineButton, { backgroundColor }]}>
                          <Text style={[styles.outlineButtonText, { color }]}>
                            {item.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
                <ActionButton
                  text="OK"
                  onPress={() => handleDone()}
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModalCalendar}>
        <TouchableWithoutFeedback onPress={closeModalCalendar}>
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
                  {/* Rest of the modal content */}
                </View>
                <SizedBox height={SPACING.sp10} />
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 0.9, alignItems: 'center' }}>
                    <Text style={darkMode == 'enable' ? styles.Dcurrent : styles.current}>Filter with Period</Text>
                  </View>
                  <TouchableOpacity
                    style={{ flex: 0.1 }}
                    onPress={closeModalCalendar}>
                    <Image
                      source={darkMode == 'enable' ? IconManager.close_dark : IconManager.close_light}
                      resizeMode="contain"
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>
                <SizedBox height={SPACING.sm} />

                <View style={{ height: getHeight() }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <View style={{ flexDirection: 'row', flex: 0.9 }}>
                      <View
                        style={[darkMode == 'enable' ? styles.DtimeCard : styles.timeCard, { marginEnd: SPACING.sp10 }]}>
                        <TextInput
                          editable={false}
                          value={selectedDate} // This will now show the selected date
                          placeholder="Start time"
                          style={[
                            {
                              fontSize: fontSizes.size15,
                              padding : 10,
                              color:
                                darkMode === 'enable'
                                  ? COLOR.White100
                                  : COLOR.Grey300,
                            },
                          ]}
                          placeholderTextColor={
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey300
                          }
                        />

                        <TouchableOpacity onPress={showDatePicker}>
                          <Image
                            source={IconManager.invoice_calendar_light}
                            resizeMode="contain"
                            style={{ width: 20, height: 20 }}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={darkMode == 'enable' ? styles.DtimeCard : styles.timeCard}>
                        {/* <Text style={styles.timeText} onPress={showEndDatePicker}>
                          End Time
                        </Text> */}
                        <TextInput
                          editable={false}
                          value={selectedEndDate} // This will now show the selected end date
                          placeholder="End time"
                          style={[
                            {
                              fontSize: fontSizes.size15,
                              padding : 10,
                              color:
                                darkMode === 'enable'
                                  ? COLOR.White100
                                  : COLOR.Grey300,
                            },
                          ]}
                          placeholderTextColor={
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey300
                          }
                        />
                        <TouchableOpacity onPress={showEndDatePicker}>
                          <Image
                            source={IconManager.invoice_calendar_light}
                            resizeMode="contain"
                            style={{ width: 20, height: 20 }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity style={{ flex: 0.1, alignItems: 'flex-end' }} onPress={handleResetDate}>
                      <Image
                        source={darkMode == 'enable' ? IconManager.invoice_delete_dark :IconManager.invoice_delete}
                        resizeMode="contain"
                        style={{ width: 20, height: 20 }}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* DateTimePicker positioned between time selection and OK button */}
                  {isDatePickerVisible && (
                    <View style = {{marginTop : isEndDatePickerVisible || isDatePickerVisible ? 20 : '' , borderColor : COLOR.Grey300, borderWidth : 0.3}}>
                      <DateTimePicker
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onValueChange={handleConfirm}
                    />
                    </View>
                  )}

                  {isEndDatePickerVisible && (
                    <View style = {{marginTop : isEndDatePickerVisible || isDatePickerVisible ? 20 : '' , borderColor : COLOR.Grey300, borderWidth : 0.3}}>
                    <DateTimePicker

                      isVisible={isEndDatePickerVisible}
                      mode="date"
                      onValueChange={handleEndDateConfirm}
                    />
                    </View>
                  )}
                </View>
                <View style = {{marginTop : isEndDatePickerVisible || isDatePickerVisible ? 50 : ''}}>
                  <ActionButton text="OK" onPress={handleOkPress} />
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};


export default Wallet;