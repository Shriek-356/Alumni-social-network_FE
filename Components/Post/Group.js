import { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    Alert,
    TextInput,
    StyleSheet,
} from "react-native";
import { getToken } from "../../configs/api";
import { createdGroup, invitedGroups, invitedMembers } from "../../configs/API/PostInvitedApi";
import { CurrentUserContext } from "../../App";
import { getAlumnis } from "../../configs/API/userApi";
import { getAllGroup } from "../../configs/API/PostInvitedApi";
import { PostInvitedContext } from "../../App";

const Group = () => {
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [alumnis, setAlumnis] = useState([]);
    const [selectedAlumnis, setSelectedAlumnis] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [currentUser] = useContext(CurrentUserContext);
    const [groups, setGroups] = useState([]); // Danh sách nhóm
    const [selectedGroups, setSelectedGroups] = useState([]); // Nhóm được chọn
    const [postInvitedId] = useContext(PostInvitedContext)
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
            fetchAlumnis(userToken);
            fetchGroups(userToken);
        };
        fetchToken();
    }, []);

    const fetchGroups = async (token) => {
        try {
            const response = await getAllGroup(token);
            

            if (response && response.results) {
                setGroups(response.results);
            } else {
                setGroups([]);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    const fetchAlumnis = async (token) => {
        try {
            const response = await getAlumnis(token);
            

            if (response && response.results) {
                setAlumnis(response.results);
            } else {
                setAlumnis([]);
            }
        } catch (error) {
            console.error("Error fetching alumni:", error);
        }
    };

    const toggleSelectAlumni = (id) => {
        setSelectedAlumnis((prev) =>
            prev.includes(id) ? prev.filter((alumniId) => alumniId !== id) : [...prev, id]
        );
    };

    const toggleSelectGroup = (id) => {
        setSelectedGroups((prev) =>
            prev.includes(id) ? prev.filter((groupId) => groupId !== id) : [...prev, id]
        );
    };

    const handleInvite = async () => {
        if (!postInvitedId) {
            Alert.alert("Lỗi", "Không tìm thấy Post Invitation ID!");
            return;
        }
    
        if (selectedAlumnis.length === 0 && selectedGroups.length === 0) {
            Alert.alert("Thông báo", "Vui lòng chọn ít nhất một alumni hoặc một nhóm để gửi lời mời");
            return;
        }
    
        setLoading(true);
        try {
            // Gửi lời mời cho các nhóm
            if (selectedGroups.length > 0) {
                await invitedGroups(token, postInvitedId, selectedGroups);
            }
    
            // Gửi lời mời cho các alumni
            if (selectedAlumnis.length > 0) {
                await invitedMembers(token, postInvitedId, selectedAlumnis);
            }
    
            Alert.alert("Thành công", "Lời mời đã được gửi thành công!");
            setSelectedAlumnis([]);
            setSelectedGroups([]);
        } catch (error) {
            console.error("Error sending invitations:", error);
            Alert.alert("Lỗi", "Không thể gửi lời mời, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập tên nhóm");
            return;
        }
        if (selectedAlumnis.length === 0) {
            Alert.alert("Thông báo", "Vui lòng chọn ít nhất một alumni để tạo nhóm");
            return;
        }
        setLoading(true);
        try {
            const groupData = {
                name: groupName,
                members: selectedAlumnis,
            };
            await createdGroup(token, groupData);
            Alert.alert("Thành công", "Nhóm đã được tạo thành công!");

            await fetchGroups(token);
            setSelectedAlumnis([]);
            setGroupName("");
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tạo nhóm, vui lòng thử lại!");
        }
        setLoading(false);
    };
    const handleRefreshGroups = async()=>{
        setIsRefreshing(true);
        await fetchGroups(token);
        setIsRefreshing(false);
    }

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Nhập tên nhóm</Text>
        <TextInput
            style={styles.input}
            placeholder="Nhập tên nhóm"
            value={groupName}
            onChangeText={setGroupName}
        />

        <Text style={styles.title}>Chọn Cựu Sinh Viên để thêm vào nhóm</Text>
        <FlatList
            data={alumnis}
            keyExtractor={(item) => item.account?.user?.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
                item.account ? (
                    <TouchableOpacity
                        style={[styles.alumniItem, selectedAlumnis.includes(item.account.user.id) && styles.selected]}
                        onPress={() => toggleSelectAlumni(item.account.user.id)}
                    >
                        <Image 
                            source={{ uri: item.account.avatar.replace("image/upload/", "") }} 
                            style={styles.avatar} 
                        />
                        <Text style={styles.fullName}>{item.account.full_name}</Text>
                    </TouchableOpacity>
                ) : null
            )}
        />

        <Text style={styles.title}>Danh sách các nhóm</Text>
        <FlatList
            data={groups}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[styles.groupItem, selectedGroups.includes(item.id) && styles.selected]}
                    onPress={() => toggleSelectGroup(item.id)}
                >
                    <Text style={styles.groupName}>{item.name}</Text>
                </TouchableOpacity>
            )}
            refreshing={isRefreshing}
            onRefresh={handleRefreshGroups}
        />

            <TouchableOpacity
                style={styles.inviteButton}
                onPress={handleInvite}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? "Đang gửi..." : "Gửi lời mời"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateGroup}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? "Đang tạo..." : "Chọn các cựu sinh viên Tạo nhóm "}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingLeft: 20,
        paddingBottom: 20,
        paddingRight: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    alumniItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    selected: {
        backgroundColor: "#cce5ff",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    fullName: {
        fontSize: 16,
    },
    groupItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 10,
        borderRadius: 5,
    },
    groupName: {
        fontSize: 16,
    },
    inviteButton: {
        marginTop: 20,
        backgroundColor: "#007bff",
        padding: 15,
        alignItems: "center",
        borderRadius: 5,
    },
    createButton: {
        marginTop: 20,
        backgroundColor: "#28a745",
        padding: 15,
        alignItems: "center",
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Group;
