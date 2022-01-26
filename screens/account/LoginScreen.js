import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.replace('Home');
            }
        });
        return unsubscribe;
    }, []);

    const handleRegister = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(`Email ${user.email} has been registered.`);
            })
            .catch((error) => {
                if (error.code == 'auth/email-already-in-use') {
                    Alert.alert(
                        `This email is already in use. Please sign in instead.`
                    );
                } else {
                    Alert.alert(error.code);
                }
            });
    };

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(`${userCredential.user.email} is signed in.`);
            })
            .catch((error) => {
                if (error.code == 'auth/wrong-password') {
                    Alert.alert('Bad Password', 'Incorrect password.');
                } else if (error.code == 'auth/user-not-found') {
                    Alert.alert('User Not Found', 'Email could not be found.');
                } else if (error.code == 'auth/invalid-email') {
                    Alert.alert('Invalid Email', 'Please enter a valid email.');
                } else if (error.code == 'auth/internal-error') {
                    console.log(error.code);
                } else {
                    Alert.alert(error.code);
                }
            });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/bdalogo.png')}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                    autoCapitalize='none'
                />
                <TextInput
                    placeholder='Password'
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                    autoCapitalize='none'
                    secureTextEntry
                />
                <TouchableOpacity onPress={handleSignIn} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <Text>Don't have an account?</Text>
                <TouchableOpacity onPress={handleRegister}>
                    <Text style={styles.hyperlink}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
    },
    logo: {
        width: 170,
        height: 175,
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 15,
        marginTop: 10,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#0c4484',
        width: '100%',
        marginTop: 30,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
    },
    hyperlink: {
        color: '#0c4484',
        fontWeight: '700',
    },
});
