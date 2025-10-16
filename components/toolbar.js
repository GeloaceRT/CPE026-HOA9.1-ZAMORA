import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Toolbar = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Placeholder</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        alignItems: "center",
        justifyContent: "center",
            marginBottom: 12,
        borderRadius: 12,
        backgroundColor: "#f5f5f5",
    },
    label: {
        color: "#555",
    },
});

export default Toolbar;