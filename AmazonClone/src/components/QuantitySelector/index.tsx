import React, {useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import styles from './styles';

interface Props {
  quantity: number;
  setQuantity: Function;
}

const QuantitySelector: React.FC<Props> = ({quantity, setQuantity}) => {
  return (
    <View style={styles.root}>
      <Pressable
        onPress={() => setQuantity(Math.max(0, quantity - 1))}
        style={styles.button}>
        <Text style={styles.buttonText}>-</Text>
      </Pressable>
      <Text style={styles.quantity}>{quantity}</Text>
      <Pressable
        onPress={() => setQuantity(quantity + 1)}
        style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );
};

export default QuantitySelector;
