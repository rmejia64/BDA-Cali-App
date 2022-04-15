import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { db } from '../../../firebase/config';
import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { ListItem, Chip } from 'react-native-elements';

const ManageAccountsScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const getUsers = async () => {
        setRefreshing(true);
        let tempUsers = [];

        const users = collection(db, 'users');
        const q = query(users, orderBy('firstName'));

        try {
            const querySnapshot = await getDocs(q);
            setRefreshing(false);
            querySnapshot.forEach((doc) => {
                tempUsers.push({ uid: doc.id, data: doc.data() });
            });
            setUsers(tempUsers);
        } catch (error) {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        navigation.addListener('focus', () => {
            setRefreshKey((oldKey) => oldKey + 1);
        });
    });

    useEffect(() => {
        getUsers();
    }, [refreshKey]);

    return (
        <>
            {/* <Filter /> */}
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
                                        {u.data.firstName} {u.data.lastName1}
                                        {u.data.lastName2 !== ''
                                            ? ' ' + u.data.lastName2
                                            : ''}
                                    </ListItem.Title>
                                    <Chip title={u.data.type} />
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
