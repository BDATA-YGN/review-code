import React from 'react';
import { Modal, TouchableOpacity, View, Text, ToastAndroid ,StyleSheet} from 'react-native';
// import Icon from '../../atoms/icon/Icon';
// import assetsManager from '../../../assets/AssetsManager';
import { useNavigation } from '@react-navigation/native';
import { FontFamily, fontSizes } from '../constants/FONT';
import COLOR from '../constants/COLOR';
import Toast from 'react-native-toast-message';


const ShortModalComponent = ({ openModal, closeModal, options,postid, shareBox }) => {
  // const showToast = (message) => {
  //   ToastAndroid.show(message, ToastAndroid.SHORT);
  // };

  const navigation = useNavigation();
  function renderModalOption(option,shareBox) {
    
    const handleToast = message => {
      showToast(message);
    };
  
    const showToast = option => {
      Toast.show({
        type: 'success',
        text1: `${option.text}`,
        visibilityTime: 4000,
        position: 'bottom',
      });
    };
    return (
      <TouchableOpacity
        style={{}}
        // onPress={()=>option.type === 'popup' ? shareBox() : option.type === 'navigate' ? navigation.navigate(option.navigation, {postid: postid }) : showToast('No Action')}
        onPress={()=>option.type === 'popup' ? shareBox() : showToast(handleToast)}
      >
        <View style={styles.shareRow}>
          {/* <Icon source={option.icon} width={16} height={16} /> */}
          <Text style={styles.shareText}>{option.text}</Text>
        </View>
      </TouchableOpacity>
      
    );
    <Toast ref={ref => Toast.setRef(ref)} />
  }

  return (
    <Modal visible={openModal} animationType="slide" transparent={true}>
      <TouchableOpacity
        onPress={closeModal}
        style={styles.shareBottomBg}
      >
        <View style={styles.shareBottom}>
          {options.map((option, index) => (
            <React.Fragment key={index}>
              {renderModalOption(option,shareBox)}
              {index < options.length - 1 && (
                <View style={styles.horizontalBorder}></View>
              )}
            </React.Fragment>
          ))}
        </View>
      </TouchableOpacity>
      <Toast ref={ref => Toast.setRef(ref)}/>
    </Modal>
  );
};
const styles = StyleSheet.create({
    shareBottomBg:{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    shareBottom:{
        backgroundColor: 'white',
        width: '100%', 
        paddingHorizontal:16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
        
    },
    shareRow:{
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical:16,
    },
    shareText:{
        marginLeft: 10,
        fontFamily: FontFamily.PoppinRegular,
        fontSize: fontSizes.size15,
        color: COLOR.Grey500,
        lineHeight: 16,
        top: 2
    },
    horizontalBorder:{
        borderWidth: 0.2, 
        borderColor: '#CCCCCC'
    }
})
export default ShortModalComponent;
