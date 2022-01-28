import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const ViewScreen = ({ route, navigation }) => {
    const { id, email, name } = route.params;

    const acceptDonation = async () => {
        // copy donation over to acceptedDonations database
        await setDoc(doc(db, 'acceptedDonations', id), {
            name: name,
            email: email,
        });

        // delete donation from donationsForms database
        await deleteDoc(doc(db, 'donationForms', id));

        // automatically navigate back to list view
        navigation.goBack();
    };

    const deleteDonation = async () => {
        /**
         * If we want to have another database to store deleted
         * donations for recovery purposes
         */
        // await setDoc(doc(db, 'deletedDonations', id), {});
        await deleteDoc(doc(db, 'donationForms', id));

        // automatically navigate back to list view
        navigation.goBack();
    };

    return (
        <View>
            <Text>id: {id}</Text>
            <Text>email: {email}</Text>
            <Text>name: {name}</Text>
            <TouchableOpacity
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
                <Text>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
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
                <Text>Delete</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ViewScreen;

const styles = StyleSheet.create({});
