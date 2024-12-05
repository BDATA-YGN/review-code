import IconManager from '../assets/IconManager';
import i18n from '../i18n';
import {handleDownloadPWA} from '../helper/Market/MarketHelper';
import COLOR from './COLOR';

export const addPostOptions = [
  {
    id: 1,
    iconLight: IconManager.gallery_light,
    iconDark: IconManager.gallery_dark,
    text: i18n.t(`translation:uploadImage`),
  },
  {
    id: 2,
    iconLight: IconManager.tagfriend_light,
    iconDark: IconManager.tagfriend_dark,
    text: i18n.t(`translation:mentionFriend`),
  },
  {
    id: 3,
    iconLight: IconManager.uploadvideo_light,
    iconDark: IconManager.uploadvideo_dark,
    text: i18n.t(`translation:uploadVideo`),
  },
  {
    id: 4,
    iconLight: IconManager.gif_light,
    iconDark: IconManager.gif_dark,
    text: i18n.t(`translation:gif`),
  },
  {
    id: 5,
    iconLight: IconManager.feeling_light,
    iconDark: IconManager.feeling_dark,
    text: i18n.t(`translation:feeling`),
  },
];

export const postPrivary = [
  {
    id: 0,
    label: i18n.t(`translation:everyone`),
    iconLight: IconManager.public_light,
    iconDark: IconManager.public_dark,
  },
  {
    id: 1,
    label: i18n.t(`translation:myfriend`),
    iconLight: IconManager.tagfriend_light,
    iconDark: IconManager.tagfriend_dark,
  },

  // {
  //   id: 6,
  //   label: i18n.t(`translation:monetization`),
  //   iconLight: IconManager.postmonetized_light,
  //   iconDark: IconManager.postmonetized_dark,
  // },
  {
    id: 3,
    label: i18n.t(`translation:onlyme`),
    iconLight: IconManager.onlyme_light,
    iconDark: IconManager.onlyme_dark,
  },
  {
    id: 4,
    label: i18n.t(`translation:anonymous`),
    iconLight: IconManager.anonymous_light,
    iconDark: IconManager.anonymous_dark,
  },
];

export const pagePrivary = [
  {
    id: 0,
    label: i18n.t(`translation:everyone`),
    iconLight: IconManager.public_light,
    iconDark: IconManager.public_dark,
  },
  {
    id: 2,
    label: 'Liked my page',
    iconLight: IconManager.like_line_light,
    iconDark: IconManager.like_line_dark,
  },
];

export const feelingActivityOptions = [
  {
    id: 0,
    iconLight: IconManager.feeling_light,
    iconDark: IconManager.feeling_dark,
    text: i18n.t(`translation:feeling`),
    value: 'feelings',
    placeHolder: '',
  },
  {
    id: 1,
    iconLight: IconManager.listening_light,
    iconDark: IconManager.listening_dark,
    text: i18n.t(`translation:listening`),
    value: 'listening',
    placeHolder: i18n.t(`translation:whatareyoulistening`),
  },
  {
    id: 2,
    iconLight: IconManager.playing_light,
    iconDark: IconManager.playing_dark,
    text: i18n.t(`translation:playing`),
    value: 'playing',
    placeHolder: i18n.t(`translation:whatareyouplaying`),
  },
  {
    id: 3,
    iconLight: IconManager.watching_light,
    iconDark: IconManager.watching_dark,
    text: i18n.t(`translation:watching`),
    value: 'watching',
    placeHolder: i18n.t(`translation:whatareyouwatching`),
  },
  {
    id: 4,
    iconLight: IconManager.traveling_light,
    iconDark: IconManager.traveling_dark,
    text: i18n.t(`translation:traveling`),
    value: 'traveling',
    placeHolder: i18n.t(`translation:whereyoutraveling`),
  },
];

export const feelingEmoji = [
  {icon: IconManager.angry, text: 'Angry', value: 'angry'},
  {icon: IconManager.funny, text: 'Funny', value: 'funny'},
  {icon: IconManager.loved, text: 'Loved', value: 'loved'},
  {icon: IconManager.cool, text: 'Cool', value: 'cool'},

  {icon: IconManager.happy, text: 'Happy', value: 'happy'},
  {icon: IconManager.tired, text: 'Tired', value: 'tired'},
  {icon: IconManager.sleepy, text: 'Sleepy', value: 'sleepy'},
  {
    icon: IconManager.expressionless,
    text: 'Expressionless',
    value: 'expressionless',
  },

  {icon: IconManager.confused, text: 'Confused', value: 'confused'},
  {icon: IconManager.shocked, text: 'Shocked', value: 'shocked'},
  {icon: IconManager.very_sad, text: 'Very Sad', value: 'sad'},
  {icon: IconManager.blessed, text: 'Blessed', value: 'blessed'},

  {icon: IconManager.bored, text: 'Bored', value: 'bored'},
  {icon: IconManager.broken, text: 'Broken', value: 'broke'},
  {icon: IconManager.lovely, text: 'Lovely', value: 'lovely'},
  {icon: IconManager.hot, text: 'Hot', value: 'hot'},
];

export const reactionIcons = {
  1: IconManager.like_react,
  2: IconManager.love_react,
  3: IconManager.haha_react,
  4: IconManager.wow_react,
  5: IconManager.sad_react,
  6: IconManager.angry_react,
};

export const onBoradingList = [
  {
    key: 's1',
    title: i18n.t(`translation:permissionLocation`),
    text: i18n.t(`translation:permission_Location`),
    image: {
      uri: IconManager.boarding_loacation_light,
    },
  },
  {
    key: 's2',
    title: i18n.t(`translation:create_groups`),
    text: i18n.t(`translation:permission_groups`),
    image: {
      uri: IconManager.boarding_group_light,
    },
  },
  {
    key: 's3',
    title: i18n.t(`translation:permissionStorage`),
    text: i18n.t(`translation:permission_storage`),
    image: {
      uri: IconManager.boarding_multimedia_light,
    },
  },
  {
    key: 's4',
    title: i18n.t(`translation:permission_recordAccess`),
    text: i18n.t(`translation:permission_recording`),
    image: {
      uri: IconManager.boarding_recording_light,
    },
  },
];

export const shareOptions = [
  {
    iconLight: IconManager.mytimeline_light,
    iconDark: IconManager.mytimeline_dark,
    text: 'Share to my Timeline',
    navigation: 'SharePost',
    type: 'navigate',
    shareType: 'share_post_on_timeline',
  },
  {
    iconLight: IconManager.mygroup_light,
    iconDark: IconManager.mygroup_dark,
    text: 'Share to a Group',
    navigation: 'ShareListing',
    type: 'navigate',
    shareType: 'share_post_on_group',
  },
  // {
  //   iconLight: IconManager.moreoptions,
  //   iconDark: IconManager.moreoptions,
  //   text: 'More Options',
  //   navigation: 'CommingSoon',
  //   type: 'popup',
  // },
  {
    iconLight: IconManager.mypages_light,
    iconDark: IconManager.mypages_dark,
    text: 'Share to a Page',
    navigation: 'ShareListing',
    type: 'navigate',
    shareType: 'share_post_on_page',
  },
];

export const NonLoginUserPostOptions = [
  {
    iconLight: IconManager.save_light,
    iconDark: IconManager.save_dark,
    text: 'Save post',
    navigation: 'CommingSoon',
    type: 'save',
  },
  {
    iconLight: IconManager.copy_light,
    iconDark: IconManager.copy_dark,
    text: 'Copy text',
    navigation: 'CommingSoon',
    type: 'copyText',
  },
  {
    iconLight: IconManager.copylink_light,
    iconDark: IconManager.copylink_dark,
    text: 'Copy link',
    navigation: 'CommingSoon',
    type: 'copyLink',
  },
  {
    iconLight: IconManager.hidepost_light,
    iconDark: IconManager.hidepost_dark,
    text: 'Hide post',
    navigation: 'CommingSoon',
    type: 'hidePost',
  },
  {
    iconLight: IconManager.report_light,
    iconDark: IconManager.report_dark,
    text: 'Report Post',
    navigation: 'CommingSoon',
    type: 'reportPost',
  },
];
export const LoginUserPostOptions = [
  {
    iconLight: IconManager.save_light,
    iconDark: IconManager.save_dark,
    text: 'Save post',
    navigation: 'CommingSoon',
    type: 'save',
  },

  {
    iconLight: IconManager.copylink_light,
    iconDark: IconManager.copylink_dark,
    text: 'Copy link',
    navigation: 'CommingSoon',
    type: 'copyLink',
  },
  {
    iconLight: IconManager.report_light,
    iconDark: IconManager.report_dark,
    text: 'Report Post',
    navigation: 'CommingSoon',
    type: 'reportPost',
  },
  {
    iconLight: IconManager.editPost_light,
    iconDark: IconManager.editPost_dark,
    text: 'Edit Post',
    navigation: 'EditPost',
    type: 'editPost',
  },
  {
    iconLight: IconManager.boostPost_light,
    iconDark: IconManager.boostPost_dark,
    text: 'Boost Post',
    navigation: 'CommingSoon',
    type: 'boostPost',
  },
  {
    iconLight: IconManager.disableCmt_light,
    iconDark: IconManager.disableCmt_dark,
    text: 'Disable Comment',
    navigation: 'CommingSoon',
    type: 'disableComment',
  },
  {
    iconLight: IconManager.deletePost_light,
    iconDark: IconManager.deletePost_dark,
    text: 'Delete post',
    navigation: 'CommingSoon',
    type: 'delete',
  },
];
export const NonOwnerPostOptions = [
  {
    iconLight: IconManager.copylink_light,
    iconDark: IconManager.copylink_dark,
    text: 'Copy link',
    navigation: 'CommingSoon',
    type: 'copyLink',
  },
  {
    iconLight: IconManager.share_light,
    iconDark: IconManager.share_dark,
    text: 'Share',
    navigation: 'CommingSoon',
    type: 'share',
  },
  {
    iconLight: IconManager.report_light,
    iconDark: IconManager.report_dark,
    text: 'Report Post',
    navigation: 'CommingSoon',
    type: 'reportPost',
  },
];

export const LoginUserEventOptions = [
  {
    iconLight: IconManager.copylink_light,
    iconDark: IconManager.copylink_dark,
    text: 'Copy link',
    // navigation: 'CommingSoon',
    type: 'copyLinkEvent',
  },

  {
    iconLight: IconManager.editPost_light,
    iconDark: IconManager.editPost_dark,
    text: 'Edit event',
    navigation: 'EditEvent',
    type: 'editEvent',
  },
  {
    iconLight: IconManager.deletePost_light,
    iconDark: IconManager.deletePost_dark,
    text: 'Delete event',
    // navigation: 'CommingSoon',
    type: 'deleteEvent',
  },
];

export const NonOwnerEventOptions = [
  {
    iconLight: IconManager.copylink_light,
    iconDark: IconManager.copylink_dark,
    text: 'Copy link',
    // navigation: 'CommingSoon',
    type: 'copyLinkEvent',
  },
];

export const moreOptionForLoginUser = [
  {
    id: '1',
    label: 'Copy Text',
  },
  {
    id: '2',
    label: 'Report',
  },
  {
    id: '3',
    label: 'Edit',
  },
  {
    id: '4',
    label: 'Delete',
  },
];
export const moreOptionForNonLoginUser = [
  {
    id: '1',
    label: 'Copy Text',
  },
  {
    id: '2',
    label: 'Report',
  },
];
export const categoriesList = [
  {id: '2', category_name: 'Cars and Vehicles'},
  {id: '3', category_name: 'Comedy'},
  {id: '4', category_name: 'Economics and Trade'},
  {id: '5', category_name: 'Education'},
  {id: '6', category_name: 'Entertainment'},
  {id: '7', category_name: 'Movies &amp; Animation'},
  {id: '8', category_name: 'Gaming'},
  {id: '9', category_name: 'History and Facts'},
  {id: '10', category_name: 'Live Style'},
  {id: '11', category_name: 'Natural'},
  {id: '12', category_name: 'News and Politics'},
  {id: '12', category_name: 'People and Nations'},
  {id: '14', category_name: 'Pets and Animals'},
  {id: '15', category_name: 'Places and Regions'},
  {id: '16', category_name: 'Science and Technology'},
  {id: '17', category_name: 'Sport'},
  {id: '18', category_name: 'Travel and Events'},
  {id: '1', category_name: 'Other'},
];

export const relationship = [
  {id: '0', name: 'None'},
  {id: '1', name: 'Single'},
  {id: '2', name: 'In a relationship'},
  {id: '3', name: 'Married'},
  {id: '4', name: 'Engaged'},
];

export const twoFactorObject = [
  {id: '0', name: 'Diasble'},
  {id: '1', name: 'Enable'},
];

export const otherUserProfileMoreOptions = [
  // {
  //   id: 1,
  //   label: 'Copy Link',
  // },
  // {
  //   id: 2,
  //   label: 'Share',
  // },
  {
    id: 3,
    label: 'Block',
  },
  // {
  //   id: 4,
  //   label: 'Report This User',
  // },
  // {
  //   id: 5,
  //   label: 'Poke',
  // },
  // {
  //   id: 6,
  //   label: 'Add To Family',
  // },
];
export const userProfileOption = [
  {
    id: 1,
    label: 'Change Cover Photo',
  },
  {
    id: 2,
    label: 'Change Profile Picture',
  },
];
export const posterimage = {
  defaultposter:
    'https://asdfsdfa.s3.us-east-005.backblazeb2.com/upload/photos/2024/01/zHLJXZM1KaJo5zIzmTsV_17_47e16f64b18d7cc830d7a8be8cdf56dc_image.jpg',
};

export const reactions = [
  {
    id: 1,
    value: 'like',
    icon: IconManager.like_react,
    icon_small: IconManager.like_react_small,
  },
  {
    id: 2,
    value: 'love',
    icon: IconManager.love_react,
    icon_small: IconManager.love_react_small,
  },
  {
    id: 3,
    value: 'haha',
    icon: IconManager.haha_react,
    icon_small: IconManager.haha_react_small,
  },
  {
    id: 4,
    value: 'wow',
    icon: IconManager.wow_react,
    icon_small: IconManager.wow_react_small,
  },
  {
    id: 5,
    value: 'sad',
    icon: IconManager.sad_react,
    icon_small: IconManager.sad_react_small,
  },
  {
    id: 6,
    value: 'angry',
    icon: IconManager.angry_react,
    icon_small: IconManager.angry_react_small,
  },
];

export const country = [
  {id: '149', name: 'Myanmar'},
  {id: '1', name: 'United States'},
  {id: '2', name: 'Canada'},
  {id: '3', name: 'Korea'},
  {id: '4', name: 'Thailand'},
  {id: '5', name: 'Cambodia'},
  {id: '6', name: 'Lao'},
  {id: '7', name: 'Vietnam'},
  {id: '8', name: 'Argentina'},
  {id: '9', name: 'France'},
  {id: '10', name: 'Nawai'},
  {id: '11', name: 'Singapore'},
  {id: '12', name: 'Russia'},
  {id: '13', name: 'Nepaw'},
  {id: '14', name: 'Senegol'},
  {id: '15', name: 'South Korea'},
];

export const postCreateOptions = [
  {
    iconLight: IconManager.event_light,
    iconDark: IconManager.event_dark,
    text: 'Create Event',
    navigation: 'CreateEventOne',
    // type: 'copyLink',
  },
  {
    iconLight: IconManager.add_product_light,
    iconDark: IconManager.add_product_dark,
    text: 'Create New Product',
    navigation: 'CreateProductOne',
    // type: 'copyLink',
  },
  {
    iconLight: IconManager.page_light,
    iconDark: IconManager.page_dark,
    text: 'Create New Page',
    navigation: 'CreatePage',
    // type: 'save',
  },

  {
    iconLight: IconManager.group_light,
    iconDark: IconManager.group_dark,
    text: 'Create New Group',
    navigation: 'CreateGroup',
    // type: 'copyLink',
  },
];

export const who_can_follow_me = [
  {
    type: 'follow_privacy',
    id: 0,
    label: i18n.t(`translation:everyone`),
  },
  {
    type: 'follow_privacy',
    id: 1,
    label: 'People i follow',
  },
];

export const who_can_message_me = [
  {
    type: 'message_privacy',
    id: 0,
    label: i18n.t(`translation:everyone`),
  },
  {
    type: 'message_privacy',
    id: 1,
    label: 'People i follow',
  },
  {
    type: 'message_privacy',
    id: 2,
    label: 'No body',
  },
];

export const who_can_post_on_my_timeline = [
  {
    type: 'post_privacy',
    id: 0,
    label: i18n.t(`translation:everyone`),
    value: 'everyone',
  },
  {
    type: 'post_privacy',
    id: 1,
    label: 'People i follow',
    value: 'ifollow',
  },
  {
    type: 'post_privacy',
    id: 2,
    label: 'No body',
    value: 'nobody',
  },
];

export const who_can_see_my_birthday = [
  {
    type: 'birth_privacy',
    id: 0,
    label: i18n.t(`translation:everyone`),
  },
  {
    type: 'birth_privacy',
    id: 1,
    label: 'People i follow',
  },
  {
    type: 'birth_privacy',
    id: 2,
    label: 'No body',
  },
];

export const online_status = [
  {
    type: 'status',
    id: 0,
    label: 'Online',
  },
  {
    type: 'status',
    id: 1,
    label: 'Offline',
  },
];

export const who_can_see_my_friends = [
  {
    type: 'friend_privacy',
    id: 0,
    label: i18n.t(`translation:everyone`),
  },
  {
    type: 'friend_privacy',
    id: 1,
    label: 'People i follow',
  },
  {
    type: 'friend_privacy',
    id: 2,
    label: 'People follow me',
  },
  {
    type: 'friend_privacy',
    id: 3,
    label: 'No body',
  },
];

export const privacySettings = [
  {
    title: 'who_can_follow_me',
    name: 'Who can follow me?',
    settings: who_can_follow_me,
  },
  {
    title: 'who_can_message_me',
    name: 'Who can message me?',
    settings: who_can_message_me,
  },
  {
    title: 'who_can_see_my_friends',
    name: 'Who can see my friends?',
    settings: who_can_see_my_friends,
  },
  {
    title: 'who_can_post_on_my_timeline',
    name: 'Who can post on my timeline?',
    settings: who_can_post_on_my_timeline,
  },
  {
    title: 'who_can_see_my_birthday',
    name: 'Who can see my birthday?',
    settings: who_can_see_my_birthday,
  },
];

export const categoryList = [
  {
    name: 'Default',
    id: 0,
  },
  {
    name: 'Other',
    id: 1,
  },
  {
    name: 'Autos & Vehicles',
    id: 2,
  },
  {
    name: 'Baby Products & Services',
    id: 3,
  },
  {
    name: 'Computers & Peripherals',
    id: 4,
  },
  {
    name: 'Consumer Electronics',
    id: 5,
  },
  {
    name: 'Dating Services',
    id: 6,
  },
  {
    name: 'Financial Services',
    id: 7,
  },
  {
    name: 'Gifts & Occasicons',
    id: 8,
  },
  {
    name: 'Home & Garden',
    id: 9,
  },
  {
    name: 'Default',
    id: 110,
  },
  {
    name: 'Other',
    id: 11,
  },
  {
    name: 'Autos & Vehicles',
    id: 12,
  },
  {
    name: 'Baby Products & Services',
    id: 13,
  },
  {
    name: 'Computers & Peripherals',
    id: 14,
  },
  {
    name: 'Consumer Electronics',
    id: 15,
  },
  {
    name: 'Dating Services',
    id: 16,
  },
  {
    name: 'Financial Services',
    id: 17,
  },
  {
    name: 'Gifts & Occasicons',
    id: 18,
  },
  {
    name: 'Home & Garden',
    id: 19,
  },
];
export const productCategories = [
  {category_id: '1', name: 'Other'},
  {category_id: '2', name: 'Autos and Vehicles'},
  {category_id: '3', name: "Baby & Children's Products"},
  {category_id: '4', name: 'Beauty Products & Services'},
  {category_id: '5', name: 'Computers & Peripherals'},
  {category_id: '6', name: 'Consumer Electronics'}, // Fixed typo here
  {category_id: '7', name: 'Dating Services'},
  {category_id: '8', name: 'Financial Services'},
  {category_id: '9', name: 'Gifts & Occasions'},
  {category_id: '10', name: 'Home & Garden'},
  // {category_id: '11', name: 'Foods and Vegetables'},
];

export const marketCategory = [
  {category_id: '0', name: 'All Products'},
  {category_id: '1', name: 'Other'},
  {category_id: '2', name: 'Autos and Vehicles'},
  {category_id: '3', name: "Baby & Children's Products"},
  {category_id: '4', name: 'Beauty Products & Services'},
  {category_id: '5', name: 'Computers & Peripherals'},
  {category_id: '6', name: 'Consumer Electronics'}, // Fixed typo here
  {category_id: '7', name: 'Dating Services'},
  {category_id: '8', name: 'Financial Services'},
  {category_id: '9', name: 'Gifts & Occasions'},
  {category_id: '10', name: 'Home & Garden'},
];

export const invoiceTransaction = [
  {
    name: 'ALL',
    id: 1,
  },
  {
    name: 'SALE',
    id: 2,
  },
  {
    name: 'WALLET',
    id: 3,
  },
  {
    name: 'PURCHASE',
    id: 4,
  },
  {
    name: 'SENT',
    id: 5,
  },
  {
    name: 'RECEIVED',
    id: 6,
  },
];

export const invoicePayment = [
  {
    name: 'ALL',
    id: 0,
  },
  {
    name: 'APPROVED',
    id: 1,
  },
  {
    name: 'DECLINE',
    id: 2,
  },
];

export const paymentType = [
  {
    name: 'Bank Transfer',
    id: 1,
  },
];

export const pwaUserActionList = [
  // type = 1(navigate), type =2 (action)
  {
    name: 'How to install Messenger',
    id: 1,
    iconLight: IconManager.go_to_light,
    iconDark: IconManager.go_to_dark,
    type: 1,
    navigate: 'PWAInstallInstructions',
  },
  // {
  //   name: 'How to install Messenger(Android)',
  //   id: 2,
  //   iconLight: IconManager.go_to_light,
  //   iconDark: IconManager.go_to_dark,
  //   type: 1,
  //   navigate: 'PWAInstallInstructions',
  // },
  {
    name: 'Install Messenger',
    id: 3,
    iconLight: IconManager.go_to_light,
    iconDark: IconManager.go_to_dark,
    type: 2,
    action: handleDownloadPWA,
  },
];

export const CurrencyType = [
  {
    name: 'MMK (Ks)',
    id: 0,
  },
  {
    name: 'USD',
    id: 1,
  },
  {
    name: 'SGD',
    id: 2,
  },
  {
    name: 'Thai Baht',
    id: 3,
  },
];

export const DurationType = [
  {
    name: 'daily',
    id: 0,
  },
  {
    name: 'weekly',
    id: 1,
  },
  {
    name: 'monthly',
    id: 2,
  },
  {
    name: 'yearly',
    id: 3,
  },
];

export const jobType = [
  {
    id: 'full_time',
    name: 'Full Time',
  },
  {
    id: 'part_time',
    name: 'Part time',
  },
  {
    id: 'internship',
    name: 'Internship',
  },
  {
    id: 'volunteer',
    name: 'Volunteer',
  },
  {
    id: 'contract',
    name: 'Contract',
  },
];

export const jobStatus = [
  {
    id: 'false',
    name: 'Not Apply',
  },
  {
    id: 'true',
    name: 'Already Applied',
  },
];

export const jobCategories = [
  {
    id: '1',
    name: 'Other',
  },
  {
    id: '2',
    name: 'Admin & Office',
  },
  {
    id: '3',
    name: 'Art & Design',
  },
  {
    id: '4',
    name: 'Business Operations',
  },
  {
    id: '5',
    name: 'Cleaning & Facilities',
  },
  {
    id: '6',
    name: 'Community & Social Services',
  },
  {
    id: '7',
    name: 'Computer & Data',
  },
  {
    id: '8',
    name: 'Construction & Mining',
  },
  {
    id: '9',
    name: 'Education',
  },
  {
    id: '10',
    name: 'Farming & Forestry',
  },
  {
    id: '11',
    name: 'Healthcare',
  },
  {
    id: '12',
    name: 'Installation, Maintenance & Repair',
  },
  {
    id: '13',
    name: 'Legal',
  },
  {
    id: '14',
    name: 'Management',
  },
  {
    id: '15',
    name: 'Manufacturing',
  },
  {
    id: '16',
    name: 'Media & Communication',
  },
  {
    id: '17',
    name: 'Personal Care',
  },
  {
    id: '18',
    name: 'Protective Services',
  },
  {
    id: '19',
    name: 'Restaurant & Hospitality',
  },
  {
    id: '20',
    name: 'Retail & Sales',
  },
  {
    id: '21',
    name: 'Science & Engineering',
  },
  {
    id: '22',
    name: 'Sports & Entertainment',
  },
  {
    id: '23',
    name: 'Transportation',
  },
];

export const applyYears = [
  {id: '1', name: '2024'},
  {id: '2', name: '2023'},
  {id: '3', name: '2022'},
  {id: '4', name: '2021'},
  {id: '5', name: '2020'},
  {id: '6', name: '2019'},
  {id: '7', name: '2018'},
  {id: '8', name: '2017'},
  {id: '9', name: '2016'},
  {id: '10', name: '2015'},
  {id: '11', name: '2014'},
  {id: '12', name: '2013'},
  {id: '13', name: '2012'},
  {id: '14', name: '2011'},
  {id: '15', name: '2010'},
  {id: '16', name: '2009'},
  {id: '17', name: '2008'},
  {id: '18', name: '2007'},
  {id: '19', name: '2006'},
  {id: '20', name: '2005'},
  {id: '21', name: '2004'},
  {id: '22', name: '2003'},
  {id: '23', name: '2002'},
  {id: '24', name: '2001'},
  {id: '25', name: '2000'},
  {id: '26', name: '1999'},
  {id: '27', name: '1998'},
  {id: '28', name: '1997'},
  {id: '29', name: '1996'},
  {id: '30', name: '1995'},
  {id: '31', name: '1994'},
  {id: '32', name: '1993'},
  {id: '33', name: '1992'},
  {id: '34', name: '1991'},
  {id: '35', name: '1990'},
  {id: '36', name: '1889'},
  {id: '37', name: '1888'},
  {id: '38', name: '1887'},
  {id: '39', name: '1886'},
  {id: '40', name: '1885'},
  {id: '41', name: '1884'},
  {id: '42', name: '1883'},
  {id: '43', name: '1882'},
  {id: '44', name: '1881'},
  {id: '45', name: '1880'},
  {id: '46', name: '1879'},
  {id: '47', name: '1878'},
  {id: '48', name: '1877'},
  {id: '49', name: '1876'},
  {id: '50', name: '1875'},
];

export const jobDurationType = [
  {
    id: 'per_hour',
    name: 'Per Hour',
  },
  {
    id: 'per_day',
    name: 'Per Day',
  },
  {
    id: 'per_week',
    name: 'Per Week',
  },
  {
    id: 'per_month',
    name: 'Per month',
  },
  {
    id: 'per_year',
    name: 'Per year',
  },
];

export const JobQuestions = [
  {
    id: 'free_text_question',
    name: 'Free Text Question',
  },
  {
    id: 'yes_no_question',
    name: 'Yes No Question',
  },
  {
    id: 'multiple_choice_question',
    name: 'Multiple Choice question',
  },
];

export const productCondition = [
  {
    type: 'yes',
    label: 'New',
  },
  {
    type: 'no',
    label: 'Used',
  },
];

export const pageActionList = [
  {
    id: '1',
    name: 'Read more',
  },
  {
    id: '2',
    name: 'Shop now',
  },
  {
    id: '3',
    name: 'View now',
  },
  {
    id: '4',
    name: 'Visit now',
  },
  {
    id: '5',
    name: 'Book now',
  },
  {
    id: '6',
    name: 'Learn more',
  },
  {
    id: '7',
    name: 'Play now',
  },
  {
    id: '8',
    name: 'Bet now',
  },
  {
    id: '9',
    name: 'Donate',
  },
  {
    id: '10',
    name: 'Apply here',
  },
  {
    id: '11',
    name: 'Quote here',
  },
  {
    id: '12',
    name: 'Order now',
  },
  {
    id: '13',
    name: 'Book tickets',
  },
  {
    id: '14',
    name: 'Enroll now',
  },
  {
    id: '15',
    name: 'Find a card',
  },
  {
    id: '16',
    name: 'Get a quote',
  },
  {
    id: '17',
    name: 'Get tickets',
  },
  {
    id: '18',
    name: 'Locate a dealer',
  },
  {
    id: '19',
    name: 'Order online',
  },
  {
    id: '20',
    name: 'Preorder now',
  },
  {
    id: '21',
    name: 'Schedule now',
  },
  {
    id: '22',
    name: 'Sign up now',
  },
  {
    id: '23',
    name: 'Subscribe',
  },
  {
    id: '24',
    name: 'Register now',
  },
];

export const defaultEmojiList = [
  {id: '1', emoji: IconManager.emojiLike},
  {id: '2', emoji: IconManager.emojiLove},
  {id: '3', emoji: IconManager.emojiHaha},
  {id: '4', emoji: IconManager.emojiWow},
  {id: '5', emoji: IconManager.emojiSad},
  {id: '6', emoji: IconManager.emojiAngry},
  {id: '15', emoji: IconManager.emojiYummy},
];
export const AdminSettings = [
  {
    id: '1',
    name: 'Access to general settings',
    type: 'general',
    initialValue: '0', // Set initial value as needed
  },
  {
    id: '2',
    name: 'Access to page information settings',
    type: 'info',
    initialValue: '0',
  },
  {
    id: '3',
    name: 'Access to Social link settings',
    type: 'social',
    initialValue: '0',
  },
  {
    id: '4',
    name: 'Access to avatar & cover settings',
    type: 'avatar',
    initialValue: '0',
  },

  {
    id: '5',
    name: 'Access to admins settings',
    type: 'admins',
    initialValue: '0',
  },

  {
    id: '6',
    name: 'Access to delete page settings',
    type: 'delete_page',
    initialValue: '0',
  },
];


export const GroupAdminSettings = [
  {
    id: '1',
    name: 'Access to general settings',
    type: 'general',
    initialValue: '0', // Set initial value as needed
  },
  {
    id: '2',
    name: 'Access to privacy settings',
    type: 'privacy',
    initialValue: '0',
  },
  {
    id: '3',
    name: 'Access to avatar & cover settings',
    type: 'avatar',
    initialValue: '0',
  },
  {
    id: '4',
    name: 'Access to members settings',
    type: 'members',
    initialValue: '0',
  },

  {
    id: '5',
    name: 'Access to analytics settings',
    type: 'analytics',
    initialValue: '0',
  },

  {
    id: '6',
    name: 'Access to delete group settings',
    type: 'delete_group',
    initialValue: '0',
  },
];