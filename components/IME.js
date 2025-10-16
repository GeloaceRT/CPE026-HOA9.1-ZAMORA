import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Toolbar = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Placeholder Input</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		color: "#999",
	},
});

export default Toolbar;