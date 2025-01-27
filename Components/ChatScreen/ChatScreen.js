import { useContext, useEffect, useRef, useState } from "react"
import { CurrentUserContext } from "../../App"
import { useRoute } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import  api , { axiosDAuthApiInstance , endpoints } from "../../configs/api"
import { Image, ScrollView, View } from "react-native"



const ChatScreen = () => {
    const [user, dispatch] = useContext(CurrentUserContext);
    const route = useRoute();
    const { roomId, firstName, lastName, avatar } = route.params;
//Xu ly toi day
    const [message, setMessage] = useState({
        content: "",
        who_sent: user?.id,
        room: roomId
    });
    const [userInfo, setUserInfo] = useState();
    const [messageList, setMessageList] = useState([]);
    const [initialScroll, setInitialScroll] = useState(false);

    const scrollViewRef = useRef();

    const change = (e, field) => {
        setMessage((current) => {
            return { ...current, [field]: e };
        });
    };

    const getCurrenUser = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            let res = await axiosDAuthApiInstance(token).get(endpoints["getCurrentUser"](user.id));
            setUserInfo(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getMessage = async () => {
        try {
            let res = await api.get(endpoints["get-message-by-room"](roomId));
            setMessageList(res.data.results);
            console.log(res.data.results);
        } catch (err) {
            console.log(err);
        }
    };

    const chatSocket = new WebSocket(
        "ws://" + "192.168.1.8:8000" + "/ws/chat/" + roomId + "/"
    );

    const sendMessage = async () => {
        try {
            let res = await api.post(endpoints["send-message"], {
                content: message.content,
                who_sent: userInfo?.id,
                room: roomId,
            });
            console.log(res.data);
            chatSocket.send(JSON.stringify({ message: res.data }));
            setMessage({
                content: "",
                who_sent: userInfo?.id,
                room: roomId,
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCurrenUser();
        chatSocket.onmessage = function (e) {
            const receivedMessage = JSON.parse(e.data).message;
            setMessageList((prevMessageList) => [...prevMessageList, receivedMessage]);
        };
    }, []);

    useEffect(() => {
        setInitialScroll(true);
        getMessage();
    }, []);

    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginVertical: 15,
                    backgroundColor: "white",
                    shadowColor: "#000",
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                    padding: 12,
                    borderRadius: 12,
                }}
            >
                <Image
                    source={{ uri: avatar }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <Text style={{ fontSize: 16 }}>{lastName}</Text>
                    <Text style={{ fontSize: 16 }}>{firstName}</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View>
                    {messageList.map((ml, index) => {
                        const isSentByCurrentUser = ml.who_sent === userInfo?.id;
                        const messageStyle = {
                            backgroundColor: isSentByCurrentUser ? "lightblue" : "lightgray",
                            alignSelf: isSentByCurrentUser ? "flex-end" : "flex-start",
                            marginBottom: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            borderRadius: 10,
                            flexDirection: "row",
                        };
                        return (
                            <View key={index} style={messageStyle}>
                                <Text style={{ fontSize: 16 }}>{ml.content}</Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <View style={styles.replyMessage}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderRadius: 15,
                        justifyContent: "space-between",
                    }}
                >
                    <TextInput
                        placeholder="Enter your message..."
                        value={message.content}
                        onChangeText={(e) => change(e, "content")}
                        numberOfLines={1}
                        style={
                            message.content.length > 0
                                ? styles.inputComment
                                : styles.emptyInputComment
                        }
                    />
                    {message.content.length > 0 && (
                        <TouchableOpacity
                            style={{ width: "10%" }}
                            onPress={() => sendMessage()}
                        >
                            <VectorIcon
                                name="send"
                                type="Ionicons"
                                size={22}
                                color="blue"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

export default ChatScreen;
