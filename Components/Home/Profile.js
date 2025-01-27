import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getToken } from '../../configs/api';
import { CurrentAccountUserContext } from '../../App';
import { useContext } from 'react';
import { ActivityIndicator } from 'react-native';
import { getUserPostss } from '../../configs/API/userApi';
import RenderPost from "../Post/Post";
import { deletePosts } from '../../configs/API/PostApi';
import { getTotalReactionsAccountt } from '../../configs/API/PostApi';
import { TotalReactionAccountContext } from '../../App';


const Profile = ({ route }) => {

    const [loading, setLoading] = useState(true)

    const [posts, setPosts] = useState([])
    const { thisAccount } = route.params;
    const [token, setToken] = useState();
    const [currentAccountUser, setCurrentAccountUser] = useContext(CurrentAccountUserContext)
    const [totalReactionAccountt, setTotalReactionAccountt] = useContext(TotalReactionAccountContext)

    const isOwner = thisAccount.user === currentAccountUser.user

    useEffect(() => {
            const fetchReactionsAccount = async () => {
                try {
                    let response = await getTotalReactionsAccountt(token, thisAccount.id)
                   await setTotalReactionAccountt(response)
                }
                catch (error) {
                    console.log("Error get all reactions account: ", error)
                }
            }
            fetchReactionsAccount()
        }, [ token,posts])

    //lay token
    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

    //Lay bai viet cua thisAccount
    useEffect(() => {
        const fetchPosts = async () => {
            if (token) {
                try {
                    let data = await getUserPostss(token, thisAccount.user)
                    const postsData = data
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
    }, [token, thisAccount]);//chay lai khi token thay doi, tuc la khi token duoc cap nhat

    function test() {
        console.log(thisAccount)
    }

    useEffect(() => {
            const fetchReactionsAccount = async () => {
                try {
                    let response = await getTotalReactionsAccountt(token, thisAccount.user)
                    setTotalReactionAccountt(response)
                }
                catch (error) {
                    console.log("Error get all reactions account: ", error)
                }
            }
            fetchReactionsAccount()
        }, [token,posts])

    function processImageURL(url) {
        //Sau nay neu co anh mac dinh thi thay bang anh mac dinh neu bi loi
        if (url) {
            return url.replace('image/upload/', '')
        }
    }

    const handleDeletePost = async (postId) => {
        console.log('a')
        try {
            setLoading(true);
            await deletePosts(token, postId);
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); // Loai bo bai viet da xoa trong state posts
            console.log(posts)
        } catch (error) {
            console.log("Error deleting post:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            {thisAccount
                && thisAccount.cover_avatar ? (
                <Image
                    source={{ uri: processImageURL(thisAccount.cover_avatar) }}
                    style={styles.coverImage}
                />
            ) : (
                <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Logo_DH_M%E1%BB%9F_TPHCM.png' }} // URL của ảnh mặc định
                    style={styles.coverImage}
                />
            )}

            {/* avatar va ten */}
            <View style={styles.profileInfo}>
                {thisAccount && thisAccount.avatar ? (
                    <Image source={{ uri: processImageURL(thisAccount.avatar) }}
                        style={styles.avatar} />
                ) : (
                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Logo_DH_M%E1%BB%9F_TPHCM.png' }}
                        style={styles.avatar} />
                )}
                <Text style={styles.userName}>{thisAccount.full_name || "UserName"}</Text>
            </View>

            {isOwner ? (<TouchableOpacity style={styles.createPostButton}
                onPress={test}
            >
                <Text style={styles.createPostText}>Tạo bài viết</Text>
            </TouchableOpacity>) : (
                <Text></Text>
            )}

            {posts&&Array.isArray(posts)&&posts.length>0 ? (<View style={styles.container}>
                {loading && !thisAccount ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <RenderPost item={item} onDelete={() => handleDeletePost(item.id)} />
                        )}
                    />
                )}
            </View>) : (
                <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                    <Text style={{color:'#888888', fontSize:18, fontWeight:'bold'}}>Chưa có bài viết</Text>
                </View>
            )}
            

        </View>
    );
};

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        padding: 15
    },
    coverImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    profileInfo: {
        alignItems: 'center',
        marginTop: -50,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#fff',
        marginBottom: 10,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    bio: {
        fontSize: 14,
        color: '#888',
    },
    createPostButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    createPostText: {
        color: '#fff',
        fontWeight: '600',
    },
    post: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    postContent: {
        fontSize: 16,
        color: '#333',
    },
});