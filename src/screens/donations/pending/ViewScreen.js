import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Modal,
} from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

const ViewScreen = ({ route, navigation }) => {
    const pd = route.params;

    const [address] = useState(pd.data.address);
    const [certReq] = useState(pd.data.certificate);
    const [clientType] = useState(pd.data.client.type);
    const [firstName] = useState(pd.data.client.firstName);
    const [lastNames] = useState(pd.data.client.lastNames);
    const [organization] = useState(pd.data.client.organization);
    const [dateCreated] = useState(pd.data.dateCreated);
    const [notes] = useState(pd.data.notes);
    const [packaging] = useState(pd.data.packaging);
    const [productType] = useState(pd.data.productType);
    const [quantity] = useState(pd.data.quantity);
    const [weight] = useState(pd.data.weight);
    const [driver, setDriver] = useState(pd.data.driver);

    const [driverName, setDriverName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');

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

    const getDriverName = async () => {
        if (driver === '') {
            setDriverName('Unassigned');
        } else {
            const userRef = doc(db, 'users', driver);
            const userSnap = await getDoc(userRef);
            const user = userSnap.data();
            if (userSnap.exists()) {
                setDriverName(
                    user.firstName +
                        ' ' +
                        user.lastName1 +
                        (user.lastName2 === '' ? '' : ' ' + user.lastName2)
                );
            } else {
                console.error('Driver not found...');
            }
        }
    };

    useEffect(() => {
        getDriverName();
    }, []);

    useEffect(() => {
        if (route.params?.driver) {
            getDriverName();
        }
    }, [route.params?.driver]);

    const DonationModal = () => {
        return (
            <View>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <TouchableOpacity
                        style={styles.modalContainer}
                        activeOpacity={1}
                        onPress={() => {
                            setModalVisible(false);
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.modalView}
                        >
                            <Text>
                                {modalType === 'cert'
                                    ? 'Certificate'
                                    : 'IDK yet!'}
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    };

    return (
        <ScrollView>
            <DonationModal />
            <ListItem topDivider bottomDivider>
                <Icon name='calendar' size={25} />
                <ListItem.Content>
                    <ListItem.Title>Date Created</ListItem.Title>
                    <ListItem.Subtitle>
                        {dateCreated.toDate().toLocaleString()}
                    </ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
            <ListItem
                bottomDivider
                onPress={() => {
                    setModalType('cert');
                    setModalVisible(true);
                }}
            >
                <Icon name='certificate' size={25} />
                <ListItem.Content>
                    <ListItem.Title>Certificate Required?</ListItem.Title>
                    <ListItem.Subtitle>
                        {certReq ? 'Yes' : 'No'}
                    </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem
                bottomDivider
                style={{ marginBottom: 32 }}
                onPress={() => {
                    navigation.push('AssignDriver', {
                        donationID: pd.id,
                        driver,
                    });
                }}
            >
                <Icon
                    name='truck'
                    size={25}
                    color={driverName === 'Unassigned' ? '#ff0000' : null}
                />
                <ListItem.Content>
                    <ListItem.Title>Driver</ListItem.Title>
                    <ListItem.Subtitle>{driverName}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem topDivider bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Type</ListItem.Title>
                    <ListItem.Subtitle>{clientType}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>{clientType + ' Name'}</ListItem.Title>
                    <ListItem.Subtitle>
                        {clientType === 'Organization'
                            ? organization
                            : firstName + ' ' + lastNames}
                    </ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Address</ListItem.Title>
                    <ListItem.Subtitle>{address}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Content</ListItem.Title>
                    <ListItem.Subtitle>
                        {packaging + ': ' + quantity}
                        {'\nWeight: ' + weight + ' kgs'}
                    </ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        </ScrollView>
    );
};

export default ViewScreen;

const styles = StyleSheet.create({
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: '30%',
        backgroundColor: 'yellow',
        borderRadius: 10,
    },
});
