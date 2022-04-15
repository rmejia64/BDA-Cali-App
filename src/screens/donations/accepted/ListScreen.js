import {
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
    RefreshControl,
    Platform,
    ActionSheetIOS,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Text, Card, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ListScreen = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [acceptedDonations, setAcceptedDonations] = useState([]);
    const [filter, setFilter] = useState('Newest');

    // grab all documents in acceptedDonations collection from firebase
    const getAcceptedDonations = async () => {
        setRefreshing(true);
        let forms = [];
        let q;
        const acceptedDonations = collection(db, 'acceptedDonations');

        if (filter === 'Newest') {
            q = query(acceptedDonations, orderBy('dateCreated', 'desc'));
        } else if (filter === 'Oldest') {
            q = query(acceptedDonations, orderBy('dateCreated'));
        } else if (filter === 'Name') {
            q = query(acceptedDonations, orderBy('name'));
        } else if (filter === 'Type') {
            q = query(acceptedDonations, orderBy('donation'), orderBy('type'));
        }

        try {
            const querySnapshot = await getDocs(q);
            setRefreshing(false);
            querySnapshot.forEach((doc) => {
                forms.push({ id: doc.id, data: doc.data() });
            });
            setAcceptedDonations(forms);
        } catch (error) {
            console.error(error);
        }
    };

    function Dropdown() {
        const platform = Platform.OS;
        if (platform === 'ios') {
            const buttons = ['Newest', 'Oldest', 'Name', 'Type'];
            return (
                <TouchableOpacity
                    style={styles.actionSheetButton}
                    onPress={() => {
                        ActionSheetIOS.showActionSheetWithOptions(
                            { options: buttons },
                            (buttonIndex) => {
                                setFilter(buttons[buttonIndex]);
                                setRefreshKey((oldKey) => oldKey + 1);
                            }
                        );
                    }}
                >
                    <Text>{filter}</Text>
                    <Icon name='menu-down' size={20} />
                </TouchableOpacity>
            );
        } else {
            return (
                <Picker
                    selectedValue={filter}
                    onValueChange={(itemValue, itemIndex) => {
                        setFilter(itemValue);
                        setRefreshKey((oldKey) => oldKey + 1);
                    }}
                >
                    <Picker.Item label='Newest' value='Newest' />
                    <Picker.Item label='Oldest' value='Oldest' />
                    <Picker.Item label='Name' value='Name' />
                    <Picker.Item label='Type' value='Type' />
                </Picker>
            );
        }
    }

    useEffect(() => {
        // refresh will trigger when the list screen is focused
        navigation.addListener('focus', () => {
            setRefreshKey((oldKey) => oldKey + 1);
        });
    });

    useEffect(() => {
        getAcceptedDonations();
    }, [refreshKey]);

    return (
        <>
            <Dropdown />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getAcceptedDonations}
                    />
                }
            >
                <View style={styles.container}>
                    {acceptedDonations.map((d) => {
                        return (
                            <TouchableOpacity
                                key={d.id}
                                onPress={() => {
                                    navigation.navigate('View', {
                                        id: d.id,
                                        email: d.data.email,
                                        name: d.data.name,
                                        businessName: d.data.businessName,
                                        dateCreated: d.data.dateCreated,
                                        date: d.data.donation.pickup.date,
                                        reqPickup:
                                            d.data.donation.pickup.reqPickup,
                                        reqCertificate:
                                            d.data.donation.reqCertificate,
                                        type: d.data.donation.type,
                                        value: d.data.donation.value,
                                    });
                                }}
                            >
                                <Card containerStyle={styles.card}>
                                    <Card.Title>{d.data.name}</Card.Title>
                                    <View style={styles.cardText}>
                                        <Text>Email</Text>
                                        <Text>{d.data.email}</Text>
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </>
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
    actionSheetButton: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
});
