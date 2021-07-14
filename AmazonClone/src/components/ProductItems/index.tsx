import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

interface Props {
  id: string;
  title: string;
  image?: string;
  avgRating: number;
  ratings?: number;
  price: number;
  oldPrice?: number;
  isCartItem?: boolean;
  quantity?: number;
  options?: string;
  showOption?: boolean;
}

const ProductItem: React.FC<Props> = ({
  id,
  title,
  image,
  avgRating,
  ratings,
  price,
  oldPrice,
  isCartItem,
  options,
  quantity,
  showOption,
}) => {
  // console.log(quantity);
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate('ProductDetails', {id});
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.root, !isCartItem && styles.border]}>
      <Image style={styles.image} source={{uri: image}} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>
        <View style={styles.rating}>
          {Array(Math.floor(avgRating))
            .fill(0)
            .map((_, i) => {
              return (
                <FontAwesome key={i} name="star" size={18} color={'#e47911'} />
              );
            })}
          {Array(5 - Math.floor(avgRating))
            .fill(0)
            .map((_, i) => {
              return (
                <FontAwesome
                  key={i}
                  name="star-o"
                  size={18}
                  color={'#e47911'}
                />
              );
            })}
          <Text style={styles.ratingCount}>{ratings}</Text>
        </View>
        <Text style={styles.price}>
          {price.toFixed(2)}{' '}
          {oldPrice && (
            <Text style={styles.oldPrice}>{oldPrice.toFixed(2)}</Text>
          )}
        </Text>
        {showOption && (
          <View style={styles.options}>
            {options && <Text>Option: {options}</Text>}
            <Text>{quantity && <Text>Quantity: {quantity}</Text>}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default ProductItem;
