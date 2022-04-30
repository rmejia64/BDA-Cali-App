import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Platform,
    ActivityIndicator,
    Modal,
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
    deleteField,
} from 'firebase/firestore';
import { ListItem, SearchBar } from 'react-native-elements';
import LoadingModal from '../../../../components/LoadingModal';

const AssignDriverScreen = ({ route, navigation }) => {
    const { id, driver } = route.params;
    const [drivers, setDrivers] = useState([]);
    const [search, setSearch] = useState('');
    const [checkBox, setCheckBox] = useState([]);
    const [loading, setLoading] = useState('false');
    const [loadingDriver, setLoadingDriver] = useState([]);

    const updateSearch = (search) => {
        setSearch(search);
    };

    const getDrivers = async () => {
        let tempDrivers = [];
        let tempCheckBox = [];
        let tempLoadingDrivers = [];

        const users = collection(db, 'users');
        const userQuery = query(users, where('type', '==', 'driver'));

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

    const handleAssignDriver = async (driver, idx) => {
        setLoading(true);
        // handle checkbox selection (only one can be selected)
        const newCheckBoxes = Array(checkBox.length).fill(false);
        const newLoadingDrivers = Array(checkBox.length).fill(false);
        newCheckBoxes[idx] = !checkBox[idx];
        newLoadingDrivers[idx] = true;
        setLoadingDriver(newLoadingDrivers);

        const donationRef = doc(db, 'pending', id);

        if (!checkBox[idx]) {
            await updateDoc(donationRef, {
                'pickup.driver': driver.uid,
                'pickup.driverName': `${driver.data.name.first} ${
                    driver.data.name.last1
                }${
                    driver.data.name.last2 === null
                        ? ''
                        : ` ${driver.data.name.last2}`
                }`,
            });
        } else {
            await updateDoc(donationRef, {
                'pickup.driver': deleteField(),
                'pickup.driverName': deleteField(),
            });
        }

        newLoadingDrivers[idx] = false;
        setLoadingDriver(newLoadingDrivers);
        setLoading(false);
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
            <LoadingModal visible={loading} />
            <SearchBar
                placeholder='Buscar nombre...'
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
                            <ListItem.CheckBox
                                checked={checkBox[idx]}
                                onPress={() => {
                                    handleAssignDriver(driver, idx);
                                }}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                            />
                            <ListItem.Content>
                                <ListItem.Title>
                                    {driver.data.name.first}{' '}
                                    {driver.data.name.last1}{' '}
                                    {driver.data.name.last2 !== ''
                                        ? driver.data.name.last2
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

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        backgroundColor: 'grey',
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
