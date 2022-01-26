import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { KeyboardAvoidingView, TextInput } from 'react-native-web';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View>
                <TextInput
                    placeholder='Name'
                    value={name}
                    onChangeText={(text) => setName(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder='Password'
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                    autoCapitalize='none'
                    secureTextEntry
                />
            </View>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
