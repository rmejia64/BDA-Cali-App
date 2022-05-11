import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListScreen from './driver/ListScreen';
import ViewScreen from './driver/ViewScreen';

const Stack = createNativeStackNavigator();

const PickupScreen = () => {
    const currentDate = new Date().toLocaleDateString('es-CO');

    return (
        <Stack.Navigator initialRouteName='List'>
            <Stack.Screen
                name='List'
                component={ListScreen}
                options={{ title: `Recogidas (${currentDate})` }}
            />
            <Stack.Screen
                name='View'
                component={ViewScreen}
                options={{ title: 'Recoger Info' }}
            />
        </Stack.Navigator>
    );
};

export default PickupScreen;

const styles = StyleSheet.create({});
