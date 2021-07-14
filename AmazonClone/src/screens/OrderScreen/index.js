import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {DataStore} from 'aws-amplify';
import {Order, OrderProduct} from '../../models';
import Auth from '@aws-amplify/auth';
import SingleOrder from '../../components/SingleOrder';

const OrderScreen = () => {
  const [orders, setOrders] = useState(null);
  useEffect(() => {
    const fetchOrders = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const orderIds = await DataStore.query(Order, c =>
        c.userSub('eq', user.attributes.sub),
      );
      if (orderIds) {
        const OrderProductsIds = await Promise.all(
          orderIds.map(async res => {
            return await DataStore.query(OrderProduct, c =>
              c.orderID('eq', res.id),
            );
          }),
        );
        setOrders(OrderProductsIds);
      }
    };

    fetchOrders();
  }, []);

  if (!orders) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text
        style={{
          fontSize: 30,
          textAlign: 'center',
          marginTop: 5,
          fontWeight: 'bold',
          marginBottom: 5,
        }}>
        Your Orders
      </Text>
      <FlatList
        data={orders}
        renderItem={({item}) => item.length > 0 && <SingleOrder order={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default OrderScreen;
