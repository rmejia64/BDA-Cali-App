import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ViewScreen from './accepted/ViewScreen';
import ListScreen from './accepted/ListScreen';

const Stack = createNativeStackNavigator();

const AcceptedScreen = () => {
    return (
        <Stack.Navigator initialRouteName='List'>
            <Stack.Screen name='List' component={ListScreen} />
            <Stack.Screen name='View' component={ViewScreen} />
        </Stack.Navigator>
    );
};

export default AcceptedScreen;

const styles = StyleSheet.create({});
