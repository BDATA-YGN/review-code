import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import COLOR from '../../constants/COLOR';

const PageSimmer = (props) => {
    return (
        <ScrollView
            contentContainerStyle={{ flex: 1, backgroundColor: props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.Grey50, justifyContent: 'center', alignItems: 'center' }}>

            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 8, backgroundColor: props.darkMode === 'enable' ? COLOR.DarkThemLight :  COLOR.White100, marginHorizontal: 8, marginVertical: 0, borderRadius: 4 }}>
                <SkeletonPlaceholder highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                    <View style={{ padding: 8, width: '100%', justifyContent: 'space-between', flexDirection: 'row', borderRadius: 16 }}>
                        <SkeletonPlaceholder width={'50%'} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ width: '80%', height: 15, borderRadius: 6 }} />
                                {/* <View style={{width: '20%',height: 15, borderRadius: 6}} /> */}
                            </View>
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder width={'50%'}  >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <View style={{ width: '30%', height: 15, borderRadius: 8 }} />
                            </View>
                        </SkeletonPlaceholder>
                    </View>
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

            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: props.darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100, margin: 8,borderRadius: 4 }}>
                <SkeletonPlaceholder highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                    <View style={{ padding: 8, width: '100%', justifyContent: 'space-between', flexDirection: 'row', borderRadius: 16 }}>
                        <SkeletonPlaceholder width={'50%'} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ width: '80%', height: 15, borderRadius: 6 }} />
                                {/* <View style={{width: '20%',height: 15, borderRadius: 6}} /> */}
                            </View>
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder width={'50%'}  >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <View style={{ width: '30%', height: 15, borderRadius: 8 }} />
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                        <SkeletonPlaceholder width={'100%'} >
                            <View style={{flexDirection: 'row'}}>
                                <SkeletonPlaceholder width={'40%'}>
                                    <View style={{ width: '95%', height: 160}} /> 
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'40%'}>
                                    <View style={{ width: '95%', height: 155 }} /> 
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'40%'}>
                                    <View style={{ width: '95%', height: 155 }} /> 
                                </SkeletonPlaceholder>
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                </SkeletonPlaceholder>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 0, backgroundColor: props.darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100, margin: 8,borderRadius: 4 }}>
                <SkeletonPlaceholder highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} >
                    <View style={{ padding: 8, width: '100%', justifyContent: 'space-between', flexDirection: 'row', borderRadius: 16 }}>
                        <SkeletonPlaceholder width={'50%'} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ width: '80%', height: 15, borderRadius: 6 }} />
                                {/* <View style={{width: '20%',height: 15, borderRadius: 6}} /> */}
                            </View>
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder width={'50%'}  >
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <View style={{ width: '30%', height: 15, borderRadius: 8 }} />
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ padding: 8, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 16 }}>
                        <SkeletonPlaceholder width={'100%'} >
                            <View style={{flexDirection: 'row'}}>
                                <SkeletonPlaceholder width={'40%'}>
                                    <View style={{ width: '95%', height: 160}} /> 
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'40%'}>
                                    <View style={{ width: '95%', height: 155 }} /> 
                                </SkeletonPlaceholder>
                                <SkeletonPlaceholder width={'40%'}>
                                    <View style={{ width: '95%', height: 155 }} /> 
                                </SkeletonPlaceholder>
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                </SkeletonPlaceholder>
            </View>
        </ScrollView>
    )
}

export default PageSimmer

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