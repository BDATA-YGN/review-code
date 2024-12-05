import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import COLOR from '../../constants/COLOR';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchDarkMode } from '../../stores/slices/DarkModeSlice';
import { retrieveStringData, storeKeys } from '../../helper/AsyncStorage';

const ListShimmer = (props) => {
    const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
    const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);

    useEffect(() => {
        getDarkModeTheme();
    }, []);
    useEffect(() => {
        if (fetchDarkMode) {
            getDarkModeTheme();
            dispatch(setFetchDarkMode(false));
        }
    }, [fetchDarkMode]);

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

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ backgroundColor: props.darkMode=== 'enable' ? COLOR.DarkTheme: COLOR.Grey50, justifyContent: 'center', alignItems: 'center' }}>

            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: props.darkMode=== 'enable' ? COLOR.DarkTheme: COLOR.Grey50, marginVertical: 0, borderRadius: 4 }}>
                {
                    props.isActionEnable
                        ?
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'60%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                {
                                    props.isActionEnable
                                        ?
                                        <SkeletonPlaceholder width={'20%'}  >
                                            <View style={{ justifyContent: 'flex-end', }}>
                                                <View style={{ width: '100%', height: 30, borderRadius: 8, marginVertical: 3 }} />
                                            </View>
                                        </SkeletonPlaceholder>
                                        :
                                        null
                                }

                            </View>
                        </SkeletonPlaceholder>
                        :
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'80%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                            </View>
                        </SkeletonPlaceholder>
                }
                {
                    props.isActionEnable
                        ?
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'60%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                {
                                    props.isActionEnable
                                        ?
                                        <SkeletonPlaceholder width={'20%'}  >
                                            <View style={{ justifyContent: 'flex-end', }}>
                                                <View style={{ width: '100%', height: 30, borderRadius: 8, marginVertical: 3 }} />
                                            </View>
                                        </SkeletonPlaceholder>
                                        :
                                        null
                                }

                            </View>
                        </SkeletonPlaceholder>
                        :
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'80%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                            </View>
                        </SkeletonPlaceholder>
                }
                {
                    props.isActionEnable
                        ?
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'60%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                {
                                    props.isActionEnable
                                        ?
                                        <SkeletonPlaceholder width={'20%'}  >
                                            <View style={{ justifyContent: 'flex-end', }}>
                                                <View style={{ width: '100%', height: 30, borderRadius: 8, marginVertical: 3 }} />
                                            </View>
                                        </SkeletonPlaceholder>
                                        :
                                        null
                                }

                            </View>
                        </SkeletonPlaceholder>
                        :
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'80%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                            </View>
                        </SkeletonPlaceholder>
                }
                {
                    props.isActionEnable
                        ?
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'60%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                {
                                    props.isActionEnable
                                        ?
                                        <SkeletonPlaceholder width={'20%'}  >
                                            <View style={{ justifyContent: 'flex-end', }}>
                                                <View style={{ width: '100%', height: 30, borderRadius: 8, marginVertical: 3 }} />
                                            </View>
                                        </SkeletonPlaceholder>
                                        :
                                        null
                                }

                            </View>
                        </SkeletonPlaceholder>
                        :
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'80%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                            </View>
                        </SkeletonPlaceholder>
                }
                {
                    props.isActionEnable
                        ?
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'60%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                {
                                    props.isActionEnable
                                        ?
                                        <SkeletonPlaceholder width={'20%'}  >
                                            <View style={{ justifyContent: 'flex-end', }}>
                                                <View style={{ width: '100%', height: 30, borderRadius: 8, marginVertical: 3 }} />
                                            </View>
                                        </SkeletonPlaceholder>
                                        :
                                        null
                                }

                            </View>
                        </SkeletonPlaceholder>
                        :
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'80%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                            </View>
                        </SkeletonPlaceholder>
                }
                {
                    props.isActionEnable
                        ?
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'60%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                {
                                    props.isActionEnable
                                        ?
                                        <SkeletonPlaceholder width={'20%'}  >
                                            <View style={{ justifyContent: 'flex-end', }}>
                                                <View style={{ width: '100%', height: 30, borderRadius: 8, marginVertical: 3 }} />
                                            </View>
                                        </SkeletonPlaceholder>
                                        :
                                        null
                                }

                            </View>
                        </SkeletonPlaceholder>
                        :
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'80%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                            </View>
                        </SkeletonPlaceholder>
                }
                {
                    props.isActionEnable
                        ?
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'60%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                {
                                    props.isActionEnable
                                        ?
                                        <SkeletonPlaceholder width={'20%'}  >
                                            <View style={{ justifyContent: 'flex-end', }}>
                                                <View style={{ width: '100%', height: 30, borderRadius: 8, marginVertical: 3 }} />
                                            </View>
                                        </SkeletonPlaceholder>
                                        :
                                        null
                                }

                            </View>
                        </SkeletonPlaceholder>
                        :
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'80%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                            </View>
                        </SkeletonPlaceholder>
                }
                {
                    props.isActionEnable
                        ?
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'60%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                {
                                    props.isActionEnable
                                        ?
                                        <SkeletonPlaceholder width={'20%'}  >
                                            <View style={{ justifyContent: 'flex-end', }}>
                                                <View style={{ width: '100%', height: 30, borderRadius: 8, marginVertical: 3 }} />
                                            </View>
                                        </SkeletonPlaceholder>
                                        :
                                        null
                                }

                            </View>
                        </SkeletonPlaceholder>
                        :
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'80%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                            </View>
                        </SkeletonPlaceholder>
                }
                {
                    props.isActionEnable
                        ?
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'60%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                {
                                    props.isActionEnable
                                        ?
                                        <SkeletonPlaceholder width={'20%'}  >
                                            <View style={{ justifyContent: 'flex-end', }}>
                                                <View style={{ width: '100%', height: 30, borderRadius: 8, marginVertical: 3 }} />
                                            </View>
                                        </SkeletonPlaceholder>
                                        :
                                        null
                                }

                            </View>
                        </SkeletonPlaceholder>
                        :
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'80%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                            </View>
                        </SkeletonPlaceholder>
                }
                {
                    props.isActionEnable
                        ?
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'60%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                {
                                    props.isActionEnable
                                        ?
                                        <SkeletonPlaceholder width={'20%'}  >
                                            <View style={{ justifyContent: 'flex-end', }}>
                                                <View style={{ width: '100%', height: 30, borderRadius: 8, marginVertical: 3 }} />
                                            </View>
                                        </SkeletonPlaceholder>
                                        :
                                        null
                                }

                            </View>
                        </SkeletonPlaceholder>
                        :
                        <SkeletonPlaceholder  highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                            <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                                <SkeletonPlaceholder style={{backgroundColor: COLOR.Primary}} width={'20%'} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 60, height: 60, borderRadius: 100 }} />
                                    </View>
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'80%'}  >
                                    <View style={{}}>
                                        <View style={{ width: '50%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                        <View style={{ width: '35%', height: 15, borderRadius: 8, marginVertical: 3 }} />
                                    </View>
                                </SkeletonPlaceholder>
                            </View>
                        </SkeletonPlaceholder>
                }
            </View>
        </ScrollView>
    )
}

export default ListShimmer

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webView: {
        flex: 1,
    },
    placeholder: {
        width: '90%',
        height: '100%'
    },
})