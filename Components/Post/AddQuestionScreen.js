import React, { useState, useEffect, useContext } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, 
  StyleSheet, ScrollView 
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getToken } from "../../configs/api";
import { addQuestionPostSurvey } from "../../configs/API/PostSurveyApi";
import { PostSurveyContext } from "../../App";
import { Picker } from "@react-native-picker/picker";
import { Switch } from "react-native-gesture-handler";

const AddQuestionScreen = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [selectedQuestionType, setSelectedQuestionType] = useState("Chương trình đào tạo");
  const [isRequired, setIsRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [postId, setPostId] = useContext(PostSurveyContext);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
    };
    fetchToken();
  }, []);

  //  Thêm câu hỏi vào danh sách (chưa gửi API)
  const handleAddQuestionToList = () => {
    if (!questionContent.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung câu hỏi!");
      return;
    }

    const newQuestion = {
      question_content: questionContent,
      is_required: isRequired ? "True" : "False",
      survey_question_type: selectedQuestionType,
    };

    setQuestionList([...questionList, newQuestion]);
    setQuestionContent(""); // Reset input
    setIsRequired(false);
  };

  //  Xóa câu hỏi khỏi danh sách
  const handleDeleteQuestion = (index) => {
    setQuestionList(questionList.filter((_, i) => i !== index));
  };

  //  Gửi danh sách câu hỏi lên server
  const handleSubmitQuestions = async () => {
    if (questionList.length === 0) {
      Alert.alert("Lỗi", "Chưa có câu hỏi nào được thêm!");
      return;
    }

    try {
      setLoading(true);
      for (const question of questionList) {
        await addQuestionPostSurvey(token, postId, question);
      }
      Alert.alert("Thành công", "Tất cả câu hỏi đã được thêm!");
      setQuestionList([]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm câu hỏi, vui lòng thử lại!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Thêm Câu Hỏi</Text>

      {/* Nhập nội dung câu hỏi */}
      <Text style={styles.label}>Nội dung câu hỏi</Text>
      <TextInput
        style={styles.input}
        value={questionContent}
        onChangeText={setQuestionContent}
        placeholder="Nhập câu hỏi..."
      />

      {/* Chọn loại câu hỏi */}
      <Text style={styles.label}>Loại câu hỏi</Text>
      <Picker
        selectedValue={selectedQuestionType}
        onValueChange={(itemValue) => setSelectedQuestionType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Chương trình đào tạo" value="Chương trình đào tạo" />
        <Picker.Item label="Nhu cầu tuyển dụng" value="Nhu cầu tuyển dụng" />
        <Picker.Item label="Thu nhập cựu sinh viên" value="Thu nhập cựu sinh viên" />
        <Picker.Item label="Tình hình việc làm" value="Tình hình việc làm" />
      </Picker>

      {/* Chọn bắt buộc trả lời */}
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Bắt buộc trả lời</Text>
        <Switch 
          value={isRequired}
          onValueChange={setIsRequired}
        />
      </View>

      {/* Nút thêm câu hỏi vào danh sách */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddQuestionToList}>
        <Text style={styles.addButtonText}>Thêm Câu Hỏi</Text>
      </TouchableOpacity>

      {/* Danh sách câu hỏi đã thêm */}
      {questionList.length > 0 && (
        <ScrollView style={styles.questionListContainer}>
          <Text style={styles.questionListTitle}>Danh sách câu hỏi:</Text>
          {questionList.map((question, index) => (
            <View key={index} style={styles.questionItem}>
              <Text style={styles.questionText}>
                {question.question_content} - {question.survey_question_type} - {question.is_required}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteQuestion(index)}
              >
                <Text style={styles.deleteButtonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Nút gửi câu hỏi lên server */}
      <TouchableOpacity
    style={styles.submitButton}
    onPress={async () => {
        setLoading(true);  // Hiển thị "Đang gửi..."
        await handleSubmitQuestions();  // Chờ lưu xong
        setLoading(false);  // Tắt trạng thái loading
        navigation.navigate("AllView");  // Chuyển trang sau khi lưu xong
    }}
    disabled={loading}
>
    <Text style={styles.submitButtonText}>{loading ? "Đang gửi..." : "Lưu Câu Hỏi"}</Text>
</TouchableOpacity>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f9",
  
    paddingTop:50,
    paddingLeft:20,
    paddingRight:20,
    paddingBottom:20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#d1dbe8",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  picker: {
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  questionListContainer: {
    backgroundColor: "#fff",
    borderColor: "#d1dbe8",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    maxHeight: 250,
  },
  questionListTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  questionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },
  questionText: {
    fontSize: 15,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#27ae60",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AddQuestionScreen;
