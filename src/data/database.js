import * as SQLite from 'expo-sqlite';
import { FileSystem } from 'react-native-unimodules';

const dbFile = `${FileSystem.documentDirectory}database.db`;

console.log('Database file:', dbFile);

const db = SQLite.openDatabase('items.db');

db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY NOT NULL, nome TEXT NOT NULL, quantidade INTEGER NOT NULL, pertenceAhLista TEXT NOT NULL);'
    );
});
console.log('Database items created');

db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS produtos (id TEXT PRIMARY KEY NOT NULL, nome TEXT NOT NULL, codigoDeBarras TEXT NOT NULL);'
    );
});
console.log('Database listas created');

db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS estoque (id TEXT PRIMARY KEY NOT NULL, nome TEXT NOT NULL, quantidade TEXT);'
    );
});
console.log('Database estoque created');

export default db;