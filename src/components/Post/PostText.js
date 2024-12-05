import {useNavigation} from '@react-navigation/native';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import {formatText} from '../../helper/Formatter';
import COLOR from '../../constants/COLOR';
import {fontSizes} from '../../constants/FONT';
import SPACING from '../../constants/SPACING';
import {retrieveJsonData, storeKeys} from '../../helper/AsyncStorage';
import {useSelector} from 'react-redux';
import {URL} from '../../config';

const PostText = props => {
  const [expanded, setExpanded] = useState(false);
  const [isLoginUser, setLogInUser] = useState(null);

  const textRef = useRef(null);
  const navigation = useNavigation();

  let setShouldDisplayReadMore = null;
  const checkUserType = async () => {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const user_id = loginData.user_id;
    setLogInUser(user_id == props.mentions_users?.user_id);
  };
  const handleReadMore = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
    checkUserType();
  }, []);

  //   function stringCut(arr, length) {
  //     let result = "";
  //     let remainingLength = length;

  //     for (let item of arr) {
  //         if (typeof item === "string") {
  //             if (item.length <= remainingLength) {
  //                 result += item;
  //                 remainingLength -= item.length;
  //             } else {
  //                 result += item.substring(0, remainingLength);
  //                 remainingLength = 0;
  //                 break;
  //             }
  //         } else if (React.isValidElement(item)) {
  //             // Handle React elements (like the <Text> element)
  //             let elementText = item.props.children;
  //             if (typeof elementText === "string") {
  //                 if (elementText.length <= remainingLength) {
  //                     result += elementText;
  //                     remainingLength -= elementText.length;
  //                 } else {
  //                     result += elementText.substring(0, remainingLength);
  //                     remainingLength = 0;
  //                     break;
  //                 }
  //             }
  //         }

  //         if (remainingLength <= 0) break;
  //     }

  //     return result;
  // }

  function stringCut(arr, length) {
    let result = [];
    let remainingLength = length;

    for (let item of arr) {
      if (typeof item === 'string') {
        if (item.length <= remainingLength) {
          result.push(item);
          remainingLength -= item.length;
        } else {
          result.push(item.substring(0, remainingLength));
          remainingLength = 0;
          break;
        }
      } else if (React.isValidElement(item)) {
        let elementText = item.props.children;
        if (typeof elementText === 'string') {
          if (elementText.length <= remainingLength) {
            result.push(item);
            remainingLength -= elementText.length;
          } else {
            const newElement = React.cloneElement(
              item,
              {},
              elementText.substring(0, remainingLength),
            );
            result.push(newElement);
            remainingLength = 0;
            break;
          }
        }
      }

      if (remainingLength <= 0) break;
    }

    return result;
  }

  const renderTextWithLinks = () => {
    let text = formatText(props.postText);

    let displayText = text;

    if (text && text.length > 150) {
      setShouldDisplayReadMore = true;
    } else {
      setShouldDisplayReadMore = false;
    }

    const renderMentionedText = renderMention(text);

    // displayText = expanded
    //   ? renderMentionedText
    //   : renderMentionedText.slice(0, 150);

    const cutString = stringCut(renderMentionedText, 150);
    displayText = expanded ? renderMentionedText : cutString;
    return (
      <View>
        <Text
          style={[
            styles.bodyText,
            props.darkMode == 'enable'
              ? {color: COLOR.White}
              : {color: COLOR.Grey500},
          ]}
          ref={textRef}>
          {displayText}
          {setShouldDisplayReadMore && (
            <Text onPress={handleReadMore} style={styles.readMore}>
              {expanded ? ' Read Less' : ' ... Read More'}
            </Text>
          )}
        </Text>
      </View>
    );
  };

  function checkUrlType(url) {
    const eventPattern = /https:\/\/demo\.myspace-mm\.com\/events\/\d+\/?$/;
    const postPattern = /https:\/\/demo\.myspace-mm\.com\/post\/\d+_.html$/;

    if (eventPattern.test(url)) {
      return 'event';
    } else if (postPattern.test(url)) {
      return 'post';
    } else {
      return 'unknown';
    }
  }

  const renderMention = text => {
    const mentions = props.mentions_users || [];

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const mentionRegex =
      mentions.length > 0
        ? new RegExp(`(${mentions.map(user => user.name).join('|')})`, 'g')
        : null;

    const parts = [];
    let lastIndex = 0;

    const combinedRegex = mentionRegex
      ? new RegExp(`${urlRegex.source}|${mentionRegex.source}`, 'g')
      : urlRegex;

    if (mentionRegex) {
      text.replace(combinedRegex, (match, url, mention, offset) => {
        if (lastIndex !== offset) {
          parts.push(text.substring(lastIndex, offset));
        }

        if (url) {
          if (checkUrlType(url) == 'event') {
            if (match.indexOf(URL) !== -1) {
              const baseEventUrl = 'https://demo.myspace-mm.com/events/';

              if (url.startsWith(baseEventUrl)) {
                const eventIdStartIndex = baseEventUrl.length;
                const eventIdEndIndex = url.indexOf('/', eventIdStartIndex);
                const eventId = url.substring(
                  eventIdStartIndex,
                  eventIdEndIndex,
                );

                parts.push(
                  <Text
                    style={{color: COLOR.Primary}}
                    onPress={() => {
                      navigation.navigate('EventDetail', {eventId: eventId});
                    }}>
                    {url}
                  </Text>,
                );
              }
            } else {
              parts.push(
                <Text
                  key={url}
                  style={{color: COLOR.Primary}}
                  onPress={() => Linking.openURL(url)}>
                  {url}
                </Text>,
              );
            }
          } else {
            if (match.indexOf(URL) !== -1) {
              const myspaceIndex = text.indexOf(URL);
              const postIdStartIndex = myspaceIndex + URL.length + 5;
              const postIdEndIndex = text.indexOf('_', postIdStartIndex);
              const postId = text.substring(postIdStartIndex, postIdEndIndex);

              parts.push(
                <Text
                  key="myspace_link"
                  style={{color: COLOR.Primary}}
                  onPress={() => {
                    navigation.navigate('PostDetail', {
                      postId: postId,
                      darkMode: props.darkMode,
                    });
                  }}>
                  {url}
                </Text>,
              );
            } else {
              parts.push(
                <Text
                  key={url}
                  style={{color: COLOR.Primary}}
                  onPress={() => Linking.openURL(url)}>
                  {url}
                </Text>,
              );
            }
          }
        }

        if (mention) {
          const user = mentions.find(u => u.name === mention);
          if (user) {
            parts.push(
              <Text
                key={user.name}
                style={{color: COLOR.Primary}}
                onPress={() => {
                  if (isLoginUser) {
                    navigation.navigate('UserProfile');
                  } else {
                    navigation.navigate('OtherUserProfile', {
                      otherUserData: user,
                      userId: user.user_id,
                    });
                  }
                }}>
                {user.name}
              </Text>,
            );
          }
        }

        lastIndex = offset + match.length;
      });
    } else
      text.replace(combinedRegex, (match, url, offset) => {
        if (lastIndex !== offset) {
          parts.push(text.substring(lastIndex, offset));
        }
        if (url) {
          if (checkUrlType(url) == 'event') {
            if (match.indexOf(URL) !== -1) {
              const baseEventUrl = 'https://demo.myspace-mm.com/events/';

              if (url.startsWith(baseEventUrl)) {
                const eventIdStartIndex = baseEventUrl.length;
                const eventIdEndIndex = url.indexOf('/', eventIdStartIndex);
                const eventId = url.substring(
                  eventIdStartIndex,
                  eventIdEndIndex,
                );

                parts.push(
                  <Text
                    style={{color: COLOR.Primary}}
                    onPress={() => {
                      navigation.navigate('EventDetail', {eventId: eventId});
                    }}>
                    {url}
                  </Text>,
                );
              }
            } else {
              parts.push(
                <Text
                  key={url}
                  style={{color: COLOR.Primary}}
                  onPress={() => Linking.openURL(url)}>
                  {url}
                </Text>,
              );
            }
          } else {
            if (match.indexOf(URL) !== -1) {
              const myspaceIndex = text.indexOf(URL);
              const postIdStartIndex = myspaceIndex + URL.length + 5;
              const postIdEndIndex = text.indexOf('_', postIdStartIndex);
              const postId = text.substring(postIdStartIndex, postIdEndIndex);

              parts.push(
                <Text
                  key="myspace_link"
                  style={{color: COLOR.Primary}}
                  onPress={() => {
                    navigation.navigate('PostDetail', {
                      postId: postId,
                      darkMode: props.darkMode,
                    });
                  }}>
                  {url}
                </Text>,
              );
            } else {
              parts.push(
                <Text
                  key={url}
                  style={{color: COLOR.Primary}}
                  onPress={() => Linking.openURL(url)}>
                  {url}
                </Text>,
              );
            }
          }
        }

        lastIndex = offset + match.length;
      });

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  const renderUrl = text => {};

  return (
    <View>
      {props.postText && props.postText.trim() !== '' && (
        <View>{renderTextWithLinks()}</View>
      )}
    </View>
  );
};

export default PostText;
const styles = StyleSheet.create({
  bodyText: {
    fontSize: fontSizes.size15,
    fontFamily: 'Poppins-Regular',
    paddingLeft: SPACING.sp16,
  },
  readMore: {
    color: COLOR.Primary,
    textDecorationLine: 'underline',
    paddingLeft: SPACING.sp16,
    paddingBottom: SPACING.sp10,
  },
  readLess: {
    color: COLOR.Primary,
    textDecorationLine: 'underline',
    paddingLeft: SPACING.sp16,
    paddingBottom: SPACING.sp10,
  },
});
