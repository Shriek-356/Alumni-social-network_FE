import { useContext, useEffect } from "react"
import { View, Text } from "react-native"
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { getToken } from "../../configs/api";
import { CurrentAccountUserContext } from "../../App";
import { useState } from "react";
import { removeToken } from "../../configs/api";
import { useNavigation } from "@react-navigation/native";

export const handleLogout = async (token,navigation) => {
    console.log(token)
    console.log('b')
    try {
        await removeToken(token)
        navigation.reset({
            index: 0, // reset stack 
            routes: [{ name: 'Login' }],
        });
        console.log("Đăng xuất thành công");
    } catch (error) {

        console.error("Lỗi khi đăng xuất: ", error);
    }
};

const Account = ({ navigation }) => {
    const [token, setToken] = useState();
    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)
    const navi = useNavigation();
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
                onPress={() => navigation.navigate('Profile', { thisAccount: currentAccountUser })}>
                <Text style={styles.buttonText}>Trang Cá Nhân</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('UserInfoScreen')}>
                <Text style={styles.buttonText}>Thông tin Cá Nhân</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('PaymentPreviewScreen')}>
                <Text style={styles.buttonText}>Thanh Toán Gói Premium</Text>
            </TouchableOpacity>



            {currentAccountUser && currentAccountUser.role === 'Admin' ? (
                <>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('ApprovalScreen')}>
                        <Text style={styles.buttonText}>Xét duyệt tài khoản</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('RegisterLecturer')}>
                        <Text style={styles.buttonText}>Tạo tài khoản giảng viên</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('UnlockAccountScreen')}>
                        <Text style={styles.buttonText}>Mở khóa tài khoản</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('StatisticsScreen')}>
                        <Text style={styles.buttonText}>Xem thống kê người dùng và bài viết</Text>
                    </TouchableOpacity>
                    
                </>
            ) : (<View></View>)}

            <TouchableOpacity
                style={styles.button}
                onPress={()=>handleLogout(token,navi)}>
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