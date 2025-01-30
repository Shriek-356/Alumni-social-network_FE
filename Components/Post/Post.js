import { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getPostCommentss} from '../../configs/API/PostApi';
import { getToken } from '../../configs/api';
import { CurrentAccountUserContext, TotalReactionAccountContext } from '../../App';
import { addPostCommentss, getTotalReactionss, addReactionss, deleteReactionss, updateReactionss } from '../../configs/API/PostApi';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { Pressable } from 'react-native';

function RenderPost({ item, onDelete }) {

    const [menuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation()
    const [reaction, setReaction] = useState();
    const [reactionID, setReactionID] = useState();
    const [comments, setComments] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [totalReaction, setTotalReaction] = useState();
    const [token, setToken] = useState();
    const [nextPageImage, setNextPageImage] = useState(null)
    const [imagesPost,setImagesPost] = useState([])
    const [loading,setLoading] = useState(false)
    const [selectedImage,setSelectedImage] = useState(null)

    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)
    const [totalReactionAccountt, setTotalReactionAccountt] = useContext(TotalReactionAccountContext)


    const isOwner = currentAccountUser.user.id === item.account.user.id; //Kiem tra xem bai viet do co phai la cua Account hien tai hay khong

    const [newComment, setNewComment] = useState({
        id: '',
        account: currentAccountUser,
        comment_image_url: '',
        created_date: '',
        updated_date: '',
        active: '',
        comment_content: '',
        post: item.id
    })

    //Lay so cam xuc cua 1 bai viet
    useEffect(() => {
        const fetchReactions = async () => {
            try {
                let response = await getTotalReactionss(token, item.id)
                if (response) {
                    setTotalReaction(response.total_reactions)
                }
            }
            catch (error) {
                console.log("Error get Reactions: ", error)
            }
        }
        fetchReactions()
    }, [token, totalReactionAccountt])

    //Lay danh sach Hinh Anh cua bai viet
    useEffect(() => {
        const fetchPostImages = async () => {
            console.log("token: ", token)
            console.log("id: ", item.id)
            if (token && item.id) {
                setLoading(true)
                try {
                    const response = await axios.get(`https://socialapp130124.pythonanywhere.com//post/${item.id}/images/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if(response.data.count>0){
                        setImagesPost(response.data.results)
                    }
                    
                }
                catch (error) {
                    console.log("Error get post images: ", error)
                }
                finally{
                    setLoading(false)
                }
            }
        }
        fetchPostImages()
    }, [token, item])

    function processImageURL(url) {
        //Sau nay neu co anh mac dinh thi thay bang anh mac dinh neu bi loi
        if (url) {
            return url.replace('image/upload/', '')
        }
    }

    const loadMoreComments = async () => {
        if (nextPage && token) {
            try {
                let respone = await axios.get(nextPage, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setComments([...comments, ...respone.data.results])
                setNextPage(respone.data.next);
            }
            catch (error) {
                console.log("Error fetching MoreComments: ", error)
            }
        }
    }

    //Lay token
    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

    useEffect(() => {
        const fetchComments = async () => {
            if (item && token) {
                try {
                    let dataComments = await getPostCommentss(token, item.id)
                    setComments(dataComments.results || [])
                    setNextPage(dataComments.next)
                } catch (error) {
                    console.log("Fetch comments error: ", error)
                }
            }
        }
        fetchComments()
    }, [item, token])

    const test = async (reactionType) => {
        await handleReaction(reactionType)
    }

    //Ham xu ly khi nguoi dung tha cam xuc
    const handleReaction = async (reactionType) => {
        if (reaction && reaction === reactionType) {
            //Neu dang co cam xuc va giong cai cu thi xoa
            try {
                let response = await deleteReactionss(token, reactionID)
                setReaction('')
                setTotalReaction((prev) => prev - 1);
            } catch (error) {
                console.log("Error delete reactions: ", error)
            }
        }
        else if (reaction && reaction != reactionType) {
            // neu dang co cam xuc va khac cai cu thi cap nhat cai moi
            try {
                const dataReactions = {
                    reaction: reactionType
                }
                let response = await updateReactionss(token, reactionID, dataReactions)
                setReaction(reactionType)
            } catch (error) {
                console.log("Error update reactions: ", error)
            }
        }
        else {// neu khong co cam xuc
            try {
                const dataReactions = {
                    reaction: reactionType,
                    account: currentAccountUser.user.id,
                    post: item.id
                }
                let response = await addReactionss(token, dataReactions)
                setReaction(reactionType)
                setReactionID(response.id)//Cap nhat id reaction vi neu them cam xuc moi thi id se thay doi, khong dung id truoc do duoc
                setTotalReaction((prev) => prev + 1);
            } catch (error) {
                console.log("Error add reactions: ", error)
            }
        }
    };


    const addComment = async () => {

        try {

            if (newComment.comment_content.trim()) {

                const commentsJson = {
                    comment_content: newComment.comment_content,
                    account: currentAccountUser.user,
                    post: item.id,
                    comment_image_url: ""
                }
                console.log(commentsJson)
                let respone = await addPostCommentss(token, commentsJson)

                if (respone) {
                    const updateComments = {
                        ...newComment,
                        created_date: new Date().toISOString().split('T')[0]
                    }
                    setComments([...comments, updateComments])
                    setNewComment({ ...newComment, comment_content: '' })
                }
            }
        } catch (error) {
            console.log("Error add comments: ", error)
        }
    };

    useEffect(() => {
        if (Array.isArray(totalReactionAccountt)) {
            totalReactionAccountt.forEach(posts => {
                if (posts && posts.post.id === item.id) {
                    setReaction(posts.reaction);
                    setReactionID(posts.id);
                }
            });
        }
    }, [totalReactionAccountt])

    return (
        <View style={styles.postContainer}>

            <View style={styles.header}>
                <Image
                    source={{ uri: processImageURL(item.avatar) || 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Logo_DH_M%E1%BB%9F_TPHCM.png' }}
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.userName} onPress={() => navigation.navigate('Profile', { thisAccount: item.account })}>{item.full_name || 'User Name'}</Text>
                    <Text style={styles.postDate}>{item.created_date}</Text>
                </View>

                {/* Nút ba chấm */}
                {isOwner && (
                    <View style={{ position: 'relative' }}>
                        <TouchableOpacity
                            onPress={() => setMenuVisible(!menuVisible)}
                            style={styles.menuButton}
                        >
                            <FontAwesome name="ellipsis-v" size={20} color="#333" />
                        </TouchableOpacity>

                        {/* Menu hiện ngay bên dưới */}
                        {menuVisible && (
                            <View style={styles.menuContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('Xóa bài viết');
                                        onDelete(); // Đảm bảo hàm được gọi
                                    }}
                                    style={styles.menuOption}
                                >
                                    <Text style={styles.menuOptionText}>Xóa bài viết</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}

            </View>


            <Text style={styles.postContent}>{item.post_content}</Text>

            {loading && <Text>Đang tải hình ảnh...</Text>}

            {/* Danh sách hình ảnh */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {imagesPost.length > 0 ? (
                    imagesPost.map((image, index) => (
                        <TouchableOpacity key={index} onPress={() => {setSelectedImage(processImageURL(image.post_image_url))}}>
                            <Image
                                source={{ uri: processImageURL(image.post_image_url) }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text>Không có hình ảnh nào.</Text>
                )}
            </ScrollView>


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
                    </View>
                </View>
            </Modal>

            <View style={styles.footer}>
                <Text>{totalReaction}</Text>
                <TouchableOpacity style={styles.actionButton}
                    onPress={() => test('Like')}>
                    <FontAwesome name="thumbs-up" size={20} color={reaction === 'Like' ? 'blue' : 'gray'} />
                    <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}
                    onPress={() => test('Haha')}>
                    <FontAwesome name="smile-o" size={20} color={reaction === 'Haha' ? 'orange' : 'gray'} />
                    <Text style={styles.actionText}>Haha</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}
                    onPress={() => test('Tym')}>
                    <FontAwesome name="heart" size={20} color={reaction === 'Tym' ? 'red' : 'gray'} />
                    <Text style={styles.actionText}>Tim</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.commentsSection}>

                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <View key={comment.id} style={styles.commentItem}>
                            <View style={styles.commentHeader}>
                                <Image
                                    source={{
                                        uri: processImageURL(comment.account.avatar) || 'https://via.placeholder.com/50',
                                    }}
                                    style={styles.avatar}
                                />
                                <View style={styles.commentTextContainer}>
                                    <View>
                                        <Text style={styles.userName}>{comment.account.full_name || 'Anonymous'}</Text>
                                        <Text style={styles.commentDate}>{comment.created_date}</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.commentText}>{comment.comment_content}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noComments}>Chưa có bình luận nào.</Text>
                )}


                {/* Tải thêm bình luận */}
                <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreComments} >
                    <Text style={styles.loadMoreText}>Tải thêm bình luận</Text>
                </TouchableOpacity>


                {/*Thêm bình luận*/}

                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Nhập bình luận..."
                        value={newComment.comment_content}
                        onChangeText={comment_content => setNewComment({ ...newComment, comment_content })}
                    />
                    <TouchableOpacity style={styles.commentButton} onPress={addComment}>
                        <Text style={styles.commentButtonText}>Gửi</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: 'white',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    postDate: {
        fontSize: 12,
        color: '#999',
    },
    postContent: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
        lineHeight: 20,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
    },
    actionButton: {
        alignItems: 'center',
    },
    actionText: {
        fontSize: 14,
        color: '#007bff',
        fontWeight: '600',
    },
    commentsSection: {
        marginTop: 10,
    },
    commentItem: {
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    commentText: {
        fontSize: 14,
        color: '#333',
    },
    noComments: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
    commentInputContainer: {
        flexDirection: 'row',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
    },
    commentInput: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
    },
    commentButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    commentButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },

    commentTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    commentDate: {
        fontSize: 12,
        color: '#999',
    },
    loadMoreButton: {
        marginTop: 10,
        alignItems: 'center',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    loadMoreText: {
        color: '#fff',
        fontWeight: '600',
    },
    menuButton: {
        paddingHorizontal: 100,
    },
    menuContainer: {
        position: 'absolute',
        top: 25,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 100,
    },
    menuOption: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    menuOptionText: {
        fontSize: 16,
        color: '#333',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginRight: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Màu nền mờ
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // Làm vùng nền phủ toàn màn hình
    },
    modalContent: {
        width: "90%",
        height: "70%",
        justifyContent: "center",
        alignItems: "center",
    },
    zoomedImage: {
        width: "100%",
        height: "100%",
    },
    closeButton: {
        position: "absolute",
        bottom: 20,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    closeButtonText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default RenderPost;