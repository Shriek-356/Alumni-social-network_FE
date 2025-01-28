import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { getRoomByAccount } from '../../configs/API/roomApi'; 
import { getToken } from '../../configs/api';
import { CurrentUserContext } from '../../App'; 
import { useNavigation } from '@react-navigation/native';

const ScreenRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [nextPage, setNextPage] = useState(null);
    const [token, setToken] = useState(null);
    const [currentUser] = useContext(CurrentUserContext);
    const navigation = useNavigation();

    
    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

    
    useEffect(() => {
        const fetchRooms = async () => {
            if (token && currentUser) {
                try {
                    setLoading(true);
                    let response = await getRoomByAccount(token, currentUser.id);
                    if (response && response.results) {
                        setRooms(response.results);
                        setNextPage(response.next);
                    }
                } catch (error) {
                    console.log('Error fetching rooms:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchRooms();
    }, [token, currentUser]);

    
    const loadMoreRooms = async () => {
        if (nextPage && !loadingMore) {
            try {
                setLoadingMore(true);
                const response = await fetch(nextPage, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (data && data.results) {
                    setRooms((prevRooms) => [...prevRooms, ...data.results]);
                    setNextPage(data.next);
                }
            } catch (error) {
                console.log('Error loading more rooms:', error);
            } finally {
                setLoadingMore(false);
            }
        }
    };

    // Render từng phòng
    const renderRoomItem = ({ item }) => {
        const cleanedAvatarUrl = item.second_user.avatar.replace('image/upload/', '');

        return (
            <View style={styles.roomItem}>
                <Image source={{ uri: cleanedAvatarUrl }} style={styles.avatar} />
                <View style={styles.infoContainer}>
                    <Text style={styles.roomName}>{item.second_user.full_name}</Text>
                    {item.second_user.account_status && (
                        <View style={styles.statusContainer}>
                            <View style={styles.activeIndicator} />
                            <Text style={styles.statusText}>Đang hoạt động</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={rooms}
                    renderItem={renderRoomItem}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={loadMoreRooms}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore && <ActivityIndicator size="small" color="#0000ff" />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    roomItem: {
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
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    roomName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    activeIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'green',
        marginRight: 5,
    },
    statusText: {
        fontSize: 14,
        color: 'green',
    },
});

export default ScreenRoom;
