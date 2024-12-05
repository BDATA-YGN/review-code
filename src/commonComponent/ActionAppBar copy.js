/*For App Bar */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native';
import COLOR from '../constants/COLOR';
import SPACING from '../constants/SPACING';
import { FontFamily, fontSizes } from '../constants/FONT';
import PIXEL from '../constants/PIXEL';

const ActionAppBar = (props) => {
    return (
        <View style={commonAppBarStyles.parentViewHolder}>
            <View style={commonAppBarStyles.backIconHolder}>
                <TouchableOpacity activeOpacity={0.7} onPress={props.backpress} style={{width: PIXEL.px40, height: PIXEL.px40,justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={props.source} style={{ width: PIXEL.px9, height: PIXEL.px16 }} resizeMode='contain'/>
                </TouchableOpacity>
                {/* <TouchableIcon iconWidth={9} iconHeight={16} source={props.source} onPress={props.backpress} /> */}
            </View>
            <View style={commonAppBarStyles.headerTextHolder}>
                <Text numberOfLines={1} style={commonAppBarStyles.appBarText}>{props.appBarText}</Text>
            </View>
            {
                props.actionButtonType == 'text-button'
                    ?
                    <View style={commonAppBarStyles.actionTextButtonHolder}>
                        {props.isDisable ?
                            <View style={commonAppBarStyles.actionButtonStyle}>
                            <Text numberOfLines={1} style={[commonAppBarStyles.actionButtonText,{color : COLOR.Grey100}]}>{props.actionButtonText}</Text>
                         </View>
                         :
                        <TouchableOpacity style={commonAppBarStyles.actionButtonStyle} onPress={props.actionButtonPress}>
                            <Text numberOfLines={1} style={[commonAppBarStyles.actionButtonText,{color : COLOR.Grey500}]}>{props.actionButtonText}</Text>
                        </TouchableOpacity>
                        }
                        
                    </View>
                    :
                    props.actionButtonType == 'image-button'
                        ?
                        <View style={commonAppBarStyles.actionTextButtonHolder}>
                            <TouchableOpacity activeOpacity={0.7} onPress={props.actionButtonPress}>
                                <Image source={props.actionButtonImage} style={{ width: PIXEL.px20, height: PIXEL.px20 }} />
                            </TouchableOpacity>
                            {/* <TouchableIcon iconWidth={20} iconHeight={20} source={props.actionButtonImage} onPress={props.actionButtonPress} /> */}
                        </View>
                        :
                        props.actionButtonType == 'disable'
                            ?
                            <View style={commonAppBarStyles.actionTextButtonHolder} />
                            :
                            <View style={commonAppBarStyles.actionTextButtonHolder} />
            }
        </View>
    );
};

export default ActionAppBar;

const commonAppBarStyles = StyleSheet.create({
    parentViewHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.3,
        backgroundColor: COLOR.White100,
        borderBottomColor: COLOR.Grey100
    },
    backIconHolder: {
        flex: 1,
        flexDirection: 'row',
    },
    headerTextHolder: {
        flex: 3,
        alignItems: 'center',
    },
    actionTextButtonHolder: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: SPACING.md
    },
    actionButtonStyle: {
        alignSelf: 'center',
        borderRadius: 3,
    },
    actionButtonText: {
        alignSelf: 'center',
        borderRadius: 3,
        fontFamily: FontFamily.PoppinRegular,
        fontSize: fontSizes.size15,
        // color: COLOR.Grey400
    },
    appBarText: {
        fontFamily: FontFamily.PoppinRegular,
        fontSize: fontSizes.size15,
        color: COLOR.Grey500,
    },
});