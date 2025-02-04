import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { getToken } from "../../configs/api";
import {  CurrentUserContext } from "../../App";
import { addPostSurvey, addQuestionPostSurvey } from "../../configs/API/PostSurveyApi";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PostSurveyContext } from "../../App";
import { Picker } from "@react-native-picker/picker";
import { Switch } from "react-native-gesture-handler";

const PostSurvey = () => {
  const [postSurveys, setPostSurveys] = useState([]);
  const [error, setError] = useState(null);
  const [newSurveyTitle, setNewSurveyTitle] = useState("");
  const [newSurveyContent, setNewSurveyContent] = useState("");
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [newSurveyQuestion, setNewSurveyQuestion] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const [selectedQuestionType , setSelectedQuestionType] = useState("Chương trình đào tạo")
  const navigation = useNavigation();
  const [currenttUser] = useContext(CurrentUserContext);

  const [postId, setPostId] = useContext(PostSurveyContext);


  // Các state riêng cho picker của startTime
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(null);

  // Các state riêng cho picker của endTime
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [tempEndDate, setTempEndDate] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
    };
    fetchToken();
  }, []);

  const handleAddPostSurvey = async () => {
    if (newSurveyTitle && newSurveyContent && startTime && endTime && currenttUser) {
      const surveyData = {
        post_survey_title: newSurveyTitle,
        start_time: startTime,
        end_time: endTime,
        post_content: newSurveyContent,
        account_id: currenttUser.id,
      };
      try {
        setLoading(true);
        const response = await addPostSurvey(token, surveyData);
        const newPostSurveyId = response.post || response.id
        console.log("Lưu post_id vào context:", newPostSurveyId);
        setPostId(newPostSurveyId); // Lưu vào Context
        if (!newPostSurveyId) {
          Alert.alert("Lỗi", "Không thể lấy post_id từ API!");
          return;
        }

        

        setNewSurveyTitle("");
        setNewSurveyContent("");
        setStartTime("");
        setEndTime("");
        setNewSurveyQuestion("");
        setQuestionList([]);
        
        navigation.navigate("AddQuestionScreen")

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


  // Xử lý cho startTime
  const onChangeStartDate = (event, selectedDate) => {
    if (event.type === "set") {
      const chosenDate = selectedDate || new Date();
      setTempStartDate(chosenDate);
      setShowStartDatePicker(false);
      setShowStartTimePicker(true);
    } else if (event.type === "dismissed") {
      setShowStartDatePicker(false);
    }
  };

  const onChangeStartTime = (event, selectedTime) => {
    if (event.type === "set") {
      const chosenTime = selectedTime || new Date();
      setShowStartTimePicker(false);
      if (tempStartDate) {
        const combinedDateTime = new Date(
          tempStartDate.getFullYear(),
          tempStartDate.getMonth(),
          tempStartDate.getDate(),
          chosenTime.getHours(),
          chosenTime.getMinutes(),
          chosenTime.getSeconds()
        );
        setStartTime(combinedDateTime.toISOString());
      }
    } else if (event.type === "dismissed") {
      setShowStartTimePicker(false);
    }
  };

  // Xử lý cho endTime
  const onChangeEndDate = (event, selectedDate) => {
    if (event.type === "set") {
      const chosenDate = selectedDate || new Date();
      setTempEndDate(chosenDate);
      setShowEndDatePicker(false);
      setShowEndTimePicker(true);
    } else if (event.type === "dismissed") {
      setShowEndDatePicker(false);
    }
  };

  const onChangeEndTime = (event, selectedTime) => {
    if (event.type === "set") {
      const chosenTime = selectedTime || new Date();
      setShowEndTimePicker(false);
      if (tempEndDate) {
        const combinedDateTime = new Date(
          tempEndDate.getFullYear(),
          tempEndDate.getMonth(),
          tempEndDate.getDate(),
          chosenTime.getHours(),
          chosenTime.getMinutes(),
          chosenTime.getSeconds()
        );
        setEndTime(combinedDateTime.toISOString());
      }
    } else if (event.type === "dismissed") {
      setShowEndTimePicker(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <Text style={styles.loadingText}>Đang tải...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.header}>Tạo Khảo Sát Mới</Text>

      <TextInput
        style={styles.input}
        value={newSurveyTitle}
        onChangeText={setNewSurveyTitle}
        placeholder="Nhập tiêu đề khảo sát"
        placeholderTextColor="#999"
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={newSurveyContent}
        onChangeText={setNewSurveyContent}
        placeholder="Nhập nội dung khảo sát"
        placeholderTextColor="#999"
        multiline
      />

      {/* Picker cho thời gian bắt đầu */}
      <View style={styles.timePickerContainer}>
        <Text style={styles.inputLabel}>Chọn thời gian bắt đầu</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            {startTime
              ? new Date(startTime).toLocaleString()
              : "Chọn ngày và giờ bắt đầu"}
          </Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onChangeStartDate}
            style={styles.dateTimePicker}
          />
        )}
        {showStartTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={onChangeStartTime}
            style={styles.dateTimePicker}
          />
        )}
      </View>

      {/* Picker cho thời gian kết thúc */}
      <View style={styles.timePickerContainer}>
        <Text style={styles.inputLabel}>Chọn thời gian kết thúc</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            {endTime
              ? new Date(endTime).toLocaleString()
              : "Chọn ngày và giờ kết thúc"}
          </Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onChangeEndDate}
            style={styles.dateTimePicker}
          />
        )}
        {showEndTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={onChangeEndTime}
            style={styles.dateTimePicker}
          />
        )}
      </View>
      <TouchableOpacity
  style={styles.submitButton}
  onPress={() => {
    handleAddPostSurvey(); // Gọi hàm thêm khảo sát
    navigation.navigate("AddQuestionScreen"); // Chuyển sang màn hình câu hỏi
  }}
>
  <Text style={styles.submitButtonText}>Tiếp tục</Text>
</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f9",
    padding: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#d1dbe8",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  timePickerContainer: {
    marginBottom: 20,
  },
  pickerButton: {
    backgroundColor: "#fff",
    borderColor: "#d1dbe8",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  dateTimePicker: {
    width: "100%",
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
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
    maxHeight: 200, // Chiều cao tối đa cho danh sách, cho phép cuộn nếu vượt quá
  },
  questionListTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  questionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  questionText: {
    fontSize: 15,
    color: "#555",
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  picker: {
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  questionItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 15,
    color: "#555",
  },
});

export default PostSurvey;
