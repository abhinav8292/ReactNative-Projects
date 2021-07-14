import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ProductItem from '../ProductItems';
import styles from './styles';
import QuantitySelector from '../QuantitySelector';
import {DataStore} from '@aws-amplify/datastore';
import {CartProduct, Product} from '../../models';
import {set} from 'react-native-reanimated';

interface Props {
  cartID: string;
  item?: Product;
  quantity: number;
}

const ShopingCartItems: React.FC<Props> = ({cartID, item, quantity}) => {
  const [loading, setLoading] = useState(false);

  const getUpdatedCart = async (quant: number) => {
    setLoading(true);
    const cartInstance = await DataStore.query(CartProduct, cartID);
    if (cartInstance) {
      const update = await DataStore.save(
        CartProduct.copyOf(cartInstance, updated => {
          updated.quantity = quant;
        }),
      );
      if (update) {
        console.log(update);
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.item}>
      <ProductItem {...item} isCartItem={true} />
      <View style={styles.buttons}>
        <View style={styles.quantity}>
          {!loading ? (
            <QuantitySelector
              quantity={quantity}
              setQuantity={getUpdatedCart}
            />
          ) : (
            <ActivityIndicator />
          )}
        </View>
        <TouchableOpacity
          style={styles.delete}
          onPress={() => console.log('delete')}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShopingCartItems;
