import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ListItem } from 'react-native-elements';
import { db, auth } from '../../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EditAccountListScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName1, setLastName1] = useState('');
    const [lastName2, setLastName2] = useState('');
    const [type, setType] = useState('');
    const [email, setEmail] = useState('');

    const types = {
        admin: 'Administrador',
        warehouse: 'Depósito',
        driver: 'Conductor',
    };

    useEffect(async () => {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            setFirstName(data.name.first);
            setLastName1(data.name.last1);
            setLastName2(data.name.last2 === null ? '' : data.name.last2);
            setType(types[data.type]);
            setEmail(data.email);
        } else {
            console.error('User not found.');
        }
    }, []);

    return (
        <View>
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Nombre</ListItem.Title>
                    <ListItem.Subtitle right>
                        {firstName +
                            ' ' +
                            lastName1 +
                            (lastName2 !== '' ? ' ' + lastName2 : '')}
                    </ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Tipo de Cuenta</ListItem.Title>
                    <ListItem.Subtitle right>{type}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
            <ListItem
                onPress={() => {
                    navigation.push('ChangeEmail');
                }}
                bottomDivider
            >
                <ListItem.Content>
                    <ListItem.Title>Email</ListItem.Title>
                    <ListItem.Subtitle right>{email}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem
                onPress={() => {
                    navigation.push('ChangePassword');
                }}
                bottomDivider
            >
                <ListItem.Content>
                    <ListItem.Title>Cambia la contraseña</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        </View>
    );
};

export default EditAccountListScreen;

const styles = StyleSheet.create({});
