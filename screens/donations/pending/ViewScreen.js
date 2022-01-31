import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const ViewScreen = ({ route, navigation }) => {
    const {
        id,
        email,
        name,
        businessName,
        dateCreated,
        date,
        reqPickup,
        reqCertificate,
        type,
        value,
    } = route.params;

    const acceptDonation = async () => {
        // copy donation over to acceptedDonations database
        await setDoc(doc(db, 'acceptedDonations', id), {
            email,
            name,
            businessName,
            dateCreated,
            donation: {
                pickup: {
                    date,
                    reqPickup,
                },
                reqCertificate,
                type,
                value,
            },
        });

        // delete donation from donationsForms database
        await deleteDoc(doc(db, 'pendingDonations', id));

        // automatically navigate back to list view
        navigation.goBack();
    };

    const deleteDonation = async () => {
        /**
         * If we want to have another database to store deleted
         * donations for recovery purposes
         */
        // await setDoc(doc(db, 'deletedDonations', id), {});
        await deleteDoc(doc(db, 'pendingDonations', id));

        // automatically navigate back to list view
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text>id: {id}</Text>
            <Text>email: {email}</Text>
            <Text>name: {name}</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        Alert.alert(
                            'Accept',
                            'Are you sure you want to accept this donation?',
                            [
                                { text: 'No' },
                                { text: 'Yes', onPress: acceptDonation },
                            ]
                        );
                    }}
                >
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        Alert.alert(
                            'Delete',
                            'Are you sure you want to delete this donation?',
                            [
                                { text: 'No' },
                                { text: 'Yes', onPress: deleteDonation },
                            ]
                        );
                    }}
                >
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ViewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    buttonsContainer: {
        width: '100%',
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        backgroundColor: '#0c4484',
        width: '40%',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
    },
});
