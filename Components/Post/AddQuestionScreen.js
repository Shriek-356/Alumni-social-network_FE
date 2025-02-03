import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getToken } from "../../configs/api";
import { addQuestionPostSurvey } from "../../configs/API/PostSurveyApi";
import { PostSurveyContext } from "../../App";

const AddQuestionScreen = () => {
  
  const navigation = useNavigation();

  
  const [token, setToken] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [selectedQuestionType, setSelectedQuestionType] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postId, setPostId] = useContext(PostSurveyContext);
 // lấy dữ liệu ra từ context

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
    };
    fetchToken();
  }, []);

  const handleAddQuestion = async () => {
    if (!questionContent.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung câu hỏi!");
      return;
    }

    const questionData = {
      question_content: questionContent,
      is_required: isRequired ? "True" : "False",
      survey_question_type: selectedQuestionType,
    };

    try {
      setLoading(true);
      await addQuestionPostSurvey(token, postId, questionData);
      Alert.alert("Thành công", "Câu hỏi đã được thêm!");
      setQuestionContent(""); // Reset input
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

      <Text style={styles.label}>Nội dung câu hỏi</Text>
      <TextInput
        style={styles.input}
        value={questionContent}
        onChangeText={setQuestionContent}
        placeholder="Nhập câu hỏi..."
      />

      <Text style={styles.label}>Loại câu hỏi</Text>
      <TextInput
        style={styles.input}
        value={selectedQuestionType}
        onChangeText={setSelectedQuestionType}
        placeholder="Nhập loại câu hỏi..."
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Bắt buộc trả lời</Text>
        <TouchableOpacity
          style={[styles.switchButton, isRequired ? styles.switchOn : styles.switchOff]}
          onPress={() => setIsRequired(!isRequired)}
        >
          <Text style={styles.switchText}>{isRequired ? "Có" : "Không"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleAddQuestion} disabled={loading}>
        <Text style={styles.submitButtonText}>{loading ? "Đang thêm..." : "Thêm Câu Hỏi"}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.doneButton} onPress={() => navigation.navigate("HomeScreen")}>
        <Text style={styles.doneButtonText}>Hoàn tất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f9",
    padding:50,
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  switchButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  switchOn: {
    backgroundColor: "#27ae60",
  },
  switchOff: {
    backgroundColor: "#ccc",
  },
  switchText: {
    color: "#fff",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#3498db",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  doneButton: {
    backgroundColor: "#2ecc71",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AddQuestionScreen;
