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
} from 'react-native';
import {StyleSheet} from 'react-native';
import React from 'react';
import COLOR from '../../constants/COLOR';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import {useNavigation} from '@react-navigation/native';
import IconManager from '../../assets/IconManager';
import SPACING from '../../constants/SPACING';
import {FontFamily, fontSizes} from '../../constants/FONT';
import SizedBox from '../../commonComponent/SizedBox';
import {Keyboard} from 'react-native';
import {
  invoicePayment,
  invoiceTransaction,
} from '../../constants/CONSTANT_ARRAY';
import {useState, useEffect} from 'react';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import {useDispatch, useSelector} from 'react-redux';
import {Modal} from 'react-native';
import ActionButton from '../../components/Button/ActionButton';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import {Alert} from 'react-native';
import {getTransaction, getWalletAmt} from '../../helper/Wallet/WalletThunk';
import BalanceList from './Balance';
import PostShimmer from '../../components/Post/PostShimmer';
import {
  requestLoadMorePaymentList,
  requestPaymentDateFilterList,
  requestPaymentFilterList,
  requestPaymentList,
  requestTransactionList,
  requestWalletAmount,
} from '../../helper/Wallet/WalletModel';
import {debounce} from 'lodash'; // Import lodash debounce
import RADIUS from '../../constants/RADIUS';
import PIXEL from '../../constants/PIXEL';
import LoadingDots from '../Market/MarketHelper/loading_dots';

const Withdraw = ({route}) => {
  const navigation = useNavigation();

  const {darkMode, userInfoData} = route.params;
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
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(''); // State to hold filtered transactions
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // State to control DatePicker visibility
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [transactionList, setTransactionList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [showFooter, setShowFooter] = useState(false);
  const [loadingTimer, setLoadingTimer] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getPaymentList = async () => {
    setIsLoading(true);
    try {
      const data = await requestPaymentList(limit, page);
      if (data.api_status === 200) {
        setTransactionList(data.message);
        if (data.message.length === 0) setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching payment list:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Stop refreshing when the fetch is complete
    }
  };

  // Handle refresh based on active filter or selected transaction
  const onRefresh = () => {
    setIsRefreshing(true);

    if (activeFilter === 'status') {
      filterPaymentList(selectedTransaction?.id); // Call the status filter function
    } else if (activeFilter === 'date') {
      getDateFilterPaymentList(selectedDate, selectedEndDate); // Call the date filter function
    } else {
      setPage(1); // Reset page number for unfiltered data
      getPaymentList();
    }
  };

  // Filter payment list by status
  const filterPaymentList = async status => {
    setActiveFilter('status');
    setPage(1);
    setHasMore(true);
    setIsLoading(true);
    try {
      const data = await requestPaymentFilterList(status, limit, 1);
      if (data.api_status === 200) {
        setTransactionList(data.message);
        if (data.message.length === 0) setHasMore(false);
      }
    } catch (error) {
      console.error('Error filtering payments:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Filter payment list by date
  const getDateFilterPaymentList = async (startDate, endDate) => {
    setActiveFilter('date');
    setPage(1);
    setHasMore(true);
    setIsLoading(true);
    try {
      const data = await requestPaymentDateFilterList(
        startDate,
        endDate,
        limit,
        1,
      );
      if (data.api_status === 200) {
        setTransactionList(data.message);
        if (data.message.length === 0) setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching filtered payments by date:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load more data based on active filter
  const handleLoadMore = () => {
    if (activeFilter === 'status') {
      loadMoreFilteredPayments();
    } else if (activeFilter === 'date') {
      loadMoreDateFilteredPayments();
    } else {
      loadMorePayment();
    }
  };

  // Load more data for unfiltered transactions
  const loadMorePayment = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const newPage = page + 1;
      const data = await requestLoadMorePaymentList(limit, newPage);
      if (data.api_status === 200) {
        if (data.message.length === 0) {
          setHasMore(false);
        } else {
          setTransactionList(prev => [...prev, ...data.message]);
          setPage(newPage);
        }
      }
    } catch (error) {
      console.error('Error loading more transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more data for filtered status transactions
  const loadMoreFilteredPayments = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const newPage = page + 1;
      const paymentStatus = selectedTransaction?.id;
      const data = await requestPaymentFilterList(
        paymentStatus,
        limit,
        newPage,
      );
      if (data.api_status === 200) {
        if (data.message.length === 0) {
          setHasMore(false);
        } else {
          setTransactionList(prev => [...prev, ...data.message]);
          setPage(newPage);
        }
      }
    } catch (error) {
      console.error('Error loading more filtered payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more data for date-filtered transactions
  const loadMoreDateFilteredPayments = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const newPage = page + 1;
      const data = await requestPaymentDateFilterList(
        selectedDate,
        selectedEndDate,
        limit,
        newPage,
      );
      if (data.api_status === 200) {
        if (data.message.length === 0) {
          setHasMore(false);
        } else {
          setTransactionList(prev => [...prev, ...data.message]);
          setPage(newPage);
        }
      }
    } catch (error) {
      console.error('Error loading more date filtered payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPaymentList();
  }, []);

  const handleOkPress = () => {
    if (handleDateAndTime() && validateDates()) {
      // Both checks passed, close the modal or perform any further actions
      console.log('validate filne', selectedDate, selectedEndDate);

      closeModalCalendar();
      // setPage(1);

      getDateFilterPaymentList(selectedDate, selectedEndDate);

      Keyboard.dismiss();
    } else {
      // Handle any other cases if needed
      // For instance, you might want to add a specific else block if there's other logic to handle
    }
  };

  const handleDone = () => {
    closeModalTransaction();
    const paymentStatus = selectedTransaction?.id;
    filterPaymentList(paymentStatus);
    Keyboard.dismiss();
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
      Alert.alert(
        'Invalid Date Selection',
        'The start time must be less than the end time.',
      );
      return false;
    }
    return true;
  };
  const handleDateAndTime = () => {
    if (!selectedDate || !selectedEndDate) {
      Alert.alert('Error', 'Please fill in both the start and end dates.');
      return false; // Indicate that the check failed
    }
    return true; // Indicate that the check passed
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return transactionList.length == 0 ? <PostShimmer darkMode={darkMode} /> : <ActivityIndicator size="large" />;
  };

  const renderEmptyComponent = () => {
    if (isLoading) {
      return null;
    }
    return (
      <View style={{alignItems: 'center', ustifyContent: 'center'}}>
        <SizedBox height={SPACING.xxxxl} />
        <Text style={darkMode == 'enable' ? styles.DnoText : styles.noText}>
          No payment to show
        </Text>
        <SizedBox height={SPACING.xxxxl} />
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    // Convert the timestamp from seconds to milliseconds
    const formatTimeAgo = timestamp => {
      const seconds = Math.floor(
        (new Date() - new Date(timestamp * 1000)) / 1000,
      );

      let interval = seconds / 31536000;
      if (interval > 1)
        return `${Math.floor(interval)} year${
          Math.floor(interval) > 1 ? 's' : ''
        } ago`;

      interval = seconds / 2592000;
      if (interval > 1)
        return `${Math.floor(interval)} month${
          Math.floor(interval) > 1 ? 's' : ''
        } ago`;

      interval = seconds / 86400;
      if (interval >= 1)
        return `${Math.floor(interval)} day${
          Math.floor(interval) > 1 ? 's' : ''
        } ago`;

      interval = seconds / 3600;
      if (interval >= 1)
        return `${Math.floor(interval)} hour${
          Math.floor(interval) > 1 ? 's' : ''
        } ago`;

      interval = seconds / 60;
      if (interval >= 1)
        return `${Math.floor(interval)} minute${
          Math.floor(interval) > 1 ? 's' : ''
        } ago`;

      return 'just now';
    };
    const formattedTime = formatTimeAgo(item.time);
    // Check if the current item is the last in the list
    const isLastItem = index === transactionList.length - 1;

    return (
      <View
        key={item.id}
        style={{marginBottom: isLastItem ? 100 : 0}} // Apply marginBottom only for the last item
      >
        <SizedBox height={SPACING.xxxl} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {(() => {
            switch (item.status) {
              case 0:
                return (
                  <View style={styles.saleCard}>
                    <Text style={styles.saleText}>PENDING</Text>
                  </View>
                );
              case 1:
                return (
                  <View style={styles.sentCard}>
                    <Text style={styles.sentText}>APPROVED</Text>
                  </View>
                );
              case 2:
                return (
                  <View style={styles.purchaseCard}>
                    <Text style={styles.purchaseText}>DECLINE</Text>
                  </View>
                );
              default:
                return null;
            }
          })()}
          <Text
            style={darkMode === 'enable' ? styles.DdateText : styles.dateText}>
            {formattedTime}
          </Text>
        </View>
        <SizedBox height={SPACING.sp5} />
        <View
          style={darkMode === 'enable' ? styles.DtextCard : styles.textCard}>
          <Text
            style={darkMode === 'enable' ? styles.DdateText : styles.dateText}>
            Amount - ks{item.amount}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={darkMode == 'enable' ? styles.DsafeAreaView : styles.safeAreaView}>
      <ActionAppBar
        appBarText="Withdraw"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />

      <View style={darkMode == 'enable' ? styles.Dcard : styles.card}>
        <Text style={darkMode == 'enable' ? styles.Dcurrent : styles.current}>
          My Earnings
        </Text>
        <Text style={darkMode == 'enable' ? styles.Dbalance : styles.balance}>
          Ks {userInfoData?.balance}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={
              darkMode == 'enable'
                ? IconManager.alert_dark
                : IconManager.alert_light
            }
            resizeMode="contain"
            style={{width: 30, height: 30}}
          />
          <Text
            style={darkMode == 'enable' ? styles.DnoteText : styles.noteText}>
            Please note that you are able to withdrawal only your Earnings,
            wallet top ups are not withdrawable.
          </Text>
        </View>
      </View>
      <View style={darkMode == 'enable' ? styles.Dcard : styles.card}>
        <Text style={darkMode == 'enable' ? styles.Dcurrent : styles.current}>
          Please choose withdrawal method
        </Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={darkMode == 'enable' ? styles.DiconCard : styles.iconCard}
            onPress={() => navigation.navigate('BankWithdraw', {darkMode})}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={
                    darkMode == 'enable'
                      ? IconManager.bank_dark
                      : IconManager.bank_light
                  }
                  resizeMode="contain"
                  style={{width: 30, height: 30}}
                />
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  paddingLeft: SPACING.sp5,
                }}>
                <Text
                  style={
                    darkMode == 'enable' ? styles.Dcurrent : styles.current
                  }>
                  BANK
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={darkMode == 'enable' ? styles.DiconCard : styles.iconCard}
            onPress={() => navigation.navigate('KBZWithdraw', {darkMode})}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={IconManager.kbz_light}
                  resizeMode="contain"
                  style={{width: 30, height: 30}}
                />
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  paddingLeft: SPACING.sp5,
                }}>
                <Text
                  style={
                    darkMode == 'enable' ? styles.Dcurrent : styles.current
                  }>
                  KBZ PAY
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={darkMode == 'enable' ? styles.Dcard : styles.card}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={darkMode == 'enable' ? styles.Dcurrent : styles.current}>
              Payment History
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={openModalTransaction}
              activeOpacity={0.8}
              style={{marginEnd: SPACING.sm}}>
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
                style={{width: 30, height: 30}}
              />
            </TouchableOpacity>
            <SizedBox height={PIXEL.px20} />
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
                style={{width: 30, height: 30}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={transactionList}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          renderItem={renderItem}
          style={{height: transactionListHeight}}
          onEndReached={hasMore ? handleLoadMore : null} // Load more only if there’s more data
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
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
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 0.9, alignItems: 'center'}}>
                    <Text
                      style={
                        darkMode == 'enable' ? styles.Dcurrent : styles.current
                      }>
                      Filter with Payment type
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{flex: 0.1}}
                    onPress={closeModalTransaction}>
                    <Image
                      source={
                        darkMode == 'enable'
                          ? IconManager.close_dark
                          : IconManager.close_light
                      }
                      resizeMode="contain"
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{height: flatListHeight}}>
                  <View style={styles.flexRowWrap}>
                    {invoicePayment.map((item, index) => {
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
                          style={[styles.outlineButton, {backgroundColor}]}>
                          <Text style={[styles.outlineButtonText, {color}]}>
                            {item.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
                <ActionButton text="OK" onPress={handleDone} />
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
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 0.9, alignItems: 'center'}}>
                    <Text
                      style={
                        darkMode == 'enable' ? styles.Dcurrent : styles.current
                      }>
                      Filter with Period
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{flex: 0.1}}
                    onPress={closeModalCalendar}>
                    <Image
                      source={
                        darkMode == 'enable'
                          ? IconManager.close_dark
                          : IconManager.close_light
                      }
                      resizeMode="contain"
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </View>
                <SizedBox height={SPACING.sm} />

                <View style={{height: getHeight()}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <View style={{flexDirection: 'row', flex: 0.9}}>
                      <View
                        style={[
                          darkMode == 'enable'
                            ? styles.DtimeCard
                            : styles.timeCard,
                          {marginEnd: SPACING.sp10},
                        ]}>
                        <TextInput
                          editable={false}
                          value={selectedDate} // This will now show the selected date
                          placeholder="Start time"
                          style={[
                            {
                              fontSize: fontSizes.size15,
                              padding: 10,
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
                            style={{width: 20, height: 20}}
                          />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={
                          darkMode == 'enable'
                            ? styles.DtimeCard
                            : styles.timeCard
                        }>
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
                              padding: 10,
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
                            style={{width: 20, height: 20}}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{flex: 0.1, alignItems: 'flex-end'}}
                      onPress={handleResetDate}>
                      <Image
                        source={darkMode == 'enable' ? IconManager.invoice_delete_dark :IconManager.invoice_delete}
                        resizeMode="contain"
                        style={{width: 20, height: 20}}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* DateTimePicker positioned between time selection and OK button */}
                  {isDatePickerVisible && (
                    <View
                      style={{
                        marginTop:
                          isEndDatePickerVisible || isDatePickerVisible
                            ? 20
                            : '',
                        borderColor: COLOR.Grey300,
                        borderWidth: 0.3,
                      }}>
                      <DateTimePicker
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onValueChange={handleConfirm}
                      />
                    </View>
                  )}

                  {isEndDatePickerVisible && (
                    <View
                      style={{
                        marginTop:
                          isEndDatePickerVisible || isDatePickerVisible
                            ? 20
                            : '',
                        borderColor: COLOR.Grey300,
                        borderWidth: 0.3,
                      }}>
                      <DateTimePicker
                        isVisible={isEndDatePickerVisible}
                        mode="date"
                        onValueChange={handleEndDateConfirm}
                      />
                    </View>
                  )}
                </View>
                <View
                  style={{
                    marginTop:
                      isEndDatePickerVisible || isDatePickerVisible ? 50 : '',
                  }}>
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

export default Withdraw;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.Grey50,
  },
  DsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
  },
  card: {
    width: '95%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.White,
    margin: SPACING.sp10,
    padding: SPACING.md,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  Dcard: {
    width: '95%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkThemLight,
    margin: SPACING.sp10,
    padding: SPACING.md,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  current: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  Dcurrent: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  balance: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size18,
  },
  Dbalance: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size18,
  },
  noteText: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    paddingHorizontal: SPACING.sp5,
  },
  DnoteText: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    paddingHorizontal: SPACING.sp5,
  },
  iconCard: {
    width: '45%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.Grey50,
    marginTop: SPACING.sm,
    marginEnd: SPACING.md,
    padding: SPACING.sm,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  DiconCard: {
    width: '45%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkTheme,
    marginTop: SPACING.sm,
    marginEnd: SPACING.md,
    padding: SPACING.sm,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: '#D4F3D5',
    // margin: SPACING.sp10,
    paddingVertical: SPACING.sp3,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  successText: {
    color: '#4CAF50',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  dateText: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  DdateText: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  textCard: {
    width: '100%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.Grey50,
    marginBottom: SPACING.sp8,
    padding: SPACING.md,
  },
  DtextCard: {
    width: '100%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkFadeLight,
    // margin: SPACING.sp10,
    padding: SPACING.md,
  },
  titleText: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
  },
  noText: {
    color: COLOR.Grey300,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
  },
  DnoText: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
  },
  DtitleText: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
  },
  purchaseCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: '#FBD4D4',
    // margin: SPACING.sp10,
    paddingVertical: SPACING.sp3,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  purchaseText: {
    color: '#FF0000',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  sentCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: '#D9EBF9',
    // margin: SPACING.sp10,
    paddingVertical: SPACING.sp3,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  sentText: {
    color: '#2196F3',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  saleText: {
    color: COLOR.Orange300,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  saleCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.Orange50,
    // margin: SPACING.sp10,
    paddingVertical: SPACING.sp3,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLOR.White100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalText: {
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  outlineButton: {
    width: '45%',
    padding: 5,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.rd5,
    borderCurve: 'continuous',
    alignItems: 'center',
  },
  outlineButtonText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
  },
  flexRowWrap: {
    gap: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
  },
  timeCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.White,
    borderColor: COLOR.Grey100,
    borderWidth: 1,
    flex: 0.5,
    // paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  DtimeCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.DarkFadeLight,
    borderColor: COLOR.Grey100,
    borderWidth: 1,
    flex: 0.5,
    // paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  timeText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
});
