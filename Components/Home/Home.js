import { View, Text,map } from "react-native";
import styles from "../../styles/styles";
import { useEffect, useState } from "react";
import { fetchUsers } from "../../configs/API/userApi";
import { FlatList } from "react-native-gesture-handler";

export default function Home() {

    const [users,setUsers] = useState([]);
    
    /*useEffect( () =>{
        fetchUsers().then((data)=>{
            setUsers(data);
        }).catch((err)=>{
            console.error("Error fetching users: ", err)
        })
    },[]);*/
    
    return(
        <View style={styles.container}>
            <View>
                <FlatList
                data = {users}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <View>
                     <Text>{item.name}</Text>   
                    </View>
                )}
                />
            </View>
        </View>
    )
}

