import { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getPostCommentss } from '../../configs/API/PostApi';
import { getToken } from '../../configs/api';
import { CurrentAccountUserContext, TotalReactionAccountContext,CurrentUserContext } from '../../App';
import { addPostCommentss, getTotalReactionss, addReactionss, deleteReactionss, updateReactionss } from '../../configs/API/PostApi';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { Pressable } from 'react-native';
import { axiosDAuthApiInstance } from '../../configs/api';
import { deleteCommentt } from '../../configs/API/PostApi';
import { ActivityIndicator } from 'react-native';
import { addSurveyResponse, submitSurveyAnswer } from '../../configs/API/PostSurveyApi';
import { getCurrentUser } from '../../configs/API/userApi';
import { updatePostt } from '../../configs/API/PostApi';

function RenderPost({ item, onDelete }) {

    //Kiểm tra tài khoản trong ds mời và người tạo mới thấy
    // Kiểm tra nếu tài khoản hiện tại không nằm trong danh sách được mời và cũng không phải người tạo
    
 
   
    

    //Sắp xếp câu hỏi trước khi render
    const sortedSurveyQuestions = item.post_survey?.survey_questions
        ? [...item.post_survey.survey_questions].sort((a, b) => a.question_order - b.question_order)
        : [];


    const [menuVisible, setMenuVisible] = useState(false);//Nay la cua bai viet
    const [menuVisibleComment, setMenuVisibleComment] = useState(false);//Nay la cua binh luan

    const navigation = useNavigation()
    const [reaction, setReaction] = useState();
    const [reactionID, setReactionID] = useState();
    const [comments, setComments] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [totalReaction, setTotalReaction] = useState();
    const [reactionCounts, setReactionCounts] = useState({
        Tym: 0,
        Like: 0,
        Haha: 0,
    });
    const [token, setToken] = useState();
    const [nextPageImage, setNextPageImage] = useState(null)
    const [imagesPost, setImagesPost] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [surveyQuestions, setSurveyQuestions] = useState(item.post_survey?.survey_questions || []);

    const [loadingComment, setLoadingComment] = useState(null)
    const [isLocked, setIsLocked] = useState(item.comment_lock)


    const [editingPost, setEditingPost] = useState(false); // Trạng thái chỉnh sửa
    const [editedPost, setEditedPost] = useState(item.post_content || '');
    const [postContent, setPostContent] = useState("")

    const [loadingEditComment, setLoadingEditComment] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState("");


    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)
    const [totalReactionAccountt, setTotalReactionAccountt] = useContext(TotalReactionAccountContext)
    const [currentUser, setCurrentUser] = useContext(CurrentUserContext)

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
    const [surveyResponses, setSurveyResponses] = useState({});


    const updateReactionCounts = (reactions) => {
        const counts = { Tym: 0, Like: 0, Haha: 0 };

        reactions.forEach((reaction) => {
            if (reaction.reaction === 'Tym') {
                counts.Tym += reaction.count;
            } else if (reaction.reaction === 'Like') {
                counts.Like += reaction.count;
            } else if (reaction.reaction === 'Haha') {
                counts.Haha += reaction.count;
            }
        });

        setReactionCounts(counts);
    };
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const userToken = await getToken(); // Lấy token hiện tại
                if (userToken) {
                    const user = await getCurrentUser(userToken); // Gọi API lấy thông tin người dùng
                    setCurrentUser(user); // Lưu vào Context `CurrentUserContext`
                    console.log('Current User:', user);
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };
        fetchCurrentUser();
    }, []);

    // Kiểm tra nếu không có quyền xem bài viết
    if (
        item.post_invitation &&
        currentUser?.id && // Kiểm tra currentUser tồn tại
        !item.post_invitation.accounts_alumni.includes(currentUser.id) && // Người dùng hiện tại không thuộc danh sách được mời
        currentUser.id !== item.account.user.id // Và không phải là người tạo bài viết
    ) {
        return null; // Không hiển thị bài viết
    }

    //Lay so cam xuc cua 1 bai viet
    useEffect(() => {
        const fetchReactions = async () => {
            try {
                let response = await getTotalReactionss(token, item.id)
                if (response) {
                    setTotalReaction(response.total_reactions)
                    updateReactionCounts(response.reactions)
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
            console.log("Thanh cong")
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

        try {
            /*const response = await axiosDAuthApiInstance(token).patch(`/post/${item.id}/`, {
                post_content: editedPost
            });

            if (response.status === 200) {
                setPostContent(editedPost); // Cập nhật nội dung bài viết mới
                setEditingPost(false); // Thoát chế độ chỉnh sửa
            }*/

            setPostContent(editedPost); // Cập nhật nội dung bài viết mới
            setEditingPost(false); // Thoát chế độ chỉnh sửa
        } catch (error) {
            console.error("Lỗi cập nhật bài viết:", error);
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
        await handleReaction(reactionType);

        // Cập nhật lại counts khi người dùng thay đổi cảm xúc
        const newCounts = { ...reactionCounts }; // Lấy số lượng ban đầu từ reactionCounts

        // Nếu cảm xúc hiện tại không phải là reactionType, giảm số lượng của cảm xúc cũ đi
        if (reaction && reaction !== reactionType) {
            newCounts[reaction] -= 1;
        }

        // Tăng số lượng của cảm xúc mới
        if (reactionType === reaction) {
            // Nếu nhấn lại cảm xúc đã chọn, giảm đi 1
            newCounts[reactionType] -= 1;
        } else {
            newCounts[reactionType] += 1;
        }

        // Cập nhật lại reactionCounts trong state
        setReactionCounts(newCounts);
    };

    //Ham xu ly khi nguoi dung tha cam xuc
    const handleReaction = async (reactionType) => {
        if (reaction && reaction === reactionType) {
            // Nếu người dùng chọn lại cảm xúc cũ, xóa cảm xúc đó và giảm số lượng
            try {
                let response = await deleteReactionss(token, reactionID);
                setReaction('');
                setTotalReaction((prev) => prev - 1);

                // Cập nhật lại reactionCounts khi xóa
                setReactionCounts((prev) => ({
                    ...prev,
                    [reaction]: prev[reaction] - 1,
                }));
            } catch (error) {
                console.log("Error delete reactions: ", error);
            }
        } else if (reaction && reaction !== reactionType) {
            // Nếu người dùng chọn cảm xúc mới, cập nhật lại cảm xúc mới và giảm số lượng cũ
            try {
                const dataReactions = {
                    reaction: reactionType
                };
                let response = await updateReactionss(token, reactionID, dataReactions);
                setReaction(reactionType);

                // Cập nhật lại reactionCounts
                setReactionCounts((prev) => ({
                    ...prev,
                    [reaction]: prev[reaction] - 1, // Giảm số lượng cảm xúc cũ
                    [reactionType]: prev[reactionType] + 1, // Tăng số lượng cảm xúc mới
                }));
            } catch (error) {
                console.log("Error update reactions: ", error);
            }
        } else {
            // Nếu chưa có cảm xúc, thêm cảm xúc mới
            try {
                const dataReactions = {
                    reaction: reactionType,
                    account: currentAccountUser.user.id,
                    post: item.id,
                };
                let response = await addReactionss(token, dataReactions);
                setReaction(reactionType);
                setReactionID(response.id); // Cập nhật ID reaction mới
                setTotalReaction((prev) => prev + 1);

                // Cập nhật lại reactionCounts
                setReactionCounts((prev) => ({
                    ...prev,
                    [reactionType]: prev[reactionType] + 1,
                }));
            } catch (error) {
                console.log("Error add reactions: ", error);
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
    //Xử lý thêm câu trả lời
    const handleSubmitAnswer = async (questionId) => {
        if (!surveyResponses[questionId]) {
            Alert.alert("Lỗi", "Vui lòng nhập câu trả lời trước khi gửi.");
            return;
        }

        try {
            const postSurveyId = item.post_survey.id || item.post_survey.post;

            const responseData = {
                account: currentAccountUser.user.id,
                post_survey: postSurveyId,
            };
            console.log(" Gửi dữ liệu đến addSurveyResponse:", responseData);
            // Gửi request tạo survey_response
            const surveyResponse = await addSurveyResponse(token, responseData);

            if (!surveyResponse || !surveyResponse.id) {
                console.log(" API trả về dữ liệu không hợp lệ:", surveyResponse);
                Alert.alert("Lỗi", "Không thể tạo survey response.");
                return;
            }

            console.log(" Survey response được tạo:", surveyResponse);

            //  Gửi câu trả lời
            const surveyAnswerData = {
                answer_value: surveyResponses[questionId],
                survey_question: questionId,
                survey_response: surveyResponse.id,
            };

            console.log(" Gửi dữ liệu đến submitSurveyAnswer:", surveyAnswerData);
            const newAnswer = await submitSurveyAnswer(token, surveyAnswerData);

            Alert.alert("Thành công", "Câu trả lời đã được gửi!");

            //  Cập nhật danh sách câu trả lời ngay trên UI
            setSurveyQuestions((prevQuestions) =>
                prevQuestions.map((q) => {
                    if (q.id === questionId) {
                        return {
                            ...q,
                            survey_answers: [
                                ...(q.survey_answers || []),
                                {
                                    id: newAnswer.id,
                                    answer_value: surveyResponses[questionId],
                                    survey_response: surveyResponse.id,
                                },
                            ],
                        };
                    }
                    return q;
                })
            );

            // Reset input sau khi gửi thành công
            setSurveyResponses({ ...surveyResponses, [questionId]: "" });

        } catch (error) {
            console.log(" Lỗi khi gửi câu trả lời:", error);
            Alert.alert("Lỗi", "Không thể gửi câu trả lời. Vui lòng thử lại.");
        }
    };




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
                // Đoạn xử lý khác biệt post_survey
                <View>
                    <Text style={styles.postContent}>{item.post_content}</Text>
                    {/* Hiển thị thông tin sự kiện nếu tồn tại */}

                    {/* Hiển thị thông tin sự kiện nếu post_invitation không phải null */}
                    {item.post_invitation && (
                        <View style={styles.invitationContainer}>
                            <Text style={styles.eventName}>Sự kiện: {item.post_invitation.event_name}</Text>
                            <Text style={styles.invitationCount}>
                                Số lượng được mời: {item.post_invitation.accounts_alumni.length} người
                            </Text>
                        </View>
                    )}

                    {item.post_survey && (<Text style={styles.surveyTime}>Thời gian kết thúc khảo sát: {new Date(item.post_survey.end_time).toLocaleString()}</Text>)}
                    {item.post_survey && (
                        <View>
                            <Text style={styles.surveyTitle}>{item.post_survey.post_survey_title}</Text>
                            {sortedSurveyQuestions.map((question) => (
                                <View key={question.id} style={styles.questionContainer}>
                                    {/* Hiển thị câu hỏi */}
                                    <Text style={styles.surveyQuestion}>
                                        {question.question_order}. {question.question_content}
                                    </Text>
                                    {/* {Nhập câu trả lời} */}
                                    <TextInput style={styles.answerInput}
                                        placeholder='Nhập câu trả lời..'
                                        value={surveyResponses[question.id] || ""}
                                        onChangeText={(text) => setSurveyResponses({ ...surveyResponses, [question.id]: text })}></TextInput>
                                    {/* Nút gửi câu trả lời */}
                                    <TouchableOpacity
                                        style={styles.submitAnswerButton}
                                        onPress={() => handleSubmitAnswer(question.id)}
                                    >
                                        <Text style={styles.submitAnswerText}>Gửi</Text>
                                    </TouchableOpacity>
                                    {/* Hiển thị danh sách câu trả lời */}

                                    {surveyQuestions.find(q => q.id === question.id)?.survey_answers?.length > 0 ? (
                                        surveyQuestions.find(q => q.id === question.id)?.survey_answers.map((answer) => {
                                            const respondent = item.post_survey.survey_responses.find(
                                                (response) => response.id === answer.survey_response
                                            );

                                            return respondent ? (
                                                <View key={answer.id} style={styles.answerWrapper}>
                                                    <View style={styles.userContainer}>
                                                        <Image
                                                            source={{ uri: processImageURL(respondent.account.avatar) }}
                                                            style={styles.userAvatar}
                                                        />
                                                        <Text style={styles.userName}>{respondent.account.full_name}</Text>
                                                    </View>
                                                    <View style={styles.answerBox}>
                                                        <Text style={styles.answerText}>{answer.answer_value}</Text>
                                                    </View>
                                                </View>
                                            ) : null;
                                        })
                                    ) : (
                                        <Text style={styles.noAnswerText}>Chưa có câu trả lời</Text>
                                    )}



                                </View>
                            ))}

                        </View>
                    )}
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
                {/* Hiển thị tổng số lượng phản ứng */}
                <Text>{totalReaction}</Text>

                {/* Nút Like với số lượng */}
                <TouchableOpacity style={styles.actionButton} onPress={() => test('Like')}>
                    <View style={styles.iconContainer}>
                        <FontAwesome name="thumbs-up" size={20} color={reaction === 'Like' ? 'blue' : 'gray'} />
                        {/* Hiển thị số lượng Like */}
                        <Text style={styles.iconText}>{reactionCounts.Like}</Text>
                    </View>
                    <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>

                {/* Nút Haha với số lượng */}
                <TouchableOpacity style={styles.actionButton} onPress={() => test('Haha')}>
                    <View style={styles.iconContainer}>
                        <FontAwesome name="smile-o" size={20} color={reaction === 'Haha' ? 'orange' : 'gray'} />
                        {/* Hiển thị số lượng Haha */}
                        <Text style={styles.iconText}>{reactionCounts.Haha}</Text>
                    </View>
                    <Text style={styles.actionText}>Haha</Text>
                </TouchableOpacity>

                {/* Nút Tym với số lượng */}
                <TouchableOpacity style={styles.actionButton} onPress={() => test('Tym')}>
                    <View style={styles.iconContainer}>
                        <FontAwesome name="heart" size={20} color={reaction === 'Tym' ? 'red' : 'gray'} />
                        {/* Hiển thị số lượng Tym */}
                        <Text style={styles.iconText}>{reactionCounts.Tym}</Text>
                    </View>
                    <Text style={styles.actionText}>Tym</Text>
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

                <View >
                    {!isLocked ? (
                        <View style={styles.commentInputContainer}>

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
                        </View>
                    ) : (
                        <View style={styles.lockedCommentContainer}>
                            <Text style={styles.lockedCommentText}>Đã khóa bình luận</Text>
                        </View>
                    )}

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
    iconContainer: {
        marginTop: 15,
        position: 'relative',
        marginBottom: 5,
    },
    iconText: {
        position: 'absolute',
        top: -20,
        left: '50%',
        transform: [{ translateX: -10 }],
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 5
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
        marginTop: 10,
        paddingHorizontal: 90,
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
    surveyContainer: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },

    surveyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
        textAlign: 'center',
    },

    surveyTime: {
        fontSize: 14,
        color: '#d9534f',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },

    questionContainer: {
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },

    surveyQuestion: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },

    answerWrapper: {
        marginTop: 10,
        paddingHorizontal: 10,
    },

    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },

    userAvatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        marginRight: 10,
    },

    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007bff',
    },

    answerBox: {
        backgroundColor: '#e9ecef',
        padding: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
        maxWidth: '80%',
    },

    answerText: {
        fontSize: 14,
        color: '#333',
    },

    noAnswerText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#888',
        marginTop: 5,
        textAlign: 'center',
    },

    answerInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginTop: 5,
        fontSize: 14,
        backgroundColor: "#fff"
    },
    submitAnswerButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        alignItems: 'center',
    },
    submitAnswerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    invitationContainer: {
        backgroundColor: '#f1f9ff',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#cce5ff',
    },
    eventName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 5,
    },
    invitationCount: {
        fontSize: 14,
        color: '#555',
    },
    
    },lockedCommentContainer: {
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