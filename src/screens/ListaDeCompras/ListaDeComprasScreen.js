import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Switch } from 'react-native';
import Modal from 'react-native-modal';
import UUID from 'react-native-uuid';
import { CheckBox, Icon } from 'react-native-elements';
import db from '../../data/database';


export default function ListaDeComprasScreen() {
    const guidLista = UUID.v4();
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [lista, setLista] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [pegou, setPegou] = useState(false);

    // const db = SQLite.openDatabase('items.db');
    useEffect(() => {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM items where pertenceAhLista = ?',
            ['lista1'],
            (_, { rows: { _array } }) => setLista(_array),
            (_, error) => console.log('Select items error:', error)
          );
        });
    }, []);


    const adicionarItem = () => {
        const novoGuid = UUID.v4();
        setLista([...lista, { nome: nome, quantidade: quantidade, id: novoGuid, pegou: pegou }]);
        setId(novoGuid);
        setNome('');
        setQuantidade('');
        setModalVisible(false);
        setPegou(false);
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO items (id, nome, quantidade, pertenceAhLista) VALUES (?, ?, ?, ?)',
                [novoGuid, nome, quantidade, 'lista1'],
                (_, { rows }) => {
                    console.log(JSON.stringify(rows));
                },
                (_, error) => {
                    console.log(error);
                }
            );
        });
        console.log('Item adicionado');
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM items where pertenceAhLista = ?',
                ['lista1'],
            (_, { rows }) => {
                console.log(JSON.stringify(rows));
            },
            (_, error) => {
                console.log(error);
            }
            
        )});

    };
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={lista}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <CheckBox
                            checked={item.pegou}
                            onPress={() => {
                                console.log(item.id);
                                const index = lista.findIndex((el) => el.id === item.id);
                                const newLista = [...lista];
                                newLista[index].pegou = !item.pegou;
                                console.log(newLista[index].pegou);
                                setLista(newLista);
                            }}
                        />
                        <Text
                            style={[
                                { marginLeft: 10, flex: 1 },
                                item.pegou ? { textDecorationLine: 'line-through' } : null,
                            ]}
                        >
                            {item.nome} - {item.quantidade}
                        </Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Button title="Adicionar Item" onPress={() => setModalVisible(true)} />
                </View>
            </View>

            <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Adicionar item</Text>
                    <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={{ marginBottom: 10 }} />
                    <TextInput placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" style={{ marginBottom: 20 }} />
                    <Button title="Adicionar" onPress={adicionarItem} />
                </View>
            </Modal>
        </View>
    );
}
