import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import Modal from 'react-native-modal';
import db from "../../data/database";
import UUID from 'react-native-uuid';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-elements';


export default EstoqueScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [lista, setLista] = useState([]);
    const [id, setId] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        CarregaLista();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        CarregaLista();
        setRefreshing(false);
    };

    useFocusEffect(
        React.useCallback(() => {
            CarregaLista();
        }, [])
    );


    const handleAdicionarPorCodigoBarras = () => {
        navigation.navigate('EscanerScreen');
    };
    const adicionarItem = async () => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO estoque (id, nome, quantidade) VALUES (?, ?, ?)',
                [UUID.v4(), nome, 1],
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

    const handleRemoverItem = (id) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM estoque WHERE id = ?',
                [id],
                (_, { rows }) => {
                    console.log(JSON.stringify(rows));
                },
                (_, error) => {
                    console.log(error);
                }
            );
        });
        CarregaLista();
    };

    const incrementarItem = (id) => {
        setQuantidade(parseInt(quantidade) + 1);
        CarregaLista();
    };
    const decrementarItem = (id) => {
        setQuantidade(parseInt(quantidade) - 1);
        CarregaLista();
    };

    const atualizarQuantidade = (id) => {
        if (quantidade < 0) {
            Alert.alert('Quantidade não pode ser menor que 0');
            return;
        }
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE estoque SET quantidade = ? WHERE id = ?',
                [quantidade, id],
                (_, { rows }) => {
                    console.log(JSON.stringify(rows));
                },
                (_, error) => {
                    console.log(error);
                }
            );
        });
        setModalVisible2(false);
        CarregaLista();
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={lista}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
                        <TouchableOpacity style={{ flex: 1 }} onLongPress={() => {
                            setId(item.id);
                            setQuantidade(parseInt(item.quantidade));
                            setModalVisible2(true);
                        }}>
                            <View>
                                <Text style={{ fontSize: 24 }}>{parseInt(item.quantidade)} - {item.nome}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Icon
                                name='trash'
                                type='font-awesome'
                                color='#517fa4'
                                onPress={() => handleRemoverItem(item.id)} />
                        </View>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                keyExtractor={(item) => item.id}
            />

            <View>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.addButtonText}>Adicionar por Nome</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.addButton} onPress={() => handleAdicionarPorCodigoBarras()}>
                    <Text style={styles.addButtonText}>Adicionar por Código de Barras</Text>
                </TouchableOpacity>
            </View>
            <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Adicionar item</Text>
                    <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={{ marginBottom: 10 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={adicionarItem} style={{ backgroundColor: 'green', padding: 10, marginRight: 10, borderRadius: 5 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Adicionar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={{ backgroundColor: 'red', padding: 10, borderRadius: 5 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal isVisible={modalVisible2} onBackdropPress={() => setModalVisible2(false)} >
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                    <View style={styles.quantityContainer}>
                        <Text style={styles.quantityLabel}>Quantidade:</Text>
                        <TouchableOpacity style={styles.quantityButtonMinus} onPress={() => decrementarItem(id)}>
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.quantityInput}
                            keyboardType="numeric"
                            value={quantidade.toString()}
                            onChangeText={setQuantidade}
                        />
                        <TouchableOpacity style={styles.quantityButtonPlus} onPress={() => incrementarItem(id)}>
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.saveButton} onPress={() => {
                        setModalVisible2(false);
                        atualizarQuantidade(id);
                    }}>
                        <Text style={styles.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    addButton: {
        marginVertical: 10,
        marginHorizontal: 20,
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    addButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
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
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityLabel: {
        marginRight: 8,
        fontWeight: 'bold',
    },
    quantityButton: {
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    quantityButtonPlus: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 15,
        marginHorizontal: 4,
    },
    quantityButtonMinus: {
        backgroundColor: '#FF6961',
        padding: 15,
        borderRadius: 15,
        marginHorizontal: 4,
    },
    quantityButtonText: {
        fontSize: 18,
        paddingHorizontal: 4,
        fontWeight: 'bold',
        color: 'white',
    },
    quantityInput: {
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        width: 64,
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: '#008000',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
});