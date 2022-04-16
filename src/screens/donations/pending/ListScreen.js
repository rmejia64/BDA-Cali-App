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
import {
    collection,
    getDocs,
    orderBy,
    query,
    setDoc,
} from 'firebase/firestore';
import { Text, Chip, SearchBar, ListItem, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ListScreen = ({ navigation }) => {
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
            querySnapshot.forEach((doc) => {
                forms.push({ id: doc.id, data: doc.data() });
            });
            setPendingDonations(forms);
        } catch (error) {
            console.error(error);
        }

        setRefreshing(false);
    };

    const acceptDonation = async (pd) => {
        await setDoc(doc(db, 'acceptedDonations', pd.id), pd.data);
        await deleteDoc(doc(db, 'pendingDonations', pd.id));
        setRefreshKey((oldKey) => oldKey + 1);
    };

    const getAge = (date) => {
        const difference = new Date().getTime() - date.getTime();
        const result = Math.round(difference) / (1000 * 3600 * 24);
        return result < 1 ? 'New' : result.toFixed(0) + ' days old';
    };

    function Dropdown() {
        const platform = Platform.OS;
        if (platform === 'ios') {
            const buttons = ['Cancel', 'Newest', 'Oldest', 'Name', 'Type'];
            return (
                <TouchableOpacity
                    style={styles.actionSheetButton}
                    onPress={() => {
                        ActionSheetIOS.showActionSheetWithOptions(
                            { options: buttons, cancelButtonIndex: 0 },
                            (buttonIndex) => {
                                if (buttonIndex !== 0) {
                                    setFilter(buttons[buttonIndex]);
                                    setRefreshKey((oldKey) => oldKey + 1);
                                }
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
                <View style={styles.donations}>
                    {pendingDonations.map((pd, idx) => {
                        const ready =
                            pd.data.driver !== '' &&
                            pd.data.pickupDate !== null;
                        return (
                            <ListItem
                                key={pd.id}
                                onPress={() => {
                                    navigation.navigate('View', {
                                        id: pd.id,
                                        data: pd.data,
                                    });
                                }}
                                topDivider={idx === 0}
                                bottomDivider
                            >
                                <ListItem.Content>
                                    <ListItem.Title>
                                        {pd.data.client.organization !== ''
                                            ? pd.data.client.organization
                                            : pd.data.client.firstName +
                                              ' ' +
                                              pd.data.client.lastNames}
                                    </ListItem.Title>
                                    <ListItem.Subtitle>
                                        {pd.data.dateCreated
                                            .toDate()
                                            .toLocaleDateString('es-CO')}
                                    </ListItem.Subtitle>
                                    <View style={styles.chips}>
                                        <Chip
                                            title={
                                                ready ? 'Ready' : 'Not ready'
                                            }
                                            buttonStyle={{
                                                backgroundColor: ready
                                                    ? '#91be62'
                                                    : '#df0b37',
                                            }}
                                            icon={{
                                                name: ready
                                                    ? 'cancel'
                                                    : 'check-bold',
                                                type: 'material-community',
                                                size: 15,
                                                color: 'white',
                                            }}
                                            containerStyle={{ margin: 5 }}
                                        />
                                        <Chip
                                            title={getAge(
                                                pd.data.dateCreated.toDate()
                                            )}
                                            buttonStyle={{
                                                backgroundColor: '#0b5575',
                                            }}
                                            icon={{
                                                name: 'clock',
                                                type: 'material-community',
                                                size: 15,
                                                color: 'white',
                                            }}
                                            containerStyle={{ margin: 5 }}
                                        />
                                        {pd.data.certificate ? (
                                            <Chip
                                                title='Certificate'
                                                disabled={!pd.data.certificate}
                                                containerStyle={{
                                                    margin: 5,
                                                }}
                                                buttonStyle={{
                                                    backgroundColor: '#ffd200',
                                                }}
                                                icon={{
                                                    name: 'certificate',
                                                    type: 'material-community',
                                                    size: 15,
                                                    color: 'white',
                                                }}
                                            />
                                        ) : null}
                                    </View>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
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
        // alignItems: 'center',
        paddingBottom: 10,
        marginTop: 20,
    },
    cardText: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    donations: {
        width: '100%',
    },
    actionSheetButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
        padding: 15,
        margin: 15,
    },
    listItem: {
        width: '100%',
        flexDirection: 'column',
    },
    chips: {
        flex: 1,
        flexDirection: 'row',
    },
});
