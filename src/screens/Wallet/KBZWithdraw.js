import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import React from 'react';
import COLOR from '../../constants/COLOR';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import {useNavigation} from '@react-navigation/native';
import {useState, useRef} from 'react';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import {FontFamily} from '../../constants/FONT';
import {fontSizes} from '../../constants/FONT';
import SizedBox from '../../commonComponent/SizedBox';
import {fontWeight} from '../../constants/FONT';
import AppLoading from '../../commonComponent/Loading';
import ActionButton from '../../components/Button/ActionButton';
import i18n from '../../i18n';
import MandatoryTextInput from '../../components/TextInputBox/MandatoryTextInput';
import {submitBankWithdraw, submitKBZWithdraw} from '../../helper/ApiModel';

const KBZWithdraw = ({route}) => {
  const navigation = useNavigation();
  const {darkMode} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textInputRefs = useRef([]);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');

  
  const onPressCreateWithdrawlBank = () => {
    // Validate that both selectedUser and amount are not empty
    if (phone && amount) {
      console.log('Selected User ID:', phone); // Log user_id for debugging
      console.log('Amount:', amount); // Log amount for debugging
      setIsLoading(true);
      submitKBZWithdraw('bank', phone, amount)
        .then(value => {
          if (value.api_status === 200) {
            setIsLoading(false);
            Alert.alert('Success', `${value.message}`, [{
              text: 'OK',
              onPress: () => {
                navigation.pop(1)
              },
            },], {
              cancelable: false,
            });
            console.log('data!!!!!!!',value.api_status)
          } else {
            value
            setIsLoading(false); // Stop loading if there's an error
            Alert.alert(
              Error ,
              `${value?.errors.error_text}`,
              [
                {
                  text: 'OK',
                },
              ],
              {cancelable: false},
            );
            console.log('data!!!!!!!',value.api_status)
          }
        })
        .catch(error => {
          // Handle the error
          // console.error('Error sending money:', error);
          setIsLoading(false); // Stop loading if there's an error
        });
    } else {
      // Display error message if selectedUser or amount is missing
      Alert.alert('Error', 'Please select a user and enter the amount.');
    }
  };

  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.DsafeAreaView :styles.safeAreaView}>
      <ActionAppBar
        appBarText="Withdrawal With KBZ Pay"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />
      <ScrollView contentContainerStyle={{padding: SPACING.sp10}}>
        <View style={darkMode == 'enable' ? styles.Dcard :styles.card}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{marginEnd: SPACING.sp5}}>
              <Image
                resizeMode="contain"
                source={darkMode == 'enable' ? IconManager.send_arrow_dark:IconManager.send_arrow_light}
                style={{width: 25, height: 25}}
              />
            </View> 
            <View>
              <Text style={darkMode == 'enable' ? styles.Dcurrent :styles.current}>Request withdrawal</Text>
              <View></View>
            </View>
          </View>
          <SizedBox height={SPACING.sp20} />
          <View style={darkMode == 'enable' ? styles.DtimeCard :styles.timeCard}>
            <TextInput
              editable={true}
              placeholder="Transfer to"
              style={[
                {
                  fontSize: fontSizes.size15,
                  color:darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                  flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 14,
                },
              ]}
              keyboardType="numeric"
              placeholderTextColor={darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300}
              value={phone}
              onChangeText={text => setPhone(text)} // Add this line to update the amount state
            />
          </View>
          <SizedBox height={SPACING.sp20} />
          <View style={darkMode == 'enable' ? styles.DtimeCard :styles.timeCard}>
            <TextInput
              editable={true}
              placeholder="Amount"
              style={[
                {
                  fontSize: fontSizes.size15,
                  color:darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                  flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 14,
                },
              ]}
              placeholderTextColor={darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300}
              value={amount}
              keyboardType="numeric"
              onChangeText={text => setAmount(text)} // Add this line to update the amount state
            />
          </View>
          <SizedBox height={SPACING.sp20} />

          <View style={styles.textInputHolder}>
            {isLoading && <AppLoading />}
            <ActionButton
              text="Request"
              onPress={() => onPressCreateWithdrawlBank(phone, amount)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default KBZWithdraw;

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
  DtimeCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.DarkThemLight,
    borderColor: COLOR.Grey100,
    borderWidth: 1,

    // paddingVertical: SPACING.sp5,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  sendText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
    fontWeight: fontWeight.weight500,
  },
  sendSmallText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size13,
    color: COLOR.Grey500,
    fontWeight: fontWeight.weight500,
  },
  textInputHolder: {
    width: '100%',
    paddingVertical: SPACING.sp5,
  },
  descriptionContainer: {
    // alignItems: 'center',
    paddingHorizontal: SPACING.sp10,
    borderWidth: 1,
    borderRadius: RADIUS.rd10,
    height: 120,
  },
  textInput: {
    fontSize: 16,
  },
});
