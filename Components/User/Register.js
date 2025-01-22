import { View, Text, SafeAreaView, Image, TouchableOpacity, TextInput } from "react-native";
import styles from "../../styles/styles";
import Styles from "./Styles";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RegisterInfoContext } from "../../App";


function Register() {
    const navigation = useNavigation();
    const [RegisterInfo, setRegisterInfo] = useContext(RegisterInfoContext);
    const [emailError, setEmailError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");

    function onContinue() {
        setPhoneNumberError("");
        setEmailError("");
        if (!RegisterInfo.username || !RegisterInfo.password || !RegisterInfo.email || !RegisterInfo.phone_number) {
            alert("Vui long dien du thong tin")
            return;
        }

        if (!isGmail(RegisterInfo.email)) {
            setEmailError("Vui lòng nhập đúng định dạng email");
            return;
        }

        if (!isPhoneNumberValid(RegisterInfo.phone_number)) {
            setPhoneNumberError("Vui lòng nhập đúng định dạng số điện thoại");
            return;
        }

        navigation.navigate('RegisterDetails');
    }

    const isGmail = (email) => {

        const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        return regex.test(email);
    };


    const isPhoneNumberValid = (phoneNumber) => {

        const regex = /^(?:\+84|0)[3|5|7|8|9]\d{8}$/;

        return regex.test(phoneNumber);
    };

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
                    <Text style={Styles.titleText}>Đăng Ký</Text>
                    <Text style={Styles.subTitleText}>Tạo tài khoản để kết nối với cựu sinh viên</Text>
                </View>

                <View style={Styles.form}>
                    <View>
                        <Text style={Styles.inputLabel}>Tên Đăng Nhập</Text>
                        <TextInput
                            style={Styles.inputControl}
                            placeholder="Nhập tên đăng nhập"
                            onChangeText={(username) => setRegisterInfo({ ...RegisterInfo, username })}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={Styles.inputLabel}>Mật khẩu</Text>
                        <TextInput
                            style={Styles.inputControl}
                            placeholder="Nhập mật khẩu"
                            secureTextEntry={true} // Đảm bảo là mật khẩu sẽ bị ẩn
                            onChangeText={(password) => setRegisterInfo({ ...RegisterInfo, password })}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={Styles.inputLabel}>Địa chỉ Email</Text>
                        <TextInput
                            style={Styles.inputControl}
                            placeholder="Nhập địa chỉ Email"
                            onChangeText={(email) => setRegisterInfo({ ...RegisterInfo, email })}

                        />
                        {emailError ? (
                            <Text style={{ color: 'red' }}>{emailError}</Text>
                        ) : null}
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={Styles.inputLabel}>Số điện thoại</Text>
                        <TextInput
                            style={Styles.inputControl}
                            placeholder="Nhập số điện thoại"
                            onChangeText={phone_number => setRegisterInfo({ ...RegisterInfo, phone_number })}
                        />

                        {phoneNumberError ? (
                            <Text style={{ color: 'red' }}>{phoneNumberError}</Text>
                        ) : null}
                    </View>

                </View>

                <View>
                    <TouchableOpacity activeOpacity={0.8} onPress={onContinue}>
                        <View style={Styles.button}>
                            <Text style={Styles.textButton}>Tiếp Tục</Text>
                        </View>
                    </TouchableOpacity>
                </View>


                <View style={{ flex: 1, marginTop: 10 }}>
                    <TouchableOpacity activeOpacity={0.10} onPress={() => { navigation.navigate('Login') }}>
                        <Text style={Styles.textFooter}>Đã có tài khoản? <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Đăng nhập ngay</Text></Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}


export default Register;
