import { Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, YellowBox, Alert } from 'react-native'
import React from 'react'
import COLOR from '../../../constants/COLOR';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import IconManager from '../../../assets/IconManager';
import { useNavigation } from '@react-navigation/native';
import SPACING from '../../../constants/SPACING';
import { FontFamily, fontSizes, fontWeight } from '../../../constants/FONT';
import RADIUS from '../../../constants/RADIUS';
import { useState , useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import SizedBox from '../../../commonComponent/SizedBox';
import { updateGroupPrivacy } from '../../../helper/ApiModel';
import { useDispatch } from 'react-redux';
import { setFetchGroupData } from '../../../stores/slices/searchSlice';
import { setFetchGroupList } from '../../../stores/slices/PostSlice';
import { setGroupInfoData } from '../../../stores/slices/PageSlice';

const GroupPrivcay = ({ route }) => {
    const { darkMode, data, userId, adminData } = route.params;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [loading ,setIsLoading] = useState(false)
    const [privacyOption, setPrivacyOption] = useState('');
    const [yesnoOption , setyesNoOption] = useState('');
    const groupId = data.group_id
    const handleSelectionTwo = option => {
        setPrivacyOption(option);
    };
    const handleYesNoSelection = option => {
        setyesNoOption(option)
    }
    useEffect(() => {
        setPrivacyOption(data.privacy);
        setyesNoOption(data.join_privacy)
        dispatch(setGroupInfoData(true));
      }, []);

      const handlePrivacy = async () => {
        setIsLoading(true);
        try {
          // Prepare form data for questions
          const data = await updateGroupPrivacy(
            groupId,
            privacyOption,
            yesnoOption
          );
          if (data.status === 200) {
            console.log(data.status)
            dispatch(setGroupInfoData(true));
            dispatch(setFetchGroupList(true));
            navigation.pop()
          }
        } catch (error) {
          console.error('Error submitting the application:', error);
        } finally {
          setIsLoading(false);
        }
      };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100 }}>
            <ActionAppBar
                appBarText="Group Privacy"
                source={IconManager.back_light}
                backpress={() => navigation.pop()}
                darkMode={darkMode}
                actionButtonType={'text-button'}
                actionButtonPress={handlePrivacy}
                actionButtonText={'Save'}
            />
            <View style={{ padding: SPACING.sp15 }}>
                <View style={styles.privacyContainer}>
                    <Image source={darkMode == 'enable' ? IconManager.privacy_gp_dark : IconManager.privacy_gp_light} style={{ width: 22, height: 22, marginRight: SPACING.sp8, resizeMode: 'contain' }} />
                    <Text style={[styles.textPrivacy, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 }]}>Privacy</Text>

                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: SPACING.sp30 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginEnd: SPACING.sp11
                        }}>
                        <TouchableOpacity
                            onPress={() => handleSelectionTwo('1')}
                            style={{ marginEnd: 10 }}>
                            {privacyOption == '1' ? (
                                <View style={styles.radio1}>
                                    <View style={styles.radioBg}></View>
                                </View>
                            ) : (
                                <View style={styles.radio2}></View>
                            )}
                        </TouchableOpacity>
                        <Text style={[styles.text, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 }]}>Public</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => handleSelectionTwo('2')}
                            style={{ marginEnd: 10 }}>
                            {privacyOption == '2' ? (
                                <View style={styles.radio1}>
                                    <View style={styles.radioBg}></View>
                                </View>
                            ) : (
                                <View style={styles.radio2}></View>
                            )}
                        </TouchableOpacity>
                        <Text style={[styles.text, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 }]}>Private</Text>
                    </View>
                </View>
               
            </View>
            {/* <SizedBox height = {SPACING.sp15} /> */}
            <View style={{ backgroundColor: COLOR.Grey50, height: SPACING.sp1 , width: '90%', justifyContent: 'center', alignSelf: 'center'}}  />
            <View style={{ padding: SPACING.sp15 }}>
                <View style={styles.privacyContainer}>
                    <Image source={darkMode == 'enable' ? IconManager.add_user_dark : IconManager.add_user_light} style={{ width: 22, height: 22, marginRight: SPACING.sp8, resizeMode: 'contain' }} />
                    <Text style={[styles.joinText, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 }]}>When someone joining this groups?</Text>

                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: SPACING.sp30 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginEnd: SPACING.sp27
                        }}>
                        <TouchableOpacity
                            onPress={() => handleYesNoSelection('2')}
                            style={{ marginEnd: 10 }}>
                            {yesnoOption == '2' ? (
                                <View style={styles.radio1}>
                                    <View style={styles.radioBg}></View>
                                </View>
                            ) : (
                                <View style={styles.radio2}></View>
                            )}
                        </TouchableOpacity>
                        <Text style={[styles.text, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 }]}>Yes</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => handleYesNoSelection('1')}
                            style={{ marginEnd: 10 }}>
                            {yesnoOption == '1' ? (
                                <View style={styles.radio1}>
                                    <View style={styles.radioBg}></View>
                                </View>
                            ) : (
                                <View style={styles.radio2}></View>
                            )}
                        </TouchableOpacity>
                        <Text style={[styles.text, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 }]}>No</Text>
                    </View>
                </View>
               
            </View>
            <View style={{ backgroundColor: COLOR.Grey50, height: SPACING.sp1 , width: '90%', justifyContent: 'center', alignSelf: 'center'}}  />
             
        </SafeAreaView>
    )
}

export default GroupPrivcay

const styles = StyleSheet.create({
    privacyContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.sp10

    },
    textPrivacy: {
        fontFamily: FontFamily.PoppinRegular,
        fontSize: fontSizes.size19,
        fontWeight: fontWeight.weight600
    },
    radio1: {
        width: 20,
        height: 20,
        borderRadius: RADIUS.rd50,
        borderColor: COLOR.Primary,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radio2: {
        width: 20,
        height: 20,
        borderRadius: RADIUS.rd50,
        borderColor: COLOR.Grey300,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioBg: {
        width: 12,
        height: 12,
        backgroundColor: COLOR.Primary,
        borderRadius: RADIUS.rd50,
        borderColor: COLOR.Grey300,
    },
    text: {
        fontSize: fontSizes.size15,
        color: COLOR.Grey400,
        fontFamily: FontFamily.PoppinRegular,

    },
    joinText: {
        fontSize: fontSizes.size16,
        color: COLOR.Grey500,
        fontFamily: FontFamily.PoppinRegular,

    },
})