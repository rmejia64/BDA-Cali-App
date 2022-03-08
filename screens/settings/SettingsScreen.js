import { StyleSheet, Text, View } from 'react-native';
import SettingsListScreen from './SettingsListScreen';
import EditAccountScreen from './EditAccountScreen';
import CreateAccountScreen from './CreateAccountScreen';
import LanguageScreen from './LanguageScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

const SettingsScreen = () => {
    return (
        <Stack.Navigator initialRouteName='SettingsList'>
            <Stack.Screen
                name='SettingsList'
                component={SettingsListScreen}
                options={{ title: 'Settings' }}
            />
            <Stack.Screen
                name='EditAccount'
                component={EditAccountScreen}
                options={{ title: 'My Account' }}
            />
            <Stack.Screen
                name='CreateAccount'
                component={CreateAccountScreen}
                options={{ title: 'Create Account' }}
            />
            <Stack.Screen
                name='Language'
                component={LanguageScreen}
                options={{ title: 'Language' }}
            />
        </Stack.Navigator>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
