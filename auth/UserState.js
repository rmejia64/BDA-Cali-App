import { Platform, StatusBar } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from './Auth';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import LoginHomeScreen from '../screens/account/LoginHomeScreen';
import HomeScreen from '../screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const UserState = () => {
    const [loading, setLoading] = useState(true);
    const { user, setUser } = useContext(AuthContext);
    const [loggedIn, setLoggedIn] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getDoc(doc(db, 'users', user.uid))
                    .then((userSnap) => {
                        const userData = userSnap.data();
                        setLoading(false);
                        setUser(userData);
                        setLoggedIn(true);
                    })
                    .catch((error) => {
                        setLoading(false);
                    });
            } else {
                setLoading(false);
                setLoggedIn(false);
            }
        });
        return () => console.log('Unmounting...');
    }, []);

    if (loading) {
        return <></>;
    }

    return (
        <NavigationContainer>
            <StatusBar
                barStyle={
                    Platform.OS === 'ios' ? 'dark-content' : 'light-content'
                }
            />
            <Stack.Navigator
                initialRouteName='LoginHomeScreen'
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen
                    name='LoginHomeScreen'
                    component={LoginHomeScreen}
                />
                <Stack.Screen name='HomeScreen' component={HomeScreen} />
            </Stack.Navigator>
            {/* {loggedIn ? <HomeScreen /> : <LoginHomeScreen />} */}
        </NavigationContainer>
    );
};

export default UserState;
