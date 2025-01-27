import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRoomByAccount } from "../../configs/API/roomApi";
import { getCurrentUser } from "../../configs/api";

const RoomScreen = () => {
    const [rooms, setRooms] = useState([]); // Danh sách room chat
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [nextPage, setNextPage] = useState(null); // URL của trang tiếp theo
  
    // Hàm fetch rooms từ API
    const fetchRooms = async (url = null) => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
  
        // Lấy thông tin người dùng hiện tại
        const currentUser = await getCurrentUser(token);
        const userId = currentUser.id; // Lấy ID người dùng hiện tại
  
        // Sử dụng endpoint động hoặc URL trang tiếp theo
        const endpoint = url || `/room/${userId}/filter_rooms/`;
        const response = await getRoomByAccount(token, userId);
  
        // Cập nhật danh sách rooms và URL trang tiếp theo
        setRooms((prevRooms) => [...prevRooms, ...response.results]);
        setNextPage(response.next);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải danh sách phòng chat");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    // Load rooms khi màn hình được mở
    useEffect(() => {
      fetchRooms();
    }, []);
  
    // Render từng room chat
    const renderRoomItem = ({ item }) => {
      const { second_user, seen, received_message_date } = item;
      return (
        <TouchableOpacity style={styles.roomItem}>
          <Image source={{ uri: second_user.avatar }} style={styles.avatar} />
          <View style={styles.roomInfo}>
            <Text style={styles.name}>{second_user.full_name}</Text>
            <Text style={styles.messageInfo}>
              {seen ? "Đã xem" : "Chưa xem"} - {new Date(received_message_date).toLocaleString()}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
  
    // UI của màn hình Room
    return (
      <View style={styles.container}>
        {loading && rooms.length === 0 ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <FlatList
            data={rooms}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRoomItem}
            onEndReached={() => {
              if (nextPage) fetchRooms(nextPage); // Tải thêm dữ liệu nếu có URL trang tiếp theo
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              nextPage && <ActivityIndicator size="small" color="#007BFF" />
            }
          />
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9f9f9", padding: 10 },
    roomItem: {
      flexDirection: "row",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      alignItems: "center",
    },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    roomInfo: { flex: 1 },
    name: { fontSize: 16, fontWeight: "bold", color: "#333" },
    messageInfo: { fontSize: 14, color: "#888" },
  });
  
  export default RoomScreen;