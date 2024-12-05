import {
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import COLOR from '../../constants/COLOR';
import IconManager from '../../assets/IconManager';
import { FontFamily, fontSizes } from '../../constants/FONT';
import { useNavigation } from '@react-navigation/native';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import i18n from '../../i18n';
import AppLoading from '../../commonComponent/Loading';
import { geSessionList, sessionDelete } from '../../helper/ApiModel';
import ListShimmer from '../GroupProfile/ListShimmer';
import IconPic from '../../components/Icon/IconPic';
import SPACING from '../../constants/SPACING';
import SizedBox from '../../commonComponent/SizedBox';
import ProfileAvatar from '../../components/Icon/ProfileAvatar';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchDarkMode } from '../../stores/slices/DarkModeSlice';
import { retrieveStringData } from '../../helper/AsyncStorage';
import { storeKeys } from '../../helper/AsyncStorage';

const ManageSession = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [sessionList, setSessionList] = useState([]);
    const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
    const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
    const dispatch = useDispatch();

    const getDarkModeTheme = async () => {
        try {
          const darkModeValue = await retrieveStringData({
            key: storeKeys.darkTheme,
          });
          if (darkModeValue !== null || undefined) {
            setDarkMode(darkModeValue);
          }
        } catch (error) {
          console.error('Error retrieving dark mode theme:', error);
        }
      };
    useEffect(() => {
        getSessionsData();
    }, []);
    useEffect(() => {
        getDarkModeTheme();
      }, []);
      useEffect(() => {
        if (fetchDarkMode) {
          getDarkModeTheme();
          dispatch(setFetchDarkMode(false));
        }
      }, [fetchDarkMode]);
    const getSessionsData = () => {
        setLoading(true);
        geSessionList().then((data) => {
            if (data.api_status == 200) {
                setSessionList(data.data);
            }
            setLoading(false);
            setRefreshing(false);
        });
    };

    const onRefresh = () => {
        setRefreshing(true);
        getSessionsData();
    };

    const handleDeleteSession = (sessionId, index) => {
        sessionDelete(sessionId).then((data) => {
          if (data.api_status == 200) {
            const updatedItems = [...sessionList.slice(0, index), ...sessionList.slice(index + 1)];
            setSessionList(updatedItems);
          } else {
          }
        })
      };

    const renderSessionItem = ({ item, index }) => (
        <View key={index} style={darkMode == 'enable' ? styles.Dcard : styles.card}>
            <View style={styles.cardElementHolder}>
                <View style={[darkMode == 'enable' ? styles.DavatarSession : styles.avatarSession, { width: 50, height: 50 }]}>
                    <Image source={item.platform === "Phone" ? IconManager.facebook_logo : IconManager.google_logo}
                        style={{ width: SPACING.sp52, height: SPACING.sp52, backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme :COLOR.White100 }} />
                </View>
                <View style={styles.sessionListTextView}>
                    <Text style={darkMode == 'enable' ? styles.DheaderText : styles.headerText}>{item.platform}</Text>
                    <Text style={darkMode == 'enable' ? styles.DbodyText : styles.bodyText}>Browser: {item.browser}</Text>
                    <Text style={darkMode == 'enable' ? styles.DbodyText : styles.bodyText}>Last Seen: {item.time}</Text>
                    <Text style={darkMode == 'enable' ? styles.DbodyText : styles.bodyText}>IP Address: {item.ip_address}</Text>
                </View>
                <View>
                    {/* <MsIcon24 iconName={assets.sessionDelete} onPress={() => handleDeleteSession(item.id, index)} style={{ width: 20, height: 20 }} /> */}
                    <TouchableOpacity onPress={() => handleDeleteSession(item.id, index)}>
                        <IconPic source={darkMode == 'enable' ? IconManager.delete_dark :IconManager.delete_light} onPress={() => { }}
                            width={SPACING.sp20} height={SPACING.sp20} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100 }}>
            <ActionAppBar
                appBarText={i18n.t(`translation:sessions`)}
                source={IconManager.back_light}
                backpress={() => navigation.goBack()} darkMode={darkMode}
            />
            <SizedBox height={SPACING.sp12} />
            <View style={{ flex: 1 }}>
                {loading ? (
                    <ListShimmer darkMode={darkMode}/>
                ) : (
                    <FlatList
                        data={sessionList}
                        renderItem={renderSessionItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingHorizontal: SPACING.sp12 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[COLOR.Primary,  COLOR.SocialBakcground]}
                                tintColor= {COLOR.Grey500}
                            />
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default ManageSession;

const styles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: COLOR.White100,
        flex: 1,
    },
    textInputRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    dropdown1BtnTxtStyle: { color: COLOR.Grey500, textAlign: 'left', fontFamily: FontFamily.PoppinRegular, fontSize: fontSizes.size12, },
    dropdown1DropdownStyle: { borderRadius: 4, padding: 8 },
    dropdown1RowStyle: { backgroundColor: COLOR.White50, borderBottomColor: COLOR.White50, height: 40, },
    Ddropdown1RowStyle: { backgroundColor: COLOR.DarkTheme, borderBottomColor: COLOR.White50, height: 40, },
    dropdown1RowTxtStyle: { color: '#444', textAlign: 'left', },
    sessionListTextView: {
        width: '70%', marginLeft: '3%', marginRight: 'auto', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 4, paddingRight: 4
    },
    cardElementHolder: {
        width: '100%', marginLeft: '8', marginRight: '8', flexDirection: 'row', justifyContent: 'space-between'
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 0, // Android-specific property for shadow
        padding: 16,
        marginBottom: 8,
        borderColor: '#D9D9D9',
        borderWidth: 1.5,
    },
    Dcard: {
        flexDirection: 'row',
        backgroundColor: COLOR.DarkTheme,
        borderRadius: 8,
        elevation: 0, // Android-specific property for shadow
        padding: 16,
        marginBottom: 8,
        borderColor: '#D9D9D9',
        borderWidth: 1.5,
    },
    sessionViewColoumn: {
        flexDirection: 'column'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        width: 130,
        fontSize: 16,
        paddingTop: 24,
    },
    avatarSession: {
        borderRadius: 100,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    DavatarSession: {
        borderRadius: 100,
        backgroundColor: COLOR.DarkTheme,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageSession: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
    },
    textSession: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerText: {
        fontFamily: FontFamily.PoppinSemiBold,
        fontSize: fontSizes.size17,
        color: COLOR.Grey500,
    },
    DheaderText: {
        fontFamily: FontFamily.PoppinSemiBold,
        fontSize: fontSizes.size17,
        color: COLOR.White50
    },
    bodyText: {
        fontFamily: FontFamily.PoppinRegular,
        fontSize: fontSizes.size14,
        color: COLOR.Grey500,
    },
    DbodyText: {
        fontFamily: FontFamily.PoppinRegular,
        fontSize: fontSizes.size14,
        color: COLOR.White50,
    }
});
