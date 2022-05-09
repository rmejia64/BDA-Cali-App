import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { db } from '../../../firebase/config';
import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { ListItem, Chip } from 'react-native-elements';
import LoadingModal from '../../../../components/LoadingModal';

const ManageAccountsScreen = ({ route, navigation }) => {
    const [users, setUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const types = {
        admin: 'Administrador',
        warehouse: 'Depósito',
        driver: 'Conductor',
    };

    const getUsers = async () => {
        setRefreshing(true);
        let tempUsers = [];

        const users = collection(db, 'users');
        const q = query(users, orderBy('type'));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                tempUsers.push({ uid: doc.id, data: doc.data() });
            });
            setUsers(tempUsers);
        } catch (error) {
            console.error(error);
        }
        setRefreshing(false);
    };

    useEffect(() => {
        if (route.params !== undefined && route.params.refresh) {
            getUsers();
        }
    }, [route.params]);

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <>
            <View
                style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingRight: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginVertical: 10,
                    }}
                >
                    <Chip
                        title={'Idk yet'}
                        icon={{
                            name: 'account-circle',
                            type: 'material-community',
                            size: 20,
                            color: 'white',
                        }}
                        containerStyle={{
                            paddingLeft: 10,
                        }}
                        buttonStyle={{
                            backgroundColor: '#0074cb',
                        }}
                        onPress={() => {}}
                    />
                    <Chip
                        title={'Idk yet'}
                        icon={{
                            name: 'calendar',
                            type: 'material-community',
                            size: 20,
                            color: 'white',
                        }}
                        containerStyle={{
                            paddingLeft: 10,
                        }}
                        buttonStyle={{
                            backgroundColor: '#0074cb',
                        }}
                        onPress={() => {}}
                    />
                </View>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getUsers}
                    />
                }
            >
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
