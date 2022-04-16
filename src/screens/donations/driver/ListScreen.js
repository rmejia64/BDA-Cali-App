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

const ListScreen = ({ navigation }) => {
    let [user] = useState(AuthContext);
    user = user._currentValue.user;

    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [pickups, setPickups] = useState([]);

    const getAssignedPickups = async () => {
        setRefreshing(true);
        let tempPickups = [];
        let q;

        const acceptedDonations = collection(db, 'acceptedDonations');
        q = query(acceptedDonations, where('driver', '==', user.id));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                tempPickups.push({ id: doc.id, data: doc.data() });
            });
            setPickups(tempPickups);
        } catch (error) {
            console.error(error.message);
        }

        setRefreshing(false);
    };

    useEffect(() => {
        navigation.addListener('focus', () => {
            setRefreshKey((oldKey) => oldKey + 1);
        });
    });

    useEffect(() => {
        getAssignedPickups();
    }, [refreshKey]);

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={getAssignedPickups}
                />
            }
        >
            {pickups.map((pickup, idx) => {
                return (
                    <ListItem
                        key={pickup.id}
                        onPress={() => {
                            navigation.navigate('View', {
                                id: pickup.id,
                                data: pickup.data,
                            });
                        }}
                        topDivider={idx === 0}
                        bottomDivider
                    >
                        <ListItem.Content>
                            <ListItem.Title>{pickup.id}</ListItem.Title>
                            <ListItem.Subtitle>
                                {/* {pickup.data.certificate ? } */}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                );
            })}
        </ScrollView>
    );
};

export default ListScreen;

const styles = StyleSheet.create({});
