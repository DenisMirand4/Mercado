import * as SQLite from 'expo-sqlite';
import { FileSystem } from 'react-native-unimodules';

const dbFile = `${FileSystem.documentDirectory}database.db`;

console.log('Database file:', dbFile);

const db = SQLite.openDatabase('items.db');
    // db.transaction(tx => {
    //     tx.executeSql(
    //         'DROP TABLE estoque;',
    //         [],
    //         (_, { rows }) => {
    //             console.log(JSON.stringify(rows));
    //         },
    //         (_, error) => {
    //             console.log(error);
    //         }
    //     );
    // });
    // db.transaction(tx => {
    //     tx.executeSql(
    //         'DROP TABLE produtos;',
    //         [],
    //         (_, { rows }) => {
    //             console.log(JSON.stringify(rows));
    //         },
    //         (_, error) => {
    //             console.log(error);
    //         }
    //     );
    // });
    // db.transaction(tx => {
    //     tx.executeSql(
    //         'DROP TABLE items;',
    //         [],
    //         (_, { rows }) => {
    //             console.log(JSON.stringify(rows));
    //         },
    //         (_, error) => {
    //             console.log(error);
    //         }
    //     );
    // });



    db.transaction(tx => {
        tx.executeSql(
        'CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY NOT NULL, nome TEXT NOT NULL, quantidade INTEGER NOT NULL, pegou INTEGER NOT NULL, pertenceAhLista TEXT NOT NULL);'
        );
    });
    console.log('Database items created');

db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS listasDeCompras (id TEXT PRIMARY KEY NOT NULL, nome TEXT NOT NULL);'
    );
});

db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS produtos (id TEXT PRIMARY KEY NOT NULL, nome TEXT NOT NULL, codigoDeBarras TEXT NOT NULL);'
    );
});
console.log('Database listas created');

db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS estoque (id TEXT PRIMARY KEY NOT NULL, nome TEXT NOT NULL, quantidade TEXT NOT NULL);'
    );
});
console.log('Database estoque created');

export default db;