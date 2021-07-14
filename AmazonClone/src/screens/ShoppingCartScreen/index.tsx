import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {Auth, DataStore} from 'aws-amplify';
import {View, FlatList, Text, ActivityIndicator} from 'react-native';
import CustomButton from '../../components/CustomButtom';
import ShopingCartItems from '../../components/ShopingCartItems';
import {CartProduct, Product} from '../../models';
import {useIsFocused} from '@react-navigation/native';

interface Props {
  id: string;
  userSub: string;
  quantity: number;
  option?: string;
  productID: string;
  product: {
    id: string;
    title: string;
    image?: string;
    avgRating: number;
    ratings?: number;
    price: number;
    oldPrice?: number;
    isCartItem?: boolean;
  };
}

const ShoppingCartScreen: React.FC = () => {
  const [cartProducts, setCartProducts] = useState<
    CartProduct[] | Props[] | []
  >([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchCart = async () => {
    const user = await Auth.currentAuthenticatedUser();
    if (user) {
      DataStore.query(CartProduct, cp =>
        cp.userSub('eq', user.attributes.sub),
      ).then(setCartProducts);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isFocused]);

  useEffect(() => {
    if (cartProducts.filter(cp => !cp.product).length === 0) {
      return;
    }

    const fetchCartProducts = async () => {
      const cartProds = await Promise.all(
        cartProducts.map((cartProduct: CartProduct) =>
          DataStore.query(Product, cartProduct.productID),
        ),
      );
      if (cartProds) {
        setCartProducts(
          cartProducts.map((cartProduct: CartProduct) => ({
            ...cartProduct,
            product: cartProds.find(p => p?.id === cartProduct.productID),
          })),
        );
      }
    };

    fetchCartProducts();
  }, [cartProducts]);

  // useEffect(() => {
  //   const subscription = DataStore.observe(CartProduct).subscribe(msg =>
  //     fetchCart(),
  //   );
  //   return subscription.unsubscribe;
  // }, []);

  useEffect(() => {
    const subscriptions = cartProducts.map((cp: CartProduct) =>
      DataStore.observe(CartProduct, cp.id).subscribe(msg => {
        if (msg.opType === 'UPDATE') {
          setCartProducts(curCartProducts =>
            curCartProducts.map((cp: CartProduct) => {
              if (cp.id !== msg.element.id) {
                return cp;
              }
              return {
                ...cp,
                ...msg.element,
              };
            }),
          );
        }
      }),
    );
    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [cartProducts]);

  let totalPrice = 0;

  if (cartProducts.filter(cp => !cp.product).length !== 0) {
    return <ActivityIndicator />;
  } else {
    totalPrice = cartProducts.reduce(
      (summedPrice: number, cartProduct: Props) =>
        summedPrice + cartProduct?.product.price * cartProduct?.quantity,
      0,
    );
  }

  const checkout = () => {
    navigation.navigate('AddressScreen', {totalPrice});
  };

  return (
    <View>
      <FlatList
        ListHeaderComponent={
          <View
            style={{margin: 6, marginVertical: 5, backgroundColor: 'white'}}>
            <Text style={{fontSize: 18, lineHeight: 30}}>
              Subtotal ({cartProducts.length} items):{' '}
              <Text style={{color: '#e47911', fontWeight: 'bold'}}>
                {totalPrice.toFixed(2)}
              </Text>
            </Text>
            <CustomButton
              text="Proceed to checkout"
              onPress={checkout}
              containerStyles={{
                backgroundColor: '#ffd814',
                borderColor: '#c7b782',
              }}
            />
          </View>
        }
        stickyHeaderIndices={[0]}
        data={cartProducts}
        renderItem={({item}) => (
          <ShopingCartItems
            cartID={item.id}
            item={item.product}
            quantity={item.quantity}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ShoppingCartScreen;
