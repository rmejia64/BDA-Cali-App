import {
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
    RefreshControl,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Text, Card } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const ListScreen = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [donationForms, setDonationForms] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    // grab all documents in donationForms collection from firebase
    const getDonationForms = async () => {
        const querySnapshot = await getDocs(collection(db, 'donationForms'));
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
            getDonationForms()
                .then((querySnapshot) => {
                    let forms = [];
                    querySnapshot.forEach((doc) => {
                        forms.push({ id: doc.id, data: doc.data() });
                    });
                    setDonationForms(forms);
                })
                .catch((error) => {
                    console.log(error.message);
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
                {donationForms.map((df) => {
                    return (
                        <TouchableOpacity
                            key={df.id}
                            onPress={() => {
                                navigation.navigate('View', {
                                    id: df.id,
                                    email: df.data.email,
                                    name: df.data.name,
                                });
                            }}
                        >
                            <Card containerStyle={styles.card}>
                                <Card.Title>{df.data.name}</Card.Title>
                                <View style={styles.cardText}>
                                    <Text>Email</Text>
                                    <Text>{df.data.email}</Text>
                                </View>
                                <View style={styles.cardText}>
                                    <Text>Donation Type</Text>
                                    <Text>{df.data.donation.type}</Text>
                                </View>
                                <View style={styles.cardText}>
                                    <Text>Value</Text>
                                    <Text>{df.data.donation.value}</Text>
                                </View>
                                <View style={styles.cardText}>
                                    <Text>Certificate Required?</Text>
                                    <Text>
                                        {df.data.donation.reqCertificate}
                                    </Text>
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
