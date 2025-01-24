import { View, Text, map } from "react-native";
import styles from "../../styles/styles";
import Styles from "./Styles";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { getUserPostss } from "../../configs/API/userApi";
import { getToken } from "../../configs/api";
import { useContext } from "react";
import { CurrentAccountUserContext, CurrentAlumniAccountContext, CurrentUserContext } from "../../App";
import RenderPost from "../Post/Post";
import { getAllPostss } from "../../configs/API/PostApi";
export default function Home() {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState();
    const [currentUser, setCurrentUser] = useContext(CurrentUserContext)
    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)
    const [currentAlumniAccount, setCurrentAlumniAccount] = useContext(CurrentAlumniAccountContext)

    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            if (token) {
                try {
                    let data = await getAllPostss(token)
                    console.log('Ds: ', data.results)
                    const postsData = data.results

                    //Lay data bai viet xong thi lay thong tin account cua bai viet do
                    const detailsPosts = postsData.map((post) => ({
                        ...post,
                        avatar: post.account.avatar,
                        full_name: post.account.full_name
                    }));
                    setPosts(detailsPosts)
                } catch (err) {
                    console.log("Error fetch Posts: ", err)
                }
                finally {
                    setLoading(false)
                }
            }
        }
        fetchPosts()
    }, [token]);//chay lai khi token thay doi, tuc la khi token duoc cap nhat


    return (
        <View style={Styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <RenderPost item={item} />}
                />
            )}
        </View>
    )
}

