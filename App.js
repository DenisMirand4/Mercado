import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator} from '@react-navigation/stack';
import ListaDeComprasScreen from './src/screens/ListaDeCompras/ListaDeComprasScreen';
import ListasDeListaDeCompras from './src/screens/ListaDeCompras/ListasDeListaDeCompras';
import EscanerScreen from './src/screens/Escaner/EscanerScreen';
import EstoqueScreen from './src/screens/Estoque/EstoqueScreen';
import CadastroProdutoScreen from './src/screens/Escaner/CadastroProdutoScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

function ListaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListasDeListaDeCompras" component={ListasDeListaDeCompras} />
      <Stack.Screen name="ListaDeCompras" component={ListaDeComprasScreen} />
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
            <Tab.Screen 
              name="Listas de Compras" 
              component={ListaStack} 
              options={{ 
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
                ), 
              }}
            />
            <Tab.Screen 
              name="Escaner" 
              component={EscanerStack} 
              options={{ 
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="barcode-scan" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen 
              name="Estoque" 
              component={EstoqueStack}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="fridge" color={color} size={size} />
                ),
              }}
            />
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
