// import { NavigationContainer, useNavigation } from '@react-navigation/native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import Home from '../screens/Home';
import Notification from '../screens/Notification';
import ShortVideo from '../screens/ShortVideo';
import Job from '../screens/Job';
import Setting from '../screens/Setting';
import BottomTabNavigator from './BottomTabNavigator';
import AddPost from '../screens/Post/AddPost';
import CreatePost from '../screens/Post/CreatePost';
import Story from '../screens/Story/Story';
import CreateStory from '../screens/Story/CreateStory';
import Post from '../screens/Post/Post';
import Feeling from '../screens/Post/Feeling';
import Gif from '../screens/Post/Gif';
import MentionFriend from '../screens/Post/MentionFriend';
import Login from '../screens/Authentication/Login';
import UserProfile from '../screens/UserProfile/UserProfile';
import OtherUserProfile from '../screens/UserProfile/OtherUserProfile';
import ViewMyPage from '../screens/PageProfile/PageDetail/ViewMyPage';
import ViewLikedPage from '../screens/PageProfile/PageDetail/ViewLikedPage';

import {
  retrieveJsonData,
  retrieveStringData,
  storeJsonData,
  storeKeys,
} from '../helper/AsyncStorage';
import {stringText} from '../constants/StringText';
import {getUserInfoData} from '../helper/ApiModel';
import UserProile from '..//screens/UserProfile/UserProfile';
import Registeration from '../screens/Authentication/Registeration';
import ForgotPassword from '../screens/Authentication/ForgotPassword/ForgotPassword';
import VerifyCode from '../screens/Authentication/ForgotPassword/VerifyCode';
import PageMain from '../screens/PageProfile/PageMain';
import UpdatePassword from '../screens/Authentication/ForgotPassword/UpdatePassword';
import SplashScreen from 'react-native-splash-screen';
import RecommendedPageScreen from '../screens/PageProfile/RecommendedPageScreen';
import Comment from '../screens/Comment/Comment';
import OnBoarding from '../screens/OnBoarding/OnBoarding';
import SuggestedPageScreen from '../screens/PageProfile/SuggestedPageScreen';
import LikePageList from '../screens/PageProfile/LikedPageList';
import ViewDiscoverPage from '../screens/PageProfile/PageDetail/ViewDiscoverPage';
import MyPageList from '../screens/PageProfile/MyPageList';
import GroupMain from '../screens/GroupProfile/GroupMain';
import MyGroupList from '../screens/GroupProfile/MyGroupList';
import JoinedGroupList from '../screens/GroupProfile/JoinedGroupList';
import RecommendedGroupScreen from '../screens/GroupProfile/RecommendedGroupScreen';
import SuggestedGroupList from '../screens/GroupProfile/SuggestedGroupList';
import ViewJoinedGroup from '../screens/GroupProfile/GroupDetail/ViewJoinedGroup';
import ViewRecommendedGroup from '../screens/GroupProfile/GroupDetail/ViewRecommendedGroup';
import ReplyComment from '../screens/Comment/ReplyComment';
import GroupInviteeList from '../screens/GroupProfile/InviteeList';
import CreatePage from '../screens/PageProfile/CreatePage/CreatePage';
import CreateGroup from '../screens/GroupProfile/CreateGroup/CreateGroup';
import PageSetttingMain from '../screens/PageProfile/PageSetting/PageSettingMain';
import EditPageGeneral from '../screens/PageProfile/PageSetting/EditPageGeneral';
import EditPageInformation from '../screens/PageProfile/PageSetting/EditPageInformation';
import EditDeletePage from '../screens/PageProfile/PageSetting/EditDeletePage';
import GroupSetttingMain from '../screens/GroupProfile/GroupSetting/GroupSettingMain';
import ViewMyGroup from '../screens/GroupProfile/GroupDetail/ViewMyGroup';
import EditGroupMember from '../screens/GroupProfile/GroupSetting/EditGroupMember';
import EditGroupData from '../screens/GroupProfile/GroupSetting/EditGroupData';
import EditGroupDelete from '../screens/GroupProfile/GroupSetting/EditGroupDelete';
import PageInviteeList from '../screens/PageProfile/PageInviteeList';
import CommingSoon from '../screens/CommingSoon';
import GeneralAcctontMain from '../screens/GeneralSettings/GeneralSettingMain';
import EditProfile from '../screens/GeneralSettings/EditProfile';
import EditPost from '../screens/Post/EditPost';
import SharePost from '../screens/Post/SharePost';
import ShareListing from '../screens/Post/ShareListing';
import BlockedList from '../screens/GeneralSettings/BlockedList';
import FriendRequest from '../screens/FriendRequest';
import Verification from '../screens/GeneralSettings/Verification';
import ChangePassword from '../screens/GeneralSettings/ChangePassword';
import TwoFactorAuth from '../screens/GeneralSettings/TwoFactor';
import ManageSession from '../screens/GeneralSettings/ManageSession';
import ReactionList from '../screens/Post/ReactionList';
import CommentReactionList from '../screens/Post/CommentReactionList';
import Theme from '../screens/Theme';
import DeactivateAccount from '../screens/GeneralSettings/DeactivateAccount';
import SearchMain from '../screens/Searching/SearchMain';
import ShortVideoNew from '../screens/ShortVideo/ShortVideoNew';

import TermsWebView from '../screens/TermsWebView';
import PostDetail from '../screens/Post/PostDetail';
import MyAccount from '../screens/GeneralSettings/MyAccount';
import InvitationLinks from '../screens/InvitationLinks/InvitationLinks';
import PostMarket from '../components/Post/PostMarket';
import SeeAllFriends from '../screens/UserProfile/SeeAllFriends';
import Event from '../screens/Event';
import SavedPosts from '../screens/SavedPosts';
import PopularPost from '../screens/PopularPost';
import Privacy from '../screens/GeneralSettings/Privacy/Privacy';
import EventDetail from '../screens/EventDetail';
import CreateEventOne from '../screens/CreateEvent/CreateEventOne';
import CreateEventTwo from '../screens/CreateEvent/CreateEventTwo';
import CreateEventThree from '../screens/CreateEvent/CreateEventThree';
import CreateEventFour from '../screens/CreateEvent/CreateEventFour';
import CreateEventFive from '../screens/CreateEvent/CreateEventFive';
import CreateEventSix from '../screens/CreateEvent/CreateEventSix';
import EditEvent from '../screens/EditEvent';
import MarketMain from '../screens/Market/market_main';
import MyMarket from '../screens/Market/my_market';
import MyProduct from '../screens/Market/my_product';
import MyPurchased from '../screens/Market/my_purchased';
import ShoppingCart from '../screens/Market/shopping_cart';
import UnusualLogin from '../screens/Authentication/UnusualLogin';
import CreateProductOne from '../screens/Market/CreateProduct/CreateProductOne';
import CreateProductTwo from '../screens/Market/CreateProduct/CreateProductTwo';
import CreateProductThree from '../screens/Market/CreateProduct/CreateProductThree';
import CreateProductFour from '../screens/Market/CreateProduct/CreateProductFour';
import CreateProductFive from '../screens/Market/CreateProduct/CreateProductFive';
import CreateProductSix from '../screens/Market/CreateProduct/CreateProductSix';
import CreateProductSeven from '../screens/Market/CreateProduct/CreateProductSeven';
import CreateProductEight from '../screens/Market/CreateProduct/CreateProductEight';
import CreateProductNine from '../screens/Market/CreateProduct/CreateProductNine';
import EditProduct from '../screens/EditProduct';
import TwoFactor from '../screens/Authentication/TwoFactor';
import ProductDetails from '../screens/Market/product_details';
import OtherProductDetails from '../screens/Market/other_product_detail';
import ProductInvoice from '../screens/Market/product_invoice';
import CreateAddress from '../screens/Market/Address/CreateAddress';
import AddressList from '../screens/Market/Address/address_list';
import EditAddress from '../screens/Market/Address/edit_address';
import Activation from '../screens/Authentication/AccountActivation/Activation';
import AccountActivation from '../screens/Authentication/AccountActivation';
import ActivationWithSMS from '../screens/Authentication/AccountActivation/ActivationWithSMS';
import ActivationWithEmail from '../screens/Authentication/AccountActivation/ActivationWithEmail';
import ActivationOptions from '../screens/Authentication/AccountActivation/ActivationOptions';
import ActivationSuccess from '../screens/Authentication/AccountActivation/ActivationSuccess';
import MarketScreen from '../screens/Market/market_screen';
import OrderedList from '../screens/Market/ordered_list';
import OrderedDetails from '../screens/Market/order_details';
import Wallet from '../screens/Wallet/Wallet';
import SendMoney from '../screens/Wallet/SendMoney';
import RecoverOptions from '../screens/Authentication/ForgotPassword/RecoverOptions';
import RecoverWithEmail from '../screens/Authentication/ForgotPassword/RecoverWithEmail';
import RecoverWithSMS from '../screens/Authentication/ForgotPassword/RecoverWithSMS';
import VerifyCodeEmail from '../screens/Authentication/ForgotPassword/VerifyCodeEmail';
import ResetPassword from '../screens/Authentication/ForgotPassword/ResetPassword';
import VerifyCodeSMS from '../screens/Authentication/ForgotPassword/VerifyCodeSMS';
import TwoFactorSettingConfrim from '../screens/GeneralSettings/TwoFactorSettingConfirm';
// import TwoFactorSettingEnabled from '../screens/GeneralSettings/TwoFactorSettingEnabled';
import PWAInstallInstructions from '../screens/PWA_Instruction/pwa_install_instructions';
import MyAddress from '../screens/MyAddress';
import OtherUserSeeAllFriends from '../screens/UserProfile/OtherUserSeeAllFriends';
import Withdraw from '../screens/Wallet/Withdraw';
import BankWithdraw from '../screens/Wallet/BankWithdraw';
import KBZWithdraw from '../screens/Wallet/KBZWithdraw';
import AddFunds from '../screens/Wallet/AddFunds';
import BankTransfer from '../screens/Wallet/BankTransfer';
import AddMonetization from '../screens/Monetization/AddMonetization';
import CreatePlan from '../screens/Monetization/CreatePlan';
import EditPlan from '../screens/Monetization/EditPlan';
import MonetizedUserProfile from '../screens/Monetization/MonetizedUserProfile';
import SubscriptionList from '../screens/Monetization/SubscriptionList';
import LiveStream from '../screens/Market/LiveStream/StreamerView/liveStream';
import NormalLive from '../screens/Market/LiveStream/StreamerView/normalLive';
import StreamViewerView from '../screens/Market/LiveStream/ViewerView/streamViewerView';
import LiveAddProduct from '../screens/Market/LiveStream/liveAddProduct';
import LiveCreateProduct from '../screens/Market/LiveStream/liveCreateProduct';
import JobLists from '../screens/Jobs/JobLists';
import JobDetail from '../screens/Jobs/JobDetail';
import JobApplyModal from '../screens/Jobs/JobApplyModal';
import CreateJob from '../screens/Jobs/CreateJob';
import JobAppliedLists from '../screens/Jobs/JobAppliedLists';
import JobAppliedDetail from '../screens/Jobs/JobAppliedDetail';
import MyJobLists from '../screens/Jobs/MyJobLists';
import EditJob from '../screens/Jobs/EditJob';
import PurchasedDetail from '../screens/Market/purchased_detail';
import ProductReview from '../screens/Market/product_review';
import ReviewCompleted from '../screens/Market/review_completed';
import {Platform} from 'react-native';
import StreamingListMain from '../screens/Market/LiveStream/liveComponent/streamList/streamingListMain';
import EditPageSocialLinks from '../screens/PageProfile/PageSetting/EditPageSocailLinks';
import EditPageAdmin from '../screens/PageProfile/PageSetting/EditPageAdmin';
import EditPriveleges from '../screens/PageProfile/PageSetting/EditPriveleges';
import NormalLiveForm from '../screens/Market/LiveStream/normalLiveForm';
import EditGroupPrivileges from '../screens/GroupProfile/GroupSetting/EditGroupPrivileges';
import GroupPrivcay from '../screens/GroupProfile/GroupSetting/GroupPrivcay';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLogin, setLogin] = useState(null);
  const [isRemenberMe, setRemenberMe] = useState(null);

  useEffect(() => {
    SplashScreen.hide();

    fetchLoginCredentialData();
  }, []);
  const fetchLoginCredentialData = async () => {
    const loginCredentials = await retrieveJsonData({
      key: storeKeys.loginCredential,
    });
    const rememberMe = await retrieveStringData({key: storeKeys.rememberMe});

    if (loginCredentials === null) {
      setLogin(false);
    } else {
      if (
        rememberMe === stringText.rememberMeCredentialDisable ||
        rememberMe === null
      ) {
        //do nothing
        setLogin(false);
      } else {
        fetchData();
        setLogin(true);
      }
    }
  };

  const fetchData = async () => {
    try {
      const userDataResponse = await getUserInfoData();
      storeJsonData({
        key: storeKeys.userInfoData,
        data: userDataResponse.user_data,
      });
    } catch (error) {
      fetchData();
    }
  };

  if (isLogin === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLogin === false ? 'Login' : 'BottomTabNavigator'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
        />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="ShortVideo" component={ShortVideo} />
        <Stack.Screen name="Job" component={Job} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="AddPost" component={AddPost} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen name="Story" component={Story} />
        <Stack.Screen name="CreateStory" component={CreateStory} />
        <Stack.Screen name="Feeling" component={Feeling} />
        <Stack.Screen name="Gif" component={Gif} />
        <Stack.Screen name="MentionFriend" component={MentionFriend} />
        <Stack.Screen name="UserProile" component={UserProile} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registeration" component={Registeration} />
        <Stack.Screen
          name="OtherUserProfile"
          component={OtherUserProfile}
          getId={({params}) => params.userId}
        />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="VerifyCode" component={VerifyCode} />
        <Stack.Screen name="PageMain" component={PageMain} />
        <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
        <Stack.Screen name="Comment" component={Comment} />
        <Stack.Screen
          name="SuggestedPageScreen"
          component={SuggestedPageScreen}
        />
        <Stack.Screen name="LikePageList" component={LikePageList} />
        <Stack.Screen name="ViewMyPage" component={ViewMyPage} />
        <Stack.Screen name="ViewLikedPage" component={ViewLikedPage} />
        <Stack.Screen name="ViewDiscoverPage" component={ViewDiscoverPage} />
        <Stack.Screen name="MyPageList" component={MyPageList} />
        <Stack.Screen name="GroupMain" component={GroupMain} />
        <Stack.Screen name="MyGroupList" component={MyGroupList} />
        <Stack.Screen name="JoinedGroupList" component={JoinedGroupList} />
        <Stack.Screen
          name="RecommendedGroupScreen"
          component={RecommendedGroupScreen}
        />
        <Stack.Screen
          name="SuggestedGroupList"
          component={SuggestedGroupList}
        />
        <Stack.Screen name="ViewJoinedGroup" component={ViewJoinedGroup} />
        <Stack.Screen
          name="ViewRecommendedGroup"
          component={ViewRecommendedGroup}
        />
        <Stack.Screen name="GroupInviteeList" component={GroupInviteeList} />
        <Stack.Screen
          name="RecommendedPageScreen"
          component={RecommendedPageScreen}
        />
        <Stack.Screen name="Onboarding" component={OnBoarding} />
        <Stack.Screen name="ReplyComment" component={ReplyComment} />
        <Stack.Screen name="CreatePage" component={CreatePage} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="PageSetttingMain" component={PageSetttingMain} />
        <Stack.Screen name="EditPageGeneral" component={EditPageGeneral} />
        <Stack.Screen
          name="EditPageInformation"
          component={EditPageInformation}
        />

        <Stack.Screen name="EditDeletePage" component={EditDeletePage} />
        <Stack.Screen name="ViewMyGroup" component={ViewMyGroup} />

        <Stack.Screen name="GroupSetttingMain" component={GroupSetttingMain} />
        <Stack.Screen name="EditGroupMember" component={EditGroupMember} />
        <Stack.Screen name="EditGroupData" component={EditGroupData} />
        <Stack.Screen name="EditGroupDelete" component={EditGroupDelete} />
        <Stack.Screen name="PageInviteeList" component={PageInviteeList} />
        <Stack.Screen name="CommingSoon" component={CommingSoon} />
        <Stack.Screen
          name="GeneralAcctontMain"
          component={GeneralAcctontMain}
        />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="EditPost" component={EditPost} />
        <Stack.Screen name="SharePost" component={SharePost} />
        <Stack.Screen name="ShareListing" component={ShareListing} />
        <Stack.Screen name="BlockedList" component={BlockedList} />
        <Stack.Screen name="FriendRequest" component={FriendRequest} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuth} />
        <Stack.Screen name="ManageSession" component={ManageSession} />
        <Stack.Screen name="ReactionList" component={ReactionList} />
        <Stack.Screen
          name="CommentReactionList"
          component={CommentReactionList}
        />

        <Stack.Screen name="Theme" component={Theme} />
        <Stack.Screen name="DeactivateAccount" component={DeactivateAccount} />
        <Stack.Screen name="SearchMain" component={SearchMain} />
        <Stack.Screen name="ShortVideoNew" component={ShortVideoNew} />
        <Stack.Screen name="TermsWebView" component={TermsWebView} />
        <Stack.Screen name="PostDetail" component={PostDetail} />
        <Stack.Screen name="MyAccount" component={MyAccount} />
        <Stack.Screen name="InvitationLinks" component={InvitationLinks} />
        <Stack.Screen name="PostMarket" component={PostMarket} />
        <Stack.Screen name="SeeAllFriends" component={SeeAllFriends} />
        <Stack.Screen name="Event" component={Event} />
        <Stack.Screen name="SavedPosts" component={SavedPosts} />
        <Stack.Screen name="PopularPost" component={PopularPost} />
        <Stack.Screen name="EventDetail" component={EventDetail} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="AccountActivation" component={AccountActivation} />
        <Stack.Screen name="CreateEventOne" component={CreateEventOne} />
        <Stack.Screen name="CreateEventTwo" component={CreateEventTwo} />
        <Stack.Screen name="CreateEventThree" component={CreateEventThree} />
        <Stack.Screen name="CreateEventFour" component={CreateEventFour} />
        <Stack.Screen name="CreateEventFive" component={CreateEventFive} />
        <Stack.Screen name="CreateEventSix" component={CreateEventSix} />
        <Stack.Screen name="EditEvent" component={EditEvent} />
        <Stack.Screen name="MarketMain" component={MarketMain} />
        <Stack.Screen name="MyMarket" component={MyMarket} />
        <Stack.Screen name="MyProduct" component={MyProduct} />
        <Stack.Screen name="MyPurchased" component={MyPurchased} />
        <Stack.Screen name="ShoppingCart" component={ShoppingCart} />
        <Stack.Screen name="UnusualLogin" component={UnusualLogin} />
        <Stack.Screen name="TwoFactor" component={TwoFactor} />
        <Stack.Screen name="CreateProductOne" component={CreateProductOne} />
        <Stack.Screen name="CreateProductTwo" component={CreateProductTwo} />
        <Stack.Screen
          name="CreateProductThree"
          component={CreateProductThree}
        />
        <Stack.Screen name="CreateProductFour" component={CreateProductFour} />
        <Stack.Screen name="CreateProductFive" component={CreateProductFive} />
        <Stack.Screen name="CreateProductSix" component={CreateProductSix} />
        <Stack.Screen
          name="CreateProductSeven"
          component={CreateProductSeven}
        />
        <Stack.Screen
          name="CreateProductEight"
          component={CreateProductEight}
        />
        <Stack.Screen name="CreateProductNine" component={CreateProductNine} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen
          name="OtherProductDetails"
          component={OtherProductDetails}
        />
        <Stack.Screen name="ProductInvoice" component={ProductInvoice} />
        <Stack.Screen name="CreateAddress" component={CreateAddress} />
        <Stack.Screen name="AddressList" component={AddressList} />
        <Stack.Screen name="EditAddress" component={EditAddress} />
        <Stack.Screen name="Activation" component={Activation} />
        <Stack.Screen name="ActivationOptions" component={ActivationOptions} />
        <Stack.Screen name="ActivationWithSMS" component={ActivationWithSMS} />
        <Stack.Screen
          name="ActivationWithEmail"
          component={ActivationWithEmail}
        />
        <Stack.Screen name="ActivationSuccess" component={ActivationSuccess} />
        <Stack.Screen name="MarketScreen" component={MarketScreen} />
        <Stack.Screen name="OrderedList" component={OrderedList} />
        <Stack.Screen name="OrderedDetails" component={OrderedDetails} />
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="SendMoney" component={SendMoney} />
        <Stack.Screen name="RecoverOptions" component={RecoverOptions} />
        <Stack.Screen name="RecoverWithEmail" component={RecoverWithEmail} />
        <Stack.Screen name="RecoverWithSMS" component={RecoverWithSMS} />
        <Stack.Screen name="VerifyCodeEmail" component={VerifyCodeEmail} />
        <Stack.Screen name="VerifyCodeSMS" component={VerifyCodeSMS} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen
          name="TwoFactorSettingConfrim"
          component={TwoFactorSettingConfrim}
        />
        {/* <Stack.Screen
          name="TwoFactorSettingEnabled"
          component={TwoFactorSettingEnabled}
        /> */}
        <Stack.Screen
          name="PWAInstallInstructions"
          component={PWAInstallInstructions}
        />
        <Stack.Screen name="MyAddress" component={MyAddress} />
        <Stack.Screen name="OtherSeeAll" component={OtherUserSeeAllFriends} />
        <Stack.Screen name="WithDraw" component={Withdraw} />
        <Stack.Screen name="BankWithdraw" component={BankWithdraw} />
        <Stack.Screen name="KBZWithdraw" component={KBZWithdraw} />
        <Stack.Screen name="AddFunds" component={AddFunds} />
        <Stack.Screen name="BankTransfer" component={BankTransfer} />
        <Stack.Screen name="AddMonetization" component={AddMonetization} />
        <Stack.Screen name="CreatePlan" component={CreatePlan} />
        <Stack.Screen name="EditPlan" component={EditPlan} />
        <Stack.Screen
          name="MonetizedUserProfile"
          component={MonetizedUserProfile}
        />
        <Stack.Screen name="SubscriptionList" component={SubscriptionList} />
        <Stack.Screen
          name="LiveStream"
          component={LiveStream}
          // options={{
          //   gestureEnabled: Platform.OS === 'ios' ? false : true,
          // }}
        />
        <Stack.Screen
          name="NormalLive"
          component={NormalLive}
          // options={{
          //   gestureEnabled: Platform.OS === 'ios' ? false : true,
          // }}
        />
        <Stack.Screen name="StreamViewerView" component={StreamViewerView} />
        <Stack.Screen name="LiveAddProduct" component={LiveAddProduct} />
        <Stack.Screen name="LiveCreateProduct" component={LiveCreateProduct} />
        <Stack.Screen name="JobLists" component={JobLists} />
        <Stack.Screen name="JobDetail" component={JobDetail} />
        <Stack.Screen name="JobApplyModal" component={JobApplyModal} />
        <Stack.Screen name="CreateJob" component={CreateJob} />
        <Stack.Screen name="JobAppliedLists" component={JobAppliedLists} />
        <Stack.Screen name="JobAppliedDetail" component={JobAppliedDetail} />
        <Stack.Screen name="MyJobLists" component={MyJobLists} />
        <Stack.Screen name="EditJob" component={EditJob} />
        <Stack.Screen name="PurchasedDetail" component={PurchasedDetail} />
        <Stack.Screen name="ProductReview" component={ProductReview} />
        <Stack.Screen name="ReviewCompleted" component={ReviewCompleted} />
        <Stack.Screen name="StreamingListMain" component={StreamingListMain} />

        <Stack.Screen
          name="EditPageSocialLinks"
          component={EditPageSocialLinks}
        />
        <Stack.Screen name="EditPageAdmin" component={EditPageAdmin} />
        <Stack.Screen name="EditPrivileges" component={EditPriveleges} />
        <Stack.Screen name="NormalLiveForm" component={NormalLiveForm} />
        <Stack.Screen
          name="EditGroupPrivileges"
          component={EditGroupPrivileges}
        />
        <Stack.Screen name="GroupPrivacy" component={GroupPrivcay} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
