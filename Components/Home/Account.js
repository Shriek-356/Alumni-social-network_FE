import { useContext, useEffect } from "react"
import styles from "../../styles/styles"
import { View, Text } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAccountUser, getCurrentUser } from "../../configs/API/userApi";
import Styles from "./Styles";
import { useState } from "react";


const Account = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState({});
    const getCurrentUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['getAccountUser'](user.id));
            setUserInfo(res.data);
        } catch (err) {
            console.log(err)
        }
    };
    const getAccountbyUser = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const userId = userInfo.id;
            if (token && userId) {
                const accountData = await getAccountUser(token, userId)
                console.log("Account Data:", accountData);
                setUserInfo((prev) => ({
                    ...prev,
                    avatar: accountData.avatar,
                    cover_avatar: accountData.cover_avatar,
                    phone_number: accountData.phone_number,
                    date_of_birth: accountData.date_of_birth,
                    gender: accountData.gender,
                }));
            }
        }
        catch (err) {
            console.log(err)

        }
    }

    useEffect(() => {
        getCurrentUser();
    }, [userInfo])

    
    useEffect(() => {
        if (userInfo.id) {
            getAccountbyUser();
        }
    }, [userInfo.id]);

    
    return (
        <View style={Styles.container_acc}>
            {userInfo.cover_avatar && <Image source={{ uri: userInfo.cover_avatar }} style={Styles.coverAvatar} />}
            {userInfo.avatar && <Image source={{ uri: userInfo.avatar }} style={Styles.avatar} />}
            <Text>Họ tên: {userInfo.full_name} {userInfo.last_name}</Text>
            <Text>Ngày sinh: {userInfo.date_of_birth}</Text>
            <Text>Giới tính: {userInfo.gender}</Text>
            <Text>Số điện thoại: {userInfo.phone_number}</Text>
            <Text>Roke</Text>
        </View>
    )
};


export default Account;