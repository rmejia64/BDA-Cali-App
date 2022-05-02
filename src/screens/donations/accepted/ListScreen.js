import {
    StyleSheet,
    View,
    ScrollView,
    RefreshControl,
    Modal,
    TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
    collection,
    getDoc,
    getDocs,
    orderBy,
    query,
    doc,
} from 'firebase/firestore';
import {
    Text,
    Chip,
    ListItem,
    Button,
    CheckBox,
    ThemeProvider,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../../../firebase/config';

const ListScreen = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [donations, setDonations] = useState([]);
    const [dateFilter, setDateFilter] = useState(null);
    const [driverFilter, setDriverFilter] = useState(null);
    const [driverModal, setDriverModal] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);

    // grab all documents in donationForms collection from firebase
    const getAcceptedDonations = async () => {
        setRefreshing(true);
        let forms = [];
        let q;
        const donations = collection(db, 'accepted');

        q = query(donations, orderBy('dateCreated', 'desc'));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                forms.push({
                    id: doc.id,
                    data: data,
                });
            });
            setDonations(forms);
        } catch (error) {
            console.error(error);
        }

        setRefreshing(false);
    };

    const getAllDrivers = async () => {
        let tempDrivers = [];

        const users = collection(db, 'users');
        const userQuery = query(users, where('type', '==', 'driver'));

        try {
            const querySnapshot = await getDoc(userQuery);
            querySnapshot.forEach((doc) => {
                tempDrivers.push({ uid: doc.id, data: doc.data() });
            });
            setDrivers(tempDrivers);
        } catch (error) {
            console.error(error.message);
        }
    };

    const SelectDriverModal = () => {
        return (
            <Modal visible={driverModal}>
                <View style={styles.driverModalContainer}>
                    <View style={styles.driverModalBox}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Icon
                                name='close'
                                color='#626b79'
                                size={30}
                                onPress={() => {
                                    setDriverModal(false);
                                }}
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: '500',
                                marginBottom: 24,
                            }}
                        >
                            Selecciona un conductor
                        </Text>
                        {drivers.length === 0 ? (
                            <Text>No hay controladores disponibles.</Text>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#0074cb',
                                        borderRadius: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 18,
                                            color: 'white',
                                            margin: 10,
                                        }}
                                    >
                                        Obtener todos controladores
                                    </Text>
                                </TouchableOpacity>
                                <ScrollView></ScrollView>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        );
    };

    useEffect(() => {
        // refresh will trigger when the list screen is focused
        navigation.addListener('focus', () => {
            getAcceptedDonations();
        });
    });

    useEffect(() => {
        getAcceptedDonations();
    }, [refreshKey]);

    useEffect(() => {
        getAllDrivers();
    }, []);

    return (
        <>
            <SelectDriverModal />
            <View
                style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingRight: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginVertical: 10,
                    }}
                >
                    <Chip
                        title={
                            driverFilter === null
                                ? 'Todos conductores'
                                : driverFilter
                        }
                        icon={{
                            name: 'truck',
                            type: 'material-community',
                            size: 20,
                            color: 'white',
                        }}
                        containerStyle={{
                            paddingLeft: 10,
                        }}
                        buttonStyle={{
                            backgroundColor: '#0074cb',
                        }}
                        onPress={() => {
                            setDriverModal(true);
                        }}
                    />
                    <Chip
                        title={
                            dateFilter === null ? 'Todas fechas' : dateFilter
                        }
                        icon={{
                            name: 'calendar',
                            type: 'material-community',
                            size: 20,
                            color: 'white',
                        }}
                        containerStyle={{
                            paddingLeft: 10,
                        }}
                        buttonStyle={{
                            backgroundColor: '#0074cb',
                        }}
                        onPress={() => {}}
                    />
                </View>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getAcceptedDonations}
                    />
                }
            >
                {donations.length === 0 && (
                    <View style={styles.noDonations}>
                        <Text
                            style={{
                                fontWeight: '400',
                                fontSize: 24,
                                color: '#626b79',
                            }}
                        >
                            Sin nuevas donaciones.
                        </Text>
                    </View>
                )}
                <View style={styles.donations}>
                    {donations.map((pd, idx) => {
                        const data = pd.data;
                        const id = pd.id;
                        return (
                            <ListItem
                                key={id}
                                onPress={() => {
                                    navigation.push('View', {
                                        id: id,
                                        data: data,
                                    });
                                }}
                                topDivider={idx === 0}
                                bottomDivider
                            >
                                <ListItem.Content>
                                    <ListItem.Title>
                                        {data.org !== undefined
                                            ? data.org.name
                                            : data.indiv.name.first +
                                              ' ' +
                                              data.indiv.name.last1 +
                                              (data.indiv.name.last2 === null
                                                  ? ''
                                                  : ` ${data.indiv.name.last2}`)}
                                    </ListItem.Title>
                                    <ListItem.Content
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-around',
                                            width: '100%',
                                            marginTop: 10,
                                        }}
                                    >
                                        <View>
                                            <Text>Conductor:</Text>
                                            <Text>
                                                {data.pickup.driverName}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text>Fecha:</Text>
                                            <Text>
                                                {data.pickup.date
                                                    .toDate()
                                                    .toLocaleDateString(
                                                        'es-CO'
                                                    )}
                                            </Text>
                                        </View>
                                    </ListItem.Content>
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
        paddingBottom: 10,
        marginTop: 20,
    },
    filterContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
    },
    filterBox: {
        justifyContent: 'center',
        padding: 20,
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    filterHeading: {
        marginLeft: 10,
        marginBottom: 5,
        fontSize: 18,
    },
    cardText: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    donations: {
        width: '100%',
    },
    noDonations: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
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
    driverModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    driverModalBox: {
        width: '100%',
        height: '100%',
    },
});
