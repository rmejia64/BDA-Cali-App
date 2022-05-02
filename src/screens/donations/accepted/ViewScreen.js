import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import LoadingModal from '../../../../components/LoadingModal';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';

const ViewScreen = ({ route, navigation }) => {
    const data = route.params.data;
    const id = route.params.id;
    const pickupDate = data.pickup.date.toDate().toLocaleDateString('es-CO');

    const [loading, setLoading] = useState(false);

    const moveBack = async () => {
        setLoading(true);

        const current = doc(db, 'accepted', id);
        const currentSnap = await getDoc(current);
        const currentDonation = currentSnap.data();

        await setDoc(doc(db, 'pending', id), currentDonation);
        await deleteDoc(doc(db, 'accepted', id));

        setLoading(false);
        navigation.goBack();
    };

    return (
        <View>
            <LoadingModal visible={loading} />
            <ScrollView>
                <ListItem topDivider bottomDivider>
                    <Icon name='truck' size={25} />
                    <ListItem.Content>
                        <ListItem.Title>Conductor</ListItem.Title>
                        <ListItem.Subtitle>
                            {data.pickup.driverName}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <Icon name='calendar-today' size={25} />
                    <ListItem.Content>
                        <ListItem.Title>Fecha de recogida</ListItem.Title>
                        <ListItem.Subtitle>{pickupDate}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    topDivider
                    bottomDivider
                    style={{ marginTop: 32 }}
                    onPress={() => {
                        Alert.alert(
                            'Confirmar',
                            '¿Estás seguro de que deseas que esta donación vuelva a estar pendiente?',
                            [
                                {
                                    text: 'Cancelar',
                                    onPress: () => {},
                                    style: 'cancel',
                                },
                                {
                                    text: 'Moverse',
                                    onPress: () => {
                                        moveBack();
                                    },
                                },
                            ]
                        );
                    }}
                >
                    <Icon name='arrow-left' size={25} color='#0074cb' />
                    <ListItem.Content>
                        <ListItem.Title style={{ color: '#0074cb' }}>
                            Volver a pendiente
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <Text
                    style={{
                        paddingTop: 32,
                        textAlign: 'center',
                        marginHorizontal: 32,
                        color: '#626b79',
                    }}
                >
                    Para realizar cambios, debe volver a mover la donación a
                    pendiente.
                </Text>
            </ScrollView>
        </View>
    );
};

export default ViewScreen;

const styles = StyleSheet.create({});
