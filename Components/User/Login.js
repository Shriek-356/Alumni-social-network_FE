
import { View, Text, Button, SafeAreaView, Image, TouchableOpacity } from "react-native";
import styles from "../../styles/styles";
import Styles from "./Styles";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";



function Login({ navigation: any }) {

    const [form, setForm] = useState({
        username: '',
        password: ''
    })

    function onClick(navigation) {
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
                            <Text style={Styles.textButton}>Đăng Nhập</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, marginTop: 50 }}>
                    <TouchableOpacity activeOpacity={0.10} onPress={()=>{navigation.navigate('Register')}}>
                        <Text style={Styles.textFooter}>Chưa có tài khoản? <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Đăng ký ngay</Text></Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

export default Login;

