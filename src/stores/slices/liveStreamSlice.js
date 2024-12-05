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

export const LiveStreamSlice = createSlice({
  name: 'LiveStreamSlice',
  initialState,
  reducers: {
    // Existing reducers...
    setFetchEmojiList: (state, action) => {
      state.fetchEmojiList = action.payload;
    },
    setCommonLoading: (state, action) => {
      state.commonLoading = action.payload;
    },
    setEmptyMessage: (state, action) => {
      state.emptyMessage = action.payload;
    },
    setStreamKey: (state, action) => {
      state.streamKey = action.payload;
    },
    setEmojiList: (state, action) => {
      state.emojiList = action.payload;
    },
    setSwitchValue: (state, action) => {
      state.switchValue = action.payload;
    },
    setValidationErrors: (state, action) => {
      state.validationErrors = action.payload; // Payload should be a serializable object
    },
    setStreamPostId: (state, action) => {
      state.streamPostId = action.payload;
    },
    setBroadcastId: (state, action) => {
      state.broadCastId = action.payload;
    },
    setStreamerId: (state, action) => {
      state.streamerId = action.payload;
    },
    setPostToTimeline: (state, action) => {
      state.postToTimeLine = action.payload;
    },

    // New action to set form validation
    setAddProductFormValidation: (state, action) => {
      state.addProductFormValidation = action.payload;
    },
    updateAddProductFormField: (state, action) => {
      const {field, value} = action.payload;
      state.addProductFormValidation[field].text = value;
    },

    setCreateProductFormValidation: (state, action) => {
      state.createProductFormValidation = action.payload;
    },
    updateCreateProductFormField: (state, action) => {
      const {field, value} = action.payload;
      state.createProductFormValidation[field].text = value;
    },

    // New action to set selected privacy option
    setSelectedPostPrivacy: (state, action) => {
      state.selectedPostPrivacy = action.payload;
    },

    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },

    setSelectedCondition: (state, action) => {
      state.selectedCondition = action.payload;
    },

    setSelectedImages: (state, action) => {
      state.selectedImages = action.payload; // Set the selected images
    },

    setStreamingList: (state, action) => {
      state.streamingList = action.payload; // Set the selected images
    },

    setLiveCommentList: (state, action) => {
      state.liveCommentList = action.payload; // Set the selected images
    },

    setLiveCommentListNew: (state, action) => {
      state.liveCommentListNew = action.payload; // Set the selected images
    },

    setAddNewComments: (state, action) => {
      state.isAddNewComments = action.payload; // Set the selected images
    },

    setLiveProductList: (state, action) => {
      state.liveProductList = action.payload; // Set the selected images
    },
    setFullScreen: (state, action) => {
      state.fullScreen = action.payload;
    },

    // New action to update formData dynamically
    updateFormData: state => {
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
  setFetchEmojiList,
  setEmojiList,
  setEmptyMessage,
  setStreamKey,
  setCommonLoading,
  setAddProductFormValidation,
  updateAddProductFormField,
  setCreateProductFormValidation,
  updateCreateProductFormField,
  setSelectedPostPrivacy, // export the new action
  setSelectedCategory,
  setSelectedCondition,
  setSelectedImages,
  setSwitchValue,
  setValidationErrors,
  setPostToTimeline,
  setStreamPostId,
  setBroadcastId,
  setStreamerId,
  updateFormData,
  setStreamingList,
  setLiveCommentList,
  setLiveCommentListNew,
  setAddNewComments,
  setLiveProductList,
  setFullScreen,
} = LiveStreamSlice.actions;

export default LiveStreamSlice.reducer;
