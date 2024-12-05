import { View, Image, TouchableOpacity, Text, ImageBackground, StyleSheet } from "react-native";
import COLOR from "../../constants/COLOR";
import { FontFamily, fontSizes } from "../../constants/FONT";
import ActionButton from "../Button/ActionButton";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
const PostEvent = (props) => {
    const eventId = props.postEvent?.id;
    const navigation = useNavigation();
    if (props.postEvent) {
        return (
            <View style={styles.container}>

                <View style={styles.imageContainer}>
                    <ImageBackground source={{ uri: props.postEvent.cover }} resizeMode="cover" style={styles.image}>

                        <LinearGradient
                            colors={[
                                'rgba(255, 255, 255, 0.50)',
                                'rgba(255, 255, 255, 0.50)',
                            ]}
                            style={styles.contentSection}

                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}>
                            <View>
                                <Text style={[styles.text, { fontSize: fontSizes.size15 }]}>{props.postEvent.name}</Text>
                                <Text style={[styles.text, { fontSize: fontSizes.size10 }]}>{props.postEvent.location}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text style={[styles.text, { fontSize: fontSizes.size10 }]}>{props.postEvent.start_date}</Text>
                                    </View>
                                    {/* <View>
                                        <Text style={[styles.text, { fontSize: fontSizes.size10 }]}>Going People</Text>
                                    </View> */}
                                </View>
                            </View>
                            <ActionButton text="View" onPress={() => navigation.navigate('EventDetail', { eventId })} />
                        </LinearGradient>

                    </ImageBackground>
                </View>
            </View>
        );
    } else {
        return null;
    }
}

const styles = StyleSheet.create({
    // image : {
    //     width : '100%',
    //     height : 300,
    // }
    container: {
        // flex: 1,

        width: '100%',
        height: 400,
        paddingHorizontal: 16,

    },
    imageContainer: {
        flex: 1,
        borderColor: COLOR.Grey50,
        borderWidth: 0.5,
    },
    image: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    contentSection: {
        padding: 10,
        gap: 10,

    },
    text: {
        color: COLOR.Grey500,
        fontFamily: FontFamily.PoppinRegular,

    },
})

export default PostEvent;