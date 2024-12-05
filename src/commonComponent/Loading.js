import { ActivityIndicator, StyleSheet, View } from 'react-native'
import React from 'react'
import COLOR from '../constants/COLOR'

const AppLoading = (props) => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator color={COLOR.Primary} size="large" />
        </View>
    )
}

export default AppLoading

const styles = StyleSheet.create({
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});