import { StyleSheet, Text, View } from 'react-native';
import SettingsListScreen from './SettingsListScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

const SettingsScreen = () => {
    return (
        <Stack.Navigator initialRouteName='Settings'>
            <Stack.Screen name='Settings' component={SettingsListScreen} />
        </Stack.Navigator>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
