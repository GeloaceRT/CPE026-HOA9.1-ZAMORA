import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MessageShape } from '../utils/MessageUtils';

const keyExtractor = item => item.id.toString();

const IMAGE_MAX_WIDTH = Math.round(Dimensions.get('window').width - 48);

const AnimatedMessageRow = ({ item, onPressMessage, children }) => {
  const scale = React.useRef(new Animated.Value(0.9)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 6,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <Animated.View style={[styles.messageRow, { opacity, transform: [{ scale }] }]}>
      <TouchableOpacity onPress={() => onPressMessage(item)} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

AnimatedMessageRow.propTypes = {
  item: MessageShape.isRequired,
  onPressMessage: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default class MessageList extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(MessageShape).isRequired,
    onPressMessage: PropTypes.func,
  };

  static defaultProps = {
    onPressMessage: () => {},
  };

  renderMessageItem = ({ item }) => {
    const { onPressMessage } = this.props;
    return (
      <AnimatedMessageRow item={item} onPressMessage={onPressMessage}>
        {this.renderMessageBody(item)}
      </AnimatedMessageRow>
    );
  };

  renderMessageBody = ({ type, text, uri, coordinate }) => {
    switch (type) {
      case 'text':
        return (
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{text}</Text>
          </View>
        );

      case 'image':
        return (
          <Image
            source={{ uri }}
            style={[styles.image, { width: IMAGE_MAX_WIDTH }]}
            onError={(e) => console.log('Image load error', e.nativeEvent || e)}
          />
        );

      case 'location':
        if (!coordinate) return null;
        return (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
              latitudeDelta: 0.08,
              longitudeDelta: 0.04,
            }}
            pointerEvents="none"
          >
            <Marker coordinate={coordinate} />
          </MapView>
        );

      default:
        return null;
    }
  };

  render() {
    const { messages } = this.props;

    return (
      <FlatList
        style={styles.container}
        inverted
        data={messages}
        renderItem={this.renderMessageItem}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'handled'}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 8,
    paddingVertical: 6,
  },
  messageBubble: {
    backgroundColor: '#0b93f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: '98%',
    flexShrink: 1,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#fff',
    fontSize: 18,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  image: {
    height: 220,
    borderRadius: 12,
    resizeMode: 'cover',
    alignSelf: 'flex-end',
  },
  map: {
    width: IMAGE_MAX_WIDTH,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
  },
  locationBubble: {
    backgroundColor: '#0b7a5f',
  },
});