import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import {FontFamily, fontSizes} from '../../constants/FONT';
import IconManager from '../../assets/IconManager';
import {useDispatch, useSelector} from 'react-redux';
import {
  setSelectedBgColor,
  setText,
} from '../../stores/slices/CreateStorySlice';
import LinearGradient from 'react-native-linear-gradient';

const TextStory = props => {
  const dispatch = useDispatch();
  const [showColorOptions, setShowColorOptions] = useState(false);
  const selectedBgColor = useSelector(
    state => state.CreateStorySlice.selectedBgColor,
  );
  const text = useSelector(state => state.CreateStorySlice.text);
  const navigation = useNavigation();

  const toggleColorOptions = () => {
    setShowColorOptions(prev => !prev);
    // setShowFontOptions(false);
  };

  //   const toggleFontOptions = () => {
  //     setShowFontOptions((prev) => !prev);
  //     setShowColorOptions(false);
  //   };

  const handleColorSelect = color => {
    // setShowColorOptions(false)
    dispatch(setSelectedBgColor(color));
  };

  const handleFontSelect = font => {
    // setShowFontOptions(false)
    dispatch(setSelectedFont(font));
  };

  const renderColorOptions = () => {
    const colorOptions = [
      '#4C2E88',
      '#891951',
      '#15499F',
      '#0D6064',
      '#0C4E42',
      '#1C6031',
      '#F58020',
      '#E65425',
      '#3E2622',
      '#000000',
      '#253238',
      '#B72025',
    ];

    return colorOptions.map((color, index) => (
      <TouchableOpacity
        key={index}
        style={{
          backgroundColor: color,
          width: 29,
          height: 29,
          borderRadius: 12,
          margin: 5,
          borderWidth: selectedBgColor === color ? 2 : 0,
          borderColor: COLOR.White100,
        }}
        onPress={() => handleColorSelect(color)}></TouchableOpacity>
    ));
  };

  //   const renderFontOptions = () => {

  //     const fontOptions = [
  //       FontFamily.PoppinRegular,
  //       FontFamily.BeauRivageRegular,
  //       FontFamily.RufinaBold,
  //       FontFamily.RufinaRegular ,
  //       FontFamily.CarattereRegular ,
  //       FontFamily.PraiseRegular ,
  //       FontFamily.RedressedRegular,
  //       FontFamily.RalewayVariableFont,
  //       FontFamily.RobotoRegular ,
  //       FontFamily.BakbakOneRegular ,
  //       FontFamily.FugazOneRegular,
  //     ];

  //     return fontOptions.map((font, index) => (
  //       <TouchableOpacity
  //         key={index}
  //         style={{
  //          margin : 5,
  //         }}
  //         onPress={() => handleFontSelect(font)}
  //       >
  //         <Text style={{fontFamily : font,fontSize: FontSize.size19 , color : Color.White100}}>Text</Text>
  //       </TouchableOpacity>
  //     ));
  //   };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TextInput
          style={{
            width: '80%',
            fontSize: fontSizes.size29,
            fontFamily: FontFamily.PoppinSemiBold,
          }}
          placeholder="Type something"
          placeholderTextColor={COLOR.White100}
          value={text}
          onChangeText={text => dispatch(setText(text))}
          multiline={true}
          textAlign="center"
          cursorColor={COLOR.White100}
          color={COLOR.White}
        />
      </View>

      {/* Color options displayed above the existing view */}
      {showColorOptions ? (
        <View>
          <ScrollView horizontal>{renderColorOptions()}</ScrollView>
        </View>
      ) : null}

      {/* {showFontOptions ? (
        <View>
          <ScrollView horizontal>
            {renderFontOptions()}
          </ScrollView>
        </View>

      ) : null} */}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
        }}>
        <View style={{flexDirection: 'row', gap: 16}}>
          <TouchableOpacity>
            <Image
              source={IconManager.font_light}
              style={{width: 47, height: 43}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleColorOptions}>
            <Image
              source={IconManager.color_light}
              style={{width: 48, height: 44}}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {text.trim() ? (
            <TouchableOpacity
              style={{
                borderRadius: 50,
                width: 84,
                height: 43,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLOR.Blue500,
              }}>
              <Text
                style={{
                  fontSize: fontSizes.size19,
                  color: COLOR.White,
                  fontFamily: FontFamily.PoppinSemiBold,
                }}>
                Add
              </Text>
            </TouchableOpacity>
          ) : (
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.16)',
                'rgba(255, 255, 255, 0.04)',
              ]}
              style={{
                borderRadius: 50,
                width: 84,
                height: 43,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <Text
                style={{
                  color: COLOR.White,
                  textAlign: 'center',
                  fontSize: fontSizes.size19,
                  fontFamily: FontFamily.PoppinSemiBold,
                }}>
                Add
              </Text>
            </LinearGradient>
          )}
        </View>
      </View>
    </View>
  );
};

export default TextStory;
