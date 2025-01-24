import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../Home/Home';
import Account from '../Home/Account';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { View } from 'react-native';
import Header from '../Layout/Header';

const Tab = createBottomTabNavigator();

export default function AllView() {
    return (
        
        <Tab.Navigator screenOptions={{
                    header: () => <Header />, // Thêm Header cho tất cả các tab
                }}>
            <Tab.Screen 
                name="Home" 
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Account" 
                component={Account}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
        
    );
}
