import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { auth, db } from "../../firebase";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";

const DonationsScreen = () => {
    const getDonationForms = async () => {
        const querySnapshot = await getDocs(collection(db, "donationForms"));
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    };

    return (
        <View>
            <Text>Donations</Text>
            <TouchableOpacity onPress={getDonationForms}>
                <Text>Get donation forms</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DonationsScreen;

const styles = StyleSheet.create({});
