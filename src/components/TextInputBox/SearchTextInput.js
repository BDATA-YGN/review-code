import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons
import IconManager from '../../assets/IconManager';
import COLOR from '../../constants/COLOR';
import { FontFamily, fontSizes } from '../../constants/FONT';

const SearchTextInput = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  

  return (
    <View
      style={props.darkMode == 'enable' ? {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent : 'center',
        borderWidth: 1,
        borderRadius: 8,
        height : 40,
        width : '100%',
        gap : 5,
        paddingHorizontal : 12,
        borderColor: isFocused ? COLOR.White : COLOR.Grey300,
      }: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent : 'center',
        borderWidth: 1,
        borderRadius: 8,
        height : 40,
        width : '100%',
        gap : 5,
        paddingHorizontal : 12,
        borderColor: isFocused ? COLOR.Primary : COLOR.Grey300,
      }}>
      {/* <Ionicons name="search" size={20} color="gray" /> */}
      <Image source={IconManager.search_light} style={{width : 16 , height : 16}}/>
      <TextInput
        style={{ flex: 1 , padding : 0, fontFamily : FontFamily.PoppinRegular, fontSize : fontSizes.size15 }}
        placeholder="Search"
        placeholderTextColor={props.darkMode == 'enable' ? COLOR.White : COLOR.Grey500}
        color ={props.darkMode == 'enable' ? COLOR.White : COLOR.Grey500}
        value={props.searchText}
        onChangeText={props.setSearchText}
        onSubmitEditing={props.handleSearch}
        onFocus={() => setIsFocused(true)}
        
      />
      {props.searchText?.length > 0 && (
        <TouchableOpacity onPress={props.handleClearInput} style={{width : 16, height : 16, backgroundColor : COLOR.Grey50, justifyContent : 'center', alignItems : 'center'}}>
          <Image source={IconManager.close_light} style={{width : 8 , height : 8}}/>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchTextInput;
