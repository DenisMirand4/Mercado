import React, { useState, useEffect, Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Dimensions, ImageBackground } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from '../../data/database';
import { Button } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';

export default function EscanerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState('');
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    // setScanned(false);
  }, []);

  const addEstoque = (item) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO estoque (id, nome, quantidade) VALUES (?, ?, ?, ?)',
        [item.id, item.nome, 1],
        (_, { rows }) => {
          console.log(JSON.stringify(rows));
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
    console.log('Item adicionado ao estoque');
    setScanned(false);
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setBarcodeData(data);
    const item = await searchItemInDatabase(data);

    if (item) {
      Alert.alert('Item encontrado!', `Gostaria de adicionar o ${item.name} ao seu estoque?`),
        [
          {
            text: 'Não',
            onPress: () => setScanned(false),
            style: 'cancel',
          },
          {
            text: 'Sim',
            onPress: () => addEstoque(item),
          }
        ]
    } else {
      Alert.alert(
        'Item não encontrado',
        `O item ${data} não foi encontrado no banco de dados. Deseja cadastrar um novo item?`,
        [
          {
            text: 'Não',
            onPress: () => setScanned(false),
            style: 'cancel',
          },
          {
            text: 'Sim',
            onPress: () => {
              setScanned(false);
              navigation.navigate('CadastroProduto', { barcode: data });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const searchItemInDatabase = async (barcodeData) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM produtos WHERE codigoDeBarras = ?',
        [barcodeData],
        (_, { rows }) => {
          // console.log(JSON.stringify(rows));
          return rows._array[0];
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
    return null;
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão para acessar a câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera.</Text>;
  }



  return (
    <View style={styles.container}>
      {isFocused ? (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
      {scanned && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Escanear novamente</Text>
        </TouchableOpacity>
      )}
      <View style={styles.background} />
      <View style={styles.mira} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  scanner: {
    flex: 1,
    width: '100%',
  },
  button: {
    backgroundColor: '#0099ff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  mira: {
    position: 'absolute',
    top: '35%',
    left: '10%',
    right: '10%',
    bottom: '35%',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: 'black',
    backgroundColor: 'transparent',

  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});