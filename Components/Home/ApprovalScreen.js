import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getToken } from '../../configs/api';
import { approvalAlumnis } from '../../configs/API/userApi';
import { getAlumnis } from '../../configs/API/userApi';
import axios from 'axios';
const ApprovalScreen = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [nextPage, setNextPage] = useState('')

    //Lay token
    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

    useEffect(() => {
        if (token) {
            fetchPendingAccounts();
        }
    }, [token]);

    const fetchPendingAccounts = async () => {
        try {
            setLoading(true);
            const response = await getAlumnis(token)
            const pendingAccounts = response.results.filter(item => item.confirm_status === "PENDING");
            setAccounts(pendingAccounts);
            setNextPage(response.next)         
        } catch (error) {
            console.error('Error fetching pending accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreAccounts = async()=>{
        if (nextPage && token) {
            try {
                let respone = await axios.get(nextPage, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const newAccounts = respone.data.results.filter(item => item.confirm_status === "PENDING");
                setAccounts([...accounts, ...newAccounts])
                setNextPage(respone.data.next);
            }
            catch (error) {
                console.log("Error fetching MoreAccounts ", error)
            }
        }
    }

    const handleApprove = async (accountId) => {
        try {
            const data ={
                confirm_status: "Confirmed"
            }
            await approvalAlumnis(token, accountId,data);
            setAccounts(accounts.filter(account => account.account.user.id !== accountId));
        } catch (error) {
            console.error('Error approving account:', error);
        }
    };

    const handleReject = async (accountId) => {
        try {
            const data ={
                confirm_status: "Rejected"
            }
            await rejectAccount(token, accountId,data);
            setAccounts(accounts.filter(account => account.account.user.id !== accountId));
        } catch (error) {
            console.error('Error rejecting account:', error);
        }
    };

    function processImageURL(url) {
        //Sau nay neu co anh mac dinh thi thay bang anh mac dinh neu bi loi
        if (url) {
            return url.replace('image/upload/', '')
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
            ) : (
                <FlatList
                    data={accounts}
                    keyExtractor={(item) => item.account.user.id.toString()}
                    renderItem={renderItem}
                />
            )}

            {/* Tải thêm bình luận */}
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreAccounts} >
                <Text style={styles.loadMoreText}>Tải thêm</Text>
            </TouchableOpacity>
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
        marginTop: 50
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
});

export default ApprovalScreen;
