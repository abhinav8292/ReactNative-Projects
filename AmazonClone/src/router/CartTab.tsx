import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import AddressScreen from '../screens/AddressScreen';
import ShoppingCartScreen from '../screens/ShoppingCartScreen';

const CartStack = createStackNavigator();

interface Props {}

const CartTab: React.FC<Props> = () => {
  return (
    <CartStack.Navigator initialRouteName="cart">
      <CartStack.Screen component={ShoppingCartScreen} name="cart" />
      <CartStack.Screen component={AddressScreen} name="AddressScreen" />
    </CartStack.Navigator>
  );
};

export default CartTab;
