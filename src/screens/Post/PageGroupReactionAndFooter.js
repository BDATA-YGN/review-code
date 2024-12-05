import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import PostFooter from '../../components/Post/PostFooter';
import PostReaction from '../../components/Post/PostReaction';
import { reactions } from '../../constants/CONSTANT_ARRAY';
import { useDispatch, useSelector } from 'react-redux';
import { setReactPopupEnable } from '../../stores/slices/PostSlice';
import { stringKey } from '../../constants/StringKey';

const PageGroupReactionAndFooter = props => {
    const [isSelfReacted, setSelfReacted] = useState(props.item?.reaction?.is_reacted ? 'Reacted' : 'Initial');
    const [reactedId, setReactedId] = useState(0);
    const navigation = useNavigation();
    const [typeOfReaction, setTypeOfReaction] = useState(0);
    return (
        <View>
            {props.item.reaction ? (
                <PostReaction
                    data={props.item}
                    darkMode={props.darkMode}
                    selfReaction={props.reaction}
                    selfReactionId={props.selfReactionId}
                    typeOfReaction={typeOfReaction}
                    setTypeOfReaction={setTypeOfReaction}
                    reactedId={reactedId}
                    setReactedId={setReactedId}
                    setSelfReacted={setSelfReacted}
                    isSelfReacted={isSelfReacted}
                    reactionType={props.reactionType}
                    // username={posts.username}

                    // username={props.userData?.first_name + ' ' + props.userData?.last_name}
                    username={
                        props.postType === stringKey.navigateToMyGroup
                            ? `${ props.userInfoData.first_name + ' ' + props.userInfoData.last_name}`
                            : props.postType === stringKey.navigateToMyPage
                                ? `${ props.userInfoData.first_name + ' ' +  props.userInfoData.last_name}`
                                : `${props.userData?.first_name + ' ' + props.userData?.last_name
                                }`
                    }
                />
            ) : null}

            <PostFooter
                data={props.item}
                reaction={props.reaction}
                doReaction={props.posts?.doReaction}
                darkMode={props.darkMode}
                posts={props.posts}
                setPosts={props.setPosts}
                index={props.index}
                typeOfReaction={typeOfReaction}
                setTypeOfReaction={setTypeOfReaction}
                isReactEnable={props.isReactEnable}
                setReactEnable={props.setReactEnable}
                setSelfReacted={setSelfReacted}
                isSelfReacted={isSelfReacted}
                reactedId={reactedId}
                setReactedId={setReactedId}
                reactionType={props.reactionType}
            />
        </View>
    );
};
const styles = StyleSheet.create({});
export default PageGroupReactionAndFooter;
