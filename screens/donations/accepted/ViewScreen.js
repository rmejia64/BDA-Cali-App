import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const ViewScreen = ({ route, navigation }) => {
    const { id, email, name } = route.params;

    return (
        <View>
            <Text>id: {id}</Text>
            <Text>email: {email}</Text>
            <Text>name: {name}</Text>
            <TouchableOpacity>
                <Text>Move back to pending</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ViewScreen;

const styles = StyleSheet.create({});
