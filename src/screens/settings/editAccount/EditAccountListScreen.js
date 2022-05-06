import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ListItem } from 'react-native-elements';
import { useSelector } from 'react-redux';

const EditAccountListScreen = ({ navigation }) => {
    const data = useSelector((state) => state.user.data);

    const types = {
        admin: 'Administrador',
        warehouse: 'Depósito',
        driver: 'Conductor',
    };

    return (
        <View>
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Nombre</ListItem.Title>
                    <ListItem.Subtitle right>
                        {data.name.first +
                            ' ' +
                            data.name.last1 +
                            (data.name.last2 !== null
                                ? ' ' + data.name.last2
                                : '')}
                    </ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Tipo de Cuenta</ListItem.Title>
                    <ListItem.Subtitle right>
                        {types[data.type]}
                    </ListItem.Subtitle>
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
                    <ListItem.Subtitle right>{data.email}</ListItem.Subtitle>
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
