import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { getToken } from '../../configs/api';
import { CurrentAccountUserContext } from '../../App';
import { useContext } from 'react';
import { ActivityIndicator } from 'react-native';
import { getUserPostss } from '../../configs/API/userApi';
import RenderPost from "../Post/Post";
import { deletePosts } from '../../configs/API/PostApi';
import { getTotalReactionsAccountt } from '../../configs/API/PostApi';
import { TotalReactionAccountContext } from '../../App';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Pressable } from 'react-native';
import axios from 'axios';
import { updateAccountt } from '../../configs/API/userApi';
import * as ImagePicker from 'expo-image-picker'
import { getAccountUser } from '../../configs/API/userApi';


const Profile = ({ route }) => {

    const [loading, setLoading] = useState(true)
    const navigation = useNavigation()
    const [posts, setPosts] = useState([])
    const { thisAccount } = route.params;
    const [token, setToken] = useState();
    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)
    const [totalReactionAccountt, setTotalReactionAccountt] = useContext(TotalReactionAccountContext)
    const [nextPage, setNextPage] = useState()

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [coverImage, setCoverImage] = useState(processImageURL(thisAccount.cover_avatar))
    const [avatarImage, setAvatarImage] = useState(processImageURL(thisAccount.avatar))
    const [imageType, setImageType] = useState('')
    const [imageLoading, setImageLoading] = useState(false)

    const isOwner = thisAccount.user.id === currentAccountUser.user.id
    //lay token
    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchPosts(); // Hàm fetch bài viết mới nhất
        }, [token])
    );

    const fetchAccount = async () => {
        try {
            let response = await getAccountUser(token, currentAccountUser.user.id)
            setCurrentAccountUser(response)
        }
        catch (error) {
            console.log("Error fetch account: ", error)
        }
    }

    const pickImage = async () => {
        // Kiểm tra quyền truy cập ảnh
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access gallery is required!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaType: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, 
            quality: 1,
        });

        if (!result.canceled) {
            const formData = new FormData();
            if (!result.assets || result.assets.length === 0) {
                alert('No image selected.');
                return;
            }
            const uri = result.assets[0].uri; // Lấy URI 

            const localUri = uri;
            const filename = localUri.split('/').pop();
            const type = `image/${filename.split('.').pop()}`;

            setImageLoading(true)
            try {
                if (token) {
                    if (imageType === 'cover') {
                        formData.append('cover_avatar', {
                            uri: localUri,
                            name: filename,
                            type: type,
                        });
                    }
                    else if (imageType === 'avatar') {
                        formData.append('avatar', {
                            uri: localUri,
                            name: filename,
                            type: type,
                        });
                    }

                    let response = await updateAccountt(token, currentAccountUser.user.id, formData)

                    if (imageType === 'cover') {
                        setCoverImage(response.cover_avatar);
                    } else if (imageType === 'avatar') {
                        setAvatarImage(response.avatar);
                    }
                    fetchAccount()
                    setSelectedImage(null)//Dong modal
                }

            } catch (error) {
                console.error('Error uploading image: ', error);
                alert('Có lỗi xảy ra khi tải ảnh lên!');
            }
            finally {
                setImageLoading(false)
            }
        }
    };


    //Lay bai viet cua thisAccount duoc nhan vao de xem profile
    const fetchPosts = useCallback(async () => {
        if (token) {
            setLoading(true)
            try {
                let data = await getUserPostss(token, thisAccount.user.id)
                const postsData = data.results
                //Lay data bai viet xong thi lay thong tin account cua bai viet do
                const detailsPosts = postsData.map((post) => ({
                    ...post,
                    avatar: post.account.avatar,
                    full_name: post.account.full_name
                }));

                setPosts(detailsPosts)
                setNextPage(data.next)
                console.log("NextPage: ", data.next)
            } catch (err) {
                console.log("Error fetch Posts: ", err)
            }
            finally {
                setLoading(false)
            }
        }
    }, [token]);//chay lai khi token thay doi, tuc la khi token duoc cap nhat


    const loadMorePosts = async () => {
        if (nextPage && token) {
            try {
                let responsee = await axios.get(nextPage, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                let postsData = responsee.data.results
                console.log("id bai viet trang 2: ", postsData)
                const detailsPosts = postsData.map((post) => ({
                    ...post,
                    avatar: post.account.avatar,
                    full_name: post.account.full_name
                }));
                setPosts([...posts, ...detailsPosts])
                setNextPage(responsee.data.next)
                console.log(responsee.data.next)
            }
            catch (error) {
                console.log("Error load more posts: ", error)
            }
        }
    }

    //Lay bai viet ma nguoi dung da tha cam xuc de hien thi len giao dien
    useEffect(() => {
        const fetchReactionsAccount = async () => {
            if (token) {
                try {
                    let response = await getTotalReactionsAccountt(token, currentAccountUser.user.id)
                    await setTotalReactionAccountt(response)
                }
                catch (error) {
                    console.log("Error get all reactions account: ", error)
                }
            }
        }
        fetchReactionsAccount()
        
    }, [token, posts])

    function processImageURL(url) {
        //Sau nay neu co anh mac dinh thi thay bang anh mac dinh neu bi loi
        if (url) {
            return url.replace('image/upload/', '')
        }
    }

    const handleDeletePost = async (postId) => {
        console.log('a')
        try {
            setLoading(true);
            await deletePosts(token, postId);
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); // Loai bo bai viet da xoa trong state posts
        } catch (error) {
            console.log("Error deleting post:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            {thisAccount
                && thisAccount.cover_avatar ? (
                <TouchableOpacity onPress={() => { setSelectedImage(processImageURL(thisAccount.cover_avatar)), setImageType('cover') }}>
                    <Image
                        source={{ uri: coverImage }}
                        style={styles.coverImage}
                    />
                </TouchableOpacity>
            ) : (
                <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Logo_DH_M%E1%BB%9F_TPHCM.png' }} // URL của ảnh mặc định
                    style={styles.coverImage}
                />
            )}

            {/* avatar va ten */}
            <View style={styles.profileInfo}>
                {thisAccount && thisAccount.avatar ? (

                    <TouchableOpacity onPress={() => { setSelectedImage(processImageURL(thisAccount.avatar)), setImageType('avatar') }}>
                        <Image source={{ uri: avatarImage }}
                            style={styles.avatar} />
                    </TouchableOpacity>

                ) : (
                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Logo_DH_M%E1%BB%9F_TPHCM.png' }}
                        style={styles.avatar} />
                )}
                <Text style={styles.userName}>{thisAccount.full_name || "UserName"}</Text>
            </View>

            {/* Modal hiển thị ảnh phóng to */}
            <Modal
                visible={!!selectedImage}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedImage(null)}
            >
                <View style={styles.modalContainer}>
                    {/* Vùng nhấn bên ngoài để đóng */}
                    <Pressable style={styles.overlay} onPress={() => setSelectedImage(null)} />

                    {/* Hình ảnh phóng to */}
                    <View style={styles.modalContent}>
                        {selectedImage && (
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.zoomedImage}
                                resizeMode="contain"
                            />
                        )}

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setSelectedImage(null)}
                        >
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>

                        {/* Chọn ảnh mới */}
                        {isOwner && (
                            <>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={pickImage}
                                >
                                    <Text style={styles.closeButtonText}>Chọn ảnh mới</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            {imageLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Đang tải ảnh...</Text>
                </View>
            )}

            {isOwner ? (<TouchableOpacity style={styles.createPostButton}
                onPress={() => navigation.navigate('CreatePost')}
            >
                <Text style={styles.createPostText}>Tạo bài viết</Text>
            </TouchableOpacity>) : (
                <Text></Text>
            )}

            {posts && Array.isArray(posts) && posts.length > 0 ? (<View style={styles.container}>
                {loading && !thisAccount ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <RenderPost item={item} onDelete={() => handleDeletePost(item.id)} />
                        )}
                    />
                )}
            </View>) : (
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: '#888888', fontSize: 18, fontWeight: 'bold' }}>Chưa có bài viết</Text>
                </View>
            )}

            {/* Tai them bai viet */}
            {nextPage ? (<TouchableOpacity style={styles.loadMoreButton} onPress={loadMorePosts}>
                <Text style={styles.loadMoreText}>Xem thêm bài viết</Text>
            </TouchableOpacity>) : <Text></Text>}
        </View>
    );
};

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        padding: 15,
    },
    coverImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#fff',
        marginTop: -50,
    },
    profileInfo: {
        alignItems: 'center',
        marginTop: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
        maxWidth: 400, 
    },
    zoomedImage: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#FF9900',
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    createPostButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    createPostText: {
        color: '#fff',
        fontWeight: '600',
    },
    loadMoreButton: {
        backgroundColor: '#FF9900',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginVertical: 10,
    },
    loadMoreText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
