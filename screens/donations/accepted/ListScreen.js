import {
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Text,
    View,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Card } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const ListScreen = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [acceptedDonations, setAcceptedDonations] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    // grab all documents in acceptedDonations collection from firebase
    const getAcceptedDonations = async () => {
        const querySnapshot = await getDocs(
            collection(db, 'acceptedDonations')
        );
        return querySnapshot;
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshKey((oldKey) => oldKey + 1);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        // refresh will trigger when the list screen is focused
        navigation.addListener('focus', () => {
            getAcceptedDonations().then((querySnapshot) => {
                let donations = [];
                querySnapshot.forEach((d) => {
                    donations.push({ id: d.id, data: d.data() });
                });
                setAcceptedDonations(donations);
            });
        });
    }, [refreshKey]);

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.container}>
                {acceptedDonations.map((d) => {
                    return (
                        <TouchableOpacity
                            key={d.id}
                            onPress={() => {
                                navigation.navigate('View', {
                                    id: d.id,
                                    email: d.data.email,
                                    name: d.data.name,
                                });
                            }}
                        >
                            <Card containerStyle={styles.card}>
                                <Card.Title>{d.data.name}</Card.Title>
                                <View style={styles.cardText}>
                                    <Text>Email</Text>
                                    <Text>{d.data.email}</Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
};

export default ListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingBottom: 10,
    },
    cardText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
