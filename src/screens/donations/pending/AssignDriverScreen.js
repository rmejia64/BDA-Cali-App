import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import {
    getDocs,
    where,
    query,
    collection,
    orderBy,
    doc,
    updateDoc,
    getDoc,
} from 'firebase/firestore';
import { ListItem, SearchBar } from 'react-native-elements';

const AssignDriverScreen = ({ route, navigation }) => {
    const { donationID, driver } = route.params;
    const [drivers, setDrivers] = useState([]);
    const [search, setSearch] = useState('');
    const [checkBox, setCheckBox] = useState([]);
    const [loading, setLoading] = useState('false');
    const [loadingDriver, setLoadingDriver] = useState([]);
    const [currentDriver, setCurrentDriver] = useState('');

    const updateSearch = (search) => {
        setSearch(search);
    };

    const getDrivers = async () => {
        let tempDrivers = [];
        let tempCheckBox = [];
        let tempLoadingDrivers = [];

        const users = collection(db, 'users');
        const userQuery = query(
            users,
            where('type', '==', 'Driver'),
            orderBy('lastName1')
        );

        try {
            const querySnapshot = await getDocs(userQuery);
            querySnapshot.forEach((doc) => {
                tempDrivers.push({ uid: doc.id, data: doc.data() });
                tempLoadingDrivers.push(false);
                if (driver === doc.id) {
                    tempCheckBox.push(true);
                } else {
                    tempCheckBox.push(false);
                }
            });
            setDrivers(tempDrivers);
            setCheckBox(tempCheckBox);
            setLoadingDriver(tempLoadingDrivers);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleAssignDriver = async (uid, idx) => {
        // handle checkbox selection (only one can be selected)
        const newCheckBoxes = Array(checkBox.length).fill(false);
        const newLoadingDrivers = Array(checkBox.length).fill(false);
        newCheckBoxes[idx] = !checkBox[idx];
        newLoadingDrivers[idx] = true;
        setLoadingDriver(newLoadingDrivers);

        const donationRef = doc(db, 'pendingDonations', donationID);

        if (!checkBox[idx]) {
            await updateDoc(donationRef, {
                driver: uid,
            });
            setCurrentDriver(uid);
        } else {
            await updateDoc(donationRef, {
                driver: '',
            });
            setCurrentDriver('');
        }

        newLoadingDrivers[idx] = false;
        setLoadingDriver(newLoadingDrivers);
        setCheckBox(newCheckBoxes);
    };

    useEffect(() => {
        getDrivers();
    }, []);

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {});
    }, [navigation]);

    return (
        <View style={{ height: '100%' }}>
            <SearchBar
                placeholder='Look up name...'
                platform={Platform.OS}
                value={search}
                onChangeText={updateSearch}
            />
            <ScrollView>
                {drivers.map((driver, idx) => {
                    return (
                        <ListItem
                            topDivider={idx === 0}
                            bottomDivider
                            key={driver.uid}
                        >
                            {loadingDriver[idx] ? (
                                <ActivityIndicator />
                            ) : (
                                <ListItem.CheckBox
                                    checked={checkBox[idx]}
                                    onPress={() => {
                                        handleAssignDriver(driver.uid, idx);
                                    }}
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                />
                            )}
                            <ListItem.Content>
                                <ListItem.Title>
                                    {driver.data.firstName}{' '}
                                    {driver.data.lastName1}{' '}
                                    {driver.data.lastName2 !== ''
                                        ? driver.data.lastName2
                                        : ''}
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default AssignDriverScreen;

const styles = StyleSheet.create({});
