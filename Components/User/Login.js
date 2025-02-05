import { View, Text, Button, SafeAreaView, Image, TouchableOpacity, Alert } from "react-native";
import styles from "../../styles/styles";
import Styles from "./Styles";
import { TextInput } from "react-native-gesture-handler";
import { use, useContext, useState } from "react";
import { getCurrentUser, login } from "../../configs/API/userApi";
import { CurrentUserContext } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAccountUser } from "../../configs/API/userApi";
import { CurrentAccountUserContext } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { CurrentAlumniAccountContext } from "../../App";
import { getAlumniAccountt } from "../../configs/API/userApi";
import { useEffect } from "react";
import Icon from 'react-native-vector-icons/Feather';
import { createMultipleRoom } from "../../configs/API/roomApi";

function Login({ navigation: any }) {
    const navigation = useNavigation()

    const [currentUser, setCurrentUser] = useContext(CurrentUserContext)
    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)
    const [currentAlumniAccount, setCurrentAlumniAccount] = useContext(CurrentAlumniAccountContext)

    const [form, setForm] = useState({
        username: '',
        password: '',
        client_id: 'VxfAbAaOkSepTB96rOR6HPsZRduin6JxFmLqDabP',
        client_secret: 'W1HSQWpS6rVvQRbiDlHMRajAx57idLENWxVGRjY4AVScd7ztNfSBo4d6IfFGSxhlVzEKrqBnHyzWaLNl8dlSQuHae9IfLNWOhsVJHzh2TlOuVU3ZNB9BwUUMfaBXIc6E',
        grant_type: 'password'
    })

    const [passVisible, setPassVisible] = useState(false)
    const saveToken = async (token) => {
        try {
            await AsyncStorage.setItem('@access_token', token);
            console.log('Token đã được lưu: ', token);
        } catch (error) {
            console.error('Lỗi khi lưu token: ', error);
        }
    }

    const getCurrentUserInfo = async (token) => {
        try {
            const getUser = await getCurrentUser(token);
            if (getUser) {
                setCurrentUser(getUser)//luu vao context
                console.log('user_id: ', getUser.id)
                return getUser.id
            }
        }
        catch (error) {
            console.log('Error getCurrentUser details: ', error)
        }
    }

    const getAccountUserInfo = async (token, id) => {
        try {
            const getAccount = await getAccountUser(token, id);
            if (getAccount) {
                setCurrentAccountUser(getAccount)
                return getAccount
            }
        }
        catch (error) {
            console.log('Error getAccountUser details: ', error)
        }

    }

    const getAlumniAccountInfo = async (token, id) => {
        try {
            const getAlumni = await getAlumniAccountt(token, id);

            if (getAlumni) {
                setCurrentAlumniAccount(getAlumni)
                return getAlumni
            }

        }
        catch (error) {
            console.log('Error getAlumniAccount: ', error)
        }
    }

    const onClick = async () => {
        if (!form.username || !form.password) {
            alert('Vui lòng nhập đầy đủ thông tin')
            return
        }

        try {
            const response = await login(form);
            if (response && response.access_token) {

                console.log(response.access_token)
                //Luu token
                saveToken(response.access_token)

                //Lay currentUser
                const id = await getCurrentUserInfo(response.access_token, id);
                //Lay account
                const account = await getAccountUserInfo(response.access_token, id);

                if (account.active === true) {
                    
                    if (account.account_status === true) {
                        
                        if (account.role === "ALUMNI") {
                             //Lay Alumni
                            const alumni = await getAlumniAccountInfo(response.access_token, id);
                            if (alumni.confirm_status === "PENDING") {
                                Alert.alert("Thông báo", "Tài khoản đang được chờ xét duyệt")
                            } else if (alumni.confirm_status === "REJECTED") {
                                Alert.alert("Thông báo", "Tài khoản đã bị từ chối xét duyệt")
                            }
                            else {
                                const id = await getCurrentUserInfo(response.access_token); // Lấy ID user
                                await createMultipleRoom(response.access_token, id);
                                navigation.navigate('AllView')
                            }
                        }
                        else {
                            const id = await getCurrentUserInfo(response.access_token); // Lấy ID user
                            await createMultipleRoom(response.access_token, id);
                            navigation.navigate('AllView')
                        }
                    } else {
                        Alert.alert("Thông báo", "Tài khoản chưa được xét duyệt")
                    }
                }
                else{
                    Alert.alert("Thông báo", "Tài khoản đã ngừng hoạt động")
                }

            } else {
                alert('Không nhận được token từ server');
            }
        } catch (error) {
            console.log('Error details: ', error);
            if (error.response) {
                alert('Sai tên tài khoản hoặc mật khẩu');
            } else {
                alert('Không thể kết nối tới server');
            }
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#eBEcf4" }}>
            <View style={styles.container}>
                <View style={Styles.header}>
                    <Image
                        style={Styles.headerLogo}
                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Logo_DH_M%E1%BB%9F_TPHCM.png' }}
                        alt="logo"
                    />
                </View>

                <View>
                    <Text style={Styles.titleText}>Đăng Nhập</Text>
                </View>

                <View style={Styles.form}>
                    <View>
                        <Text style={Styles.inputLabel}>Tên Đăng Nhập</Text>
                        <TextInput
                            style={Styles.inputControl}
                            placeholder="Nhập tên đăng nhập"
                            onChangeText={username => setForm({ ...form, username })}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={Styles.inputLabel}>Mật khẩu</Text>
                        <View style={Styles.passwordContainer}>
                            <TextInput
                                style={Styles.inputControl}
                                placeholder="Nhập mật khẩu"
                                secureTextEntry={!passVisible} // Bật/tắt ẩn mật khẩu
                                onChangeText={password => setForm({ ...form, password })}
                            />
                            <TouchableOpacity onPress={() => setPassVisible(!passVisible)} style={Styles.iconContainer}>
                                <Icon name={passVisible ? 'eye-off' : 'eye'} size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View>
                    <TouchableOpacity activeOpacity={0.8} onPress={onClick}>
                        <View style={Styles.button}>
                            <Text style={Styles.textButton}>Đăng Nhập</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, marginTop: 50 }}>
                    <TouchableOpacity activeOpacity={0.10} onPress={() => { navigation.navigate('Register') }}>
                        <Text style={Styles.textFooter}>Chưa có tài khoản? <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Đăng ký ngay</Text></Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

export default Login;
