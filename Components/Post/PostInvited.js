import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { getToken } from "../../configs/api";
import { CurrentUserContext } from "../../App";
import { createPostInvited } from "../../configs/API/PostInvitedApi";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

const PostInvited = () => {
  const [eventName, setEventName] = useState(""); // Nhập tên sự kiện
  const [postContent, setPostContent] = useState(""); // Nhập nội dung sự kiện
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser] = useContext(CurrentUserContext);
  const navigation = useNavigation();
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
    };
    fetchToken();
  }, []);

  // Xử lý chọn ngày & giờ bắt đầu
  const onChangeStartDate = (event, selectedDate) => {
    if (event.type === "set") {
      setTempStartDate(selectedDate);
      setShowStartDatePicker(false);
      setShowStartTimePicker(true);
    } else {
      setShowStartDatePicker(false);
    }
  };

  const onChangeStartTime = (event, selectedTime) => {
    if (event.type === "set") {
      setShowStartTimePicker(false);
      if (tempStartDate) {
        const combinedDateTime = new Date(
          tempStartDate.getFullYear(),
          tempStartDate.getMonth(),
          tempStartDate.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes(),
          selectedTime.getSeconds()
        );
        setStartTime(combinedDateTime.toISOString());
      }
    } else {
      setShowStartTimePicker(false);
    }
  };

  // Xử lý chọn ngày & giờ kết thúc
  const onChangeEndDate = (event, selectedDate) => {
    if (event.type === "set") {
      setTempEndDate(selectedDate);
      setShowEndDatePicker(false);
      setShowEndTimePicker(true);
    } else {
      setShowEndDatePicker(false);
    }
  };

  const onChangeEndTime = (event, selectedTime) => {
    if (event.type === "set") {
      setShowEndTimePicker(false);
      if (tempEndDate) {
        const combinedDateTime = new Date(
          tempEndDate.getFullYear(),
          tempEndDate.getMonth(),
          tempEndDate.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes(),
          selectedTime.getSeconds()
        );
        setEndTime(combinedDateTime.toISOString());
      }
    } else {
      setShowEndTimePicker(false);
    }
  };

  const handleCreatePostInvited = async () => {
    if (!eventName || !postContent || !startTime || !endTime) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);
      const data = {
        event_name: eventName,
        start_time: startTime,
        end_time: endTime,
        post_content: postContent,
        account_id: currentUser.id,
      };

      const response = await createPostInvited(token, data);
      // đã bỏ Alert ở đây
    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi", "Không thể tạo bài viết mời!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tạo Bài Viết Mời</Text>

      {/* Nhập tên sự kiện */}
      <TextInput
        style={styles.input}
        value={eventName}
        onChangeText={setEventName}
        placeholder="Nhập tên sự kiện"
        placeholderTextColor="#999"
      />

      {/* Nhập nội dung sự kiện */}
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={postContent}
        onChangeText={setPostContent}
        placeholder="Nhập nội dung sự kiện"
        placeholderTextColor="#999"
        multiline
      />

 {/* Chọn thời gian bắt đầu */}
 <TouchableOpacity style={styles.pickerButton} onPress={() => setShowStartDatePicker(true)}>
        <Text style={styles.pickerButtonText}>
          {startTime ? new Date(startTime).toLocaleString() : "Chọn ngày và giờ bắt đầu"}
        </Text>
      </TouchableOpacity>
      {showStartDatePicker && <DateTimePicker value={new Date()} mode="date" display="default" onChange={onChangeStartDate} />}
      {showStartTimePicker && <DateTimePicker value={new Date()} mode="time" display="default" onChange={onChangeStartTime} />}

      {/* Chọn thời gian kết thúc */}
      <TouchableOpacity style={styles.pickerButton} onPress={() => setShowEndDatePicker(true)}>
        <Text style={styles.pickerButtonText}>
          {endTime ? new Date(endTime).toLocaleString() : "Chọn ngày và giờ kết thúc"}
        </Text>
      </TouchableOpacity>
      {showEndDatePicker && <DateTimePicker value={new Date()} mode="date" display="default" onChange={onChangeEndDate} />}
      {showEndTimePicker && <DateTimePicker value={new Date()} mode="time" display="default" onChange={onChangeEndTime} />}

      {/* Nút tạo bài viết */}
      <TouchableOpacity style={styles.submitButton} onPress={() => {handleCreatePostInvited();
        navigation.navigate("Group");
      }}>
        <Text style={styles.submitButtonText}>Tiếp Tục</Text>
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
  pickerButton: {
    backgroundColor: "#fff",
    borderColor: "#d1dbe8",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#333",
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
});

export default PostInvited;
