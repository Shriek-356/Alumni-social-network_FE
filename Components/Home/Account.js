import { useContext, useEffect } from "react"
import { View, Text } from "react-native"
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAccountUser } from "../../configs/API/userApi";
import { getToken } from "../../configs/api";
import { CurrentAccountUserContext } from "../../App";
import Styles from "./Styles";
import { useState } from "react";
import { removeToken } from "../../configs/api";
import { useNavigation } from "@react-navigation/native";


/*const Account = ({ navigation }) => {
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


export default Account;*/

const Account = ({ navigation }) => {

    const navi = useNavigation()
    const [token, setToken] = useState();
    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)

    //lay token
    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

    function processImageURL(url) {
        //Sau nay neu co anh mac dinh thi thay bang anh mac dinh neu bi loi
        if (url) {
            return url.replace('image/upload/', '')
        }
    }

    const handleLogout = async () => {
        try {
            await removeToken(token)

            setCurrentAccountUser(null)

            navi.reset({
                index: 0, // reset stack 
                routes: [{ name: 'Login' }],
            });
            console.log("Đăng xuất thành công");
        } catch (error) {
            
            console.error("Lỗi khi đăng xuất: ", error);
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.avatarContainer}>
                {currentAccountUser && currentAccountUser.avatar ? (
                    <Image
                        source={{ uri: processImageURL(currentAccountUser.avatar) }}
                        style={styles.avatar}
                    />
                ) : (
                    <Image
                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Logo_DH_M%E1%BB%9F_TPHCM.png' }} // URL của ảnh mặc định
                        style={styles.avatar}
                    />
                )}
                <Text style={styles.name}>
                    {currentAccountUser ? currentAccountUser.full_name : "Người dùng"}
                </Text>
            </View>


            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Profile',{thisAccount: currentAccountUser})}>
                <Text style={styles.buttonText}>Trang Cá Nhân</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('PersonalPage')}>
                <Text style={styles.buttonText}>Thông tin Cá Nhân</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogout}>
                <Text style={styles.buttonText}>Đăng Xuất</Text>
            </TouchableOpacity>
        </View>
    );

};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 15,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 40,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginVertical: 8,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Account;