
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import VectorIcon from '../../utils/VectorIcon';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import logo from '../../assets/logo.png';

const Header =  () => {
    const navigation = useNavigation()
    return (
        <View style={styles.headerContainer}>
            <Image source={logo} style={styles.LogoStyle} />
            <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('SearchScreen')}>
                    <View>
                        <VectorIcon
                            name="search-sharp"
                            type="Ionicons"
                            size={25}
                            color="#3A3A3A"
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBg} onPress={() => navigation.navigate('RoomScreen')}>
                    <View>
                        <VectorIcon
                            name="chatbubble"
                            type="Ionicons"
                            size={25}
                            color="#3A3A3A"
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    LogoStyle: {
        height:40,
        width:100, 
        resizeMode: 'contain'

    },
    icon:{
        height:35,
        width:35,
        borderRadius:50,
        justifyContent:'center',
        alignContent:'center',
        marginLeft:10,
    },
    headerContainer:{
        backgroundColor: ' #FFFFFF',
        paddingTop:10,
        paddingLeft:10,
        paddingRight:15,
        marginTop:30,
        flexDirection:'row',
        justifyContent:'space-between',


    },
    headerIcons:{
        flexDirection:'row',
    }
});
export default Header;