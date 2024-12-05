import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Pressable,
    TouchableOpacity,
    TextInput,
    Alert
  } from 'react-native';
  import React, {useState,useEffect} from 'react';
  import COLOR from '../../constants/COLOR';
  import ActionAppBar from '../../commonComponent/ActionAppBar';
  import {useNavigation} from '@react-navigation/native';
  import IconManager from '../../assets/IconManager';
  import {FontFamily, fontSizes, fontWeight} from '../../constants/FONT';
  import SPACING from '../../constants/SPACING';
  import SizedBox from '../../commonComponent/SizedBox';
  import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
  import PIXEL from '../../constants/PIXEL';
  import i18n from '../../i18n';
  import IconPic from '../../components/Icon/IconPic';
  import RADIUS from '../../constants/RADIUS';
  import {Modal} from 'react-native';
  import {CurrencyType, DurationType} from '../../constants/CONSTANT_ARRAY';
  import ActionButton from '../../components/Button/ActionButton';
  import { submitBankTransfer, submitNewPlan } from '../../helper/ApiModel';
  import AppLoading from '../../commonComponent/Loading';
import { UpdateNewPlan } from '../../helper/Monetization/MonetizationModel';
import { useDispatch } from 'react-redux';
import { updatePlan } from '../../stores/slices/monetization_slice';
const EditPlan = ({route}) => {
    const navigation = useNavigation();
    const [currenyModalVisible, setcurrenyModalVisible] = useState(false);
    const [durationModalVisible,setDurationModalVisible]= useState(false);
    const {darkMode ,data , currencyLists} = route.params;
    const [name ,setName] = useState('');
    const [price, setPrice] = useState('');
    const [currency ,setCurrency] = useState('');
    const [currencyId, setCurrencyId] = useState('');
    const [period ,setPeriod] = useState('');
    const [description , setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const id = data.id;
    const dispatch = useDispatch();

    useEffect(() => {
        setCurrencyId(data.currency)
        if (data) {
          setName(data.title);
          setPrice(data.price);
          setCurrency(findCategoryNameByIndex(Number(data.currency)));
          setPeriod(data.period);
          setDescription(data.description)
        }
      }, [ data]);

    const handleCurrencySelect = (item,index) => {
      console.log("Selected Currency:", item);
      setCurrency(item.currency)
      setCurrencyId(index)
      setcurrenyModalVisible(false) // Close the modal after selection
    };

    const handleDurationSelect = item => {
      setPeriod(item.name)
  
      setDurationModalVisible(false) // Close the modal after selection
    };

    const findCategoryNameByIndex = (index) => {
      if (currencyLists?.data && index >= 0 && index < currencyLists.data.length) {
        const category = currencyLists.data[index];
        return category ? category.currency : 'not found';
      } else {
        return 'not found';
      }
    };

      const onPressCreatePlan = () => {
        if (name && price && currencyId !== '' && period && description) {
          setIsLoading(true);
          UpdateNewPlan('edit', id, name, price, currencyId, period, description)
            .then(value => {
              setIsLoading(false);
              if (value.api_status === 200) {
                Alert.alert('Success', `${value.data}`, [{ text: 'OK' }], {
                  cancelable: false,
                });
    
                // Dispatch the action to update the plan in Redux
                dispatch(
                  updatePlan({
                    id: id,
                    updatedData: {
                      title: name,
                      price: price,
                      currency: currencyId,
                      period: period,
                      description: description,
                    },
                  })
                );
    
                // Navigate back to the previous screen
                setTimeout(() => {
                  navigation.pop(); // Navigate back to the previous screen
                }, 1000); // Navigate to the AddMonetization screen if needed
              } else {
                Alert.alert('Error', `${value?.errors?.error_text}`, [{ text: 'OK' }]);
              }
            })
            .catch(error => {
              setIsLoading(false);
              Alert.alert('Error', 'Failed to update the plan.');
            });
        } else {
          Alert.alert('Error', 'Please fill in all fields.');
        }
      };
    
    return (
      <SafeAreaView style={darkMode == 'enable' ? styles.DSafeAreaView :styles.SafeAreaView}>
        <ActionAppBar
          appBarText="Edit Plan"
          source={IconManager.back_light}
          backpress={() => navigation.pop()}
          darkMode={darkMode}
        />
        <View style={{padding: SPACING.sp20}}>
          <TouchableOpacity style={[styles.timeCard,{backgroundColor: darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100}]}>
            <TextInput
              editable={true}
              placeholder="Enter Plan Title"
              style={[
                {
                  fontSize: fontSizes.size15,
                  color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                  flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 14
                },
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
              value={name}
              onChangeText={text => setName(text)} 
            />
          </TouchableOpacity>
          <SizedBox height={SPACING.sp10} />
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={[styles.timeCard,{flex: 0.6, marginEnd: SPACING.sp10,backgroundColor: darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100}]}>
              <TextInput
                editable={true}
                placeholder="Plan Price"
                style={[
                  {
                    fontSize: fontSizes.size15,
                    color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                    flex: 1,
                    fontFamily: FontFamily.PoppinRegular,
                    paddingVertical : 14
                  },
                ]}
                placeholderTextColor={
                  darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
                }
                keyboardType="numeric"
                  value={price}
                  onChangeText={text => setPrice(text)} // Add this line to update the amount state
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[ styles.timeCard ,{flex: 0.4,backgroundColor: darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100}]}
              activeOpacity={0.8}
              onPress={() => setcurrenyModalVisible(true)}>
              <TextInput
                editable={false}
                placeholder="MMK (KS)"
                style={[
                  {
                    fontSize: fontSizes.size15,
                    color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                    flex: 1,
                    fontFamily: FontFamily.PoppinRegular,
                    paddingVertical : 14
                  },
                ]}
                placeholderTextColor={
                  darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
                }
                keyboardType="numeric"
                value= {currency}
              />
              <IconPic
                source={darkMode == 'enable' ? IconManager.downArrow_dark :IconManager.downArrow_light}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
          </View>
          <SizedBox height={SPACING.sp10} />
          <TouchableOpacity style={[styles.timeCard,{backgroundColor: darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100}]} activeOpacity={0.8} onPress={() => setDurationModalVisible(true)}>
            <TextInput
              editable={false}
              placeholder="Duration"
              style={[
                {
                  fontSize: fontSizes.size15,
                  color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                  flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 14
                },
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
              keyboardType="numeric"
                value={period}
              
            />
            <IconPic
              source={darkMode == 'enable' ? IconManager.downArrow_dark :IconManager.downArrow_light}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
          <SizedBox height={SPACING.sp10} />
          <TouchableOpacity
            style={darkMode == 'enable' ? styles.DnoteCard : styles.noteCard}
            activeOpacity={0.8}>
            <TextInput
              editable={true}
              placeholder="Plan Description"
              multiline={true}
              style={[
                {
                  fontSize: fontSizes.size15,
                  color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                  // flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                },
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
                value={description}
                onChangeText={text => setDescription(text)} // Add this line to update the amount state
            />
          </TouchableOpacity>
          <SizedBox height={SPACING.sp10} />
          {isLoading && <AppLoading/>}
          <ActionButton text="Save" onPress = {onPressCreatePlan}/>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={currenyModalVisible}
          onRequestClose={() => setcurrenyModalVisible(false)}>
          <View style={[styles.modalBox]}>
            <View
              style={[
                darkMode == 'enable'
                  ? styles.DmodalInnerBox
                  : styles.modalInnerBox,
                {width: '80%'},
              ]}>
              <View
                style={{
                  width: '100%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  alignItems: 'flex-start',
                }}>
                <View style={styles.closeButtonContainer}>
                  <Text
                    style={{
                      fontSize: fontSizes.size19,
                      fontWeight: fontWeight.weight600,
                      color:
                        darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                      fontFamily: FontFamily.PoppinSemiBold,
                    }}>
                    Currency
                  </Text>
                  <TouchableOpacity onPress={() => setcurrenyModalVisible(false)}>
                    <Image
                      source={
                        darkMode == 'enable'
                          ? IconManager.close_dark
                          : IconManager.close_light
                      }
                      style={{width: 20, height: 20}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    marginBottom: 8,
                    marginTop: 8,
                    backgroundColor: 'gray',
                  }}></View>
                {currencyLists.data?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index} // Added key prop to ensure unique identification of each element
                      style={{width: '100%'}}
                      onPress={() => handleCurrencySelect(item,index)}>
                      <Text
                        style={[
                          styles.txt16,
                          darkMode === 'enable'
                            ? styles.txtWhite
                            : styles.txtBlack,
                          styles.paddingAll,
                        ]}>
                        {item.currency}
                        {/* Assuming you want to display the currency type; replace "Female" with {item} */}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
  
                <View style={{width: 10, height: 10}}></View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={durationModalVisible}
          onRequestClose={() => setDurationModalVisible(false)}>
          <View style={[styles.modalBox]}>
            <View
              style={[
                darkMode == 'enable'
                  ? styles.DmodalInnerBox
                  : styles.modalInnerBox,
                {width: '80%'},
              ]}>
              <View
                style={{
                  width: '100%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  alignItems: 'flex-start',
                }}>
                <View style={styles.closeButtonContainer}>
                  <Text
                    style={{
                      fontSize: fontSizes.size19,
                      fontWeight: fontWeight.weight600,
                      color:
                        darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                      fontFamily: FontFamily.PoppinSemiBold,
                    }}>
                    Duration
                  </Text>
                  <TouchableOpacity onPress={() => setDurationModalVisible(false)}>
                    <Image
                      source={
                        darkMode == 'enable'
                          ? IconManager.close_dark
                          : IconManager.close_light
                      }
                      style={{width: 20, height: 20}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    marginBottom: 8,
                    marginTop: 8,
                    backgroundColor: 'gray',
                  }}></View>
                {DurationType.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index} // Added key prop to ensure unique identification of each element
                      style={{width: '100%'}}
                      onPress={() =>handleDurationSelect(item)}
                      >
                      <Text
                        style={[
                          styles.txt16,
                          darkMode === 'enable'
                            ? styles.txtWhite
                            : styles.txtBlack,
                          styles.paddingAll,
                        ]}>
                        {item.name}
                        {/* Assuming you want to display the currency type; replace "Female" with {item} */}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
  
                <View style={{width: 10, height: 10}}></View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  };
  
export default EditPlan

const styles = StyleSheet.create({
    SafeAreaView: {
        flex: 1,
        backgroundColor: COLOR.White100,
      },
      DSafeAreaView: {
        flex: 1,
        backgroundColor: COLOR.DarkThemLight,
      },
      timeCard: {
        borderRadius: RADIUS.rd7,
        backgroundColor: COLOR.White,
        borderColor: COLOR.Grey100,
        borderWidth: 1,
        // paddingVertical: SPACING.sp5,
        paddingHorizontal: SPACING.md,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
      },
      noteCard: {
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.sm,
        backgroundColor: COLOR.White100,
        borderWidth: 1,
        height: 120,
        borderColor: COLOR.Grey100,
      },
      DnoteCard: {
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.sm,
        backgroundColor: COLOR.DarkThemLight,
        borderWidth: 1,
        height: 120,
        borderColor: COLOR.Grey100,
      },
      modalBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalInnerBox: {
        margin: 10,
        backgroundColor: COLOR.White100,
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
      },
      DmodalInnerBox: {
        margin: 10,
        backgroundColor: COLOR.DarkFadeLight,
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
      },
      txt16: {
        fontSize: 16,
        fontFamily: FontFamily.PoppinRegular,
      },
      textGray: {
        color: COLOR.Grey300,
      },
      fontWeight700: {
        fontWeight: fontWeight.weight700,
      },
    
      closeButtonContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        flexDirection: 'row',
      },
      txtBlack: {
        color: COLOR.Grey500,
      },
      txtWhite: {
        color: COLOR.White100,
      },
      paddingAll : {
        paddingVertical : SPACING.sp5
      }
})