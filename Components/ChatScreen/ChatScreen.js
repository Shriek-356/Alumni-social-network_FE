// import { ref } from "firebase/database";
// import { useState } from "react"


// const ChatScreen = () => {
//     const route = useRoute()
//     const [messages, setMessages] = useState([]);
//     const [newMessage,setNewMessage] = useState('');

//     //Gửi tin nhắn
//     const sendMessage = () => {
//         if (newMessage.trim() !== '')
//         {
//             const messageRef = ref(database,'rooms/'+roomId+'messages');
//             const messageId = new Date().getTime(); //Id duy nhất trên time
//             set(messageRef.child(messageId),{
//                 content: newMessage,
//             })
//         }
//     }
// }