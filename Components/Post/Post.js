import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getPostCommentss } from '../../configs/API/PostApi';
import { getToken } from '../../configs/api';
import axios from 'axios';

function RenderPost({ item }) {
    const [reaction, setReaction] = useState();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [nextPage, setNextPage] = useState(null);

    const [token, setToken] = useState();

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
                setNextPage(respone.next);
                console.log(respone.data)
            }
            catch (error) {
                console.log("Error fetching MoreComments: ", error)
            }
        }
    }

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
                    await setComments(dataComments.results || [])
                    console.log(dataComments)
                    setNextPage(dataComments.next)
                    console.log(dataComments.next)
                } catch (error) {
                    console.log("Fetch comments error: ", error)
                }
            }
        }
        fetchComments()

        console.log('id:', item.id)

    }, [item, token])

    const handleReaction = (reactionType) => {
        setReaction(reactionType);
    };

    const addComment = () => {
        if (newComment.trim()) {
            setComments([...comments, newComment]);
            setNewComment('');
        }
    };

    return (
        <View style={styles.postContainer}>

            <View style={styles.header}>
                <Image
                    source={{ uri: processImageURL(item.avatar) || 'https://via.placeholder.com/50' }}
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.userName}>{item.full_name || 'User Name'}</Text>
                    <Text style={styles.postDate}>{item.created_date}</Text>
                </View>
            </View>


            <Text style={styles.postContent}>{item.post_content}</Text>


            {item.image && (
                <Image
                    source={{ uri: item.image }}
                    style={styles.postImage}
                />
            )}


            <View style={styles.footer}>
                <TouchableOpacity style={styles.actionButton}
                    onPress={() => handleReaction('like')}>
                    <FontAwesome name="thumbs-up" size={20} color={reaction === 'like' ? 'blue' : 'gray'} />
                    <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}
                    onPress={() => handleReaction('haha')}>
                    <FontAwesome name="smile-o" size={20} color={reaction === 'haha' ? 'yellow' : 'gray'} />
                    <Text style={styles.actionText}>Haha</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}
                    onPress={() => handleReaction('love')}>
                    <FontAwesome name="heart" size={20} color={reaction === 'love' ? 'red' : 'gray'} />
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
                {nextPage && (
                    <View style={styles.commentInputContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Nhập bình luận..."
                            value={newComment}
                            onChangeText={setNewComment}
                        />
                        <TouchableOpacity style={styles.commentButton} onPress={addComment}>
                            <Text style={styles.commentButtonText}>Gửi</Text>
                        </TouchableOpacity>
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
});

export default RenderPost;
