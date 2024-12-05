import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import COLOR from '../../../constants/COLOR';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import {useNavigation} from '@react-navigation/native';
import IconManager from '../../../assets/IconManager';
import PIXEL from '../../../constants/PIXEL';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';
import {
  setProductCondition,
  setProductCurrency,
} from '../../../stores/slices/CreateProductSlice';
import ActionButton from '../../../components/Button/ActionButton';
import {Modal} from 'react-native';

const CreateProductSix = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {darkMode} = route.params;
  const productCondition = useSelector(
    state => state.CreateProductSlice.productCondition,
  );
  const [selectedCondition, setSelectedCondition] = useState(productCondition);
  const [conditionModalVisible, setConditionModalVisible] = useState(false);

  const handleProductCurrencyChange = value => {
    setSelectedCondition(value);
    dispatch(setProductCondition(value));
    setConditionModalVisible(false);
  };

  const handelNagivate = () => {
    if(productCondition) {
      navigation.navigate('CreateProductSeven', {darkMode: darkMode});
    }else {
      Alert.alert('Error','Please choose the product condition')
    }
    }
    

  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        {
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        },
      ]}>
      <ActionAppBar
        appBarText="Create New Product"
        source={IconManager.back_light}
        backpress={() => navigation.pop(6)}
        darkMode={darkMode}
      />
      <View style={styles.container}>
        <View style={styles.stepContainer}>
          <View>
            <Text
              style={[
                styles.stepText,
                {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
              ]}>
              Step 6/9
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarForeground} />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View>
            <Text
              style={[
                styles.labelText,
                {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
              ]}>
              Product Condition
            </Text>
          </View>
          <View style={styles.currencyContainer}>
            <View style={styles.textInputBorderStyle}>
              <TextInput
                editable={false}
                value={
                  selectedCondition === '0'
                    ? 'New'
                    : selectedCondition === '1'
                    ? 'Used'
                    : ''
                }
                placeholder="Select Product Condition"
                placeholderTextColor={COLOR.Grey300}
                style={[
                  styles.textInput,
                  {
                    backgroundColor:
                      darkMode === 'enable'
                        ? COLOR.DarkThemLight
                        : COLOR.White100,
                    marginLeft: 4,
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                  },
                ]}
              />
              <TouchableOpacity
                onPress={() => setConditionModalVisible(true)}
                style={styles.dropdownIconContainer}>
                <Image
                  source={IconManager.downArrow_light}
                  style={styles.dropdownIcon}
                  tintColor={COLOR.Grey200}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={conditionModalVisible}
            onRequestClose={() => setConditionModalVisible(false)}>
            <View style={styles.modalBox}>
              <View
                style={[
                  styles.modalInnerBox,
                  {
                    backgroundColor:
                      darkMode === 'enable'
                        ? COLOR.DarkThemLight
                        : COLOR.White100,
                  },
                ]}>
                <View style={styles.modalContent}>
                  <View
                    style={[
                      styles.closeButtonContainer,
                      {justifyContent: 'space-between', alignItems: 'center'},
                    ]}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.modalTitle,
                        {
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey500,
                          fontSize: fontSizes.size16,
                          fontFamily: FontFamily.PoppinSemiBold,
                        },
                      ]}>
                      Select Product Condition
                    </Text>
                    <TouchableOpacity
                      onPress={() => setConditionModalVisible(false)}>
                      <Image
                        source={
                          darkMode === 'enable'
                            ? IconManager.close_dark
                            : IconManager.close_light
                        }
                        style={[
                          styles.closeIcon,
                          {resizeMode: 'contain', width: 18, height: 18},
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.divider}></View>
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => handleProductCurrencyChange('0')}>
                    <Text
                      style={[
                        styles.modalOptionText,
                        {
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey500,
                        },
                      ]}>
                      New
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => handleProductCurrencyChange('1')}>
                    <Text
                      style={[
                        styles.modalOptionText,
                        {
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey500,
                        },
                      ]}>
                      Used
                    </Text>
                  </TouchableOpacity>
                  {/* Add more currency options here */}
                </View>
              </View>
            </View>
          </Modal>
          <View style={{marginTop: 5}}>
            <ActionButton text="Next" onPress={handelNagivate} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateProductSix;

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: COLOR.White,
    flex: 1,
  },
  container: {
    padding: PIXEL.px16,
    rowGap: 15,
  },
  stepContainer: {
    rowGap: 10,
  },
  stepText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
  },
  progressBarBackground: {
    backgroundColor: COLOR.Grey50,
    height: 6,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.Grey50,
  },
  progressBarForeground: {
    width: '66.66%',
    height: '100%',
    backgroundColor: COLOR.Primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.Primary,
  },
  inputContainer: {
    rowGap: 10,
  },
  labelText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: 19,
    color: COLOR.Grey150,
  },
  currencyContainer: {
    borderColor: COLOR.Grey200,
    borderWidth: 1,
    borderRadius: 8,
  },
  textInputBorderStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    fontSize: PIXEL.px16,
    fontFamily: FontFamily.PoppinRegular,
    width: '90%',
    color: COLOR.Grey300,
    padding: 10,
    paddingHorizontal: 15,
  },
  dropdownIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 10,
  },
  dropdownIcon: {
    width: 17,
    height: 17,
  },
  modalBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalInnerBox: {
    backgroundColor: COLOR.White100,
    borderRadius: 8,
    padding: 20,
    width: '70%',
  },
  modalContent: {
    width: '100%',
    alignItems: 'flex-start',
  },
  closeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalTitle: {
    fontSize: PIXEL.px19,
    fontWeight: '600',
    color: COLOR.Grey300,
    fontFamily: FontFamily.PoppinRegular,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    marginBottom: 8,
    marginTop: 8,
    backgroundColor: 'gray',
  },
  modalOption: {
    width: '100%',
    paddingVertical: 10,
  },
  modalOptionText: {
    fontSize: PIXEL.px16,
    color: COLOR.Grey300,
    fontFamily: FontFamily.PoppinRegular,
  },
});
