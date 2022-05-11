import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { doc, updateDoc, deleteField } from 'firebase/firestore';
import { ListItem } from 'react-native-elements';
import LoadingModal from '../../../../components/LoadingModal';
import { useSelector } from 'react-redux';

const AssignDriverScreen = ({ route, navigation }) => {
    const drivers = useSelector((state) => state.user.drivers);

    const { id, driver } = route.params;
    const [checkBox, setCheckBox] = useState([]);
    const [loading, setLoading] = useState('false');
    const [loadingDriver, setLoadingDriver] = useState([]);

    const getDrivers = async () => {
        let tempCheckBox = [];
        let tempLoadingDrivers = [];

        try {
            drivers.forEach((d) => {
                tempLoadingDrivers.push(false);
                if (driver === d.uid) {
                    tempCheckBox.push(true);
                } else {
                    tempCheckBox.push(false);
                }
            });
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
                'pickup.driverPlate': driver.data.plate,
            });
        } else {
            await updateDoc(donationRef, {
                'pickup.driver': deleteField(),
                'pickup.driverName': deleteField(),
                'pickup.driverPlate': deleteField(),
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

    return (
        <View style={{ height: '100%' }}>
            <LoadingModal visible={loading} />
            <ScrollView>
                {drivers.map((driver, idx) => {
                    const name = driver.data.name;
                    const plate = driver.data.plate;
                    const [first, last1, last2] = [
                        name.first,
                        name.last1,
                        name.last2,
                    ];
                    const driverName = `${first} ${last1}${
                        last2 !== '' ? ` ${last2}` : ''
                    }`;
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
                                    {`${plate} (${driverName})`}
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
