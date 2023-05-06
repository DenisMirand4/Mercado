import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal } from 'react-native';


export default function ListaDeComprasScreen() {
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [lista, setLista] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const adicionarItem = () => {
        setLista([...lista, { nome: nome, quantidade: quantidade }]);
        setNome('');
        setQuantidade('');
        setModalVisible(false);
    };
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={lista}
                renderItem={({ item }) => (
                    <Text>{item.nome} - {item.quantidade}</Text>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Button title="Adicionar Item" onPress={() => setModalVisible(true)} />
                </View>
            </View>

            <Modal visible={modalVisible} animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'white', padding: 20 }}>
                        <Text>Nome:</Text>
                        <TextInput
                            placeholder="Digite o nome"
                            value={nome}
                            onChangeText={valor => setNome(valor)}
                        />
                        <Text>Quantidade:</Text>
                        <TextInput
                            placeholder="Digite a quantidade"
                            value={quantidade}
                            onChangeText={valor => setQuantidade(valor)}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                            <Button title="Adicionar" onPress={adicionarItem} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
