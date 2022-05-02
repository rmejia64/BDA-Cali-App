import {
    Image,
    Modal,
    Platform,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Button, CheckBox } from 'react-native-elements';
import { app, db, auth } from '../../../firebase/config';
import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes,
} from 'firebase/storage';
import {
    deleteDoc,
    doc,
    getDoc,
    query,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Formik } from 'formik';
import SignatureScreen from 'react-native-signature-canvas';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as FileSystem from 'expo-file-system';
import LoadingModal from '../../../../components/LoadingModal';

const ViewScreen = ({ route, navigation }) => {
    const params = route.params;
    const [hasReceipt, setHasReceipt] = useState('yes');
    const [image, setImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [signature, setSignature] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signatureVisible, setSignatureVisible] = useState(false);

    const askForPermissions = async (type) => {
        if (Platform.OS !== 'web') {
            if (type === 'camera') {
                const { status } =
                    await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    alert('Please allow camera permissions.');
                }
            }
            if (type === 'cameraroll') {
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Please allow camera roll permissions.');
                }
            }
        }
    };

    const uploadImagesAsync = async () => {
        const storage = getStorage(app);
        const receiptImgID = `receipts/${uuidv4()}`;
        const receiptImgRef = ref(storage, receiptImgID);
        const signatureImgID = `signatures/${signature.split('/').pop()}`;
        const signatureImgRef = ref(storage, signatureImgID);

        // if the donation already had a receipt image, delete it
        if (params.data.pickup.receiptImage !== undefined) {
            const oldImgRef = ref(storage, params.data.pickup.receiptImage);
            deleteObject(oldImgRef)
                .then(() => {})
                .catch((e) => console.error(e));
        }

        if (signature !== null && params.data.signatureImage !== undefined) {
            const oldSignatureRef = ref(storage, params.data.signatureImage);
            deleteObject(oldSignatureRef)
                .then(() => {})
                .catch((e) => console.error(e));
        }

        try {
            const receiptImg = await fetch(image);
            const receiptBytes = await receiptImg.blob();
            await uploadBytes(receiptImgRef, receiptBytes);

            const signatureImg = await fetch(signature);
            const signatureBytes = await signatureImg.blob();
            await uploadBytes(signatureImgRef, signatureBytes);

            const donationRef = doc(db, 'accepted', params.id);
            await updateDoc(donationRef, {
                'pickup.receiptImage': receiptImgID,
                'pickup.signatureImage': signatureImgID,
            });
        } catch (e) {
            console.error(e);
            alert('Image upload failed, please try again.');
        }
    };

    const pickImage = async () => {
        askForPermissions('cameraroll');

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const takePhoto = async () => {
        askForPermissions('camera');

        let result = await ImagePicker.launchCameraAsync({
            aspect: [4, 3],
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const getDonationImages = async () => {
        setLoading(true);

        const storage = getStorage(app);

        if (params.data.pickup.receiptImage !== undefined) {
            const reference = ref(storage, params.data.pickup.receiptImage);
            await getDownloadURL(reference).then((url) => {
                setImage(url);
            });
        }

        if (params.data.pickup.signatureImage !== undefined) {
            const reference = ref(storage, params.data.pickup.signatureImage);
            await getDownloadURL(reference).then((url) => {
                setSignature(url);
            });
        }

        setLoading(false);
    };

    const handleDonationSubmit = async (values) => {
        setLoading(true);
        setIsSubmitting(true);

        const donationRef = doc(db, 'pickedup', params.id);
        let data = params.data;

        if (hasReceipt === 'no' && values.noReceiptReason) {
            data.pickup.noReceiptReason = values.noReceiptReason;
        }

        if (hasReceipt === 'yes' && image !== null) {
            await uploadImagesAsync();
        }

        await setDoc(donationRef, data);
        await deleteDoc(doc(db, 'accepted', params.id));
        navigation.navigate({
            name: 'List',
            merge: true,
        });

        setLoading(false);
        setIsSubmitting(false);
    };

    const SignatureModal = () => {
        const ref = useRef();

        const handleCancel = () => {
            setSignatureVisible(false);
            ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
        };

        const handleOK = (signature) => {
            const uuid = uuidv4();
            setSignatureVisible(false);
            ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );

            setLoading(true);

            const path = FileSystem.cacheDirectory + `${uuid}.png`;
            FileSystem.writeAsStringAsync(
                path,
                signature.split('data:image/png;base64,')[1],
                { encoding: FileSystem.EncodingType.Base64 }
            )
                .then(() => {
                    FileSystem.getInfoAsync(path, {
                        size: true,
                        md5: true,
                    }).then(() => {
                        setSignature(path);
                    });
                })
                .catch((error) => {
                    console.error(error);
                });

            setLoading(false);
        };

        const handleConfirm = () => {
            ref.current.readSignature();
        };

        const handleClear = () => {
            console.log('clear');
            ref.current.clearSignature();
        };

        return (
            <Modal
                visible={signatureVisible}
                supportedOrientations={['portrait', 'landscape']}
            >
                <SignatureScreen
                    ref={ref}
                    onOK={handleOK}
                    webStyle={`
                            .m-signature-pad--footer {
                                display: none;
                                margin: 0px;
                            }
                        `}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 24,
                    }}
                >
                    <Button
                        title='Cancelar'
                        icon={{
                            name: 'arrow-left',
                            type: 'material-community',
                            color: 'white',
                        }}
                        buttonStyle={{
                            backgroundColor: '#df0b37',
                            marginLeft: 40,
                        }}
                        onPress={handleCancel}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            title='Limpiar'
                            onPress={handleClear}
                            buttonStyle={{
                                backgroundColor: 'grey',
                                marginRight: 20,
                            }}
                        />
                        <Button
                            title='Entregar'
                            onPress={handleConfirm}
                            buttonStyle={{ marginRight: 40 }}
                        />
                    </View>
                </View>
            </Modal>
        );
    };

    useEffect(async () => {
        await getDonationImages();
    }, []);

    return (
        <View>
            <LoadingModal visible={loading} />
            <SignatureModal />
            <Formik
                initialValues={{ noReceiptReason: '' }}
                onSubmit={(values) => {
                    Alert.alert(
                        'Confirmar',
                        '¿Estás seguro de que quieres enviar esta donación?',
                        [
                            {
                                text: 'Entregar',
                                onPress: () => {
                                    handleDonationSubmit(values);
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
                validateOnChange={false}
                validateOnBlur={false}
                validate={(values) => {
                    const errors = {};
                    if (signature === null) {
                        errors.signature = 'Firma del donante';
                    }
                    if (hasReceipt === 'no' && !values.noReceiptReason) {
                        errors.noReceiptReason = 'Falta el motivo del recibo';
                    }
                    if (hasReceipt === 'yes' && image === null) {
                        errors.receiptPicture = 'Foto de recibo';
                    }

                    if (Object.keys(errors).length !== 0) {
                        let missing = '';
                        let i = 0;
                        for (const error in errors) {
                            missing += `- ${errors[error]}`;
                            if (i !== Object.keys(errors).length - 1) {
                                missing += '\n';
                            }
                            i++;
                        }
                        Alert.alert('Información faltante', `${missing}`);
                    }
                    return errors;
                }}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                }) => (
                    <KeyboardAvoidingView
                        style={{
                            height: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <ScrollView>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.header}>
                                    Firma del donante{' '}
                                    <Text style={{ color: 'red' }}>*</Text>
                                </Text>
                                {signature !== null && (
                                    <TouchableOpacity
                                        style={{
                                            width: '70%',
                                            height: 100,
                                            marginBottom: 24,
                                            backgroundColor: 'white',
                                            borderRadius: 5,
                                            borderWidth: 2,
                                            borderColor: '#0074cb',
                                        }}
                                        onPress={() => {
                                            setSignatureVisible(true);
                                            ScreenOrientation.lockAsync(
                                                ScreenOrientation
                                                    .OrientationLock
                                                    .LANDSCAPE_RIGHT
                                            );
                                        }}
                                    >
                                        <Image
                                            source={{ uri: signature }}
                                            style={styles.signatureBox}
                                        />
                                    </TouchableOpacity>
                                )}
                                <View style={{ width: '50%' }}>
                                    <Button
                                        title='Pantalla abierta'
                                        onPress={() => {
                                            setSignatureVisible(true);
                                            ScreenOrientation.lockAsync(
                                                ScreenOrientation
                                                    .OrientationLock
                                                    .LANDSCAPE_RIGHT
                                            );
                                        }}
                                        buttonStyle={
                                            errors.signature &&
                                            styles.buttonError
                                        }
                                    />
                                </View>
                            </View>
                            <View>
                                <Text style={styles.header}>
                                    El donante tiene recibo?{' '}
                                    <Text style={{ color: 'red' }}>*</Text>
                                </Text>
                                <View style={{ alignItems: 'center' }}>
                                    <CheckBox
                                        title='Sí'
                                        checked={hasReceipt === 'yes'}
                                        onPress={() => setHasReceipt('yes')}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        containerStyle={{ width: '80%' }}
                                    />
                                    <CheckBox
                                        title='No'
                                        checked={hasReceipt === 'no'}
                                        onPress={() => setHasReceipt('no')}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        containerStyle={{ width: '80%' }}
                                    />
                                </View>
                                {hasReceipt === 'yes' ? (
                                    <>
                                        <View style={styles.imageContainer}>
                                            {!imageLoading ? (
                                                image !== null && (
                                                    <Image
                                                        source={{
                                                            uri: image,
                                                        }}
                                                        style={{
                                                            width: '80%',
                                                            height: 350,
                                                        }}
                                                    />
                                                )
                                            ) : (
                                                <ActivityIndicator
                                                    color='grey'
                                                    size='large'
                                                />
                                            )}
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-evenly',
                                                marginTop: 15,
                                                marginBottom: 24,
                                            }}
                                        >
                                            <View style={{ width: '35%' }}>
                                                <Button
                                                    buttonStyle={[
                                                        { width: '100%' },
                                                        errors.receiptPicture
                                                            ? styles.buttonError
                                                            : '',
                                                    ]}
                                                    title='Subir'
                                                    onPress={pickImage}
                                                    icon={{
                                                        name: 'image',
                                                        type: 'material-community',
                                                        color: 'white',
                                                    }}
                                                />
                                            </View>
                                            <View style={{ width: '35%' }}>
                                                <Button
                                                    buttonStyle={[
                                                        { width: '100%' },
                                                        errors.receiptPicture
                                                            ? styles.buttonError
                                                            : '',
                                                    ]}
                                                    title='Captura'
                                                    onPress={takePhoto}
                                                    icon={{
                                                        name: 'camera',
                                                        type: 'material-community',
                                                        color: 'white',
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </>
                                ) : (
                                    <View
                                        style={{
                                            marginTop: 18,
                                            marginBottom: 24,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <View style={{ width: '80%' }}>
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Falta el motivo del recibo:{' '}
                                                <Text style={{ color: 'red' }}>
                                                    *
                                                </Text>
                                            </Text>
                                            <TextInput
                                                onChangeText={handleChange(
                                                    'noReceiptReason'
                                                )}
                                                onBlur={handleBlur(
                                                    'noReceiptReason'
                                                )}
                                                value={values.noReceiptReason}
                                                multiline
                                                style={[
                                                    styles.input,
                                                    errors.noReceiptReason
                                                        ? styles.error
                                                        : '',
                                                ]}
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Text style={{ color: 'white', fontSize: 24 }}>
                                RECOGIDO
                            </Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                )}
            </Formik>
        </View>
    );
};

export default ViewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContainer: {
        width: '100%',
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 24,
    },
    uploadButtons: {
        flexDirection: 'row',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingBottom: 15,
        paddingTop: 15,
        borderRadius: 15,
        marginTop: 10,
        textAlignVertical: 'center',
    },
    error: {
        borderColor: '#df0b37',
        borderStyle: 'solid',
        borderWidth: 2,
    },
    buttonError: {
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#df0b37',
        borderRadius: 5,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    signatureBox: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 5,
        overflow: 'hidden',
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#0074cb',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
});
