import { SafeAreaView, Text, View, Image} from "react-native";
import COLOR from "../../constants/COLOR";
import ActionAppBar from "../../commonComponent/ActionAppBar";
import { FontFamily } from "../../constants/FONT";
import IconManager from "../../assets/IconManager";
import ActionButton from "../../components/Button/ActionButton";
import { useNavigation } from "@react-navigation/native";

const ReviewCompleted = ({ route }) => {
    const { darkMode } = route.params;
    const navigation = useNavigation();

    return(
        <SafeAreaView
        style={{
            flex: 1,
            backgroundColor:
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White,
        }}
        >
        <ActionAppBar appBarText="Review Completed" backpress={() => navigation.goBack()} darkMode={darkMode} />

        <View style = {{padding : 16, flex : 1}}>
            <View>
                <Text style = {{fontFamily : FontFamily.PoppinSemiBold , fontSize  : 20 , textAlign : 'center'}}>Thanks for your review!</Text>
            </View>
            <View style = {{ flex  :1 ,flexDirection : 'row', justifyContent : 'center' , alignItems : 'center'}}>
         
                <Image
                source={IconManager.reviewCompleted} // Single star image
                style={{
                    width: 226,
                    height: 226,
                }}
                />

            </View>
            <ActionButton text = "Continue Shopping" onPress= {() =>  navigation.pop(4)}/>
        </View>

        </SafeAreaView>
    )
}

export default ReviewCompleted;