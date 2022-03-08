import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Image,
    Button,
    SafeAreaView,
    TextInput,
    ScrollView,
} from 'react-native';
import React from 'react';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { db } from '../../firebase';

const CreateDonationScreen = () => {
    const {
        control,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm({
        defaultValues: {
            id: '',
            type: '',
            address: '',
            certificate: '',
            productType: '',
            packaging: '',
            quantity: '',
            weight: '',
        },
    });
    const onSubmit = async (data) => {
        await addDoc(collection(db, 'pendingDonations'), {
            dateCreated: new Date(),
            address: data.address,
            certificate: data.certificate,
            packaging: data.certificate,
            productType: data.productType,
            quantity: data.quantity,
            type: data.type,
            weight: data.weight,
        });
        handleClear();
    };

    const handleClear = () => {
        resetField('type'),
            resetField('address'),
            resetField('certificate'),
            resetField('productType'),
            resetField('packaging'),
            resetField('quantity'),
            resetField('weight');
    };

    return (
        <KeyboardAwareScrollView>
            <View style={styles.container}>
                <View>
                    <Text style={styles.mainHeader}> New Form</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.header}> A. General Information</Text>

                    <Text style={styles.infoHeader}>Type of Client:</Text>

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder='Individual or Organization'
                            />
                        )}
                        name='type'
                    />
                    {errors.type && (
                        <Text style={styles.error}>This is required.</Text>
                    )}

                    <Text style={styles.infoHeader}>Address:</Text>

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder='Address'
                            />
                        )}
                        name='address'
                    />
                    {errors.address && (
                        <Text style={styles.error}>This is required.</Text>
                    )}

                    <Text style={styles.infoHeader}>Certificate Required?</Text>

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder='Yes/No'
                            />
                        )}
                        name='certificate'
                    />
                    {errors.certificate && (
                        <Text style={styles.error}>This is required.</Text>
                    )}
                </View>
                <View style={styles.section}>
                    <Text style={styles.header}> B. Donation Information </Text>
                    <Text style={styles.infoHeader}>Type of Product</Text>

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder='Perishable/Non-Perishable'
                            />
                        )}
                        name='productType'
                    />
                    {errors.productType && (
                        <Text style={styles.error}>This is required.</Text>
                    )}

                    <Text style={styles.infoHeader}>Packaging Type</Text>

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder='Type of Packaging'
                            />
                        )}
                        name='packaging'
                    />
                    {errors.packaging && (
                        <Text style={styles.error}>This is required.</Text>
                    )}

                    <Text style={styles.infoHeader}>Quantity</Text>

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder='e.g. # of boxes'
                            />
                        )}
                        name='quantity'
                    />
                    {errors.quantity && (
                        <Text style={styles.error}>This is required.</Text>
                    )}

                    <Text style={styles.infoHeader}>Weight</Text>

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder='In Kilos'
                            />
                        )}
                        name='weight'
                    />
                    {errors.weight && (
                        <Text style={styles.error}>This is required.</Text>
                    )}
                </View>

                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Submit</Text>
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
    error: {
        color: 'red',
        paddingLeft: 4,
    },
    section: {
        width: '80%',
        marginTop: 20,
    },
    mainHeader: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 40,
    },
    button: {
        backgroundColor: '#0c4484',
        width: '80%',
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
        fontFamily: 'Helvetica Neue',
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
    infoHeader: {
        paddingTop: 10,
        paddingLeft: 5,
    },
});

const { height } = Dimensions.get('screen');
