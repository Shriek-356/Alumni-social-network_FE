import { launchImageLibrary } from "react-native-image-picker";
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { uploadImagesPosts, creatNewPost } from "../../configs/API/PostApi";
import { getToken } from "../../configs/api";
import { useEffect } from "react";
import { deletePosts } from "../../configs/API/PostApi";
import { useNavigation } from "@react-navigation/native";
import { CurrentAccountUserContext } from "../../App";
import { useContext } from "react";
const CreatePost = () => {

    const navigation = useNavigation()
    const [content, setContent] = useState('')
    const [images, setImages] = useState([])  // Giữ images như một mảng
    const [loading, setLoading] = useState(false)
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

    const pickImage = async () => {
        // Kiểm tra quyền truy cập ảnh
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access gallery is required!');
            return;
        }

        // Chọn ảnh từ thư viện
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaType: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Cho phép chỉnh sửa ảnh trước khi chọn
            quality: 1,
            selectionLimit: 0 // Cho phép chọn nhiều ảnh
        });

        if (!result.canceled) {
            setImages(prevImages => [...prevImages, result.assets[0].uri]); // Thêm ảnh mới vào mảng
            console.log(images)
        }
    };

    const uploadImages = async () => {
        if (content) {
            setLoading(true)
            try {
                if (token) {
                    const data = {
                        post_content: content
                    }
                    let response = await creatNewPost(token, data)
                    //Neu co hinh anh thi moi  xu ly api hinh anh
                    if (images.length != 0&&response) {
                        const formData = new FormData();
                        
                        images.forEach((imageUri) => {
                            const localUri = imageUri;
                            const filename = localUri.split('/').pop(); 
                            const type = `image/${filename.split('.').pop()}`;

                            formData.append('multi_images', {
                                uri: localUri,
                                name: filename,
                                type: type,
                            });
                        });

                        formData.append('post', response.id);

                        setLoading(true)

                        try {
                             await uploadImagesPosts(token, formData)
                            navigation.goBack()// tro ve man hinh profile
                        }
                        catch (error) {
                            console.log("Error upload images: ", error)
                            alert('Co loi khi upload anh, vui long thu lai')
                            deletePosts(token,response.id)
                        }
                        finally {
                            setLoading(true)
                        }
                    }
                    navigation.goBack()// tro ve man hinh profile
                }
            } catch (error) {
                alert('Co loi khi tao bai viet, vui long thu lai')
                console.log("Error create post: ", error)
            }
            finally {
                setLoading(true)
            }
        } else {
            alert('Noi dung khong duoc de trong')
            return
        }

    }

    return (
        <View style={styles.container}>

            <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Nội dung bài viết"
                value={content}
                onChangeText={setContent}
                multiline
            />

            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText} >Chọn ảnh</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                {images.map((image, index) => (
                    <Image
                        key={index}
                        source={{ uri: image }}
                        style={{ width: 100, height: 100, margin: 5 }}
                    />
                ))}
            </View>

            <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={uploadImages}>
                <Text style={styles.buttonText}>Đăng bài</Text>
            </TouchableOpacity>


            {currentAccountUser && currentAccountUser.role === 'Admin' ? (
            <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => navigation.navigate('PostSurvey')}>
                <Text style={styles.buttonText}>Tạo bài viết khảo sát</Text>
            </TouchableOpacity>
            ):(<View></View>)}

            {currentAccountUser && currentAccountUser.role === 'Admin' ? (
            <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => navigation.navigate('PostInvited')}>
                <Text style={styles.buttonText}>Tạo bài viết lời mời</Text>
            </TouchableOpacity>
            ):(<View></View>)}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 150,
        flex: 1,
        padding: 20,
    },
    input: {
        width: 500,
        height: 500,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CreatePost;
