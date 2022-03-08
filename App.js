import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreenManager from './screens/account/LoginScreenManager';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar barStyle='dark-content' />
            <Stack.Navigator
                initialRouteName='LoginScreenManager'
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen
                    name='LoginScreenManager'
                    component={LoginScreenManager}
                />
                <Stack.Screen name='Home' component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
