import React, { useEffect, useState } from "react";
import { Platform, StatusBar, StyleSheet, View, Text } from "react-native";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";

export default function Status() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    let isMounted = true;

    NetInfo.fetch().then(state => {
      if (isMounted) {
        setInfo(state.isConnected ? "connected" : "none");
      }
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      if (isMounted) {
        setInfo(state.isConnected ? "connected" : "none");
      }
      console.log("Network status changed", state.isConnected ? "connected" : "none");
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const isConnected = info !== "none";
  const backgroundColor = isConnected ? "#FFFFFF" : "#FF3B30";

  return (
    <>
      <View style={[styles.status, { backgroundColor }]}>
        <StatusBar
          translucent
          backgroundColor={backgroundColor}
          barStyle={isConnected ? "dark-content" : "light-content"}
          animated={false}
        />
      </View>
      {!isConnected && (
        <View style={styles.messageContainer} pointerEvents="none">
          <View style={styles.bubble}>
            <Text style={styles.message}>No Network Connection!</Text>
          </View>
        </View>
      )}
    </>
  );
}

const statusHeight = Platform.OS === "ios" ? Constants.statusBarHeight : StatusBar.currentHeight || 0;

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  messageContainer: {
    position: "absolute",
    zIndex: 1,
    top: statusHeight + 20,
    left: 0,
    right: 0,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FF3B30",
  },
  message: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});