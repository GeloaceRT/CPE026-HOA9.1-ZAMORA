import React from "react";
import { StyleSheet, View, Text } from "react-native";

const MessageList = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.placeholder}>Messages will be here</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	placeholder: {
		fontSize: 16,
		color: "#777",
	},
});

export default MessageList;