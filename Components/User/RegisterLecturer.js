import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { registerLecturerr } from '../../configs/API/userApi';
import { getToken } from '../../configs/api';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const RegisterLecturer = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        date_of_birth: new Date(),
        gender: 'male',
    });

    const showDatepicker = () => {
        setShowDatePicker(true);
    };
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [token, setToken] = useState()
    const navigation = useNavigation()


    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };


    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setDateOfBirth(currentDate);
        const formattedDate = currentDate.toISOString().split('T')[0];
        setFormData({ ...formData, date_of_birth: formattedDate });
        setShowDatePicker(false);
    };


    //lay token
    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

    const handleRegister = async () => {
        if (token) {
            try {
                let response = await registerLecturerr(token, formData)
                navigation.goBack()
                Alert.alert("Thành công", "Đăng ký giảng viên thành công!");
            } catch (error) {
                Alert.alert("Lỗi", "Đăng ký thất bại, vui lòng thử lại!");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng Ký Giảng Viên</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={formData.username}
                onChangeText={(text) => handleInputChange('username', text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Họ"
                value={formData.last_name}
                onChangeText={(text) => handleInputChange('last_name', text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Tên"
                value={formData.first_name}
                onChangeText={(text) => handleInputChange('first_name', text)}
            />

            {/* 🔹 Thêm TextInput cho số điện thoại */}
            <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
            />

            {/* Ngày sinh */}
            <TouchableOpacity style={styles.datePicker} onPress={showDatepicker}>
                <Text >
                    {dateOfBirth.toLocaleDateString()}  {/* Hiển thị ngày đã chọn */}
                </Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            {/* Giới tính */}
            <Text style={styles.inputLabel}>Giới Tính</Text>
            <Picker
                selectedValue={formData.gender}
                style={styles.picker}
                onValueChange={(value) => handleInputChange('gender', value)}
            >
                <Picker.Item label="Nam" value="male" />
                <Picker.Item label="Nữ" value="female" />
            </Picker>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Đăng Ký</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#FFF',
        marginBottom: 15,
        fontSize: 16,
    },
    datePicker: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        marginBottom: 15,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 5,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#FFF',
        padding: 12,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RegisterLecturer;
