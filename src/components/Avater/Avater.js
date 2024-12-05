import React from "react";
import { Image } from "react-native";


const Avater = props =>{
    return(
        <Image source={props.source} style={{width : props.width , height : props.height , borderRadius : props.borderRadius}}  resizeMode="contain"/>
    )
}

export default Avater;