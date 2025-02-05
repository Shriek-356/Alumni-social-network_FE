import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getToken } from '../../configs/api';
import { approvalAlumnis } from '../../configs/API/userApi';
import { getAlumnis } from '../../configs/API/userApi';
import axios from 'axios';

const ApprovalScreen = () => {
    const [accounts, setAccounts] = useState([]);  // Tài khoản chờ xét duyệt
    const [loading, setLoading] = useState(true);  // Trạng thái loading
    const [token, setToken] = useState(null);      // Token của người dùng
    const [nextPage, setNextPage] = useState('');  // Lưu trang tiếp theo (nếu có)

    // Lấy token người dùng
    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

    // Khi có token, tải tất cả các tài khoản chờ duyệt (duyệt hết các trang)
    useEffect(() => {
        if (token) {
            fetchAllPendingAccounts();  // Lấy tất cả tài khoản chờ duyệt
        }
    }, [token]);

    const fetchAllPendingAccounts = async () => {
        try {
            setLoading(true);  // Bắt đầu tải dữ liệu
            let allAccounts = [];  // Mảng chứa tất cả tài khoản chờ duyệt
            let currentPage = 'https://socialapp130124.pythonanywhere.com//alumni_accounts/';  // URL của API (thay bằng URL thực tế)

            // Lặp qua tất cả các trang
            while (currentPage) {
                const response = await axios.get(currentPage, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const pendingAccounts = response.data.results.filter(item => item.confirm_status === "PENDING");
                allAccounts = [...allAccounts, ...pendingAccounts];  // Thêm tài khoản mới vào mảng
                currentPage = response.data.next;  // Cập nhật trang tiếp theo
            }

            setAccounts(allAccounts);  // Lưu tất cả tài khoản vào state
        } catch (error) {
            console.error('Error fetching all pending accounts:', error);  // Xử lý lỗi nếu có
        } finally {
            setLoading(false);  // Kết thúc quá trình tải
        }
    };

    const handleApprove = async (accountId) => {
        try {
            setLoading(true);  // Bắt đầu quá trình duyệt
            const data = { confirm_status: "Confirmed" };
            await approvalAlumnis(token, accountId, data);  // Duyệt tài khoản
            setAccounts(accounts.filter(account => account.account.user.id !== accountId));  // Xóa tài khoản đã duyệt khỏi danh sách
        } catch (error) {
            console.error('Error approving account:', error);  // Xử lý lỗi nếu có
        } finally {
            setLoading(false);  // Kết thúc quá trình duyệt
        }
    };

    const handleReject = async (accountId) => {
        try {
            setLoading(true);  // Bắt đầu quá trình từ chối
            const data = { confirm_status: "Rejected" };
            await approvalAlumnis(token, accountId, data);  // Từ chối tài khoản
            setAccounts(accounts.filter(account => account.account.user.id !== accountId));  // Xóa tài khoản đã từ chối khỏi danh sách
        } catch (error) {
            console.error('Error rejecting account:', error);  // Xử lý lỗi nếu có
        } finally {
            setLoading(false);  // Kết thúc quá trình từ chối
        }
    };

    function processImageURL(url) {
        // Xử lý hình ảnh (nếu có lỗi với URL, thay thế bằng ảnh mặc định)
        if (url) {
            return url.replace('image/upload/', '');
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.accountItem}>
            <Image source={{ uri: processImageURL(item.account.avatar) }} style={styles.avatar} />
            <View style={styles.infoContainer}>
                <Text style={styles.fullName}>{item.account.full_name}</Text>
                <Text style={styles.dateText}>Ngày tham gia: {item.account.created_date}</Text>
                <Text style={styles.dateText}>Mã sinh viên: {item.alumni_account_code}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item.account.user.id)}>
                    <Text style={styles.buttonText}>✔</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.account.user.id)}>
                    <Text style={styles.buttonText}>✖</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Xét duyệt tài khoản</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : accounts.length === 0 ? (
                <Text style={styles.noAccountsText}>Không có tài khoản nào để xét duyệt</Text> 
            ) : (
                <FlatList
                    data={accounts}  // Hiển thị tất cả tài khoản chờ duyệt
                    keyExtractor={(item) => item.account.user.id.toString()}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 50,
    },
    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    fullName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 14,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    approveButton: {
        backgroundColor: 'green',
        borderRadius: 20,
        padding: 10,
        marginRight: 10,
    },
    rejectButton: {
        backgroundColor: 'red',
        borderRadius: 20,
        padding: 10,
    },
    buttonText: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },
    noAccountsText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ApprovalScreen;
