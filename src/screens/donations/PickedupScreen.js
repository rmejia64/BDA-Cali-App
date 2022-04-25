import { StyleSheet } from 'react-native';
import React from 'react';
import ListScreen from './pickedup/ListScreen';
import ViewScreen from './pickedup/ViewScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const PickedupScreen = () => {
    return (
        <Stack.Navigator initialRouteName='List'>
            <Stack.Screen
                name='List'
                component={ListScreen}
                options={{ title: 'Recogido' }}
            />
            <Stack.Screen
                name='View'
                component={ViewScreen}
                options={{ title: 'Donación Info' }}
            />
        </Stack.Navigator>
    );
};

export default PickedupScreen;

const styles = StyleSheet.create({});
