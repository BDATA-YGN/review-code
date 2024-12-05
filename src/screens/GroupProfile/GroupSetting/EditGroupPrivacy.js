// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, TouchableOpacity, Dimensions, ScrollView, StatusBar, StyleSheet, Image, RefreshControl, TextInput } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { BorderRadius, Color, FontFamily, FontSize } from '../../../../constants/GlobalStyles';
// import { RadioButton } from 'react-native-paper';

// const EditGroupPrivacy = (props) => {
//     const navigationAppBar = useNavigation();
//     const [checked, setChecked] = useState('first');

//     return (
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <RadioButton.Group onValueChange={(value) => setChecked(value)} value={checked}>
//                 <RadioButton.Item label="First" value="first" />
//                 <RadioButton.Item label="Second" value="second" />
//                 <RadioButton.Item label="Third" value="third" />
//             </RadioButton.Group>
//             <Text>Selected: {checked}</Text>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
// });

// export default EditGroupPrivacy;