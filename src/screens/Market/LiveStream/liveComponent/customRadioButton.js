import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import COLOR from '../../../../constants/COLOR';
import {FontFamily, fontSizes} from '../../../../constants/FONT';

const CustomRadioButton = ({
  options,
  layout = 'vertical',
  showLabel = true,
  onSelect,
  disabled = false,
  selectedOption: initialSelectedOption, // Add this line
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (initialSelectedOption) {
      setSelectedOption(initialSelectedOption.type);
    }
  }, [initialSelectedOption]); // Update the selected option if the prop changes

  const handlePress = option => {
    if (!disabled) {
      setSelectedOption(option.type); // Store the `type` value
      onSelect(option); // Send the `type` value back to parent
    }
  };

  return (
    <View
      style={[
        styles.container,
        layout === 'horizontal' ? styles.horizontal : styles.vertical,
      ]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          style={styles.radioButtonContainer}
          onPress={() => handlePress(option)}
          disabled={disabled}>
          <View style={styles.radioButtonOuter}>
            <View style={styles.radioButtonInner}>
              {selectedOption === option.type && <View style={styles.dot} />}
            </View>
          </View>
          {showLabel && <Text style={styles.label}>{option.label}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // margin: 10,
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vertical: {
    flexDirection: 'column',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLOR.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    backgroundColor: '#fff',
    elevation: 4, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 1, height: 3},
  },
  radioButtonInner: {
    height: 16,
    width: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dot: {
    height: 15,
    width: 15,
    borderRadius: 30,
    backgroundColor: COLOR.Primary, // Active dot color
  },
  label: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
    color: COLOR.Grey400,
    marginRight: 4,
  },
});

export default CustomRadioButton;
