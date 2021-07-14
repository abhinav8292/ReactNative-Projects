import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import ProductItem from '../../components/ProductItems';
import {DataStore} from 'aws-amplify';
import {Product} from '../../models';
import {Text} from 'react-native';

const HomeScreen: React.FC<{searchValue: string}> = ({searchValue}) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const results = await DataStore.query(Product);
      setProducts(results);
      products.map(p => console.log('hh', p));
    };
    fetchProducts();
  }, []);

  return (
    <View>
      <FlatList
        data={products}
        renderItem={({item}) => <ProductItem {...item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;
