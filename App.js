import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BottomTabBar from './src/components/BottomTab/BottomTabBar';
import Navegator from './src/screens/Navegator/Navegator';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator} from '@react-navigation/stack';
import ListaDeComprasScreen from './src/screens/ListaDeCompras/ListaDeComprasScreen';
import EscanerScreen from './src/screens/Escaner/EscanerScreen';
import EstoqueScreen from './src/screens/Estoque/EstoqueScreen';
import CadastroProdutoScreen from './src/screens/Escaner/CadastroProdutoScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function EscanerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EscanerScreen" component={EscanerScreen} />
      <Stack.Screen name="CadastroProduto" component={CadastroProdutoScreen} />
    </Stack.Navigator>
  );
}

function EstoqueStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EstoqueScreen" component={EstoqueScreen} />
      <Stack.Screen name="EscanerScreen" component={EscanerScreen} />
      <Stack.Screen name="CadastroProduto" component={CadastroProdutoScreen} />

    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Header /> */}
      <StatusBar style="auto" />
      <NavigationContainer>
        <Tab.Navigator>
            <Tab.Screen name="Lista de Compras" component={ListaDeComprasScreen} />
            <Tab.Screen name="Escaner" component={EscanerStack} options={{ headerShown: false }}/>
            <Tab.Screen name="Estoque" component={EstoqueStack}/>
        </Tab.Navigator>
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
