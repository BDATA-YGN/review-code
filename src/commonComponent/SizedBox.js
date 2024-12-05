import { View } from 'react-native'
import React from 'react'

const SizedBox = (props) => {
    return (
        <View style={{width: props.width,height: props.height,backgroundColor: props.color}} />
    )
}

export default SizedBox