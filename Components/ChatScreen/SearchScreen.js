import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { searchUserss } from '../../configs/API/userApi';
import { useEffect } from 'react';
import { getToken } from '../../configs/api';
import { Image } from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [token, setToken] = useState()
    const navigation = useNavigation()

    function processImageURL(url) {
        //Sau nay neu co anh mac dinh thi thay bang anh mac dinh neu bi loi
        if (url) {
            return url.replace('image/upload/', '')
        }
    }

    //Lay token
    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }
        if (token) {
            try {
                let response = await searchUserss(token, query)
                setSearchResults(response);
            }
            catch (error) {
                console.log("Error search users: ", error)
            }
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            {searchResults ? (
                <FlatList
                data={searchResults}
                keyExtractor={(item) => item.user.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.userItem}>
                        <Image source={{ uri: processImageURL(item.avatar) }} style={styles.avatar} />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName} onPress={()=>navigation.navigate('Profile',{thisAccount: item})}>{item.full_name}</Text>
                            <Text style={styles.userDetail}>
                                ✅ Tham gia: {moment(item.created_date).format('DD/MM/YYYY')}
                            </Text>
                            <Text style={styles.userDetail}>
                                🎂 Sinh nhật: {moment(item.date_of_birth).format('DD/MM/YYYY')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
            ) : <Text></Text>}
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 10,
        marginTop: 40,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    userDetail: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
});

export default SearchScreen
