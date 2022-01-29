import { StyleSheet } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CreateScreen from './donations/CreateDonationScreen';
import PendingScreen from './donations/PendingScreen';
import AcceptedScreen from './donations/AcceptedScreen';
import SettingsScreen from './settings/SettingsScreen';

const HomeScreen = () => {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Pending') {
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
            })}
        >
            <Tab.Screen name='Create' component={CreateScreen} />
            <Tab.Screen name='Pending' component={PendingScreen} />
            <Tab.Screen name='Accepted' component={AcceptedScreen} />
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
