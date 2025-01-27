import { View, Text, map } from "react-native";
import styles from "../../styles/styles";
import Styles from "./Styles";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { getUserPostss } from "../../configs/API/userApi";
import { getToken } from "../../configs/api";
import { useContext } from "react";
import React from "react";
import { CurrentAccountUserContext, CurrentAlumniAccountContext, CurrentUserContext } from "../../App";
import RenderPost from "../Post/Post";
import { getAllPostss, getTotalReactionsAccountt } from "../../configs/API/PostApi";
import { TotalReactionAccountContext } from "../../App";
import { useFocusEffect } from "@react-navigation/native";
import { deletePosts } from "../../configs/API/PostApi";
import { useCallback } from "react";

export default function Home() {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState();
    const [currentUser, setCurrentUser] = useContext(CurrentUserContext)
    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)
    const [currentAlumniAccount, setCurrentAlumniAccount] = useContext(CurrentAlumniAccountContext)
    const [totalReactionAccountt, setTotalReactionAccountt] = useContext(TotalReactionAccountContext)


    const handleDeletePost = async (postId) => {
        console.log('a')
        try {
            setLoading(true);
            await deletePosts(token, postId);
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); //Loai bo bai viet da xoa trong state posts
        } catch (error) {
            console.log("Error deleting post:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
            console.log(token)
        };
        fetchToken();
    }, []);

    const fetchPosts = useCallback(async () => {
        if (token) {
            setLoading(true);
            try {
                const data = await getAllPostss(token);
                const postsData = data.results;
                const detailsPosts = postsData.map((post) => ({
                    ...post,
                    avatar: post.account.avatar,
                    full_name: post.account.full_name
                }));
                setPosts(detailsPosts);
            } catch (err) {
                console.log("Error fetch Posts: ", err);
            } finally {
                setLoading(false);
            }
        }
    }, [token]);

    //khi nguoi dung quay lai tab Home thi fetch lai posts va tat ca bai viet da cam xuc
    useFocusEffect(
        React.useCallback(() => {
            fetchPosts();
            fetchReactionsAccount();
        }, [token])  
    );

    const fetchReactionsAccount = useCallback(async () => {
            try {
                let response = await getTotalReactionsAccountt(token, currentUser.id)
                await setTotalReactionAccountt(response)
            }
            catch (error) {
                console.log("Error get all reactions account: ", error)
            }
    }, [currentUser, token,posts])


    return (
        <View style={Styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <RenderPost item={item} onDelete={()=>handleDeletePost(item.id)} />}
                />
            )}
        </View>
    )
}

