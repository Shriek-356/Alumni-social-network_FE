import { View, Text, map } from "react-native";
import Styles from "./Styles";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
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
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import axios from "axios";

export default function Home() {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState();
    const [currentUser, setCurrentUser] = useContext(CurrentUserContext)
    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)
    const [totalReactionAccountt, setTotalReactionAccountt] = useContext(TotalReactionAccountContext)
    const [nextPage, setNextPage] = useState()


    const handleDeletePost = async (postId) => {
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
                setNextPage(data.next)
                const detailsPosts = postsData.map((post) => ({
                    ...post,
                    avatar: post.account.avatar,
                    full_name: post.account.full_name
                }));
                setPosts(detailsPosts);
                console.log(detailsPosts)
            } catch (err) {
                console.log("Error fetch Posts: ", err);
            } finally {
                setLoading(false);
            }
        }
    }, [token]);

    const loadMorePosts = async () => {
        if (nextPage && token) {
            try {
                let responsee = await axios.get(nextPage, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                let postsData = responsee.data.results
                const detailsPosts = postsData.map((post) => ({
                    ...post,
                    avatar: post.account.avatar,
                    full_name: post.account.full_name
                }));
                setPosts([...posts, ...detailsPosts])
                setNextPage(responsee.data.next)
            }
            catch (error) {
                console.log("Error load more posts: ", error)
            }
        }
    }

    //khi nguoi dung quay lai tab Home thi fetch lai posts va tat ca bai viet da cam xuc
    useFocusEffect(
        React.useCallback(() => {
            fetchPosts();
            fetchReactionsAccount();
        }, [token])
    );

    const fetchReactionsAccount = useCallback(async () => {
        try {
            let response = await getTotalReactionsAccountt(token, currentAccountUser.user.id)
            await setTotalReactionAccountt(response)
        }
        catch (error) {
            console.log("Error get all reactions account: ", error)
        }
    }, [currentUser, token, posts])


    return (
        <View style={Styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <RenderPost item={item} onDelete={() => handleDeletePost(item.id)} />}
                />
            )}

            {/* Tai them bai viet */}
            {nextPage ? (<TouchableOpacity style={styless.loadMoreButton} onPress={loadMorePosts}>
                <Text style={styless.loadMoreText}>Xem thêm bài viết</Text>
            </TouchableOpacity>) : <Text></Text>}

        </View>
    )
}

const styless = StyleSheet.create({
    loadMoreButton: {
        backgroundColor: '#FF9900', 
        paddingVertical: 10, 
        paddingHorizontal: 20,
        borderRadius: 15, 
        alignItems: 'center', 
        marginVertical: 10, 
    },
    loadMoreText: {
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold', 
    },
});

