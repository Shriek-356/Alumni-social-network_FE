import { useContext, useEffect, useState } from "react";
import { RoomContext } from "../../App";
import { Text, View, StyleSheet, Image, FlatList, ActivityIndicator } from "react-native";
import { getMessbyRoom } from "../../configs/API/roomApi";
import { useNavigation } from "@react-navigation/native";
import { getToken } from "../../configs/api";

const ChatScreen = () => {
    const [mess, setMess] = useState([]);
    const [room] = useContext(RoomContext);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [nextPage, setNextPage] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

    useEffect(() => {
        const fetchMess = async () => {
            if (token && room) {
                try {
                    setLoading(true);
                    const response = await getMessbyRoom(token, room.id);
                    if (response && response.results) {
                        setMess(response.results);
                        setNextPage(response.next);
                    }
                } catch (error) {
                    console.log("Error fetching messages", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchMess();
    }, [token, room]);

    const loadMoreMess = async () => {
        if (nextPage && !loadingMore) {
            try {
                setLoadingMore(true);
                const response = await fetch(nextPage, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (data && data.results) {
                    setMess((prevMess) => [...prevMess, ...data.results]);
                    setNextPage(data.next);
                }
            } catch (error) {
                console.log("Error loading more messages", error);
            } finally {
                setLoadingMore(false);
            }
        }
    };
    //Chưa xử lý seen

    const renderMessItem = ({ item }) => {
        const isCurrentUser = item.who_sent.user.id === room.first_user.user.id;
        return (
            <View
                style={[
                    styles.messageContainer,
                    isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
                ]}
            >
                <View style={styles.avatarContainer}>
                    <Image
                        source={{
                            uri: isCurrentUser ? room.first_user.avatar : room.second_user.avatar,
                        }}
                        style={styles.avatar}
                    />
                </View>

                <View style={styles.messageContent}>
                    <Text style={styles.messageText}>{item.content}</Text>
                    <Text style={styles.timestamp}>
                        {new Date(item.timestamp).toLocaleString()}
                    </Text>
                    {item.seen && <Text style={styles.seen}>Đã xem</Text>}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tin nhắn</Text>
            
            <Text style={styles.roomInfo}>{room?.second_user?.full_name}</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : mess.length === 0 ? (
                <Text>Không có tin nhắn nào</Text>
            ) : (
                <FlatList
                    data={mess}
                    renderItem={renderMessItem}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={loadMoreMess}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loadingMore && <ActivityIndicator size="small" />}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    roomInfo: {
        fontSize: 16,
        marginBottom: 5,
    },
    messageContainer: {
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
        marginVertical: 5,
    },
    currentUserMessage: {
        justifyContent: "flex-end",
        alignSelf: "flex-end",
    },
    otherUserMessage: {
        justifyContent: "flex-start",
        alignSelf: "flex-start",
    },
    avatarContainer: {
        marginRight: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    messageContent: {
        maxWidth: "80%",
        backgroundColor: "#f0f0f0",
        padding: 10,
        borderRadius: 10,
    },
    messageText: {
        fontSize: 14,
        color: "#333",
    },
    timestamp: {
        fontSize: 10,
        color: "#aaa",
        marginTop: 5,
    },
    seen: {
        fontSize: 10,
        color: "green",
        marginTop: 5,
    },
});

export default ChatScreen;
