import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
    Alert,
    TextInput,
    Image,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LoadingModal from '../../../../components/LoadingModal';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, app } from '../../../firebase/config';
import { CheckBox, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

const ViewScreen = ({ route, navigation }) => {
    const data = route.params.data;
    const id = route.params.id;

    const [loading, setLoading] = useState(false);

    // expiration date modal
    const [dateOpen, setDateOpen] = useState(false);
    const [expiration, setExpiration] = useState(null);

    // packaging modal
    const [packagingModal, setPackagingModal] = useState(false);
    const [packaging, setPackaging] = useState(null);

    // quantity modal
    const [quantityModal, setQuantityModal] = useState(false);
    const [quantity, setQuantity] = useState(null);
    const [tempQuantity, setTempQuantity] = useState(null);

    // receipt image/reason
    const [receipt, setReceipt] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [receiptModal, setReceiptModal] = useState(false);

    const submitDonation = async () => {
        setLoading(true);

        const current = doc(db, 'pickedup', id);
        const currentSnap = await getDoc(current);
        const currentDonation = currentSnap.data();

        await setDoc(doc(db, 'completed', id), currentDonation);
        await deleteDoc(doc(db, 'pickedup', id));

        setLoading(false);
        navigation.navigate('List', {
            refresh: true,
        });
    };

    const getData = async () => {
        setLoading(true);

        const donationRef = doc(db, 'pickedup', id);
        const donationSnap = await getDoc(donationRef);
        const currentData = donationSnap.data();
        const donation = currentData.donation;

        if (donation.updates === undefined) {
            setPackaging(donation.packaging);
            setQuantity(donation.quantity);
            if (donation.type === 'perish') {
                setExpiration(donation.perishable.expiration.toDate());
            }
        } else {
            setPackaging(
                donation.updates.packaging === undefined
                    ? donation.packaging
                    : donation.updates.packaging
            );
            setQuantity(
                donation.updates.quantity === undefined
                    ? donation.quantity
                    : donation.updates.quantity
            );
            if (donation.type === 'perish') {
                setExpiration(
                    donation.updates.expiration === undefined
                        ? donation.perishable.expiration.toDate()
                        : donation.updates.expiration.toDate()
                );
            }
        }

        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    const getReceiptImage = async () => {
        if (data.pickup.receiptImage !== undefined) {
            setImageLoading(true);
            const storage = getStorage(app);
            const reference = ref(storage, data.pickup.receiptImage);
            await getDownloadURL(reference).then((url) => {
                setReceipt(url);
            });
            setImageLoading(false);
        }
    };

    const updatePackaging = async (newPackaging) => {
        setPackagingModal(false);
        if (newPackaging !== packaging) {
            setLoading(true);
            setPackaging(newPackaging);
            const donationRef = doc(db, 'pickedup', id);

            await updateDoc(donationRef, {
                'donation.updates.packaging': newPackaging,
            });

            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };

    const updateQuantity = async (newQuantity) => {
        setQuantityModal(false);

        if (newQuantity === null || newQuantity === '') {
            return;
        }

        if (newQuantity !== quantity) {
            setLoading(true);
            setQuantity(newQuantity);

            const donationRef = doc(db, 'pickedup', id);

            await updateDoc(donationRef, {
                'donation.updates.quantity': newQuantity,
            });

            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };

    const updateExpiration = async (date) => {
        setExpiration(date);

        const donationRef = doc(db, 'pickedup', id);

        await updateDoc(donationRef, {
            'donation.updates.expiration': date,
        });

        setDateOpen(false);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <LoadingModal visible={loading} />
            <DateTimePicker
                isVisible={dateOpen}
                mode='date'
                minimumDate={new Date()}
                onConfirm={updateExpiration}
                onCancel={() => setDateOpen(false)}
                isDarkModeEnabled={false}
            />
            <Modal visible={packagingModal} animationType='fade' transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <View style={{ alignItems: 'flex-end', margin: 12 }}>
                            <Icon
                                name='close'
                                color='#626b79'
                                size={30}
                                onPress={() => {
                                    setPackagingModal(false);
                                }}
                            />
                        </View>
                        <View
                            style={{ marginHorizontal: 16, marginBottom: 28 }}
                        >
                            <Text
                                style={{
                                    marginLeft: 14,
                                    marginBottom: 16,
                                    fontSize: 18,
                                    fontWeight: '600',
                                }}
                            >
                                ¿Cambiar el embalaje?
                            </Text>
                            <CheckBox
                                title='Caja'
                                checked={packaging === 'Caja'}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                onPress={() => updatePackaging('Caja')}
                            />
                            <CheckBox
                                title='Kilos'
                                checked={packaging === 'Kilos'}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                onPress={() => updatePackaging('Kilos')}
                            />
                            <CheckBox
                                title='Unidades'
                                checked={packaging === 'Unidades'}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                onPress={() => updatePackaging('Unidades')}
                            />
                            <CheckBox
                                title='Estivas'
                                checked={packaging === 'Estivas'}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                onPress={() => updatePackaging('Estivas')}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal visible={quantityModal} animationType='fade' transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <View style={{ alignItems: 'flex-end', margin: 12 }}>
                            <Icon
                                name='close'
                                color='#626b79'
                                size={30}
                                onPress={() => {
                                    setQuantityModal(false);
                                }}
                            />
                        </View>
                        <View
                            style={{ marginHorizontal: 16, marginBottom: 28 }}
                        >
                            <Text
                                style={{
                                    marginBottom: 16,
                                    fontSize: 18,
                                    fontWeight: '600',
                                    textAlign: 'center',
                                }}
                            >
                                ¿Cambiar cantidad/peso?
                            </Text>
                            <View style={{ alignItems: 'center' }}>
                                <TextInput
                                    value={tempQuantity}
                                    onChangeText={(text) =>
                                        setTempQuantity(
                                            text.replace(/[^0-9]/g, '')
                                        )
                                    }
                                    style={styles.input}
                                    keyboardType={'numeric'}
                                    defaultValue={quantity}
                                    maxLength={10}
                                />
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={styles.expSubmit}
                                    onPress={() => {
                                        updateQuantity(tempQuantity);
                                    }}
                                >
                                    <Text style={styles.expSubmitText}>
                                        Cambio
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal visible={receiptModal} animationType='fade' transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <View style={{ alignItems: 'flex-end', margin: 12 }}>
                            <Icon
                                name='close'
                                color='#626b79'
                                size={30}
                                onPress={() => {
                                    setReceiptModal(false);
                                }}
                            />
                        </View>
                        {data.pickup.receiptImage === undefined ? (
                            <View style={{ marginBottom: 32 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        textAlign: 'center',
                                        marginBottom: 12,
                                    }}
                                >
                                    Razón por la que falta el recibo:
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: 'gray',
                                        textAlign: 'center',
                                    }}
                                >
                                    "{data.pickup.noReceiptReason}"
                                </Text>
                            </View>
                        ) : (
                            <View
                                style={{
                                    height: 400,
                                    marginHorizontal: '5%',
                                    marginBottom: 32,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {imageLoading ? (
                                    <ActivityIndicator color='gray' size={50} />
                                ) : (
                                    <Image
                                        source={{ uri: receipt }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        resizeMode='cover'
                                    />
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
            <ScrollView>
                <View style={styles.section}>
                    <Text style={styles.header}>Info de donación</Text>
                    <ListItem topDivider bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title>Tipo de producto</ListItem.Title>
                            <ListItem.Subtitle>
                                {data.donation.type === 'perish'
                                    ? 'Perecedero'
                                    : 'No perecedero'}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                    <ListItem
                        bottomDivider
                        onPress={() => setPackagingModal(true)}
                    >
                        <ListItem.Content>
                            <ListItem.Title>Tipo de embalaje</ListItem.Title>
                            <ListItem.Subtitle>{packaging}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                    <ListItem
                        bottomDivider
                        onPress={() => setQuantityModal(true)}
                    >
                        <ListItem.Content>
                            <ListItem.Title>Cantidad/Peso</ListItem.Title>
                            <ListItem.Subtitle>{quantity}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                </View>
                {data.donation.type === 'perish' && (
                    <View style={styles.section}>
                        <Text style={styles.header}>
                            Info de producto perecedero
                        </Text>
                        <ListItem
                            topDivider
                            bottomDivider
                            onPress={() => {
                                Alert.alert(
                                    '¿Cambiar fecha?',
                                    '¿Quieres cambiar la fecha de caducidad?',
                                    [
                                        {
                                            text: 'No',
                                            onPress: () => {},
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Sí',
                                            onPress: () => setDateOpen(true),
                                        },
                                    ]
                                );
                            }}
                        >
                            <ListItem.Content>
                                <ListItem.Title>
                                    Fecha de caducidad
                                </ListItem.Title>
                                <ListItem.Subtitle>
                                    {expiration !== null
                                        ? expiration.toLocaleDateString('es-CO')
                                        : ''}
                                </ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                        {data.donation.perishable.traits !== null && (
                            <ListItem bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>Descripción</ListItem.Title>
                                    <ListItem.Subtitle>
                                        {data.donation.perishable.traits}
                                    </ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        )}
                    </View>
                )}
                <View style={styles.section}>
                    <Text style={styles.header}>Recibo & Firma</Text>
                    <ListItem
                        topDivider
                        bottomDivider
                        onPress={() => {
                            setReceiptModal(true);
                            if (receipt === null) getReceiptImage();
                        }}
                    >
                        <ListItem.Content>
                            <ListItem.Title>
                                ¿Se recogió el recibo?
                            </ListItem.Title>
                            <ListItem.Subtitle>
                                {data.pickup.receiptImage === undefined
                                    ? 'No'
                                    : 'Sí'}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title>¿Firma del donante?</ListItem.Title>
                            <ListItem.Subtitle>
                                {data.pickup.signature === undefined
                                    ? 'No'
                                    : 'Sí'}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.doneButton}
                onPress={() => {
                    Alert.alert(
                        'Confirmar',
                        '¿Estás seguro que quieres enviar? Esto no se puede deshacer.',
                        [
                            {
                                text: 'Enviar',
                                onPress: () => {
                                    submitDonation();
                                },
                            },
                            {
                                text: 'Cancelar',
                                onPress: () => {},
                                style: 'cancel',
                            },
                        ]
                    );
                }}
            >
                <Text style={styles.doneButtonText}>Enviar</Text>
            </TouchableOpacity>
        </>
    );
};

export default ViewScreen;

const styles = StyleSheet.create({
    section: {
        marginBottom: 16,
    },
    header: {
        margin: 16,
        fontSize: 18,
        fontWeight: '600',
    },
    doneButton: {
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0074cb',
    },
    doneButtonText: {
        fontSize: 20,
        color: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.3)',
    },
    modalView: {
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
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        borderRadius: 5,
        width: '50%',
        height: 46,
        textAlign: 'center',
    },
    expSubmit: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        backgroundColor: '#0074cb',
        borderRadius: 3,
        height: 46,
        marginTop: 18,
    },
    expSubmitText: {
        color: 'white',
        fontSize: 16,
    },
});
