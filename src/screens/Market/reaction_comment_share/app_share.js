import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SPACING from '../../../constants/SPACING';
import IconManager from '../../../assets/IconManager';
import ModalComponent from '../../../commonComponent/ModalComponent';
import {useSelector} from 'react-redux';
import {shareOptions} from '../../../constants/CONSTANT_ARRAY';
import {checkNetworkStatus} from '../../../helper/Market/MarketHelper';

const AppShare = ({darkMode, openShareModal, setOpenModal}) => {
  const navigation = useNavigation();
  // const [openModal, setOpenModal] = useState(false);
  // const postData = useSelector(state => state.MarketSlice.postData);
  // const pageList = useSelector(state => state.MarketSlice.pageList);
  // const groupList = useSelector(state => state.MarketSlice.groupList);

  return (
    <TouchableOpacity
      onPress={() => {
        checkNetworkStatus().then(isOnline => {
          if (isOnline) {
            setOpenModal(!openShareModal);
          } else {
          }
        });
      }}
      activeOpacity={0.8}
      style={styles.reactionStyle}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{
            width: SPACING.sp36,
            height: SPACING.sp36,
            resizeMode: 'contain',
          }}
          source={
            darkMode === 'enable'
              ? IconManager.share_dark
              : IconManager.share_light
          }
        />
      </View>
      {/* <ModalComponent
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        options={shareOptions}
        postid={postData.post_id}
        post={postData}
        reaction={null}
        groupList={groupList}
        pageList={pageList}
        message={"You can't share!"}
        posts={postData}
        isReactEnable={false}
        doReaction={false}
        darkMode={darkMode}
        isMarket="SHARE_MARKET"
      /> */}
    </TouchableOpacity>
  );
};

export default AppShare;

const styles = StyleSheet.create({
  reactionStyle: {
    // backgroundColor: COLOR.Primary,
    borderRadius: SPACING.sp8,
    width: '32%',
    // height: SPACING.sp40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
