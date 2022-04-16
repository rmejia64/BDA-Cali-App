import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ActionSheetIOS,
    Platform,
    ActivityIndicator,
    Modal,
} from 'react-native';
import React from 'react';
import { useState, useEffect } from 'react';
import { set, useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../firebase/config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CreateDonationScreen = () => {
    const [clientType, setClientType] = useState('Individual');
    const [orgName, setOrgName] = useState('');
    const [indivFirstName, setIndivFirstName] = useState('');
    const [indivLastNames, setIndivLastNames] = useState('');
    const [address, setAddress] = useState('');
    const [certReq, setCertReq] = useState('Required');
    const [productType, setProductType] = useState('Perishable');
    const [packaging, setPackaging] = useState('');
    const [quantity, setQuantity] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const clientTypeButtons = ['Cancel', 'Individual', 'Organization'];
    const certReqButtons = ['Cancel', 'Required', 'Not required'];
    const productTypeButtons = ['Cancel', 'Perishable', 'Non-perishable'];

    function Dropdown(props) {
        if (Platform.OS === 'ios') {
            let buttons = [];
            let text = '';
            if (props.type === 'clientType') {
                buttons = clientTypeButtons;
                text = clientType;
            } else if (props.type === 'certReq') {
                buttons = certReqButtons;
                text = certReq;
            } else if (props.type === 'productType') {
                buttons = productTypeButtons;
                text = productType;
            }
            return (
                <TouchableOpacity
                    style={styles.actionSheetButton}
                    onPress={() => {
                        ActionSheetIOS.showActionSheetWithOptions(
                            { options: buttons, cancelButtonIndex: 0 },
                            (buttonIndex) => {
                                if (buttonIndex !== 0) {
                                    if (props.type === 'clientType') {
                                        setClientType(buttons[buttonIndex]);
                                    } else if (props.type === 'certReq') {
                                        setCertReq(buttons[buttonIndex]);
                                    } else if (props.type === 'productType') {
                                        setProductType(buttons[buttonIndex]);
                                    }
                                }
                            }
                        );
                    }}
                >
                    <Text>{text}</Text>
                    <Icon name='menu-down' size={20} />
                </TouchableOpacity>
            );
        }
        return null;
    }

    function SubmitButton() {
        if (isLoading) {
            return <ActivityIndicator />;
        } else {
            return <Text style={styles.buttonText}>Submit</Text>;
        }
    }

    const inputsValid = () => {
        if (
            clientType === 'Individual' &&
            (indivFirstName === '' || indivLastNames === '')
        ) {
            return false;
        }
        if (clientType === 'Organization' && orgName === '') {
            return false;
        }
        if (address === '') {
            return false;
        }
        if (packaging === '') {
            return false;
        }
        if (quantity === '') {
            return false;
        }
        if (weight === '') {
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        if (clientType === 'Individual') {
            setOrgName('');
        } else {
            setIndivFirstName('');
            setIndivLastNames('');
        }

        if (notes.startsWith('generate')) {
            const amount = notes.split(' ')[1];
            for (let i = 0; i < amount; i++) {
                let data = {
                    dateCreated: new Date(),
                    client: {
                        type: i % 2 === 0 ? 'Organization' : 'Individual',
                        organization: i % 2 === 0 ? 'Org ' + i : '',
                        firstName: i % 2 !== 0 ? 'First' : '',
                        lastNames: i % 2 !== 0 ? 'Last ' + i : '',
                    },
                    address: i + ' Test St., Santa Clara, CA',
                    certificate: i % 3 === 0 ? false : true,
                    productType: i % 2 === 0 ? 'Perishable' : 'Non-perishable',
                    packaging: 'Boxes',
                    notes: 'This is a sample donation',
                    quantity: 20,
                    weight: 40,
                    driver: '',
                    pickupDate: null,
                };
                await addDoc(collection(db, 'pendingDonations'), data);
            }
            handleClear();
            setIsLoading(false);
            return;
        }

        if (inputsValid() === true) {
            let data = {
                dateCreated: new Date(),
                client: {
                    type: clientType,
                    organization: orgName,
                    firstName: indivFirstName.trim(),
                    lastNames: indivLastNames.trim(),
                },
                address,
                certificate: certReq === 'Required' ? true : false,
                productType,
                packaging,
                notes,
                quantity: parseInt(quantity),
                weight: parseInt(weight),
                driver: '',
                pickupDate: null,
            };

            await addDoc(collection(db, 'pendingDonations'), data);
            handleClear();
        } else {
            alert('Please fill out all required fields.');
        }
        setIsLoading(false);
    };

    const handleClear = () => {
        setOrgName('');
        setIndivFirstName('');
        setIndivLastNames('');
        setAddress('');
        setPackaging('');
        setQuantity('');
        setWeight('');
        setNotes('');
    };

    return (
        <KeyboardAwareScrollView>
            <View style={styles.container}>
                <View>
                    <Text style={styles.mainHeader}> New Form</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.header}> A. General Information</Text>

                    <Text style={styles.infoHeader}>
                        Type of Client: <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                    <Dropdown type='clientType' />
                    <Picker
                        selectedValue={clientType}
                        onValueChange={(itemValue, itemIndex) => {
                            setClientType(itemValue);
                        }}
                        style={Platform.OS === 'ios' ? { display: 'none' } : {}}
                    >
                        <Picker.Item label='Individual' value='Individual' />
                        <Picker.Item
                            label='Organization'
                            value='Organization'
                        />
                    </Picker>

                    <View
                        style={
                            clientType === 'Organization'
                                ? { display: 'none' }
                                : {}
                        }
                    >
                        <Text style={styles.infoHeader}>
                            First Name: <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <TextInput
                            placeholder='Adrian'
                            value={indivFirstName}
                            onChangeText={setIndivFirstName}
                            style={styles.input}
                        />
                        <Text style={styles.infoHeader}>
                            Last Name(s):{' '}
                            <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <TextInput
                            placeholder='Ramirez Lopez'
                            value={indivLastNames}
                            onChangeText={setIndivLastNames}
                            style={styles.input}
                        />
                    </View>
                    <View
                        style={
                            clientType === 'Individual'
                                ? { display: 'none' }
                                : {}
                        }
                    >
                        <Text style={styles.infoHeader}>
                            Organization Name:{' '}
                            <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <TextInput
                            placeholder='Coca-cola'
                            value={orgName}
                            onChangeText={setOrgName}
                            style={styles.input}
                        />
                    </View>

                    <Text style={styles.infoHeader}>
                        Address: <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                    <TextInput
                        placeholder=''
                        value={address}
                        onChangeText={setAddress}
                        style={styles.input}
                        selectTextOnFocus
                    />

                    <Text style={styles.infoHeader}>
                        Certificate Required?{' '}
                        <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                    <Dropdown type='certReq' />
                    <Picker
                        selectedValue={certReq}
                        onValueChange={(itemValue, itemIndex) => {
                            setCertReq(itemValue);
                        }}
                        style={Platform.OS === 'ios' ? { display: 'none' } : {}}
                    >
                        <Picker.Item label='Required' value='Required' />
                        <Picker.Item
                            label='Not required'
                            value='Not required'
                        />
                    </Picker>
                </View>
                <View style={styles.section}>
                    <Text style={styles.header}> B. Donation Information </Text>
                    <Text style={styles.infoHeader}>
                        Type of Product <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                    <Dropdown type='productType' />
                    <Picker
                        selectedValue={productType}
                        onValueChange={(itemValue, itemIndex) => {
                            setProductType(itemValue);
                        }}
                        style={Platform.OS === 'ios' ? { display: 'none' } : {}}
                    >
                        <Picker.Item label='Perishable' value='Perishable' />
                        <Picker.Item
                            label='Non-perishable'
                            value='Non-perishable'
                        />
                    </Picker>

                    <Text style={styles.infoHeader}>
                        Packaging Type <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                    <TextInput
                        placeholder='p. ej. Boxes, Palettes'
                        value={packaging}
                        onChangeText={setPackaging}
                        style={styles.input}
                    />

                    <Text style={styles.infoHeader}>
                        Quantity <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                    <TextInput
                        placeholder='p. ej. # of boxes'
                        value={quantity}
                        onChangeText={(text) =>
                            setQuantity(text.replace(/[^0-9]/g, ''))
                        }
                        style={styles.input}
                        keyboardType='numeric'
                    />

                    <Text style={styles.infoHeader}>
                        Weight (kg) <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                    <TextInput
                        placeholder='p. ej. 100'
                        value={weight}
                        onChangeText={(text) =>
                            setWeight(text.replace(/[^0-9]/g, ''))
                        }
                        style={styles.input}
                        keyboardType='numeric'
                    />

                    <Text style={styles.infoHeader}>Notes</Text>
                    <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        multiLine={true}
                        style={[styles.input, styles.largeInput]}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.button}
                    disabled={isLoading}
                >
                    <SubmitButton />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleClear}
                    style={styles.clearButton}
                >
                    <Text style={styles.hyperlink}>Clear</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default CreateDonationScreen;

const styles = StyleSheet.create({
    actionSheetButton: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
        padding: 15,
        marginTop: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 30,
    },
    clearButton: {
        paddingBottom: 15,
        paddingHorizontal: 110,
    },
    clearText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    section: {
        width: '85%',
        marginTop: 20,
    },
    mainHeader: {
        fontSize: 40,
    },
    button: {
        backgroundColor: '#0c4484',
        width: '85%',
        marginTop: 30,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    clearButton: {
        marginTop: 15,
        textAlign: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
    },
    hyperlink: {
        color: '#0c4484',
        fontWeight: '700',
        fontSize: 16,
    },
    header: {
        fontSize: 20,
        paddingTop: 15,
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 15,
        marginTop: 10,
    },
    largeInput: {
        textAlignVertical: 'top',
    },
    infoHeader: {
        paddingTop: 10,
        paddingLeft: 5,
    },
});

const { height } = Dimensions.get('screen');
