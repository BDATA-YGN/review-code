import { Image, SafeAreaView, StyleSheet, View , Text} from "react-native";
import IconManager from "../../../assets/IconManager";
import { FontFamily, fontSizes } from "../../../constants/FONT";
import COLOR from "../../../constants/COLOR";
import ActionButton from "../../../components/Button/ActionButton";
import { useNavigation } from "@react-navigation/native";
import SPACING from "../../../constants/SPACING";



const ActivationSuccess = ({route}) => {
    const navigation = useNavigation();
    const {darkMode} = route.params;

    return(

        <SafeAreaView style= {{flex : 1,backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100 ,padding : SPACING.sm}}>
             <View style = {{flex : 1 ,flexDirection : 'column', justifyContent : 'center', alignItems : 'center', paddingTop : '10%' , paddingBottom : '5%', gap : 16}}>
                <Image
                    resizeMode="contain"
                    source={
                        IconManager.activation_success_light
                    }
                    style={styles.imageHeader}
                    />
                <View>
                    <Text style ={{fontSize : fontSizes.size15 , fontFamily: FontFamily.PoppinRegular, color : darkMode == 'enable' ? COLOR.White : COLOR.Grey500, textAlign : 'center', marginTop : 8}}>We have sent you an email, Please check your inbox/spam to verify your email.</Text>
                </View>
               <View style = {{width : '90%'}}>
                    <ActionButton text = "Login" onPress = {() => navigation.navigate('Login')}/>
               </View>
            </View>
            
           
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    imageHeader : {
        width : 200,
        height : 200,
    }
})


export default ActivationSuccess;