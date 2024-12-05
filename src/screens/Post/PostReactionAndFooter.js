import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  PanResponder,
  Animated,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import PostFooter from '../../components/Post/PostFooter';
import PostReaction from '../../components/Post/PostReaction';
import {reactions} from '../../constants/CONSTANT_ARRAY';
import {useDispatch, useSelector} from 'react-redux';
import {setReactPopupEnable} from '../../stores/slices/PostSlice';

const PostReactionAndFooter = props => {
  const [isSelfReacted, setSelfReacted] = useState(
    props.item?.reaction?.is_reacted ? 'Reacted' : 'Initial',
  );
  const buttonRef = useRef();
  const [reactedId, setReactedId] = useState(0);
  const navigation = useNavigation();
  const [typeOfReaction, setTypeOfReaction] = useState('0');
  const [isDragging, setIsDragging] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [modalTranslateY] = useState(new Animated.Value(300)); // Start off screen
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [buttonLayout, setButtonLayout] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const onLayoutCapture = event => {
    const {x, y, width, height} = event.nativeEvent.layout;
    setButtonLayout({x, y, width, height});
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const {dx, dy} = gestureState;
        return Math.abs(dx) > 5 || Math.abs(dy) > 5; // Threshold for starting pan gesture
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        setShowReactions(false); // Hide modal on drag
      },
      onPanResponderMove: (evt, gestureState) => {
        const {moveX, moveY} = gestureState;
        console.log(`Dragging at position X: ${moveX}, Y: ${moveY}`);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
      },
    }),
  ).current;
  // useEffect(()=>{
  // },[])
  return (
    <View style={{}}>
      {/* {props.item.reaction ? (
        <PostReaction
          data={props.item}
          isFromShare={props.isFromShare}
          selfReaction={props.reaction}
          selfReactionId={props.selfReactionId}
          isSelfReacted={isSelfReacted}
          typeOfReaction={typeOfReaction}
          setTypeOfReaction={setTypeOfReaction}
          reactedId={reactedId}
          setReactedId={setReactedId}
          reactionType={props.reactionType}
          // username={posts.username}

          username={
            props.userData?.first_name + ' ' + props.userData?.last_name
          }
          darkMode={props.darkMode}
        />
      ) : null} */}

      <PostFooter
        data={props.item}
        isFromShare={props.isFromShare}
        isFromDetail={props.isFromDetail}
        posts={props.posts}
        setPosts={props.setPosts}
        index={props.index}
        reaction={props.reaction}
        doReaction={props.item?.doReaction}
        darkMode={props.darkMode}
        groupList={props.groupList}
        typeOfReaction={typeOfReaction}
        setTypeOfReaction={setTypeOfReaction}
        isReactEnable={props.isReactEnable}
        setReactEnable={props.setReactEnable}
        setSelfReacted={setSelfReacted}
        isSelfReacted={isSelfReacted}
        pageList={props.pageList}
        reactedId={reactedId}
        userData={props.userData}
        selfReactionId={props.selfReactionId}
        setReactedId={setReactedId}
        reactionType={props.reactionType}
        setOtherReactionPopupStatus={props.setOtherReactionPopupStatus}
        isOtherReactionPopupStatus={props.isOtherReactionPopupStatus}
      />
      {/* <Modal
        visible={showReactions}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowReactions(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressIn={() => setShowReactions(false)}>
          <View
            style={{
              position: 'absolute',
              top: modalPosition.y || 50,
              left: modalPosition.x - 50 || 50,
              pointerEvents: 'auto',
              padding: 10,
            }}>
            <Text>Hello World</Text>
          </View>
        </TouchableOpacity>
      </Modal> */}
    </View>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default PostReactionAndFooter;
