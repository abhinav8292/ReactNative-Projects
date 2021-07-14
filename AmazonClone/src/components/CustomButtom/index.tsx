import React from 'react';
import {View, Text, Pressable} from 'react-native';
import styles from './styles';

interface Props {
  text: string;
  onPress: () => void;
  containerStyles?: object;
}

const CustomButton: React.FC<Props> = ({text, onPress, containerStyles}) => {
  return (
    <Pressable onPress={onPress} style={[styles.root, containerStyles]}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

export default CustomButton;
