import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../auth/Auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CreateScreen from './donations/CreateDonationScreen';
import PendingScreen from './donations/PendingScreen';
import AcceptedScreen from './donations/AcceptedScreen';
import SettingsScreen from './settings/SettingsScreen';
import PickupScreen from './donations/PickupScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
    let [user] = useState(AuthContext);
    user = user._currentValue.user;

    return (
        <Tab.Navigator
            initialRouteName='Pending'
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Pickup') {
                        iconName = focused ? 'truck' : 'truck-outline';
                    } else if (route.name === 'Pending') {
                        iconName = focused
                            ? 'account-clock'
                            : 'account-clock-outline';
                    } else if (route.name === 'Accepted') {
                        iconName = focused
                            ? 'account-check'
                            : 'account-check-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'cog' : 'cog-outline';
                    } else if (route.name === 'Create') {
                        iconName = focused ? 'pencil' : 'pencil-outline';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                headerShown: false,
            })}
        >
            {user.type === 'Administrator' ? (
                <Tab.Screen name='Create' component={CreateScreen} />
            ) : (
                <></>
            )}
            {user.type === 'Driver' ? (
                <Tab.Screen name='Pickup' component={PickupScreen} />
            ) : (
                <></>
            )}
            {user.type === 'Driver' ? (
                <></>
            ) : (
                <Tab.Screen name='Pending' component={PendingScreen} />
            )}

            {user.type === 'Driver' ? (
                <></>
            ) : (
                <Tab.Screen name='Accepted' component={AcceptedScreen} />
            )}
            <Tab.Screen name='Settings' component={SettingsScreen} />
        </Tab.Navigator>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
