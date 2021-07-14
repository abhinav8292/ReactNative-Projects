import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, ActivityIndicator} from 'react-native';
import {Auth, DataStore} from 'aws-amplify';
import styles from './Styles';
import {Picker} from '@react-native-picker/picker';
import QuantitySelector from '../../components/QuantitySelector';
import CustomButton from '../../components/CustomButtom';
import ImageCarousel from '../../components/ImageCarousel';
import {useNavigation, useRoute} from '@react-navigation/core';
import {CartProduct, Product} from '../../models';

const ProductScreen: React.FC = () => {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [selectedOption, setSelectedOption] =
    useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    DataStore.query(Product, route.params?.id).then(setProduct);
  }, [route.params?.id]);

  useEffect(() => {
    if (product?.options) {
      setSelectedOption(product.options[0]);
    }
  });

  const addToCart = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    if (!product || !userData) {
      return;
    }
    const newCartProduct = new CartProduct({
      userSub: userData.attributes.sub,
      quantity,
      option: selectedOption,
      productID: product.id,
    });
    const added = await DataStore.save(newCartProduct);
    if (added) {
      navigation.navigate('cart');
    }
  };

  if (!product) {
    return <ActivityIndicator />;
  }
  return (
    <ScrollView style={styles.root}>
      <Text style={styles.title}>{product.title}</Text>
      <ImageCarousel images={product?.images} />
      {selectedOption && (
        <Picker
          selectedValue={selectedOption}
          onValueChange={itemValue => setSelectedOption(itemValue)}>
          {product.options?.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>
      )}
      <Text style={styles.price}>
        from {product.price.toFixed(2)}{' '}
        {product.oldPrice && (
          <Text style={styles.oldPrice}>{product.oldPrice.toFixed(2)}</Text>
        )}
      </Text>
      <Text style={styles.description}>{product.description}</Text>
      <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      <View style={styles.button}>
        <CustomButton
          text={'Add To Cart'}
          onPress={addToCart}
          containerStyles={{backgroundColor: '#e3c985'}}
        />
        <CustomButton
          text={'Buy Now'}
          onPress={() => {
            console.warn('Buy now');
          }}
        />
      </View>
    </ScrollView>
  );
};

export default ProductScreen;
