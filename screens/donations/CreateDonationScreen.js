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
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
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
        await setDoc(doc(db, 'pendingDonations', data.id), {
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
        resetField('id'),
            resetField('type'),
            resetField('address'),
            resetField('certificate'),
            resetField('productType'),
            resetField('packaging'),
            resetField('quantity'),
            resetField('weight');
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View>
                    <Text style={styles.mainHeader}> New Form</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.topHeader}>
                            {' '}
                            A. General Information{' '}
                        </Text>
                    </View>
                    <Text style={styles.infoHeader}>ID:</Text>
                    <View style={styles.entry}>
                        <Controller
                            style={styles.entry}
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder='70938127309'
                                />
                            )}
                            name='id'
                        />
                        {errors.id && (
                            <Text style={styles.error}>This is required.</Text>
                        )}
                    </View>
                    <Text style={styles.infoHeader}>Type of Client:</Text>
                    <View style={styles.entry}>
                        <Controller
                            style={styles.entry}
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                    </View>

                    <Text style={styles.infoHeader}>Address:</Text>
                    <View style={styles.entry}>
                        <Controller
                            style={styles.entry}
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                    </View>

                    <Text style={styles.infoHeader}>Certificate Required?</Text>
                    <View style={styles.entry}>
                        <Controller
                            style={styles.entry}
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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

                    <Text style={styles.header}> B. Donation Information </Text>
                    <Text style={styles.infoHeader}>Type of Product</Text>
                    <View style={styles.entry}>
                        <Controller
                            style={styles.entry}
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                    </View>

                    <Text style={styles.infoHeader}>Packaging Type</Text>
                    <View style={styles.entry}>
                        <Controller
                            style={styles.entry}
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                    </View>

                    <Text style={styles.infoHeader}>Quantity</Text>
                    <View style={styles.entry}>
                        <Controller
                            style={styles.entry}
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                    </View>

                    <Text style={styles.infoHeader}>Weight</Text>
                    <View style={styles.entry}>
                        <Controller
                            style={styles.entry}
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.clearButton}>
                        <TouchableOpacity
                            onPress={handleClear}
                            style={styles.button}
                        >
                            <Text style={styles.clearText}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateDonationScreen;

const styles = StyleSheet.create({
    rowContainer: {
        flex: 1,
    },
    topHeader: {
        fontFamily: 'Helvetica Neue',
        fontSize: 20,
        paddingTop: 30,
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
        paddingTop: 0,
    },
    mainHeader: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 40,
        paddingTop: 25,
        justifyContent: 'center',
        textAlign: 'center',
    },
    buttonContainer: {
        paddingVertical: 25,
        paddingHorizontal: 110,
    },
    button: {
        elevation: 8,
        backgroundColor: '#186ae7',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center',
        textTransform: 'uppercase',
    },
    header: {
        fontFamily: 'Helvetica Neue',
        fontSize: 20,
        paddingTop: 30,
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
    entry: {
        paddingHorizontal: 5,
    },
});

const { height } = Dimensions.get('screen');
