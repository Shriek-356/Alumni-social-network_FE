import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet, Platform } from "react-native";
import { getToken } from "../../configs/api";
import { CurrentAccountUserContext } from '../../App';
import { addPostSurvey, addQuestionPostSurvey } from "../../configs/API/PostSurveyApi";
import DateTimePicker from '@react-native-community/datetimepicker';
import { PostSurveyContext } from "../../App";

const PostSurvey = () => {
    const [postSurveys, setPostSurveys] = useState([]);
    const [error, setError] = useState(null);
    const [newSurveyTitle, setNewSurveyTitle] = useState(""); 
    const [newSurveyContent, setNewSurveyContent] = useState("");
    const [token, setToken] = useState();
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState(""); 
    const [endTime, setEndTime] = useState(""); 
    const [newSurveyQuestion, setNewSurveyQuestion] = useState(""); 
    const [questionList, setQuestionList] = useState([]); 
    const navigation = useNavigation();
    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext);

    const [postServeyInfo , setPostSurveyInfo] = useContext(PostSurveyContext)

    // State để điều khiển việc hiển thị DateTimePicker
    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);

    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

    const handleAddPostSurvey = async () => {
        if (newSurveyTitle && newSurveyContent && startTime && endTime && currentAccountUser) {
            const surveyData = {
                post_survey_title: newSurveyTitle,
                start_time: startTime,
                end_time: endTime,
                post_content: newSurveyContent,
                account_id: currentAccountUser.id, 
            };
            try {
                setLoading(true);
                const response = await addPostSurvey(token, surveyData);
                const newPostSurveyId = response.post.id;

                questionList.forEach(async (question) => {
                    const surveyQuestionData = {
                        question_content: question.content,
                        is_required: question.isRequired,
                        survey_question_type: question.type, 
                    };
                    await addQuestionPostSurvey(token, surveyQuestionData, newPostSurveyId);
                });

                setNewSurveyTitle("");
                setNewSurveyContent("");
                setStartTime("");
                setEndTime("");
                setNewSurveyQuestion("");
                setQuestionList([]);
                Alert.alert("Thông báo", "Khảo sát đã được thêm thành công!");
            } catch (error) {
                setError("Lỗi khi thêm khảo sát");
                console.log(error);
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin khảo sát.");
        }
    };

    const handleAddQuestion = () => {
        if (newSurveyQuestion) {
            const newQuestion = {
                content: newSurveyQuestion,
                isRequired: true,
                type: "Employment Status",
            };
            setQuestionList([...questionList, newQuestion]);
            setNewSurveyQuestion("");
        }
    };

    // Handle start time change
    const onChangeStartTime = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || new Date();
            setStartTime(currentDate.toISOString());
            setShowStartTime(false); // Ẩn bộ chọn thời gian sau khi chọn
        } else if (event.type === 'dismissed') {
            setShowStartTime(false); // Ẩn bộ chọn khi bị huỷ
        }
    };

    // Handle end time change
    const onChangeEndTime = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || new Date();
            setEndTime(currentDate.toISOString());
            setShowEndTime(false); // Ẩn bộ chọn thời gian sau khi chọn
        } else if (event.type === 'dismissed') {
            setShowEndTime(false); // Ẩn bộ chọn khi bị huỷ
        }
    };

    return (
        <View style={styles.container}>
            {loading && <Text style={styles.loadingText}>Đang tải...</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}

            <TextInput
                style={styles.input}
                value={newSurveyTitle}
                onChangeText={setNewSurveyTitle}
                placeholder="Nhập tiêu đề khảo sát"
            />
            <TextInput
                style={styles.input}
                value={newSurveyContent}
                onChangeText={setNewSurveyContent}
                placeholder="Nhập nội dung khảo sát"
            />

            {/* Start time picker */}
            <View style={styles.timePickerContainer}>
                <Text style={styles.inputLabel}>Chọn thời gian bắt đầu</Text>
                <TouchableOpacity onPress={() => setShowStartTime(true)}>
                    <Text>{startTime ? new Date(startTime).toLocaleString() : "Chọn thời gian bắt đầu"}</Text>
                </TouchableOpacity>
                {showStartTime && Platform.OS === 'android' && (
                    <DateTimePicker
                        value={startTime ? new Date(startTime) : new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeStartTime}
                        style={{ width: "100%" }}
                    />
                )}
                {showStartTime && Platform.OS === 'android' && (
                    <DateTimePicker
                        value={startTime ? new Date(startTime) : new Date()}
                        mode="time"
                        display="default"
                        onChange={onChangeStartTime}
                        style={{ width: "100%" }}
                    />
                )}
            </View>

            {/* End time picker */}
            <View style={styles.timePickerContainer}>
                <Text style={styles.inputLabel}>Chọn thời gian kết thúc</Text>
                <TouchableOpacity onPress={() => setShowEndTime(true)}>
                    <Text>{endTime ? new Date(endTime).toLocaleString() : "Chọn thời gian kết thúc"}</Text>
                </TouchableOpacity>
                {showEndTime && Platform.OS === 'android' && (
                    <DateTimePicker
                        value={endTime ? new Date(endTime) : new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeEndTime}
                        style={{ width: "100%" }}
                    />
                )}
                {showEndTime && Platform.OS === 'android' && (
                    <DateTimePicker
                        value={endTime ? new Date(endTime) : new Date()}
                        mode="time"
                        display="default"
                        onChange={onChangeEndTime}
                        style={{ width: "100%" }}
                    />
                )}
            </View>

            {/* Input for adding survey question */}
            <TextInput
                style={styles.input}
                value={newSurveyQuestion}
                onChangeText={setNewSurveyQuestion}
                placeholder="Nhập câu hỏi khảo sát"
            />
            <Button title="Thêm câu hỏi khảo sát" onPress={handleAddQuestion} />

            {/* Hiển thị danh sách câu hỏi đã thêm */}
            {questionList.length > 0 && (
                <View style={styles.questionList}>
                    <Text style={styles.questionListTitle}>Câu hỏi khảo sát đã thêm:</Text>
                    {questionList.map((question, index) => (
                        <Text key={index} style={styles.questionText}>{question.content}</Text>
                    ))}
                </View>
            )}

            <Button title="Thêm khảo sát mới" onPress={handleAddPostSurvey} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f9f9f9",
    },
    loadingText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
        borderRadius: 5,
    },
    timePickerContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        color: "#333",
        marginBottom: 8,
    },
    datePicker: {
        width: "100%",
    },
    questionList: {
        marginTop: 20,
        paddingLeft: 8,
    },
    questionListTitle: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 8,
    },
    questionText: {
        fontSize: 14,
        color: "#333",
    },
});

export default PostSurvey;
