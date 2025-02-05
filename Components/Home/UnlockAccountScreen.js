import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { getToken } from '../../configs/api';  
import { updateAccountt } from '../../configs/API/userApi';
import { updateUserr } from '../../configs/API/userApi';

const UnlockAccountScreen = () => {
    const [accounts, setAccounts] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [token, setToken] = useState(null);      
    const [nextPage, setNextPage] = useState(null);

   // Lay token
    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

 
    useEffect(() => {
        if (token) {
            fetchAllAccounts();  
        }
    }, [token]);

    const fetchAllAccounts = async () => {
        try {
            setLoading(true); 
            let allAccounts = [];  
            let currentPage = 'https://socialapp130124.pythonanywhere.com//accounts/'; 

            while (currentPage) {
                const response = await axios.get(currentPage, {
                    headers: { Authorization: `Bearer ${token}` }, 
                });

                const lockedAccounts = response.data.results.filter(item => !item.account_status);  
                allAccounts = [...allAccounts, ...lockedAccounts];  

                currentPage = response.data.next;  
            }

            setAccounts(allAccounts);  
        } catch (error) {
            console.error('Error fetching accounts:', error); 
        } finally {
            setLoading(false); 
        }
    };

    const handleUnlock = async (accountId) => {
        if (token) {
            try {
                setLoading(true);  
                const data1 = { account_status: true};
                const currentDate = new Date();
                const isoDateString = currentDate.toISOString();
                const data2 = { last_login: isoDateString }
                await updateAccountt(token,accountId,data1)
                await updateUserr(token,accountId,data2)
                setAccounts(accounts.filter(account => account.user.id !== accountId));  
            } catch (error) {
                console.error('Error unlocking account:', error);  
            } finally {
                setLoading(false);  
            }
        }
    };

    function processImageURL(url) {
        // Xử lý URL ảnh
        if (url) {
            return url.replace('image/upload/', '');
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.accountItem}>
            <Image source={{ uri: processImageURL(item.avatar) }} style={styles.avatar} />
            <View style={styles.infoContainer}>
                <Text style={styles.fullName}>{item.full_name}</Text>
                <Text style={styles.dateText}>Ngày tham gia: {item.created_date}</Text>
                <Text style={styles.dateText}>Mã sinh viên: {item.user.username}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.unlockButton} onPress={() => handleUnlock(item.user.id)}>
                    <Text style={styles.buttonText}>Mở khóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mở khóa tài khoản</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : accounts.length === 0 ? (
                <Text style={styles.noAccountsText}>Không có tài khoản nào bị khóa</Text>
            ) : (
                <FlatList
                    data={accounts}  
                    keyExtractor={(item) => item.user.id.toString()}
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
    unlockButton: {
        backgroundColor: 'blue',
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

export default UnlockAccountScreen;
