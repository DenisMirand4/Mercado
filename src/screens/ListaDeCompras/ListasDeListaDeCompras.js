import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Switch } from 'react-native';
import Modal from 'react-native-modal';
import UUID from 'react-native-uuid';
import { CheckBox, Icon } from 'react-native-elements';
import db from '../../data/database';


export default function ListasDeListaDeCompras() {
    return (
        <ListaDeComprasScreen />
    );
}