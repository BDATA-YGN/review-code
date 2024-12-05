import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import COLOR from '../../constants/COLOR';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import {useNavigation} from '@react-navigation/native';
import IconManager from '../../assets/IconManager';
import {FontFamily, fontSizes, fontWeight} from '../../constants/FONT';
import SizedBox from '../../commonComponent/SizedBox';
import ListModal from '../PWA_Instruction/list_modal';
import { useState } from 'react';
import { pwaUserActionList } from '../../constants/CONSTANT_ARRAY';

const JobAppliedDetail = ({route}) => {
  const {data, darkMode} = route.params;
  const navigation = useNavigation();
  const [modalListVisible, setModalListVisible] = useState(false);
  const formatTimeAgo = timestamp => {
    const seconds = Math.floor(
      (new Date() - new Date(timestamp * 1000)) / 1000,
    );

    let interval = seconds / 31536000;
    if (interval > 1)
      return `${Math.floor(interval)} year${
        Math.floor(interval) > 1 ? 's' : ''
      } ago`;

    interval = seconds / 2592000;
    if (interval > 1)
      return `${Math.floor(interval)} month${
        Math.floor(interval) > 1 ? 's' : ''
      } ago`;

    interval = seconds / 86400;
    if (interval >= 1)
      return `${Math.floor(interval)} day${
        Math.floor(interval) > 1 ? 's' : ''
      } ago`;

    interval = seconds / 3600;
    if (interval >= 1)
      return `${Math.floor(interval)} hour${
        Math.floor(interval) > 1 ? 's' : ''
      } ago`;

    interval = seconds / 60;
    if (interval >= 1)
      return `${Math.floor(interval)} minute${
        Math.floor(interval) > 1 ? 's' : ''
      } ago`;

    return 'just now';
  };

  const formattedTime = formatTimeAgo(data.time);
  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.dsafeAreaView : styles.safeAreaView}>
      <ActionAppBar
        appBarText="Job Detail"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />
      <ScrollView contentContainerStyle={{padding: SPACING.sp20}}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity style={styles.avatar}>
            <Image
              source={{uri: data?.user_data?.avatar}}
              style={{
                width: 70,
                height: 70,
                borderRadius: 10,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <SizedBox height={SPACING.sp10} />
        <Text style={[styles.username,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{data?.user_data?.first_name} {data?.user_data?.last_name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{marginEnd: SPACING.sp5}}>
              <Image
                source={darkMode == 'enable' ? IconManager.location_dark :IconManager.location_light}
                resizeMode="contain"
                style={{width: 20, height: 20}}
              />
            </View>
            <Text style={[styles.location,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300}]}>{data?.location}</Text>
          </View>

        </View>
        <SizedBox height={SPACING.sp20} />
        <TouchableOpacity
          style={styles.viewCandidate}
          activeOpacity={0.8}
          onPress={() => {
            setModalListVisible(true);
          }}
        > 
          <Image source={IconManager.job_message_light}  style={{ width:15 , height : 15,marginEnd:SPACING.sp8 }}/>
          <Text style={styles.viewText}>Message</Text>
        </TouchableOpacity>
        <SizedBox height={SPACING.sp20} />
        <View style={{flexDirection: 'row'}}>
          <View style={{marginEnd: SPACING.sp5}}>
            <Image
              source={IconManager.jobs_light}
              resizeMode="contain"
              style={{width: 20, height: 20}}
            />
          </View>
          <Text style={[styles.jobDetails,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{data?.job_info?.title}</Text>
        </View>
        <SizedBox height={SPACING.sp15} />
        <View style={{flexDirection: 'row'}}>
          <View style={{marginEnd: SPACING.sp5}}>
            <Image
              source={darkMode == 'enable' ? IconManager.sessions_dark: IconManager.sessions_light}
              resizeMode="contain"
              style={{width: 20, height: 20}}
            />
          </View>
          <Text style={[styles.jobDetails,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{formattedTime}</Text>
        </View>
        <SizedBox height={SPACING.sp15} />
        <View style={{flexDirection: 'row'}}>
          <View style={{marginEnd: SPACING.sp5}}>
            <Image
              source={darkMode == 'enable' ? IconManager.email_dark :IconManager.email_light}
              resizeMode="contain"
              style={{width: 20, height: 20}}
            />
          </View>
          <Text style={[styles.jobDetails,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{data.email}</Text>
        </View>
        <SizedBox height={SPACING.sp15} />
        <View style={{flexDirection: 'row'}}>
          <View style={{marginEnd: SPACING.sp5}}>
            <Image
              source={IconManager.phone_light}
              resizeMode="contain"
              style={{width: 20, height: 20}}
            />
          </View>
          <Text style={[styles.jobDetails,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{data.phone_number}</Text>
        </View>
        <SizedBox height={SPACING.sp15} />
        <View>
          {data?.where_did_you_work ? (
            <Text style={[styles.text16,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>Where did you work?</Text>
          ) : null}
          {data?.where_did_you_work ? (
            <Text style={[styles.jobDetails,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>- {data?.where_did_you_work}</Text>
          ) : null}
        </View>
        <SizedBox height={SPACING.sp15} />
        <View>
          {data?.position ? <Text style={[styles.text16,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>Position</Text> : null}
          {data?.position ? (
            <Text style={[styles.jobDetails,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>- {data?.position}</Text>
          ) : null}
          <SizedBox height={SPACING.sp15} />
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.5}}>
            {data?.experience_start_date ? (
              <Text style={[styles.text16,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>Start Date</Text>
            ) : null}
            {data?.experience_start_date ? (
              <Text style={[styles.jobDetails,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>
                - {data?.experience_start_date}
              </Text>
            ) : null}
          </View>
          <View style={{flex: 0.5}}>
            {data?.experience_end_date ? (
              <Text style={[styles.text16,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>End Date</Text>
            ) : null}
            {data?.experience_end_date ? (
              <Text style={[styles.jobDetails,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>
                - {data?.experience_end_date}
              </Text>
            ) : null}
          </View>
        </View>

        <View>
          {data?.job_info?.description ? (
            <Text style={[styles.text16,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>Description</Text>
          ) : null}
          {data?.job_info?.description ? (
            <Text style={[styles.jobDetails,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>- {data?.job_info?.description}</Text>
          ) : null}
        </View>
        <SizedBox height={SPACING.sp10} />
        {data?.job_info?.question_one ? (
          <Text  style={[styles.text16,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{data?.job_info?.question_one}</Text>
        ) : null}
        {data?.question_one_answer ? (
          <Text  style={[styles.jobDetails,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}> - {data?.job_info?.question_one_type == 'multiple_choice_question' ? data?.job_info?.question_one_answers[data.question_one_answer] : data?.question_one_answer}</Text>
        ) : null}
        <SizedBox height={SPACING.sp10} />
        {data?.job_info?.question_two ? (
          <Text style={[styles.text16,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{data?.job_info?.question_two}</Text>
        ) : null}
        {data?.question_two_answer ? (
          <Text style={[styles.jobDetails,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}> -  {data?.job_info?.question_two_type == 'multiple_choice_question' ? data?.job_info?.question_two_answers[data.question_two_answer] : data?.question_two_answer} </Text>
        ) : null}
        <SizedBox height={SPACING.sp10} />
        {data?.job_info?.question_three ? (
          <Text style={[styles.text16,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{data?.job_info?.question_three}</Text>
        ) : null}
        {data?.question_three_answer ? (
          <Text style={[styles.jobDetails,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>
            {' '}
            - {data?.job_info?.question_three_type == 'multiple_choice_question' ? data?.job_info?.question_three_answers[data.question_three_answer] : data?.question_three_answer}
          </Text>
        ) : null}
      </ScrollView>
      <ListModal
        dataList={pwaUserActionList}
        darkMode={darkMode}
        modalVisible={modalListVisible}
        setModalVisible={setModalListVisible}
      />
    </SafeAreaView>
  );
};

export default JobAppliedDetail;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  dsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  avatar: {
    borderColor: COLOR.Grey100,
    borderWidth: 2,
    borderRadius: RADIUS.rd10,
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  location: {
    color: COLOR.Grey300,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size17,
    alignSelf: 'center',
  },
  jobDetails: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  username: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size23,
  },
  text16: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    fontWeight: fontWeight.weight600,
  },
  viewCandidate: {
    backgroundColor: COLOR.Primary,
    padding: SPACING.sp8,
    justifyContent :'center',
    borderColor: COLOR.Primary,
    borderRadius: RADIUS.rd8,
    borderWidth: 1,
    flexDirection :'row'
  },
  viewText: {
    fontSize: fontSizes.size13,
    color: COLOR.Blue50,
    fontFamily: FontFamily.PoppinRegular,
    textAlign: 'center',
  },
});
