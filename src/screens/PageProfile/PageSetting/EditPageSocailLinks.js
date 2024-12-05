import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, Button, Alert, ActivityIndicator } from 'react-native';
import COLOR from '../../../constants/COLOR';
import PIXEL from '../../../constants/PIXEL';
import IconPic from '../../../components/Icon/IconPic';
import IconManager from '../../../assets/IconManager';
import { FontFamily, fontSizes } from '../../../constants/FONT';
import { useNavigation } from '@react-navigation/native';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import SizedBox from '../../../commonComponent/SizedBox';
import { updatePage, updateSocailLinks } from '../../../helper/ApiModel';
import { useDispatch } from 'react-redux';
import { setPageInfoData } from '../../../stores/slices/PageSlice';
import { setFetchPageList } from '../../../stores/slices/PostSlice';
import ActionButton from '../../../components/Button/ActionButton';
import SPACING from '../../../constants/SPACING';

const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', placeholder: 'Facebook URL', iconLight: IconManager.facebook_light ,iconDark: IconManager.facebook_light},
    { id: 'twitter', name: 'Twitter', placeholder: 'X URL', iconLight: IconManager.twitter_light,iconDark: IconManager.twitter_light },
    { id: 'instagram', name: 'Instagram', placeholder: 'Instagram URL', iconLight: IconManager.instagram_light ,iconDark: IconManager.instagram_light },
    { id: 'telegram', name: 'Telegram', placeholder: 'Telegram Profile Link', iconLight: IconManager.telegram_light ,iconDark:IconManager.telegram_light},
    { id: 'viber', name: 'Viber', placeholder: 'Viber Phone Number', iconLight: IconManager.viber_light,iconDark: IconManager.viber_light },
    { id: 'youtube', name: 'YouTube', placeholder: 'YouTube Link', iconLight: IconManager.youtube_light,iconDark: IconManager.youtube_light},
];


const EditPageSocialLinks = ({ route }) => {
    const { data, darkMode } = route.params;
    console.log(data)
    const dispatch = useDispatch();
    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        twitter: '',
        instagram: '',
        telegram: '',
        viber: '',
        youtube: '',
    });
    const [focusedInput, setFocusedInput] = useState('');
    const [inputErrors, setInputErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    // Set initial data on component mount
    useEffect(() => {
        if (data) {
            setSocialLinks({
                facebook: data.facebook || '',
                twitter: data.twitter || '',
                instagram: data.instgram || '',
                telegram: data.vk || '',
                viber: data.linkedin || '',
                youtube: data.youtube || ''
            });
        }
    }, [data]);

    const handleFocus = (platformId) => {
        setInputErrors((prevErrors) => ({ ...prevErrors, [platformId]: false }));
        setFocusedInput(platformId);
    };

    const handleBlur = () => {
        setFocusedInput('');
    };

    const handleChangeText = (platformId, text) => {
        setSocialLinks((prevLinks) => ({ ...prevLinks, [platformId]: text }));
    };

    const validateInputs = () => {
        let isValid = true;
        const errors = {};

        Object.keys(socialLinks).forEach((key) => {
            if (!socialLinks[key]) {
                errors[key] = true;
                isValid = false;
            }
        });

        setInputErrors(errors);
        return isValid;
    };

    // const handleButtonPress = () => {
    //     if (!validateInputs()) {
    //         Alert.alert('Validation Error', 'Please fill in all the fields.');
    //         return;
    //     }
    //     onPressUpdateSocialLinks();
    // };

    const onPressUpdateSocialLinks = () => {
        setLoading(true);
        updateSocailLinks(data.page_id, socialLinks.facebook, socialLinks.twitter, socialLinks.instagram, socialLinks.telegram,socialLinks.viber, socialLinks.youtube)
            .then((response) => {
                setLoading(false);
                if (response.api_status === 200) {
                    dispatch(setPageInfoData(true));
                    // navigation.goBack();
                    Alert.alert('Success', 'Social links updated successfully!', [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack(),  // Navigate back after success
                        },  
                    ]);

                } else {
                    Alert.alert('Error', `${response.errors.error_text}`);
                }
            })
            .catch((error) => {
                setLoading(false);
                Alert.alert('Error', 'Failed to update social links.');
            });
    };


    

    const backgroundColor = darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100;
    const textColor = darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500;
    const placeholderColor = darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey300;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
            <ActionAppBar
                appBarText="Social Links"
                source={IconManager.back_light}
                backpress={() => navigation.pop()}
                darkMode={darkMode}
            />
            <SizedBox height={12} />

            {socialPlatforms.map((platform) => {
                const borderColor = inputErrors[platform.id]
                    ? COLOR.Danger
                    : focusedInput === platform.id
                    ? COLOR.Primary
                    : COLOR.Grey100;
                    const iconSource = darkMode === 'enable' ? platform.iconDark : platform.iconLight;  
                return (
                    <View key={platform.id} style={styles.centeredView}>
                        <View style={[styles.inputContainer, { backgroundColor, borderColor }]}>
                        <View style={styles.iconWrapper}>
                                <IconPic source={iconSource} />
                            </View>
                            <TextInput
                                style={[styles.textInput, { backgroundColor, color: textColor }]}
                                value={socialLinks[platform.id]}
                                onFocus={() => handleFocus(platform.id)}
                                onBlur={handleBlur}
                                placeholder={platform.placeholder}
                                placeholderTextColor={placeholderColor}
                                onChangeText={(text) => handleChangeText(platform.id, text)}
                            />
                        </View>
                        <SizedBox height={SPACING.sp15} />
                    </View>
                );
            })}

                <View style={{marginHorizontal:SPACING.sp18, marginTop : SPACING.sp8}}>
                {loading ? (
                    <ActivityIndicator size="large" color={COLOR.Primary} />
                ) : (

                    <ActionButton text ="Save" onPress={onPressUpdateSocialLinks} />
                )}
                </View>
                
            
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    centeredView: {
        width: '100%',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        width: '90%',
        height: PIXEL.px50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
    },
    iconWrapper: {
        width: '11%',
        paddingLeft: 16,
    },
    textInput: {
        borderRadius: 10,
        width: '89%',
        paddingLeft: 8,
        paddingRight: 16,
        fontFamily: FontFamily.PoppinRegular,
        fontSize: fontSizes.size14,
    },
    buttonWrapper: {
        marginTop: 20,
        alignItems: 'center',
    },
});

export default EditPageSocialLinks;
