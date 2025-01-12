
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    headerLogo:{
        width:100,
        height:100,
        alignSelf:'center'
    },
    header:{
        marginTop:80
    },   

    titleText:{
        fontWeight:"bold",
        fontSize:35,
        textAlign:'center',
        marginTop:30,
        color:'#0033CC'
    },

    form:{
        marginTop:50,
        flex:1,
        marginBottom:50
    },

    inputLabel:{
        fontWeight:"bold",
        fontSize:18
    },
    
    inputControl:{
        backgroundColor:'white',
        marginTop:15,
        borderRadius:18,
        fontWeight:500,
        fontSize:15,
        paddingHorizontal:15,
        widtd:15
    },

    button:{
        backgroundColor:'#0099FF',
        borderRadius:10,
        borderWidth:0.5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:10,
    },

    textButton:{
        fontSize:20,
        color:'#FFFFFF'
    },

    textFooter:{
        fontSize:15,
        textAlign:'center'
    }

})