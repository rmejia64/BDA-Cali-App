import { StyleSheet, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { ListItem } from 'react-native-elements';

const SettingsScreen = () => {
    const navigation = useNavigation();

    const handleSignout = () => {
        signOut(auth)
            .then(() => {
                navigation.replace('LoginScreenManager');
            })
            .catch((error) => console.log(error.message));
    };

    return (
        <View>
            <ListItem
                onPress={() => {
                    navigation.navigate('EditAccount');
                }}
                bottomDivider
            >
                <Icon name={'account-edit'} size={20} />
                <ListItem.Content>
                    <ListItem.Title>My Account</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem
                onPress={() => {
                    navigation.navigate('CreateAccount');
                }}
                bottomDivider
            >
                <Icon name={'account-multiple-plus'} size={20} />
                <ListItem.Content>
                    <ListItem.Title>Create Account</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem
                onPress={() => {
                    navigation.navigate('Language');
                }}
                bottomDivider
            >
                <Icon name={'translate'} size={20} />
                <ListItem.Content>
                    <ListItem.Title>Language</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem onPress={handleSignout} bottomDivider>
                <Icon name={'logout'} size={20} color={'red'} />
                <ListItem.Content>
                    <ListItem.Title style={{ color: 'red' }}>
                        Log out
                    </ListItem.Title>
                </ListItem.Content>
            </ListItem>
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
