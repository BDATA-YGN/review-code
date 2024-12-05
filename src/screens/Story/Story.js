import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DualAvater from '../../components/DualAvater';
import {FontFamily, fontSizes} from '../../constants/FONT';
import COLOR from '../../constants/COLOR';
import SPACING from '../../constants/SPACING';
import IconManager from '../../assets/IconManager';
import i18next from 'i18next';
import PIXEL from '../../constants/PIXEL';
import RADIUS from '../../constants/RADIUS';

const Story = props => {
  const navigation = useNavigation();

  const createStoryView = (
    <TouchableOpacity
      style={{marginRight: SPACING.sp16}}
      onPress={() => {
        navigation.navigate('CreateStory');
      }}>
      <View
        style={{width: PIXEL.px100, height: PIXEL.px150, position: 'relative'}}>
        {props.userData.avatar && (
          <Image
            resizeMode="cover"
            source={{uri: props.userData.avatar}}
            style={styles.imageMyday}
          />
        )}

        <View style={styles.overlay}>
          <Image
            source={IconManager.create_Story_light}
            style={styles.createStoryIcon}
          />
          <Text style={[styles.overlayText, {paddingBottom: SPACING.sp6}]}>
            {i18next.t('translation:addStory')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{width: '100%', marginHorizontal: SPACING.sp10}}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        {createStoryView}

        {props.stories.length > 0 &&
          props.stories.map((value, index) => (
            <TouchableOpacity
              style={{marginRight: 16}}
              onPress={() => {}}
              key={index}>
              <View style={{width: PIXEL.px100, height: PIXEL.px150}}>
                <Image
                  resizeMode="cover"
                  source={{uri: value.stories[0].thumbnail}}
                  style={styles.imageMyday}
                />
                <View
                  style={{
                    position: 'absolute',
                    marginTop: 7,
                    marginLeft: SPACING.sp8,
                  }}>
                  <DualAvater
                    largerImageWidth={32}
                    largerImageHeight={32}
                    source={{uri: value.stories[0].user_data.avatar}}
                    smallIcon={IconManager.flag_light}
                    isIconColor={true}
                    isActive={true}
                    iconBadgeEnable={true}
                    isBorderColor={true}
                  />
                </View>
                <View style={styles.overlay} />
                <Text style={styles.overlayText}>
                  {value.stories[0].user_data.first_name}{' '}
                  {value.stories[0].user_data.last_name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export default Story;

const styles = StyleSheet.create({
  createStoryContainer: {
    width: PIXEL.px100,
    height: PIXEL.px140,
    backgroundColor: COLOR.Primary,
    borderRadius: RADIUS.rd20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  createStoryIcon: {
    width: PIXEL.px30,
    height: PIXEL.px30,
    resizeMode: 'contain',
    position: 'absolute',
    alignSelf: 'center',
    top: '-50%',
  },
  createStoryText: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    marginTop: SPACING.sp10,
  },
  imageMyday: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.rd20,
    borderWidth: SPACING.sp2,
    borderColor: 'rgba(73, 78, 182, 0.30)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(73, 78, 182, 0.70)',
    height: PIXEL.px40,
    top: '74%',
    justifyContent: 'center',
    borderBottomLeftRadius: RADIUS.rd20,
    borderBottomRightRadius: RADIUS.rd20,
    borderWidth: PIXEL.px2,
    borderColor: 'rgba(73, 78, 182, 0.30)',
  },
  overlayText: {
    position: 'absolute',
    bottom: SPACING.sp0,
    color: COLOR.White100,
    fontSize: fontSizes.size12,
    fontFamily: FontFamily.PoppinRegular,
    alignSelf: 'center',
    paddingBottom: SPACING.sp8,
  },
});
