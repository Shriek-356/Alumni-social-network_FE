import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit'; // Biểu đồ đường thẳng
import { getToken } from '../../configs/api';
import { ActivityIndicator } from 'react-native';

const StatisticsScreen = () => {
  const [usersData, setUsersData] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [timePeriod, setTimePeriod] = useState('year'); // Year, Month, Quarter
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Lấy token
  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
    };
    fetchToken();
  }, []);

  // Hàm để lấy tất cả dữ liệu người dùng
  const fetchUsers = async () => {
    let users = [];
    let url = 'https://socialapp130124.pythonanywhere.com//users/';
    while (url) {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      users = [...users, ...response.data.results];
      url = response.data.next;
    }
    setUsersData(users);
  };

  // Hàm để lấy tất cả dữ liệu bài viết
  const fetchPosts = async () => {
    let posts = [];
    let url = 'https://socialapp130124.pythonanywhere.com//post/';
    while (url) {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      posts = [...posts, ...response.data.results];
      url = response.data.next;
    }
    setPostsData(posts);
  };

  // Hàm để xử lý dữ liệu theo thời gian (Năm, Tháng, Quý)
  const processData = () => {
    const usersByDate = {};
    const postsByDate = {};

    // Phân loại dữ liệu người dùng theo năm, tháng, quý
    usersData.forEach(user => {
      const date = new Date(user.date_joined);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // tháng bắt đầu từ 0
      const quarter = Math.floor(month / 4) + 1;

      const key = timePeriod === 'year' ? year : timePeriod === 'month' ? month : quarter;
      usersByDate[key] = (usersByDate[key] || 0) + 1;
    });

    // Phân loại dữ liệu bài viết theo năm, tháng, quý
    postsData.forEach(post => {
      const date = new Date(post.created_date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const quarter = Math.floor(month / 4) + 1;

      const key = timePeriod === 'year' ? year : timePeriod === 'month' ? month : quarter;
      postsByDate[key] = (postsByDate[key] || 0) + 1;
    });

    // Chuyển dữ liệu thành mảng để vẽ biểu đồ
    const labels = Object.keys(usersByDate);
    const usersCount = labels.map(label => usersByDate[label]);
    const postsCount = labels.map(label => postsByDate[label]);

    setChartData({
      labels,
      datasets: [
        {
          data: usersCount,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Màu cho Users
          strokeWidth: 3, // Độ dày đường cho Users
        },
        {
          data: postsCount,
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Màu cho Posts
          strokeWidth: 3, // Độ dày đường cho Posts
        },
      ],
    });
    setIsLoading(false);
  };

  // Lấy dữ liệu người dùng và bài viết khi component mount và token có sẵn
  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchPosts();
    }
  }, [token]); // Chỉ gọi khi token có giá trị

  // Cập nhật lại dữ liệu khi thay đổi khoảng thời gian
  useEffect(() => {
    if (usersData.length > 0 && postsData.length > 0) {
      processData();
    }
  }, [usersData, postsData, timePeriod]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thống Kê Người Dùng và Bài Viết</Text>

      <View style={styles.pickerContainer}>
        <Text>Chọn Thời Gian:</Text>
        <Button
          title="Năm"
          onPress={() => setTimePeriod('year')}
          color={timePeriod === 'year' ? '#008CBA' : '#ccc'}
        />
        <Button
          title="Tháng"
          onPress={() => setTimePeriod('month')}
          color={timePeriod === 'month' ? '#008CBA' : '#ccc'}
        />
        <Button
          title="Quý"
          onPress={() => setTimePeriod('quarter')}
          color={timePeriod === 'quarter' ? '#008CBA' : '#ccc'}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <View>
          <LineChart
            data={chartData}
            width={400} // Chiều rộng biểu đồ
            height={220} // Chiều cao biểu đồ
            yAxisLabel="" // Đặt tên cho trục Y
            yAxisSuffix="" // Không cần đơn vị cho trục Y
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0, // Số chữ số sau dấu phẩy
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '6', // Độ lớn của các điểm
                strokeWidth: '2',
                stroke: '#ffa726',
              },
              style: {
                borderRadius: 16, // Góc bo tròn cho biểu đồ
              },
            }}
            bezier
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 122, 255, 1)' }]} />
              <Text>Người dùng</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 99, 132, 1)' }]} />
              <Text>Bài viết</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:50,
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Căn giữa tiêu đề
  },
  pickerContainer: {
    marginBottom: 20,
    alignItems: 'center', // Căn giữa các nút
    flexDirection: 'row', // Thay đổi chiều hướng các nút thành ngang
    justifyContent: 'space-evenly', // Tạo không gian đều giữa các nút
  },
  legendContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    flexDirection: 'row', // Sắp xếp chú thích theo chiều ngang
    justifyContent: 'space-evenly', // Căn đều các mục chú thích
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15, // Khoảng cách giữa các mục chú thích
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default StatisticsScreen;
