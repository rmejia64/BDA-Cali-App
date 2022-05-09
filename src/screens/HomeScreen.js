import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PendingScreen from './donations/PendingScreen';
import AcceptedScreen from './donations/AcceptedScreen';
import SettingsScreen from './settings/SettingsScreen';
import PickupScreen from './donations/PickupScreen';
import PickedupScreen from './donations/PickedupScreen';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
    const data = useSelector((state) => state.user.data);

    return (
        <Tab.Navigator
            initialRouteName={data.type === 'driver' ? 'Recoger' : 'Pendiente'}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Recogidas') {
                        iconName = focused ? 'truck' : 'truck-outline';
                    } else if (route.name === 'Pendiente') {
                        iconName = focused
                            ? 'account-clock'
                            : 'account-clock-outline';
                    } else if (route.name === 'Recogiendo') {
                        iconName = focused ? 'truck' : 'truck-outline';
                    } else if (route.name === 'Recogido') {
                        iconName = focused
                            ? 'truck-check'
                            : 'truck-check-outline';
                    } else if (route.name === 'Ajustes') {
                        iconName = focused ? 'cog' : 'cog-outline';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                headerShown: false,
            })}
        >
            {data.type === 'driver' ? (
                <Tab.Screen name='Recogidas' component={PickupScreen} />
            ) : (
                <>
                    <Tab.Screen name='Pendiente' component={PendingScreen} />
                    <Tab.Screen name='Recogiendo' component={AcceptedScreen} />
                    <Tab.Screen name='Recogido' component={PickedupScreen} />
                </>
            )}
            <Tab.Screen name='Ajustes' component={SettingsScreen} />
        </Tab.Navigator>
    );
};

export default HomeScreen;
