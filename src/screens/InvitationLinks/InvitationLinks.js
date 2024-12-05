import { SafeAreaView, ScrollView, StyleSheet, Text, View ,TouchableOpacity,Image,RefreshControl} from 'react-native'
import React from 'react'
import ActionAppBar from '../../commonComponent/ActionAppBar'
import i18n from '../../i18n';
import IconManager from '../../assets/IconManager';
import { useNavigation } from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import RADIUS from '../../constants/RADIUS';
import { FontFamily, fontSizes, fontWeight } from '../../constants/FONT';
import PIXEL from '../../constants/PIXEL';
import ActionButton from '../../components/Button/ActionButton';
import SizedBox from '../../commonComponent/SizedBox';
import { useState,useEffect } from 'react';
import { submitCreateInvitationLink } from '../../helper/ApiModel';
import Clipboard from '@react-native-clipboard/clipboard';
import AppLoading from '../../commonComponent/Loading';
import { retrieveStringData,storeKeys } from '../../helper/AsyncStorage';
import { setFetchDarkMode } from '../../stores/slices/DarkModeSlice';
import { useDispatch, useSelector } from 'react-redux';


const InvitationLinks = () => {
    const navigation = useNavigation();
    const [AvailableLink, setAvailableLink] = useState("");
    const [GeneratedLink, setGeneratedLink] = useState("");
    const [UsedLink, setUsedLink] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
    const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
    const dispatch = useDispatch();
    const [refreshing,setRefreshing] = useState(false)
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
      getDarkModeTheme();
    }, []);
    useEffect(() => {
      if (fetchDarkMode) {
        getDarkModeTheme();
        dispatch(setFetchDarkMode(false));
      }
    }, [fetchDarkMode]);
  
    const copyToClipboard = (link) => {
        Clipboard.setString(link);
      };
    const handleRefresh = () => {
        setRefreshing(true);
        fetchInvitationData();
      };
    
      const generateLink = (type) => {
        setLoading(true);
        submitCreateInvitationLink(type)
          .then((value) => {
            if (value.api_status === 200) {
              fetchInvitationData();
            }
          })
          .catch((error) => {
            console.error('Error generating link:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      };
    
      const fetchInvitationData = () => {
        submitCreateInvitationLink('get')
          .then((data) => {
            if (data.api_status === 200) {
              setAvailableLink(data.available_links);
              setGeneratedLink(data.generated_links);
              setUsedLink(data.used_links);
              setData(data.data);
            }
          })
          .catch((error) => {
            console.error('Error fetching invitation data:', error);
          })
          .finally(() => {
            setRefreshing(false);
            setLoading(false);
          });
      };
    
      useEffect(() => {
        fetchInvitationData();
      }, []);
     
  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.DsafeAreaView :styles.safeAreaView}>
        <ActionAppBar
                appBarText={i18n.t(`translation:inviationLink`)}
                source={darkMode == 'enable' ? IconManager.back_dark :IconManager.back_light}
                backpress={() => { navigation.goBack() }} darkMode={darkMode} />
        <View>
            <View>
                <ScrollView style={{paddingHorizontal: 14, marginVertical: 14}} refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLOR.Primary]} // Customize the refresh indicator color
          />
        }>
                    <View style={darkMode == 'enable' ? styles.Dcard :styles.card}>
                        <View style={styles.cardContentContainer}>
                            <Text style={styles.cardContent}>Availabe Links</Text>
                            <Text style={styles.cardContent}>Generated Links</Text>
                            <Text style={styles.cardContent}>Used Links</Text>
                        </View>
                        <View style={styles.cardContentContainer}>
                            <Text style={styles.cardContent}>{AvailableLink}</Text>
                            <Text style={styles.cardContent}>{GeneratedLink}</Text>
                            <Text style={styles.cardContent}>{UsedLink}</Text>
                         </View>
                         <SizedBox height={PIXEL.px20} />
                        <ActionButton text="Generate Links"  onPress={()=>{generateLink('create')}}/>

                    </View>
                    <View style={darkMode == 'enable' ? styles.Dcard :styles.card}>
                        <View style={styles.cardContentContainer}>
                        <Text style={styles.cardContent}>Invited User</Text>
                        <Text style={styles.cardContent}>Date</Text>
                        <Text style={styles.cardContent}>Url</Text>
                        </View>
                    <View style={styles.horizontalLine} />

                    {data.map((item, index) => (
                    <View style={styles.generatedLinkContainer} key={index}>
                        <Text style={styles.cardContent}>
                        {item.user_name ? item.user_name : '-'}
                        </Text>
                        <Text style={styles.cardContent}>
                        {new Date(item.time * 1000).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                        </Text>
                        <Text style={styles.cardContent}>
                        <View>
                        <TouchableOpacity onPress={()=>{copyToClipboard(item.link)}}>
                            <Image source={IconManager.copy_light} style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        </Text>
                    </View>
                    ))}
                    </View>
                    <SizedBox height={PIXEL.px50} />
                </ScrollView>
                {loading && <AppLoading/>}
            </View>
        </View>
    </SafeAreaView>
  )
}

export default InvitationLinks

const styles = StyleSheet.create({
    safeAreaView:{
        flex: 1,
        backgroundColor: COLOR.White50,
      },
      DsafeAreaView:{
        flex: 1,
        backgroundColor: COLOR.DarkTheme,
      },
    card : {
        borderWidth : 1,
        borderColor : COLOR.Grey100,
        borderRadius:RADIUS.rd8,
        marginBottom:PIXEL.px16,
        padding:PIXEL.px15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        // Shadow properties for Android
        elevation: 3,
        backgroundColor:COLOR.White100
    },
    Dcard : {
      borderWidth : 1,
      borderColor : COLOR.Grey100,
      borderRadius:RADIUS.rd8,
      marginBottom:PIXEL.px16,
      padding:PIXEL.px15,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 1,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      // Shadow properties for Android
      elevation: 3,
      backgroundColor:COLOR.DarkTheme
  },
    cardContentContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent:'center',
        marginTop: 5,
      },
      cardContent: {
        flex: 1,
        color: COLOR.Primary,
        textAlign: 'center',

        fontSize:fontSizes.size12,
        fontFamily:FontFamily.PoppinRegular,
        fontWeight:fontWeight.weight500
      },
      horizontalLine: {
        borderBottomColor: COLOR.Primary,
        borderBottomWidth: 1,
        // marginBottom : 5,
      },
      generatedLinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomColor:COLOR.Primary,
        borderBottomWidth: 1,
    
        // backgroundColor : 'red'
      },
      icon : {
        width: 20,  
        height: 20,
        resizeMode:'contain'
      }
})