import { StyleSheet } from "react-native";

export default StyleSheet.create({

    container_acc:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        padding:16,
        backgroundColor:''
    },
    coverAvatar: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#ffffff',
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 8,
    },

})