import { View, Text, SafeAreaView, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import styles from "../../styles/styles";
import Styles from "./Styles";
import React from "react";
import { RegisterInfoContext } from "../../App";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { registerAlumni } from "../../configs/API/userApi";

export default function RegisterDetails() {
    const navigation = useNavigation()
    const [RegisterInfo, setRegisterInfo] = useContext(RegisterInfoContext);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(new Date());

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setDateOfBirth(currentDate);
        const formattedDate = currentDate.toISOString().split('T')[0];
        setRegisterInfo({ ...RegisterInfo, date_of_birth: formattedDate });
        setShowDatePicker(false);
    };

    const onSubmit = async () => {
        if (!RegisterInfo.first_name || !RegisterInfo.last_name || !RegisterInfo.date_of_birth || !RegisterInfo.alumni_account_code || !RegisterInfo.gender) {
            alert("Vui lòng nhập đủ thông tin");
            return;
        }

        try {
            const response = await registerAlumni(RegisterInfo);

            Alert.alert("Thông báo", "Đăng ký thành công, vui lòng chờ Quản trị viên xét duyệt");

        } catch (error) {
            if (error.response) {
                console.log("Lỗi từ API:", error.response.data);
                const errorKeys = Object.keys(error.response.data);
                const errorMessage = errorKeys.join(', ');
                Alert.alert("Thông báo", errorMessage);
            }
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#eBEcf4" }}>
            <View style={styles.container}>


                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ fontSize: 18, color: '#000', padding: 5, fontWeight: 'bold' }}>{"< Quay lại"}</Text>
                </TouchableOpacity>


                <View>
                    <Text style={Styles.titleText}>Thông tin chi tiết</Text>
                </View>
                <View style={Styles.form}>
                    <View>
                        <Text style={Styles.inputLabel}>Họ Lót</Text>
                        <TextInput
                            style={Styles.inputControl}
                            placeholder="Nhập họ lót"
                            onChangeText={(last_name) => setRegisterInfo({ ...RegisterInfo, last_name })}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={Styles.inputLabel}>Tên Người Dùng</Text>
                        <TextInput
                            style={Styles.inputControl}
                            placeholder="Nhập tên người dùng"
                            onChangeText={(first_name) => setRegisterInfo({ ...RegisterInfo, first_name })}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={Styles.inputLabel}>Giới Tính</Text>

                        <Picker
                            selectedValue={RegisterInfo.gender}
                            style={Styles.inputControl}
                            onValueChange={(itemValue) => setRegisterInfo({ ...RegisterInfo, gender: itemValue })}
                        >
                            <Picker.Item label="Chọn giới tính" value="" />
                            <Picker.Item label="Nam" value="Nam" />
                            <Picker.Item label="Nữ" value="Nữ" />

                        </Picker>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={Styles.inputLabel}>Mã Sinh Viên</Text>
                        <TextInput
                            style={Styles.inputControl}
                            placeholder="Nhập mã số sinh viên"
                            onChangeText={(alumni_account_code) => setRegisterInfo({ ...RegisterInfo, alumni_account_code })}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={Styles.inputLabel}>Ngày Sinh</Text>
                        <TouchableOpacity onPress={showDatepicker}>
                            <Text style={Styles.inputControl}>
                                {dateOfBirth.toLocaleDateString()}  {/* Hiển thị ngày đã chọn */}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={dateOfBirth}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}

                </View>
                <View>
                    <TouchableOpacity activeOpacity={0.8} onPress={onSubmit}>
                        <View style={Styles.button}>
                            <Text style={Styles.textButton}>Đăng ký</Text>
                        </View>
                    </TouchableOpacity>
                </View>


                <View style={{ flex: 1, marginTop: 50 }}>
                    <TouchableOpacity activeOpacity={0.10} onPress={() => { navigation.navigate('Login') }}>
                        <Text style={Styles.textFooter}>Đã có tài khoản? <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Đăng nhập ngay</Text></Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}