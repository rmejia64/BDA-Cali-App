import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { db } from '../../../firebase/config';
import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { ListItem, Chip } from 'react-native-elements';
import LoadingModal from '../../../../components/LoadingModal';

const ManageAccountsScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const types = {
        admin: 'Administrador',
        warehouse: 'Depósito',
        driver: 'Conductor',
    };

    const getUsers = async () => {
        let tempUsers = [];

        const users = collection(db, 'users');
        const q = query(users, orderBy('name.first'));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                tempUsers.push({ uid: doc.id, data: doc.data() });
            });
            setUsers(tempUsers);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        navigation.addListener('focus', () => {
            setLoading(true);
            getUsers();
            setLoading(false);
        });
    });

    useEffect(() => {
        setLoading(true);
        getUsers();
        setLoading(false);
    }, []);

    return (
        <>
            {/* <Filter /> */}
            <LoadingModal visible={loading} />
            <ScrollView>
                <View>
                    {users.map((u, i) => {
                        return (
                            <ListItem
                                key={u.uid}
                                onPress={() => {}}
                                topDivider={i === 0}
                                bottomDivider
                            >
                                <ListItem.Content>
                                    <ListItem.Title>
                                        {u.data.name.first} {u.data.name.last1}
                                        {u.data.name.last2 !== null
                                            ? ' ' + u.data.name.last2
                                            : ''}
                                    </ListItem.Title>
                                    <Chip
                                        containerStyle={{ marginTop: 12 }}
                                        title={types[u.data.type]}
                                    />
                                </ListItem.Content>
                            </ListItem>
                        );
                    })}
                </View>
            </ScrollView>
        </>
    );
};

export default ManageAccountsScreen;

const styles = StyleSheet.create({});
