import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CurrentUserContext, CurrentAccountUserContext } from '../../App';
import { useContext, useEffect } from 'react';
import { updateUserr } from '../../configs/API/userApi';
import { ActivityIndicator } from 'react-native';
import { getToken } from '../../configs/api';
import { getAccountUser } from '../../configs/API/userApi';
import { getCurrentUser } from '../../configs/API/userApi';
import { changePasswordd } from '../../configs/API/userApi';
import { handleLogout } from '../Home/Account';
import { useNavigation } from '@react-navigation/native';

const UserInfoScreen = () => {

  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigation = useNavigation()

  // Giả sử thông tin người dùng được lưu trong state
  const [userInfo, setUserInfo] = useState({
    first_name: currentUser.first_name,
    last_name: currentUser.last_name,
    email: currentUser.email,
    username: currentUser.username,
    user_id: currentUser.id,
  });

  //lay token
  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
    };
    fetchToken();
  }, []);

  // Trạng thái chỉnh sửa của từng trường thông tin
  const [isEditing, setIsEditing] = useState({
    first_name: false,
    last_name: false,
    email: false,
  });

  const [editedInfo, setEditedInfo] = useState({});

  // Hàm bắt đầu chỉnh sửa một trường
  const startEditing = (field) => {
    setIsEditing({
      ...isEditing,
      [field]: true,
    });
    setEditedInfo({
      ...editedInfo,
      [field]: userInfo[field],
    });
  };

  // Hàm hủy chỉnh sửa và trở lại giá trị ban đầu
  const cancelEditing = (field) => {
    setIsEditing({
      ...isEditing,
      [field]: false,
    });
    setEditedInfo({
      ...editedInfo,
      [field]: userInfo[field],
    });
  };

  // Hàm xử lý thay đổi thông tin khi người dùng nhập vào
  const handleInputChange = (field, value) => {
    setEditedInfo({
      ...editedInfo,
      [field]: value,
    });
  };

  // Hàm lưu thông tin khi nhấn nút "Lưu"
  const handleSave = async (field) => {
    if (token) {
      setLoading(true);
      try {
        const data = {
          [field]: editedInfo[field]
        }
        await updateUserr(token, currentUser.id, data)
        alert("Lưu thông tin thành công")
        setUserInfo({
          ...userInfo,
          [field]: editedInfo[field], //Luu cap nhat de hien thi len view
        });
        setIsEditing({
          first_name: false,
          last_name: false,
          email: false,
        });
        setCurrentUser({
          ...currentUser,
          [field]: editedInfo[field]
        })
        setEditedInfo({});
        const account = await getAccountUser(token, currentUser.id)
        const user = await getCurrentUser(token)
        setCurrentAccountUser(account)
        setCurrentUser(user)
      } catch (error) {
        console.log("Error update info: ", error)
      }
      finally {
        setLoading(false);
      }
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    setLoading(true);
    const data = {
      old_pass: oldPassword,
      new_pass: newPassword
    }
    if (token) {
      try {
        let response = await changePasswordd(token, data);
        alert(response.detail + ", vui lòng đăng nhập lại!");
        setOldPassword('');
        setNewPassword('')
        setConfirmPassword('');
        setIsEditing({ ...isEditing, password: false });
        handleLogout(token,navigation)
      } catch (error) {
        if (error.response && error.response.data && error.response.data.detail) {
          alert(error.response.data.detail)
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Thông tin cá nhân</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Mã người dùng</Text>
        <Text style={styles.value}>{userInfo.user_id}</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Họ</Text>
        {isEditing.first_name ? (
          <>
            <TextInput
              style={styles.input}
              value={editedInfo.first_name}
              onChangeText={(text) => handleInputChange('first_name', text)}
            />
            <View style={styles.buttonsContainer}>
              {loading ? (
                <ActivityIndicator size="small" color="#0066cc" />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSave('first_name')}
                  >
                    <Text style={styles.saveButtonText}>Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => cancelEditing('first_name')}
                  >
                    <Text style={styles.cancelButtonText}>Hủy</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.value}>{userInfo.first_name}</Text>
            <TouchableOpacity onPress={() => startEditing('first_name')}>
              <Text style={styles.editText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Tên</Text>
        {isEditing.last_name ? (
          <>
            <TextInput
              style={styles.input}
              value={editedInfo.last_name}
              onChangeText={(text) => handleInputChange('last_name', text)}
            />
            <View style={styles.buttonsContainer}>
              {loading ? (
                <ActivityIndicator size="small" color="#0066cc" />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSave('last_name')}
                  >
                    <Text style={styles.saveButtonText}>Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => cancelEditing('last_name')}
                  >
                    <Text style={styles.cancelButtonText}>Hủy</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.value}>{userInfo.last_name}</Text>
            <TouchableOpacity onPress={() => startEditing('last_name')}>
              <Text style={styles.editText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        {isEditing.email ? (
          <>
            <TextInput
              style={styles.input}
              value={editedInfo.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
            <View style={styles.buttonsContainer}>
              {loading ? (
                <ActivityIndicator size="small" color="#0066cc" />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSave('email')}
                  >
                    <Text style={styles.saveButtonText}>Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => cancelEditing('email')}
                  >
                    <Text style={styles.cancelButtonText}>Hủy</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.value}>{userInfo.email}</Text>
            <TouchableOpacity onPress={() => startEditing('email')}>
              <Text style={styles.editText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Tên người dùng</Text>
        <Text style={styles.value}>{userInfo.username}</Text>
      </View>

      {/* Đổi mật khẩu */}
      <View style={styles.passwordFieldContainer}>
        <Text style={styles.label}>Đổi mật khẩu</Text>
        {isEditing.password ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu cũ"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu mới"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={styles.buttonsContainer}>
              {loading ? (
                <ActivityIndicator size="small" color="#0066cc" />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleChangePassword}
                  >
                    <Text style={styles.saveButtonText}>Lưu mật khẩu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setIsEditing({ ...isEditing, password: false })}
                  >
                    <Text style={styles.cancelButtonText}>Hủy</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing({ ...isEditing, password: true })}>
            <Text style={styles.editText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: 50,
    backgroundColor: '#F7F9FC', 
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', 
  },
  fieldContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, 
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
    color: '#666',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    backgroundColor: '#F2F2F2',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    paddingLeft: 10,
    paddingTop: 10,
    color: '#333',
  },
  editText: {
    fontSize: 16,
    color: '#0066cc',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  passwordFieldContainer: {
    marginBottom: 40, 
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});

export default UserInfoScreen;