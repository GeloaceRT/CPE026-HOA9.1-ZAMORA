import React, { useEffect, useState, useRef } from "react";
import { Platform, StatusBar, StyleSheet, View, Text, Animated } from "react-native";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";

export default function Status() {
  const [info, setInfo] = useState(null);
  const animation = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    const target = info === "none" ? 0 : 1;
    Animated.timing(animation, {
      toValue: target,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [animation, info]);

  const isConnected = info !== "none";
  const backgroundColor = isConnected ? "#FFFFFF" : "#FF3B30";
  const statusBackground = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FF3B30", "#FFFFFF"],
  });
  const offlineOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.25, 0],
  });
  const offlineTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -16],
  });

  return (
    <>
      <Animated.View style={[styles.status, { backgroundColor: statusBackground }]}> 
        <StatusBar
          translucent
          backgroundColor={backgroundColor}
          barStyle={isConnected ? "dark-content" : "light-content"}
          animated
        />
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.messageContainer,
          { opacity: offlineOpacity, transform: [{ translateY: offlineTranslateY }] },
        ]}
      >
        {!isConnected && (
          <View style={styles.bubble}>
            <Text style={styles.message}>No Network Connection!</Text>
          </View>
        )}
      </Animated.View>
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