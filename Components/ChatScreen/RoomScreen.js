import { useEffect, useState } from "react"
import { getRoombyAccount,createMultipleRooms } from "../../configs/API/roomApi";
import { Button, FlatList, Text, View } from "react-native";

const RoomScreen = ({navigation,firstUserId}) => {
    const [rooms, setRooms] = useState([]);
    const [loading,setLoading] = useState(false);
    const [roomsCreated, setRoomsCreated] = useState(false);
    const [token, setToken] = useState();
    
//Lấy token


    useEffect(() => {
        setLoading(true);
        getRoombyAccount(firstUserId, token)
          .then((roomsData) => {
            setRooms(roomsData.results);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }, [firstUserId, token]);

      useEffect(()=>{
        const AutoCreateRooms = async () => {
            setLoading(true);
        try{
            if(!roomsCreated){
                await createMultipleRooms(firstUserId,token);
                setRoomsCreated(true);

            }
            const roomsData = await getRoombyAccount(firstUserId,token);
            setRooms(roomsData.results);
        }catch (error) {
            console.error("Error:", error);
        }finally {
            setLoading(false);
        }
    };
    AutoCreateRooms();
},[firstUserId,token,roomsCreated]);
    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        fetchToken();
    }, []);

    
    //Dieu huong ve ChatScreen

    // const enterRoom= (roomId) => {
    //     navigation.navigate('ChatScreen',{roomId})
    // };
    return(
        <View>
            <Text>Danh sách các đoạn chat</Text>
            {loading ? ( <Text>Đang tải...</Text>):(
                <FlatList keyExtractor={item => item.id.toString()} data={rooms} renderItem={({item})=> (
                    <View>
                        <Text>{item.second_user.full_name} </Text>
                    </View>
                )}/>
            )}
            
               
            
        </View>
    )
}
export default RoomScreen;