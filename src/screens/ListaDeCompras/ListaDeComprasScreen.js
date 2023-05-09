import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import UUID from 'react-native-uuid';
import { CheckBox, Icon } from 'react-native-elements';
import db from '../../data/database';
import { set } from 'react-native-reanimated';


export default function ListaDeComprasScreen({ navigation, route }) {
    const { idLista } = route.params;
    const guidLista = UUID.v4();
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [lista, setLista] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [pegou, setPegou] = useState(false);

    useEffect(() => {
        pegarItens();
    }, []);

    const pegarItens = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM items where pertenceAhLista = ?',
                [idLista],
                (_, { rows: { _array } }) => setLista(_array),
                (_, error) => console.log('Select items error:', error)
            );
        });
    };

    const checkItem = (item) => {
        item.pegou == true ? item.pegou = false : item.pegou = true;
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE items SET pegou = ? WHERE id = ?',
                [item.pegou, item.id],
                (_, { rows: { _array } }) => setLista(_array),
                (_, error) => console.log('Select items error:', error)
            );
        });
        pegarItens();
    };


    const adicionarItem = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO items (id, nome, quantidade, pegou, pertenceAhLista) VALUES (?, ?, ?, ?, ?)',
                [UUID.v4(), nome, 1, false, idLista],
                (_, { rows }) => {
                    console.log(JSON.stringify(rows));
                },
                (_, error) => {
                    console.log(error);
                }
            );
        });
        setNome('');
        setModalVisible(false);
        pegarItens();
    };

    const deletarItem = (id) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM items WHERE id = ?',
                [id],
                (_, { rows }) => {
                    console.log(JSON.stringify(rows));
                },
                (_, error) => {
                    console.log(error);
                }
            );
        });
        pegarItens();
    };
    const incrementarItem = (id) => {
        setQuantidade(quantidade + 1);
        pegarItens();
    };
    const decrementarItem = (id) => {
        if (quantidade <= 1) {
            setQuantidade(2);
        }
        setQuantidade(quantidade - 1);
        pegarItens();
    };


    const editarItem = (id) => {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE items SET nome = ?, quantidade = ? WHERE id = ?',
                [nome, quantidade, id],
                (_, { rows }) => {
                    console.log(JSON.stringify(rows));
                },
                (_, error) => {
                    console.log(error);
                }
            );
        });
        setNome('');
        setModalVisible2(false);
        pegarItens();
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={lista}
                renderItem={({ item }) => (
                    <TouchableOpacity onLongPress={() => {
                        setModalVisible2(true);
                        setId(item.id);
                        setNome(item.nome);
                        setQuantidade(item.quantidade);
                    }} onPress={() => (checkItem(item))}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox
                                    checked={item.pegou}
                                    onPress={() => {
                                        checkItem(item);
                                    }}
                                />
                                <Text
                                    style={[
                                        { marginLeft: 10, fontSize: 24, color: '#000' },
                                        item.pegou ? { textDecorationLine: 'line-through' } : null,
                                    ]}
                                >
                                    {item.nome}
                                </Text>
                            </View>
                            {item.quantidade > 1 && (
                                <Text style={{marginRight: 8 , marginLeft: 'auto', fontWeight: 'bold', fontSize: 24, color: '#000' }}>{item.quantidade}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: 'gray' }} />}
            />
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Adicionar Item</Text>
            </TouchableOpacity>

            <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Adicionar item</Text>
                    <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={{ marginBottom: 10 }} />
                    <Button
                        title="Adicionar"
                        onPress={() => {
                            adicionarItem(nome);
                            setModalVisible(false);
                            pegarItens();
                        }}
                    />
                </View>
            </Modal>

            <Modal isVisible={modalVisible2} animationType="slide" onBackdropPress={() => setModalVisible2(false)}>

                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible2(false)}
                            >
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Editar item</Text>
                        </View>
                        <View style={styles.modalBody}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome"
                                value={nome}
                                onChangeText={setNome}
                            />
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
                        </View>
                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => { deletarItem(id); setModalVisible2(false) }}>
                                <Text style={styles.deleteButtonText}>Deletar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={() => editarItem(id)}>
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    modalContent: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 16,
        width: '80%',
    },
    modalHeader: {
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalBody: {
        marginBottom: 16,
    },
    modalCloseButton: {
        alignItems: 'absolute',
        marginRight: 16,
        marginTop: 16,
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
    input: {
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
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
        backgroundColor: 'green',
        padding: 11,
        borderRadius: 15,
        marginHorizontal: 4,
    },
    quantityButtonMinus: {
        backgroundColor: 'red',
        padding: 11,
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
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    deleteButton: {
        backgroundColor: '#ff6961',
        padding: 8,
        borderRadius: 4,
        width: '40%',
    },
    deleteButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#77dd77',
        padding: 8,
        borderRadius: 4,
        width: '40%',
    },
    saveButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#ccc',
        borderRadius: 16,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: '#000',
        fontSize: 20,
    },


});