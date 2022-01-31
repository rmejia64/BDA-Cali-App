import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        await deleteDoc(doc(db, 'acceptedDonation', id));
        navigation.goBack();
    };

    return (
        <View>
            <Text>id: {id}</Text>
            <Text>email: {email}</Text>
            <Text>name: {name}</Text>
            <TouchableOpacity onPress={moveBack}>
                <Text>Move back to pending</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ViewScreen;

const styles = StyleSheet.create({});
