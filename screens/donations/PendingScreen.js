import { StyleSheet } from 'react-native';
import React from 'react';
import ViewScreen from './pending/ViewScreen';
import ListScreen from './pending/ListScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const PendingScreen = () => {
    return (
        <Stack.Navigator initialRouteName='List'>
            <Stack.Screen
                name='List'
                component={ListScreen}
                options={{ title: 'Pending' }}
            />
            <Stack.Screen
                name='View'
                component={ViewScreen}
                options={{ title: '' }}
            />
        </Stack.Navigator>
    );
};

export default PendingScreen;

const styles = StyleSheet.create({});
