import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import COLOR from '../../../constants/COLOR';
import { AdminSettings } from '../../../constants/CONSTANT_ARRAY';
import { GroupAdminSettings } from '../../../constants/CONSTANT_ARRAY';
import ActionAppBar from '../../../commonComponent/ActionAppBar copy';
import { useNavigation } from '@react-navigation/native';
import IconManager from '../../../assets/IconManager';
import SPACING from '../../../constants/SPACING';
import { FontFamily, fontSizes } from '../../../constants/FONT';
import ToggleSwitch from '../../../components/ToggleSwitch';
import { submitUpdateAdminSettings, submitUpdateGroupAdminSettings } from '../../../helper/ApiModel';
import { useDispatch } from 'react-redux';
import { setGroupInfoData, setPageInfoData } from '../../../stores/slices/PageSlice';

const EditGroupPrivileges = ({ route }) => {
    const { darkMode, data, userId, adminData } = route.params;
    const navigation = useNavigation();
    const groupId = data.group_id;
    console.log(adminData)
    console.log(groupId)

    const [privilegeStates, setPrivilegeStates] = useState({});
    const dispatch = useDispatch();
    useEffect(() => {
        console.log("Admin data updated:", adminData);
        const initialStates = GroupAdminSettings.reduce((acc, item) => {
            acc[item.id] = adminData[item.type] === "1"; // Convert "1"/"0" from adminData to boolean
            return acc;
        }, {});
        setPrivilegeStates(initialStates);
        dispatch(setGroupInfoData(true))
    }, [adminData]);
    

    const handleTogglePrivilege = (id, value) => {
        setPrivilegeStates(prevState => {
            const updatedStates = {
                ...prevState,
                [id]: value
            };

            // Prepare data for API call based on updated states
            const privilegeValues = {
                general: updatedStates['1'] ? "1" : "0",
                privacy: updatedStates['2'] ? "1" : "0",
                avatar: updatedStates['3'] ? "1" : "0",
                member: updatedStates['4'] ? "1" : "0",
                analytics: updatedStates['5'] ? "1" : "0",
                delete_group: updatedStates['6'] ? "1" : "0",
            };

            submitUpdateGroupAdminSettings(groupId, userId, ...Object.values(privilegeValues))
                .then(response => {
                    if (response.api_status === 200) {
                        dispatch(setGroupInfoData(true));
                        console.log("Updated successfully");
                        
                    } else {
                        console.error("Failed to update");
                    }
                })
                .catch(error => {
                    console.error("Error updating:", error);
                });

            return updatedStates;
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.White }}>
            <ActionAppBar
                appBarText="Privileges"
                source={IconManager.back_light}
                backpress={() => navigation.pop()}
                darkMode={darkMode}
                
            />
            {GroupAdminSettings.map((item) => (
                <View style={styles.settings} key={item.id}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.settingName}>{item.name}</Text>
                        <View style={{ flex: 0.2 }}>
                            <ToggleSwitch
                                isOn={privilegeStates[item.id]}
                                onToggle={(value) => handleTogglePrivilege(item.id, value)}
                            />
                        </View>
                    </View>
                    <View style={{ backgroundColor: COLOR.Grey50, height: SPACING.sp1 }} />
                </View>
            ))}
        </SafeAreaView>
    );
};

export default EditGroupPrivileges;

const styles = StyleSheet.create({
    settings: {
        paddingTop: SPACING.sp20,
        paddingHorizontal: SPACING.sp20,
    },
    settingName: {
        marginBottom: SPACING.sp20,
        fontFamily: FontFamily.PoppinRegular,
        fontSize: fontSizes.size14,
        color: COLOR.Grey500,
        flex: 0.8,
    },
});
