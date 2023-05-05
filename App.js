import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Header from './components/Header';
import BottomTabBar from './components/BottomTabBar';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <StatusBar style="auto" />
      <NavigationContainer>
        <BottomTabBar />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 50,
  },
});