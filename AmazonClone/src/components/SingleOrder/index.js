import {DataStore} from 'aws-amplify';
import React, {useState} from 'react';
import {useEffect} from 'react';
import {View, Text, ScrollView, FlatList} from 'react-native';
import {Product} from '../../models';
import ProductItem from '../ProductItems';

const SingleOrder = ({order}) => {
  const [currOrder, setCurrOrder] = useState(null);

  useEffect(() => {
    setCurrOrder(order);
  }, [order]);

  useEffect(() => {
    if (!currOrder) {
      return;
    }

    if (currOrder.filter(co => !co.productDetails).length === 0) {
      return;
    }
    const fetchOrders = async () => {
      const orderProduct = await Promise.all(
        order.map(async item => {
          return await DataStore.query(Product, c =>
            c.id('eq', item.productID),
          );
        }),
      );
      if (orderProduct) {
        setCurrOrder(
          currOrder.map(item => ({
            ...item,
            productDetails: orderProduct.find(p => p[0].id === item.productID),
          })),
        );
      }
    };
    fetchOrders();
  }, [currOrder]);

  if (!currOrder || currOrder.filter(co => !co.productDetails).length !== 0) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  currOrder.map(curr => console.log(curr.quantity));

  return (
    <View
      style={{
        backgroundColor: 'darkgrey',
        marginVertical: 30,
        // marginHorizontal: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}>
      {currOrder.map((item, index) => (
        <ProductItem
          key={index}
          {...item.productDetails[0]}
          quantity={item.quantity}
          options={item.option}
          showOption={true}
        />
      ))}
    </View>
  );
};

export default SingleOrder;
