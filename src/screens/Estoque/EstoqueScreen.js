import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList } from "react-native";
import Modal from 'react-native-modal';
import db from "../../data/database";
import UUID from 'react-native-uuid';

export default EstoqueScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [nome, setNome] = useState('');
    const [lista, setLista] = useState([]);
    const [id, setId] = useState('');
    
    useEffect(() => {
            CarregaLista();
    }, []);
    
    const handleAdicionarPorCodigoBarras = () => {
        navigation.navigate('EscanerScreen');
    };
    const adicionarItem = async () => {
        const novoGuid = UUID.v4();
        setLista([...lista, { nome: nome, quantidade: 1, id: novoGuid }]);
        setId(novoGuid);
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO estoque (id, nome, quantidade) VALUES (?, ?, ?)',
                [novoGuid, nome, 1],
                (_, { rows }) => {
                    console.log(JSON.stringify(rows));
                },
                (_, error) => {
                    console.log(error);
                }
            );
        });
        setModalVisible(false);
        setNome('');
        CarregaLista();
        Alert.alert('Item adicionado');
    };
    const CarregaLista = () => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM estoque',
            [],
            (_, { rows }) => {
              const items = [];
              for (let i = 0; i < rows.length; i++) {
                const { nome, quantidade, id } = rows.item(i);
                if (nome !== '') {
                  items.push({ nome, quantidade, id });
                }
              }
              setLista(items);
            },
            (_, error) => {
              console.log(error);
            }
          );
        });
      };
      


    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={lista}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Text>
                            {item.nome}
                        </Text>
                    </View>
                )}
                keyExtractor={(item) => item.id }
            />

            <View>
                <Button title="Adicionar por Nome" onPress={() => setModalVisible(true)} />
            </View>
            <View>
                <Button
                    title="Adicionar por Código de Barras"
                    onPress={() => handleAdicionarPorCodigoBarras()}
                />
            </View>
            <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Adicionar item</Text>
                    <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={{ marginBottom: 10 }} />
                    <Button title="Adicionar" onPress={adicionarItem} />
                    <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    buttonContainer: {
        marginVertical: 10,
        marginHorizontal: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
