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

        // if (filter === 'Newest') {
        //     q = query(pendingDonations, orderBy('dateCreated', 'desc'));
        // } else if (filter === 'Oldest') {
        //     q = query(pendingDonations, orderBy('dateCreated'));
        // } else if (filter === 'Name') {
        //     q = query(pendingDonations, orderBy('name'));
        // } else if (filter === 'Type') {
        //     q = query(pendingDonations, orderBy('donation'), orderBy('type'));
        // }
        q = query(pendingDonations, orderBy('dateCreated', 'desc'));

        try {
            const querySnapshot = await getDocs(q);
            setRefreshing(false);
            querySnapshot.forEach((doc) => {
                forms.push({ id: doc.id, data: doc.data() });
            });
            console.log(forms);
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
                        // if (pd.data.donation.pickup.reqPickup === 'Yes') {
                        //     reqPickup = <Text>PICKUP</Text>;
                        // } else {
                        //     reqPickup = <Text>DROPOFF</Text>;
                        // }
                        return (
                            <TouchableOpacity
                                key={pd.id}
                                onPress={() => {
                                    navigation.navigate('View', {
                                        address: pd.data.address,
                                        certificate: pd.data.certificate,
                                        packaging: pd.data.certificate,
                                        productType: pd.data.productType,
                                        quantity: pd.data.quantity,
                                        type: pd.data.type,
                                        weight: pd.data.weight,
                                    });
                                }}
                            >
                                <Card containerStyle={styles.card}>
                                    <Card.Title>{pd.id}</Card.Title>
                                    {reqPickup}
                                    <View style={styles.cardText}>
                                        <Text>Address</Text>
                                        <Text>{pd.data.address}</Text>
                                    </View>
                                    <View style={styles.cardText}>
                                        <Text>Certificate</Text>
                                        <Text>{pd.data.certificate}</Text>
                                    </View>
                                    <View style={styles.cardText}>
                                        <Text>Packaging</Text>
                                        <Text>{pd.data.packaging}</Text>
                                    </View>
                                    <View style={styles.cardText}>
                                        <Text>Product Type</Text>
                                        <Text>{pd.data.productType}</Text>
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
