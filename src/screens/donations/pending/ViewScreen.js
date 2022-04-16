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
import { Button, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';

const ViewScreen = ({ route, navigation }) => {
    const pd = route.params;

    const [driver, setDriver] = useState(pd.data.driver);
    const [driverName, setDriverName] = useState('');
    const [pickupDate, setPickupDate] = useState(pd.data.pickupDate);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');

    // date picker states
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    const acceptDonation = async () => {
        // copy donation over to acceptedDonations database
        await setDoc(doc(db, 'acceptedDonations', pd.id), pd.data);

        // delete donation from donationsForms database
        await deleteDoc(doc(db, 'pendingDonations', pd.id));

        // automatically navigate back to list view
        navigation.goBack();
    };

    const deleteDonation = async (pd) => {
        /**
         * If we want to have another database to store deleted
         * donations for recovery purposes
         */
        // await setDoc(doc(db, 'deletedDonations', id), {});
        await deleteDoc(doc(db, 'pendingDonations', pd.id));

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

    const handleDateConfirm = (date) => {
        console.log(date);
        setOpen(false);
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
        const ModalContent = () => {
            switch (modalType) {
                case 'pickup-date':
                    return <Text>Pickup</Text>;
                case 'cert':
                    return <Text>Certificate!</Text>;
            }
        };

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
                            <ModalContent />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <DonationModal />
                <ListItem topDivider bottomDivider>
                    <Icon name='calendar' size={25} />
                    <ListItem.Content>
                        <ListItem.Title>Date Created</ListItem.Title>
                        <ListItem.Subtitle>
                            {pd.data.dateCreated.toDate().toLocaleString()}
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
                            {pd.data.certificate ? 'Yes' : 'No'}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
                <ListItem
                    bottomDivider
                    onPress={() => {
                        navigation.push('AssignDriver', {
                            donationID: pd.id,
                            driver,
                        });
                    }}
                >
                    <Icon name='truck' size={25} />
                    <ListItem.Content>
                        <ListItem.Title
                            style={{
                                color: driver === '' ? '#df0b37' : null,
                            }}
                        >
                            Driver
                        </ListItem.Title>
                        <ListItem.Subtitle>{driverName}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
                <ListItem
                    bottomDivider
                    style={{ marginBottom: 32 }}
                    onPress={() => {
                        setOpen(true);
                    }}
                >
                    <Icon name='calendar-today' size={25} />
                    <ListItem.Content>
                        <ListItem.Title
                            style={{
                                color: pickupDate === null ? '#df0b37' : null,
                            }}
                        >
                            Pickup Date
                        </ListItem.Title>
                        <ListItem.Subtitle>
                            {pickupDate === null
                                ? 'Unassigned'
                                : pickupDate
                                      .toDate()
                                      .toLocaleDateString('es-CO')}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
                <ListItem topDivider bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Type</ListItem.Title>
                        <ListItem.Subtitle>
                            {pd.data.client.type}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>
                            {pd.data.client.type + ' Name'}
                        </ListItem.Title>
                        <ListItem.Subtitle>
                            {pd.data.client.type === 'Organization'
                                ? pd.data.client.organization
                                : pd.data.client.firstName +
                                  ' ' +
                                  pd.data.client.lastNames}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Address</ListItem.Title>
                        <ListItem.Subtitle>{pd.data.address}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Content</ListItem.Title>
                        <ListItem.Subtitle>
                            {pd.data.packaging + ': ' + pd.data.quantity}
                            {'\nWeight: ' + pd.data.weight + ' kgs'}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            </ScrollView>
            <View>
                <Button
                    title='Accept'
                    onPress={() => acceptDonation(pd)}
                    buttonStyle={{
                        backgroundColor: '#0074cb',
                    }}
                    disabled={driver === '' || pickupDate === null}
                />
                <Button
                    title='Delete'
                    onPress={() => deleteDonation(pd)}
                    buttonStyle={{
                        backgroundColor: '#df0b37',
                    }}
                />
            </View>
            <DateTimePicker
                isVisible={open}
                mode='date'
                minimumDate={new Date()}
                onConfirm={() => {
                    handleDateConfirm;
                }}
                onCancel={() => setOpen(false)}
            />
        </View>
    );
};

export default ViewScreen;

const styles = StyleSheet.create({
    container: {
        height: '100%',
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
