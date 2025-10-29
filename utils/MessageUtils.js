import PropTypes from 'prop-types';


export const MessageShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['text', 'image', 'location']),
  text: PropTypes.string,
  uri: PropTypes.string,
  coordinate: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
});


let messageId = 0;
function getNextId() {
  messageId += 1;
  return messageId;
}


export function createTextMessage(text) {
  return {
    type: 'text',
    id: getNextId(),
    text,
  };
}


export function createImageMessage(uri) {
  return {
    type: 'image',
    id: getNextId(),
    uri,
  };
}


export function createLocationMessage(coordinate) {
  return {
    type: 'location',
    id: getNextId(),
    coordinate,
  };
}

// Provide a default and CommonJS-compatible export so runtime `require()`
// and `import * as` both work reliably in different environments.
const _default = {
  MessageShape,
  createTextMessage,
  createImageMessage,
  createLocationMessage,
};

export default _default;

// Support Node's require() in environments that don't transpile ES modules.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = _default;
}