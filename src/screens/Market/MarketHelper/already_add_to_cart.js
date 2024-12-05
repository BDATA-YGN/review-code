import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import COLOR from '../../../constants/COLOR';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import SPACING from '../../../constants/SPACING';
import RADIUS from '../../../constants/RADIUS';

const AlreadyAddedToCart = ({visible, onConfirm, onCancel, darkMode}) => {
  const animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animation]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.dialogContainer,
            {
              transform: [{scale: animation}],
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
            },
          ]}>
          <Text
            style={[
              styles.title,
              {
                color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey800,
              },
            ]}>
            Already Added to Cart
          </Text>
          <Text
            style={[
              styles.message,
              {
                color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
              },
            ]}>
            This item is already in your cart. Do you want to view your cart?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
                {
                  backgroundColor:
                    darkMode === 'enable' ? COLOR.Grey700 : COLOR.Grey100,
                },
              ]}
              onPress={onCancel}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey800,
                  },
                ]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={styles.buttonText}>View Cart</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AlreadyAddedToCart;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContainer: {
    width: '80%',
    borderRadius: RADIUS.rd12,
    padding: SPACING.sp20,
    borderColor: COLOR.Primary,
    shadowColor: COLOR.Black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size20,
    marginBottom: SPACING.sp12,
  },
  message: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    marginBottom: SPACING.sp24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: SPACING.sp12,
    paddingHorizontal: SPACING.sp16,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.Primary,
    marginLeft: SPACING.sp8,
  },
  cancelButton: {
    backgroundColor: COLOR.Grey300,
  },
  buttonText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size14,
    color: COLOR.White100,
  },
});
