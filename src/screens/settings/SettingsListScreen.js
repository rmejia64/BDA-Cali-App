import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { ListItem } from 'react-native-elements';
import { AuthContext } from '../../auth/Auth';

const SettingsScreen = ({ navigation }) => {
    let [user] = useState(AuthContext);
    user = user._currentValue.user;

    const handleSignout = () => {
        signOut(auth)
            .then(() => {
                // sign-out successful
            })
            .catch((error) => console.error(error.message));
    };

    return (
        <View>
            <ListItem
                onPress={() => {
                    navigation.push('EditAccountList');
                }}
                bottomDivider
            >
                <Icon name={'account-edit'} size={20} />
                <ListItem.Content>
                    <ListItem.Title>My Account</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            {user.data.type === 'Administrator' ? (
                <ListItem
                    onPress={() => {
                        navigation.push('ManageAccounts');
                    }}
                    bottomDivider
                >
                    <Icon name={'account-multiple'} size={20} />
                    <ListItem.Content>
                        <ListItem.Title>Manage Accounts</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            ) : null}
            {user.data.type === 'Administrator' ? (
                <ListItem
                    onPress={() => {
                        navigation.push('CreateAccount');
                    }}
                    bottomDivider
                >
                    <Icon name={'account-plus'} size={20} />
                    <ListItem.Content>
                        <ListItem.Title>Create Account</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            ) : null}
            <ListItem
                onPress={() => {
                    navigation.push('Language');
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
