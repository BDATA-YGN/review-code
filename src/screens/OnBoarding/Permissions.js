import {Platform, View} from 'react-native';
import React from 'react';

import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';

export const requestLocationPermission = async () => {
  try {
    const result = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const requestContactPermission = async () => {
  try {
    let result;

    if (Platform.OS === 'ios') {
      result = await request(PERMISSIONS.IOS.CONTACTS);
    } else {
      const contactsPermission = await request(
        PERMISSIONS.ANDROID.READ_CONTACTS,
      );
      const phonePermission = await request(PERMISSIONS.ANDROID.CALL_PHONE);

      result =
        contactsPermission === RESULTS.GRANTED &&
        phonePermission === RESULTS.GRANTED
          ? RESULTS.GRANTED
          : RESULTS.DENIED;
    }

    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};
// export const requestContactPermissionPhoneCall = async () => {
//   try {
//     const result = await request(
//       Platform.OS === 'ios'
//         ? PERMISSIONS.IOS.CONTACTS
//         : PERMISSIONS.ANDROID.CALL_PHONE
//     );
//     if (result === RESULTS.GRANTED) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
// };

export const requestStoragePermission = async () => {
  try {
    const result = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    );
    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};
export const requestStoragePermissionCamera = async () => {
  try {
    const result = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    );
    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const requestRecordingPermission = async () => {
  try {
    const result = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO,
    );
    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
