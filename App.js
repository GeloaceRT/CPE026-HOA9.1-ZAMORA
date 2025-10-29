import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Image,
  TouchableOpacity,
  BackHandler,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import Status from './components/status';
import MessageList from './components/MessageList';
import Toolbar from './components/toolbar';
import * as MessageUtils from './utils/MessageUtils';

const MESSAGE_LAYOUT_ANIMATION = {
  duration: 260,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [fullscreenImageId, setFullscreenImageId] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const scheduleMessageAnimation = useCallback(() => {
    LayoutAnimation.configureNext(MESSAGE_LAYOUT_ANIMATION);
  }, []);

  useEffect(() => {
    // sample messages to demonstrate MessageList rendering
    const demo = [
      MessageUtils.createTextMessage('Hello'),
      MessageUtils.createTextMessage('World'),
      MessageUtils.createImageMessage('https://picsum.photos/400/300'),
      MessageUtils.createLocationMessage({ latitude: 37.7749, longitude: -122.4194 }),
    ];
    scheduleMessageAnimation();
    setMessages(demo);
  }, [scheduleMessageAnimation]);

  // BackHandler: when fullscreen image is shown on Android, press back to dismiss
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const onBack = () => {
      if (fullscreenImageId !== null) {
        setFullscreenImageId(null);
        return true; // handled
      }
      return false; // let default behavior
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [fullscreenImageId]);

  const dismissFullscreenImage = useCallback(() => {
    setFullscreenImageId(null);
  }, []);

  const handlePressMessage = useCallback((message) => {
    const { id, type } = message;
    switch (type) {
      case 'text':
        // Confirm deletion
        Alert.alert(
          'Delete message',
          'Are you sure you want to delete this message?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                scheduleMessageAnimation();
                setMessages((cur) => cur.filter((m) => m.id !== id));
              },
            },
          ],
          { cancelable: true }
        );
        break;
      case 'image':
        setFullscreenImageId(id);
        break;
      default:
        break;
    }
  }, [scheduleMessageAnimation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Status />
        <MessageList messages={messages} onPressMessage={handlePressMessage} />
        <Toolbar />
      </View>
      {/* Fullscreen image overlay */}
      {fullscreenImageId !== null && (() => {
        const msg = messages.find((m) => m.id === fullscreenImageId);
        if (!msg || msg.type !== 'image') return null;
        return (
          <TouchableOpacity
            activeOpacity={1}
            onPress={dismissFullscreenImage}
            style={styles.fullscreenOverlay}
          >
            <Image source={{ uri: msg.uri }} style={styles.fullscreenImage} resizeMode="contain" />
          </TouchableOpacity>
        );
      })()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});
