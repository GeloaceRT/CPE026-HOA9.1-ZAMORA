import { SafeAreaView, StyleSheet, View } from 'react-native';
import Status from './components/status';
import MessageList from './components/MessageList';
import Toolbar from './components/toolbar';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Status />
        <MessageList />
        <Toolbar />
      </View>
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
});
