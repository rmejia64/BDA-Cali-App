import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React from 'react';
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

    const moveBack = async () => {
        await setDoc(doc(db, 'pendingDonations', id), {
            email: email,
            name: name,
            businessName: businessName,
            dateCreated: dateCreated,
            donation: {
                pickup: {
                    date: date,
                    reqPickup: reqPickup,
                },
                reqCertificate: reqCertificate,
                type: type,
                value: value,
            },
        });
        await deleteDoc(doc(db, 'acceptedDonations', id));
        navigation.goBack();
    };

    const handleDelete = async () => {
        await deleteDoc(doc(db, 'acceptedDonations', id));
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
                        'Are you sure you want to move this donation to pending?',
                        [{ text: 'No' }, { text: 'Yes', onPress: moveBack }]
                    );
                }}
            >
                <Text>Move to pending</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    Alert.alert(
                        'Accept',
                        'Are you sure you want to delete this donation?',
                        [{ text: 'No' }, { text: 'Yes', onPress: handleDelete }]
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
