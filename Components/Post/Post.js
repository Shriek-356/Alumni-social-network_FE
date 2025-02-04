import { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getPostCommentss } from '../../configs/API/PostApi';
import { getToken } from '../../configs/api';
import { CurrentAccountUserContext, TotalReactionAccountContext } from '../../App';
import { addPostCommentss, getTotalReactionss, addReactionss, deleteReactionss, updateReactionss } from '../../configs/API/PostApi';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { Pressable } from 'react-native';
import { axiosDAuthApiInstance } from '../../configs/api';
import { deleteCommentt } from '../../configs/API/PostApi';
import { ActivityIndicator } from 'react-native';
import { updatePostt } from '../../configs/API/PostApi';

function RenderPost({ item, onDelete }) {

    const [menuVisible, setMenuVisible] = useState(false);//Nay la cua bai viet
    const [menuVisibleComment, setMenuVisibleComment] = useState(false);//Nay la cua binh luan

    const navigation = useNavigation()
    const [reaction, setReaction] = useState();
    const [reactionID, setReactionID] = useState();
    const [comments, setComments] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [totalReaction, setTotalReaction] = useState();
    const [token, setToken] = useState();
    const [nextPageImage, setNextPageImage] = useState(null)
    const [imagesPost, setImagesPost] = useState([])
    const [loading, setLoading] = useState(false)
    
    const [selectedImage, setSelectedImage] = useState(null)


    const [editingPost, setEditingPost] = useState(false); // Trạng thái chỉnh sửa
    const [editedPost, setEditedPost] = useState(item.post_content || '');
    const [postContent, setPostContent] = useState(item.post_content)

    const [loadingEditComment, setLoadingEditComment] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    const [loadingComment, setLoadingComment] = useState(null)
    const [isLocked, setIsLocked] = useState(item.comment_lock)


    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)
    const [totalReactionAccountt, setTotalReactionAccountt] = useContext(TotalReactionAccountContext)


    const isOwner = currentAccountUser.user.id === item.account.user.id; //Kiem tra xem bai viet do co phai la cua Account hien tai hay khong

    const [newComment, setNewComment] = useState({
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

                    if (response.data.count > 0) {
                        setImagesPost(response.data.results)
                    }

                }
                catch (error) {
                    console.log("Error get post images: ", error)
                }
                finally {
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

    const SetMenuVisibleComment = (commentId) => {
        //Tức là nếu cùng id (đang mở menu) thì gán là null để tắt menu
        setMenuVisibleComment(menuVisibleComment === commentId ? null : commentId);
    };

    const startEditingComment = (commentId, content) => {
        setEditingCommentId(commentId);
        setEditedContent(content);
        setMenuVisibleComment(null); // Đóng menu sau khi chọn chỉnh sửa
    };


    const saveEditedComment = async (commentId) => {
        setLoadingEditComment(true)
        try {
            const commentJson = {
                "comment_content": editedContent
            }
            await axiosDAuthApiInstance(token).patch(`/comment/${commentId}/`, commentJson)
            setComments(comments.map(comment =>
                comment.id === commentId ? { ...comment, comment_content: editedContent } : comment
            ));
            setEditingCommentId(null);
            setEditedContent("");
        } catch (error) {
            console.log("Lỗi cập nhật bình luận: ", error);
        }
        finally {
            setLoadingEditComment(false)
        }
    };

    const onDeleteComment = async (commentId) => {
        try {
            await deleteCommentt(token, commentId)
            console.log('Xoa Thanh Cong')
            setComments((prevComments) => prevComments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.log("Lỗi cập nhật bình luận: ", error);
        }
    }

    const onCommentLocked = async () => {
        if (token) {
            try {
                const data = {
                    comment_lock: !isLocked
                }
                await updatePostt(token, item.id, data)
                setIsLocked(!isLocked);
            } catch (error) {
                console.log("Lỗi khóa bình luận: ", error)
            }
        }
    }



    const startEditingPost = () => {
        setEditedPost(item.post_content); // Lấy nội dung bài viết hiện tại
        setEditingPost(true); // Bật chế độ chỉnh sửa
    };

    const handleUpdatePost = async () => {
        if (!editedPost.trim()) {
            alert("Nội dung không được để trống!");
            return;
        }
        if (token) {
            try {
                const data = {
                    post_content: editedPost.trim()
                }
                await updatePostt(token, item.id, data)
                setPostContent(editedPost.trim()); // Cập nhật nội dung bài viết mới
                setEditingPost(false); // Thoát chế độ chỉnh sửa
                console.log("Cap nhat bai viet thanh cong")
            } catch (error) {
                console.error("Lỗi cập nhật bài viết:", error);
            }
        }
    };


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
            setLoadingComment(true)
            if (item && token) {
                try {
                    let dataComments = await getPostCommentss(token, item.id)
                    setComments(dataComments.results || [])
                    setNextPage(dataComments.next)
                } catch (error) {
                    console.log("Fetch comments error: ", error)
                }
                finally {
                    setLoadingComment(false)
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
        setLoading(true)
        try {
            if (newComment.comment_content.trim()) {
                const commentsJson = {
                    comment_content: newComment.comment_content,
                    account: currentAccountUser.user.id,
                    post: item.id,
                    comment_image_url: ""
                }
                let respone = await addPostCommentss(token, commentsJson)
                if (respone) {
                    const updateComments = {
                        ...newComment,
                        id: respone.id,
                        created_date: new Date().toISOString().split('T')[0]
                    }
                    setComments(prevComments => [updateComments, ...prevComments]);

                    setNewComment({ ...newComment, comment_content: '' })
                }
            }
        } catch (error) {
            console.log("Error add comments: ", error)
        }
        finally {
            setLoading(false)
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
                            style={styles.menuButton1}
                        >
                            <FontAwesome name="ellipsis-v" size={20} color="#333" />
                        </TouchableOpacity>

                        {menuVisible && (
                            <View style={styles.menuContainer}>
                                <TouchableOpacity
                                    onPress={startEditingPost} // Bật chế độ chỉnh sửa đúng cách
                                    style={styles.menuOption}
                                >
                                    <Text style={styles.menuOptionText}>Chỉnh sửa bài viết</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => onCommentLocked()}
                                    style={styles.menuOption}
                                >
                                    {isLocked ? (<Text style={styles.menuOptionText}>Mở bình luận</Text>) : (<Text style={styles.menuOptionText}>Khóa bình luận</Text>)}

                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => onDelete()}
                                    style={styles.menuOption}
                                >
                                    <Text style={styles.menuOptionText}>Xóa bài viết</Text>
                                </TouchableOpacity>

                            </View>
                        )}
                    </View>
                )}

            </View>


            {editingPost ? (
                <View>
                    <TextInput
                        value={editedPost}
                        onChangeText={setEditedPost}
                        style={styles.input}
                        multiline
                    />
                    <TouchableOpacity onPress={handleUpdatePost} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Lưu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEditingPost(false)} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Hủy</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <Text style={styles.postContent}>{postContent}</Text>
                </View>
            )}



            {loading && <Text>Đang tải hình ảnh...</Text>}

            {/* Danh sách hình ảnh */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {imagesPost.length > 0 ? (
                    imagesPost.map((image, index) => (
                        <TouchableOpacity key={index} onPress={() => { setSelectedImage(processImageURL(image.post_image_url)) }}>
                            <Image
                                source={{ uri: processImageURL(image.post_image_url) }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View></View>
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
                {loadingComment && <ActivityIndicator size="large" color="blue" />}
                {comments.map((comment) => (
                    <View key={comment.id} style={styles.commentItem}>
                        <View style={styles.commentHeader}>
                            <Image
                                source={{ uri: processImageURL(comment.account.avatar) || 'https://via.placeholder.com/50' }}
                                style={styles.avatar}
                            />
                            <View style={styles.commentTextContainer}>
                                <Text style={styles.userName} onPress={() => navigation.navigate('Profile', { thisAccount: currentAccountUser })}>{comment.account.full_name || 'Anonymous'}</Text>
                                <Text style={styles.commentDate}>{comment.created_date}</Text>
                            </View>

                            {/* Nút ba chấm cho mỗi bình luận */}
                            {currentAccountUser.user.id === comment.account.user.id && (
                                <View style={{ position: 'relative' }}>
                                    <TouchableOpacity
                                        onPress={() => SetMenuVisibleComment(comment.id)}
                                        style={styles.menuButton}
                                    >
                                        <FontAwesome name="ellipsis-v" size={20} color="#333" />
                                    </TouchableOpacity>

                                    {/* Menu hiển thị nếu menuVisibleComment === comment.id */}
                                    {menuVisibleComment === comment.id && (
                                        <View style={styles.menuContainer}>
                                            <TouchableOpacity
                                                onPress={() => startEditingComment(comment.id, comment.comment_content)}
                                                style={styles.menuOption}
                                            >
                                                <Text style={styles.menuOptionText}>Chỉnh sửa</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => onDeleteComment(comment.id)}
                                                style={styles.menuOption}
                                            >
                                                <Text style={styles.menuOptionText}>Xóa</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>

                        {/* Nếu đang chỉnh sửa thì hiển thị input, nếu không thì hiển thị nội dung */}
                        {editingCommentId === comment.id ? (
                            <View >
                                <TextInput
                                    style={styles.commentInput}
                                    value={editedContent}
                                    onChangeText={setEditedContent}
                                />
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={() => saveEditedComment(comment.id)} style={styles.saveButton} disabled={loadingEditComment}>
                                        {loadingEditComment ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveButtonText}>Lưu</Text>}
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setEditingCommentId(null)} style={styles.cancelButton}>
                                        <Text style={styles.cancelButtonText}>Hủy</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <Text style={styles.commentText}>{comment.comment_content}</Text>
                        )}
                    </View>
                ))}

                {/* Tải thêm bình luận */}
                <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreComments} >
                    <Text style={styles.loadMoreText}>Tải thêm bình luận</Text>
                </TouchableOpacity>


                {/*Thêm bình luận*/}
                {!isLocked ? (<View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Nhập bình luận..."
                        value={newComment.comment_content}
                        onChangeText={comment_content => setNewComment({ ...newComment, comment_content })}
                    />
                    <TouchableOpacity style={styles.commentButton} onPress={addComment} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.commentButtonText}>Gửi</Text>
                        )}
                    </TouchableOpacity>
                </View>) : (
                    <View style={styles.lockedCommentContainer}>    
                        <Text style={styles.lockedCommentText}>Đã khóa bình luận</Text>
                    </View>
                )}


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
    menuButton1: {
        marginTop: 5,
        paddingHorizontal: 100,
    },
    menuButton: {
        marginTop: 10,
        paddingHorizontal: 60,
    },
    menuContainer: {
        position: 'absolute',
        top: 25,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 5,
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
        fontSize: 15,
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

    commentActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    commentActionText: {
        fontSize: 14,
        color: '#007bff',
        fontWeight: '600',
        marginRight: 10
    },
    buttonContainer: {
        flexDirection: "row",
        marginLeft: 10,
    },
    saveButton: {
        backgroundColor: "#33CC33",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 10, // Khoảng cách giữa hai nút
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    cancelButton: {
        backgroundColor: "#FF3300",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 14,
    },
    lockedCommentContainer: {
        backgroundColor: '#f8d7da', 
        borderRadius: 8,             
        padding: 10,                 
        marginTop: 10,              
        alignItems: 'center',        
        justifyContent: 'center',   
    },
    lockedCommentText: {
        color: '#721c24',           
        fontSize: 16,                
        fontWeight: 'bold', 
        fontStyle:'italic',         
        textAlign: 'center',      
    }
});

export default RenderPost;