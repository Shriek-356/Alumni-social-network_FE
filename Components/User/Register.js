
import { View, Text, Button, SafeAreaView, Image, TouchableOpacity } from "react-native";
import styles from "../../styles/styles";
import Styles from "./Styles";
import { TextInput } from "react-native";
import { useState } from "react";



function Register() {
    
    const [form, setForm] = useState({
        username: '',
        password: ''
    })

    function onClick() {
        alert("UserName"+ form.username)
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
                    <Text style={Styles.titleText}>Đăng Ký</Text>
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
                        <TextInput
                            style={Styles.inputControl}
                            placeholder="Nhập mật khẩu"
                            onChangeText={password => setForm({ ...form, password })}
                        />
                    </View>

                </View>

                <View>
                    <TouchableOpacity activeOpacity={0.8}
                    onPress={onClick}
                    >
                        <View style={Styles.button}>
                            <Text style={Styles.textButton}>Đăng Ký</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, marginTop: 50 }}>
                    <TouchableOpacity activeOpacity={0.10}>
                        <Text style={Styles.textFooter}>Đã có tài khoản? <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Đăng nhập ngay</Text></Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

export default Register;

