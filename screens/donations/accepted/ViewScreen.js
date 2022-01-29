import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const ViewScreen = ({ route, navigation }) => {
    const { id, email, name } = route.params;

    const moveBack = async () => {
        await setDoc(doc(db, 'donationForms', id), {
            name: name,
            email: email,
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
