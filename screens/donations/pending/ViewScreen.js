import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const ViewScreen = ({ route, navigation }) => {
    const pd = route.params;

    const [address, setAddress] = useState(pd.data.address);
    const [certReq, setCertReq] = useState(pd.data.certificate);
    const [clientType, setClientType] = useState(pd.data.client.type);
    const [firstName, setFirstName] = useState(pd.data.client.firstName);
    const [lastNames, setLastNames] = useState(pd.data.client.lastNames);
    const [organization, setOrganization] = useState(
        pd.data.client.organization
    );
    const [dateCreated, setDateCreated] = useState(pd.data.dateCreated);
    const [notes, setNotes] = useState(pd.data.notes);
    const [packaging, setPackaging] = useState(pd.data.packaging);
    const [productType, setProductType] = useState(pd.data.productType);
    const [quantity, setQuantity] = useState(pd.data.quantity);
    const [weight, setWeight] = useState(pd.data.weight);
    const [isLoading, setIsLoading] = useState(false);

    const acceptDonation = async () => {
        // copy donation over to acceptedDonations database
        await setDoc(doc(db, 'acceptedDonations', pd.id), {
            address,
            certificate: certReq,
            client: {
                firstName,
                lastNames,
                organization,
                clientType,
            },
            dateCreated,
            notes,
            packaging,
            productType,
            quantity,
            weight,
        });

        // delete donation from donationsForms database
        await deleteDoc(doc(db, 'pendingDonations', pd.id));

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
            {/* <Text>id: {id}</Text>
            <Text>email: {email}</Text>
            <Text>name: {name}</Text> */}
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
