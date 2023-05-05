import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import EstoqueScreen from '../Estoque/EstoqueScreen';
import ListaDeComprasScreen from '../ListaDeCompras/ListaDeComprasScreen';
import EscanerScreen from '../Escaner/EscanerScreen';

const Tab = createBottomTabNavigator();

const BottomTabBar = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Lista de Compras" component={ListaDeComprasScreen} />
            <Tab.Screen name="Escaner" component={EscanerScreen} />
            <Tab.Screen name="Estoque" component={EstoqueScreen} />
        </Tab.Navigator>
    );
}

export default BottomTabBar;

