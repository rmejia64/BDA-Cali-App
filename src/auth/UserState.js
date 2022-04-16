import { Platform, StatusBar, StyleSheet, View, Image } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from './Auth';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import LoginHomeScreen from '../screens/login/LoginHomeScreen';
import HomeScreen from '../screens/HomeScreen';

const UserState = () => {
    const [loading, setLoading] = useState(true);
    const { user, setUser } = useContext(AuthContext);
    const [loggedIn, setLoggedIn] = useState(null);

    useEffect(() => {
        let isMounted = true;

        onAuthStateChanged(auth, (user) => {
            if (isMounted) {
                if (user) {
                    getDoc(doc(db, 'users', user.uid))
                        .then((userSnap) => {
                            const userData = userSnap.data();
                            setLoading(false);
                            setUser({
                                id: user.uid,
                                data: userData,
                            });
                            setLoggedIn(true);
                        })
                        .catch((error) => {
                            setLoading(false);
                        });
                } else {
                    setLoading(false);
                    setLoggedIn(false);
                }
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/bdalogo.png')}
                />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <StatusBar
                barStyle={
                    Platform.OS === 'ios' ? 'dark-content' : 'light-content'
                }
            />
            {loggedIn ? <HomeScreen /> : <LoginHomeScreen />}
        </NavigationContainer>
    );
};

export default UserState;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 170,
        height: 175,
    },
});
