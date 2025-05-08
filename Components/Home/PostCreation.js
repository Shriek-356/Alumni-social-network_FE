import { launchImageLibrary } from "react-native-image-picker";
import { useState } from 'react';
import { View, Text,Alert, TextInput, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { uploadImagesPosts, creatNewPost } from "../../configs/API/PostApi";
import { getToken } from "../../configs/api";
import { useEffect } from "react";
import { deletePosts } from "../../configs/API/PostApi";
import { useNavigation } from "@react-navigation/native";
import { CurrentAccountUserContext } from "../../App";
import { useContext } from "react";
import { axiosInstanceAI } from "../../configs/api";
const CreatePost = () => {

    const navigation = useNavigation()
    const [content, setContent] = useState('')
    const [images, setImages] = useState([])  // Giữ images như một mảng
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState();
    const [isAILoading, setIsAILoading] = useState(false)
    const [topic, setTopic] = useState('');
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)
    //lay token
    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);


    const handleAIClick = () => {
        setShowTopicModal(true);
    };
    
    //Xử lý AI

    // Xử lý mở modal nhập chủ đề
    // Hàm gọi AI để tạo nội dung
     const generateContentWithAI = async () => {
        console.group('[AI] Generating content');
        try {
            // Check trial and subscription status
            console.log('User Info:', {
                trialCount: currentAccountUser?.ai_trial_uses,
                subscriptionStatus: currentAccountUser?.subscription_status,
                expiryDate: currentAccountUser?.subscription_expiry_date,
            });

            if (currentAccountUser?.ai_trial_uses >= 2) {
                if (currentAccountUser?.subscription_status !== 'Active') {
                    Alert.alert(
                        "Thông báo hạn chế",
                        "Bạn đã sử dụng hết 2 lần thử nghiệm AI miễn phí. Vui lòng đăng ký để tiếp tục sử dụng tính năng này.",
                        [{ text: "OK" }]

                    );
                    return;
                }

                const expiryDate = new Date(currentAccountUser.subscription_expiry_date);
                if (expiryDate < new Date()) {
                    Alert.alert(
                        "Thông báo hạn chế",
                        "Gói Premium của bạn đã hết hạn vui lòng gia hạn để tiếp tục sử dụng.",
                        [{ text: "OK" }]
                    );
                    return;
                }
            }

            if (!topic.trim()) {
                Alert.alert("Error", "Please enter a topic before generating content.");
                return;
            }

            setIsAILoading(true);
            const response = await axiosInstanceAI.post('', {
                model: "deepseek/deepseek-chat-v3-0324:free",
                messages: [{ role: "user", content: `Create content about: ${topic}` }]
            });

            const aiContent = response.data.choices[0]?.message?.content;
            if (aiContent) {
                setContent(aiContent);
                setCurrentAccountUser(prev => ({
                    ...prev,
                    ai_trial_uses: (prev.ai_trial_uses || 0) + 1,
                }));
            } else {
                Alert.alert("Error", "No content received from AI.");
            }
        } catch (error) {
            console.error("AI Error:", error);
            Alert.alert("Error", "An error occurred while generating content.");
        } finally {
            setIsAILoading(false);
            setShowTopicModal(false);
            setTopic('');
            console.groupEnd();
        }
    };
    

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
                    if (images.length != 0 && response) {
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
                            deletePosts(token, response.id)
                        }
                        finally {
                            setLoading(false)



                        }
                    }
                    navigation.goBack()// tro ve man hinh profile
                }
            } catch (error) {
                alert('Co loi khi tao bai viet, vui long thu lai')
                console.log("Error create post: ", error)
            }
            finally {
                setLoading(false)

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

            {/* Nút tạo nội dung bằng AI */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#28a745' }]}
                onPress={handleAIClick}
                disabled={isAILoading}
            >
                <Text style={styles.buttonText}>
                    {isAILoading ? 'Đang tạo nội dung...' : 'Tạo nội dung với AI'}
                </Text>
            </TouchableOpacity>

            {/* Modal nhập chủ đề */}
            <Modal
                visible={showTopicModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowTopicModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nhập chủ đề bài viết</Text>
                        <TextInput
                            style={styles.topicInput}
                            placeholder="Ví dụ: Du lịch Đà Nẵng, Ẩm thực Hà Nội..."
                            value={topic}
                            onChangeText={setTopic}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#6c757d' }]}
                                onPress={() => setShowTopicModal(false)}
                            >
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#28a745' }]}
                                onPress={() => generateContentWithAI()}
                                disabled={!topic.trim()}
                            >
                                <Text style={styles.buttonText}>Tạo nội dung</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
            ) : (<View></View>)}

            {currentAccountUser && currentAccountUser.role === 'Admin' ? (
                <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => navigation.navigate('PostInvited')}>
                    <Text style={styles.buttonText}>Tạo bài viết lời mời</Text>
                </TouchableOpacity>
            ) : (<View></View>)}

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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    topicInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
});

export default CreatePost;
