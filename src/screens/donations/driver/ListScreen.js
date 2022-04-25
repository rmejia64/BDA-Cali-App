import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { AuthContext } from '../../../auth/Auth';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { ListItem } from 'react-native-elements';

const ListScreen = ({ route, navigation }) => {
    let [user] = useState(AuthContext);
    user = user._currentValue.user;

    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [pickups, setPickups] = useState([]);

    const getAssignedPickups = async (refresh) => {
        let tempPickups = [];
        let q;

        const accepted = collection(db, 'accepted');
        q = query(accepted, where('pickup.driver', '==', user.id));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                tempPickups.push({ id: doc.id, data: doc.data() });
            });
            setPickups(tempPickups);
        } catch (error) {
            console.error(error.message);
        }
    };

    const formatAddress = (address) => {
        return `${address.street}\n${address.city}, ${address.region}`;
    };

    useEffect(() => {
        navigation.addListener('focus', () => {
            getAssignedPickups();
        });
    });

    useEffect(() => {
        setRefreshing(true);
        getAssignedPickups();
        setRefreshing(false);
    }, [refreshKey]);

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshKey((oldkey) => oldkey + 1);
                    }}
                />
            }
        >
            {pickups.map((pickup, idx) => {
                const data = pickup.data;
                const id = pickup.id;
                const address = formatAddress(data.client.address);
                return (
                    <ListItem
                        key={id}
                        onPress={() => {
                            navigation.push('View', {
                                id,
                                data,
                            });
                        }}
                        topDivider={idx === 0}
                        bottomDivider
                    >
                        <ListItem.Content>
                            <ListItem.Title>{address}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                );
            })}
        </ScrollView>
    );
};

export default ListScreen;

const styles = StyleSheet.create({});
