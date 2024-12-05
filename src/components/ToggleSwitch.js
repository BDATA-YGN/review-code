import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import COLOR from '../constants/COLOR';

const ToggleSwitch = ({ onToggle, isOn }) => {
    const toggleSwitch = () => {
        onToggle(!isOn); // Toggle the state and call the handler
    };

    return (
        <TouchableOpacity
            style={[styles.switchContainer, isOn ? styles.switchOn : styles.switchOff]}
            onPress={toggleSwitch}
        >
            <View style={[styles.switchCircle, isOn ? styles.circleOn : styles.circleOff]} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    switchContainer: {
        width: 40,
        height: 20,
        borderRadius: 15,
        justifyContent: 'center',
        padding: 2,
    },
    switchOn: {
        backgroundColor: COLOR.Primary,
        alignItems: 'flex-end',
    },
    switchOff: {
        backgroundColor: 'grey',
        alignItems: 'flex-start',
    },
    switchCircle: {
        width: 16,
        height: 16,
        borderRadius: 13,
        backgroundColor: 'white',
    },
    circleOn: {
        marginLeft: 30,
    },
    circleOff: {
        marginRight: 30,
    },
});

export default ToggleSwitch;
