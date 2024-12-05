import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  fetchEmojiList: false,
  commonLoading: false,
  emojiList: [],
  emptyMessage: `Oops! It's empty here.`,
  streamKey: '',
  addProductFormValidation: {
    title: {text: 'Live Title'},
    description: {text: 'Live desc'},
  },
  createProductFormValidation: {
    name: {text: 'Name', isValid: false},
    price: {text: '8', isValid: false},
    discount: {text: '3', isValid: false},
    phone: {text: '0989893444', isValid: false},
    itemCount: {text: '9', isValid: false},
    description: {text: 'For sale', isValid: false},
  },
  selectedPostPrivacy: null,
  selectedCategory: null,
  selectedCondition: null,
  selectedImages: [],
  streamingList: [],
  liveCommentList: [],
  liveCommentListNew: [],
  isAddNewComments: 0,
  switchValue: false,
  validationErrors: {},
  streamPostId: '',
  broadCastId: '',
  streamerId: '',
  postToTimeLine: 'no',
  formData: {},
  liveProductList: [],
  fullScreen: false,
};

export const NormalLiveSlice = createSlice({
  name: 'NormalLiveSlice',
  initialState,
  reducers: {
    // Existing reducers...
    setFetchEmojiLisNormalLive: (state, action) => {
      state.fetchEmojiList = action.payload;
    },
    setCommonLoadingNormalLive: (state, action) => {
      state.commonLoading = action.payload;
    },
    setEmptyMessageNormalLive: (state, action) => {
      state.emptyMessage = action.payload;
    },
    setStreamKeyNormalLive: (state, action) => {
      state.streamKey = action.payload;
    },
    setEmojiListNormalLive: (state, action) => {
      state.emojiList = action.payload;
    },
    setSwitchValueNormalLive: (state, action) => {
      state.switchValue = action.payload;
    },
    setValidationErrorsNormalLive: (state, action) => {
      state.validationErrors = action.payload; // Payload should be a serializable object
    },
    setStreamPostIdNormalLive: (state, action) => {
      state.streamPostId = action.payload;
    },
    setBroadcastIdNormalLive: (state, action) => {
      state.broadCastId = action.payload;
    },
    setStreamerIdNormalLive: (state, action) => {
      state.streamerId = action.payload;
    },
    setPostToTimelineNormalLive: (state, action) => {
      state.postToTimeLine = action.payload;
    },

    // New action to set form validation
    setAddProductFormValidationNormalLive: (state, action) => {
      state.addProductFormValidation = action.payload;
    },
    updateAddProductFormFieldNormalLive: (state, action) => {
      const {field, value} = action.payload;
      state.addProductFormValidation[field].text = value;
    },

    setCreateProductFormValidationNormalLive: (state, action) => {
      state.createProductFormValidation = action.payload;
    },
    updateCreateProductFormFieldNormalLive: (state, action) => {
      const {field, value} = action.payload;
      state.createProductFormValidation[field].text = value;
    },

    // New action to set selected privacy option
    setSelectedPostPrivacyNormalLive: (state, action) => {
      state.selectedPostPrivacy = action.payload;
    },

    setSelectedCategoryNormalLive: (state, action) => {
      state.selectedCategory = action.payload;
    },

    setSelectedConditionNormalLive: (state, action) => {
      state.selectedCondition = action.payload;
    },

    setSelectedImagesNormalLive: (state, action) => {
      state.selectedImages = action.payload; // Set the selected images
    },

    setStreamingListNormalLive: (state, action) => {
      state.streamingList = action.payload; // Set the selected images
    },

    setLiveCommentListNormalLive: (state, action) => {
      state.liveCommentList = action.payload; // Set the selected images
    },

    setLiveCommentListNewNormalLive: (state, action) => {
      state.liveCommentListNew = action.payload; // Set the selected images
    },

    setAddNewCommentsNormalLive: (state, action) => {
      state.isAddNewComments = action.payload; // Set the selected images
    },

    setLiveProductListNormalLive: (state, action) => {
      state.liveProductList = action.payload; // Set the selected images
    },

    setFullScreen: (state, action) => {
      state.fullScreen = action.payload;
    },

    // New action to update formData dynamically
    updateFormDataNormalLive: state => {
      state.formData = {
        selectedPostPrivacy: state.selectedPostPrivacy,
        liveTitle: state.addProductFormValidation.title.text,
        liveDescription: state.addProductFormValidation.description.text,
        name: state.createProductFormValidation.name.text,
        price: state.createProductFormValidation.price.text,
        discount: state.createProductFormValidation.discount.text,
        phone: state.createProductFormValidation.phone.text,
        itemCount: state.createProductFormValidation.itemCount.text,
        description: state.createProductFormValidation.description.text,
        category: state.selectedCategory,
        selectedCondition: state.selectedCondition,
        switchValue: state.switchValue,
        images: state.selectedImages,
      };
    },
  },
});

export const {
  setFetchEmojiLisNormalLive,
  setEmojiListNormalLive,
  setEmptyMessageNormalLive,
  setStreamKeyNormalLive,
  setCommonLoadingNormalLive,
  setAddProductFormValidationNormalLive,
  updateAddProductFormFieldNormalLive,
  setCreateProductFormValidationNormalLive,
  updateCreateProductFormFieldNormalLive,
  setSelectedPostPrivacyNormalLive, // export the new action
  setSelectedCategoryNormalLive,
  setSelectedConditionNormalLive,
  setSelectedImagesNormalLive,
  setSwitchValueNormalLive,
  setValidationErrorsNormalLive,
  setPostToTimelineNormalLive,
  setStreamPostIdNormalLive,
  setBroadcastIdNormalLive,
  setStreamerIdNormalLive,
  updateFormDataNormalLive,
  setStreamingListNormalLive,
  setLiveCommentListNormalLive,
  setLiveCommentListNewNormalLive,
  setAddNewCommentsNormalLive,
  setLiveProductListNormalLive,
  setFullScreen,
} = NormalLiveSlice.actions;

export default NormalLiveSlice.reducer;
