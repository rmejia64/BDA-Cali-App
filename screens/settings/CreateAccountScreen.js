import {
    StyleSheet,
    Text,
    View,
    Platform,
    ActionSheetIOS,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { setDoc, doc } from 'firebase/firestore';

const CreateAccountScreen = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName1, setLastName1] = useState('');
    const [lastName2, setLastName2] = useState('');
    const [accountType, setAccountType] = useState('Driver');
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    const generatePassword = () => {
        let p = firstName.substring(0, 3);
        p += lastName1.substring(0, 4);
        if (lastName2 !== '') {
            p += lastName2.substring(0, 4);
        }
        // p += Math.floor(Math.random() * (9999 - 1000) + 1000);
        return p;
    };

    const createAccount = () => {
        setIsLoading(true);
        const pass = generatePassword();
        createUserWithEmailAndPassword(auth, email, pass)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    firstName,
                    lastName1,
                    lastName2,
                    type: accountType.toLowerCase(),
                });
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.code == 'auth/email-already-in-use') {
                    alert(
                        'This email is already in use. Please use another one.'
                    );
                } else {
                    alert(error.code);
                }
                setIsLoading(false);
            });
    };

    function CreateButton() {
        if (isLoading) {
            return <ActivityIndicator />;
        } else {
            return <Text style={styles.buttonText}>Create Account</Text>;
        }
    }

    function Dropdown() {
        const platform = Platform.OS;
        if (platform === 'ios') {
            const buttons = ['Cancel', 'Administrator', 'Warehouse', 'Driver'];
            return (
                <TouchableOpacity
                    style={styles.actionSheetButton}
                    onPress={() => {
                        ActionSheetIOS.showActionSheetWithOptions(
                            { options: buttons, cancelButtonIndex: 0 },
                            (buttonIndex) => {
                                if (buttonIndex != 0) {
                                    setAccountType(buttons[buttonIndex]);
                                }
                            }
                        );
                    }}
                >
                    <Text>{accountType}</Text>
                    <Icon name='menu-down' size={20} />
                </TouchableOpacity>
            );
        }
        return null;
    }

    return (
        <KeyboardAwareScrollView>
            <View style={styles.container} behavior='padding'>
                <View style={styles.section}>
                    <Text style={styles.heading}>Account Type</Text>
                    <Dropdown />
                    {/* Picker is here because Android was glitchy when conditionally
                        rendering Picker in Dropdown(), so if platform is Android, we
                        return null */}
                    <Picker
                        selectedValue={accountType}
                        onValueChange={(itemValue, itemIndex) => {
                            setAccountType(itemValue);
                        }}
                        style={Platform.OS === 'ios' ? { display: 'none' } : {}}
                    >
                        <Picker.Item
                            label='Administrator'
                            value='Administrator'
                        />
                        <Picker.Item label='Warehouse' value='Warehouse' />
                        <Picker.Item label='Driver' value='Driver' />
                    </Picker>
                </View>
                <View style={styles.section}>
                    <Text style={styles.heading}>Name</Text>
                    <Text>First Name *</Text>
                    <TextInput
                        placeholder='Adrian'
                        value={firstName}
                        onChangeText={setFirstName}
                        style={styles.input}
                    />
                    <Text>Last Name 1 *</Text>
                    <TextInput
                        placeholder='Ramirez'
                        value={lastName1}
                        onChangeText={setLastName1}
                        style={styles.input}
                    />
                    <Text>Last Name 2</Text>
                    <TextInput
                        placeholder='Lopez'
                        value={lastName2}
                        onChangeText={setLastName2}
                        style={styles.input}
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.heading}>Email</Text>
                    <TextInput
                        placeholder='nombre@bdacali.com'
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        autoCapitalize='none'
                    />
                </View>
                <View style={styles.passwordAdvisory}>
                    <Text>
                        A password will be automatically generated as the first
                        three letters of the first name and first four letters
                        of the last names.
                    </Text>
                    <Text>Example</Text>
                    <Text>Name: Adrian Ramirez Lopez</Text>
                    <Text>Password: AdrRamiLope</Text>
                </View>
                <TouchableOpacity
                    onPress={createAccount}
                    style={styles.button}
                    disabled={isLoading}
                >
                    <CreateButton />
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 30,
    },
    actionSheetButton: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'lightgray',
        padding: 15,
    },
    section: {
        width: '80%',
        marginTop: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        paddingBottom: 15,
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 15,
        marginTop: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#0c4484',
        width: '80%',
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
    passwordAdvisory: {
        width: '80%',
        textAlign: 'center',
    },
});
