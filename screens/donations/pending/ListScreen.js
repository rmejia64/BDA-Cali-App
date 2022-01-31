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
import { db } from '../../../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Text, Card, SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ListScreen = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [pendingDonations, setPendingDonations] = useState([]);
    const [filter, setFilter] = useState('Newest');

    // grab all documents in donationForms collection from firebase
    const getPendingDonations = async () => {
        setRefreshing(true);
        let forms = [];
        let q;
        const pendingDonations = collection(db, 'pendingDonations');

        if (filter === 'Newest') {
            q = query(pendingDonations, orderBy('dateCreated'));
        } else if (filter === 'Oldest') {
            q = query(pendingDonations, orderBy('dateCreated', 'desc'));
        } else if (filter === 'Name') {
            q = query(pendingDonations, orderBy('name'));
        } else if (filter === 'Type') {
            q = query(pendingDonations, orderBy('donation'), orderBy('type'));
        }

        try {
            const querySnapshot = await getDocs(q);
            setRefreshing(false);
            querySnapshot.forEach((doc) => {
                forms.push({ id: doc.id, data: doc.data() });
            });
            setPendingDonations(forms);
        } catch (error) {
            console.log(error);
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
        getPendingDonations();
    }, [refreshKey]);

    return (
        <>
            {/* <SearchBar lightTheme /> */}
            <Dropdown />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getPendingDonations}
                    />
                }
            >
                <View style={styles.container}>
                    {pendingDonations.map((pd) => {
                        let reqPickup;
                        if (pd.data.donation.pickup.reqPickup === 'Yes') {
                            reqPickup = <Text>PICKUP</Text>;
                        } else {
                            reqPickup = <Text>DROPOFF</Text>;
                        }
                        return (
                            <TouchableOpacity
                                key={pd.id}
                                onPress={() => {
                                    navigation.navigate('View', {
                                        id: pd.id,
                                        email: pd.data.email,
                                        name: pd.data.name,
                                        businessName: pd.data.businessName,
                                        dateCreated: pd.data.dateCreated,
                                        date: pd.data.donation.pickup.date,
                                        reqPickup:
                                            pd.data.donation.pickup.reqPickup,
                                        reqCertificate:
                                            pd.data.donation.reqCertificate,
                                        type: pd.data.donation.type,
                                        value: pd.data.donation.value,
                                    });
                                }}
                            >
                                <Card containerStyle={styles.card}>
                                    <Card.Title>{pd.data.name}</Card.Title>
                                    {reqPickup}
                                    <View style={styles.cardText}>
                                        <Text>Email</Text>
                                        <Text>{pd.data.email}</Text>
                                    </View>
                                    <View style={styles.cardText}>
                                        <Text>Donation Type</Text>
                                        <Text>{pd.data.donation.type}</Text>
                                    </View>
                                    <View style={styles.cardText}>
                                        <Text>Value</Text>
                                        <Text>{pd.data.donation.value}</Text>
                                    </View>
                                    <View style={styles.cardText}>
                                        <Text>Certificate Required?</Text>
                                        <Text>
                                            {pd.data.donation.reqCertificate}
                                        </Text>
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
