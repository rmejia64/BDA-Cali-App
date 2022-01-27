import {
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
    RefreshControl,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Text, Card, Button, Icon } from 'react-native-elements';

const PendingScreen = () => {
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
        getDonationForms().then((querySnapshot) => {
            let forms = [];
            querySnapshot.forEach((doc) => {
                forms.push({ id: doc.id, data: doc.data() });
            });
            setDonationForms(forms);
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
                            onPress={() => console.log(df.id)}
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

export default PendingScreen;

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
