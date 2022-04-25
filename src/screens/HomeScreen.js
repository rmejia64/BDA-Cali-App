import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../auth/Auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PendingScreen from './donations/PendingScreen';
import AcceptedScreen from './donations/AcceptedScreen';
import SettingsScreen from './settings/SettingsScreen';
import PickupScreen from './donations/PickupScreen';
import PickedupScreen from './donations/PickedupScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
    let [user] = useState(AuthContext);
    user = user._currentValue.user;

    return (
        <Tab.Navigator
            initialRouteName={
                user.data.type === 'driver' ? 'Recoger' : 'Pendiente'
            }
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Recoger') {
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
            {user.data.type === 'driver' ? (
                <Tab.Screen name='Recoger' component={PickupScreen} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
