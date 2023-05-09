import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import UUID from 'react-native-uuid';
import { CheckBox, Icon } from 'react-native-elements';
import db from '../../data/database';


export default function ListasDeListaDeCompras({ navigation }) {
    const [lista, setLista] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nome, setNome] = useState('');
    const [id, setId] = useState('');


    const criarLista = (nome) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO listasDeCompras (id, nome) VALUES (?, ?)',
                [UUID.v4(), nome],
                (_, { rows }) => {
                    console.log(JSON.stringify(rows));
                },
                (_, error) => {
                    console.log(error);
                }
            );
        });
    };

    const deletarLista = (id) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM listasDeCompras WHERE id = ?',
                [id],
                (_, { rows }) => {
                    console.log(JSON.stringify(rows));
                },
                (_, error) => {
                    console.log(error);
                }
            );
        });
    };

    const pegarListas = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM listasDeCompras',
                [],
                (_, { rows: { _array } }) => setLista(_array),
                (_, error) => console.log('Select items error:', error)
            );
        });
    };

    const handleNavegation = (id) => {
        navigation.navigate('ListaDeCompras', { idLista: id });
    };


    useEffect(() => {
        pegarListas();
    }, []);

    return (
        <View style={styles.container} >
            <FlatList
                data={lista}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => handleNavegation(item.id)}>
                            <View>
                                <Text style={{ fontSize: 18 }}>{item.nome}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Icon
                                name='trash'
                                type='font-awesome'
                                color='#517fa4'
                                onPress={() => { deletarLista(item.id); pegarListas(); }} />
                        </View>
                    </View>
                )}
                keyExtractor={item => item.id}
            />
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Criar Lista</Text>
            </TouchableOpacity>

            <Modal isVisible={modalVisible}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                        <Text style={{ fontSize: 18 }}>Nome da Lista</Text>
                        <TextInput
                            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                            onChangeText={text => setNome(text)}
                            value={nome}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                            <Button title="Criar" onPress={() => {
                                criarLista(nome);
                                setModalVisible(false);
                                pegarListas();
                            }} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    button: {
        marginVertical: 10,
        marginHorizontal: 20,
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    touchableOpacity: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1.5,
        borderTopColor: '#ccc',

        borderBottomWidth: 1.5,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    }


});