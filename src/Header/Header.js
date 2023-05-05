import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Header = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Meu Header</Text>
      </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
      height: 50,
      backgroundColor: 'gray',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: 'white',
      fontSize: 18,
    },
});


