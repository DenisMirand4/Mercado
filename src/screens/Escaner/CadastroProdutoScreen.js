import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import db from "../../data/database";
import UUID from 'react-native-uuid';

export default function CadastroProdutoScreen({ navigation, route }) {
    const { barcode} = route.params;
    const [nome, setNome] = useState("");
    console.log('CadastroProdutoScreen');
    console.log(barcode);
    const id = UUID.v4();
    const handlerAdicionarAoEstoque = (item) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO estoque (id, nome, quantidade) VALUES (?, ?, ?)",
                [item.id, item.nome, 1],
                (_, { rows }) => {
                    console.log(JSON.stringify(rows));
                },
                (_, error) => {
                    console.log(error);
                }
            );
        });
        navigation.navigate('EstoqueScreen');
    };

    const addProduto = (item) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO produtos (id, nome, codigoDeBarras) VALUES (?, ?, ?)",
                [id, item.nome, barcode],
                (_, { rows }) => {
                    Alert.alert('Sucesso', 'Produto adicionado com sucesso!', [
                        { text: 'OK', onPress: () => navigation.goBack() },
                        { text: 'Adicionar ao estoque', onPress: () => handlerAdicionarAoEstoque(item)},
                    ]);
                },
                (_, error) => {
                    console.log(error);
                }
            );
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro de Produto</Text>
            <Text style={styles.label}>Informe o nome:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o nome"
                value={nome}
                onChangeText={setNome}
            />
            <Button
                style={styles.button}
                title="Salvar"
                onPress={() => addProduto({ nome: nome })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    label: {
      fontSize: 18,
      marginBottom: 10,
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderColor: "#ccc",
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    button: {
      backgroundColor: "blue",
      color: "white",
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      alignSelf: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
  });
