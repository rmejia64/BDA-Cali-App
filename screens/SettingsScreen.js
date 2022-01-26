import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { ListItem } from 'react-native-elements';

const SettingsScreen = () => {
    const navigation = useNavigation();

    const handleSignout = () => {
        signOut(auth)
            .then(() => {
                navigation.replace('Login');
            })
            .catch((error) => console.log(error.message));
    };

    return (
        // <View>
        //     <Text>Settings</Text>
        //     <TouchableOpacity onPress={handleSignout}>
        //         <Text>Sign Out</Text>
        //     </TouchableOpacity>
        // </View>
        <View>
            <ListItem onPress={handleSignout}>
                <ListItem.Content>
                    <ListItem.Title>Log out</ListItem.Title>
                </ListItem.Content>
            </ListItem>
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
