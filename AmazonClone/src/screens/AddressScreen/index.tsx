import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, Text, TextInput, View} from 'react-native';
import styles from './styles';
import CustomButton from '../../components/CustomButtom';
import {DataStore} from '@aws-amplify/datastore';
import {CartProduct, Order, OrderProduct} from '../../models';
import Auth from '@aws-amplify/auth';
import {useNavigation, useRoute} from '@react-navigation/core';
import {API, graphqlOperation} from 'aws-amplify';
import {createPaymentIntent} from '../../graphql/mutations';
import {useStripe} from '@stripe/stripe-react-native';
const {getData} = require('country-list');

interface Props {}
const countries = getData();

const AddressScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [customerDetails, setCoustomerDetails] = useState({
    fullname: '',
    number: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: countries[0].code,
  });
  const [error, setError] = useState({
    fullnameError: '',
    numberError: '',
    addressError: '',
    cityError: '',
    stateError: '',
    countryError: '',
  });

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentIntent();
  }, []);

  useEffect(() => {
    if (clientSecret) {
      initializePaymentSheet();
    }
  }, [clientSecret]);

  const amount = Math.floor(route.params?.totalPrice * 100 || 0);

  const fetchPaymentIntent = async () => {
    const response = await API.graphql(
      graphqlOperation(createPaymentIntent, {amount}),
    );
    // console.log(response);
    setClientSecret(response.data.createPaymentIntent.clientSecret);
  };

  const initializePaymentSheet = async () => {
    if (!clientSecret) {
      return;
    }
    const {error} = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
    });

    if (error) {
      console.log(error);
    }
    console.log('succeded');
  };

  const openPaymentSheet = async () => {
    if (!clientSecret) {
      return;
    }
    const {error} = await presentPaymentSheet({clientSecret});
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      saveOrder();
      Alert.alert('Success', 'Your order is confirmed');
    }
  };

  const handleChange = (text: string, field: string): void => {
    setCoustomerDetails({...customerDetails, [field]: text});
  };

  const validateFields = (field: string): void => {
    if (field === 'fullnameError') {
      if (customerDetails.fullname.length < 3) {
        setError({...error, [field]: 'Fullname is too short'});
      } else if (customerDetails.fullname.length > 30) {
        setError({...error, [field]: 'Fullname is too long'});
      } else {
        setError({...error, [field]: ''});
      }
    }
    if (field === 'addressError') {
      if (customerDetails.address.length < 3) {
        setError({...error, [field]: 'Address is too short'});
      } else if (customerDetails.address.length > 30) {
        setError({...error, [field]: 'Address is too long'});
      } else {
        setError({...error, [field]: ''});
      }
    }
    if (field === 'numberError') {
      if (customerDetails.number.length !== 10) {
        setError({...error, [field]: 'Invalid phone number'});
      } else {
        setError({...error, [field]: ''});
      }
    }
  };

  const saveOrder = async () => {
    const {fullname, number, address, city, state, zipCode, country} =
      customerDetails;
    // get user details
    const user = await Auth.currentAuthenticatedUser();
    // create a new order
    const newOrder = await DataStore.save(
      new Order({
        userSub: user.attributes.sub,
        fullname,
        number,
        country,
        city,
        address,
        state,
        zipCode,
        amount,
      }),
    );
    // fetch all cart items
    const cartItems = await DataStore.query(CartProduct, cp =>
      cp.userSub('eq', user.attributes.sub),
    );
    // attach all cart items to the order
    await Promise.all(
      cartItems.map(cartItem =>
        DataStore.save(
          new OrderProduct({
            quantity: cartItem.quantity,
            option: cartItem.option,
            productID: cartItem.productID,
            orderID: newOrder.id,
          }),
        ),
      ),
    );
    // delete cart items after successful order
    await Promise.all(cartItems.map(cartItem => DataStore.delete(cartItem)));

    // clear Address field
    setCoustomerDetails({
      fullname: '',
      number: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: countries[0].code,
    });
    // redirect to home
    navigation.navigate('OrderScreen');
  };

  const onCheckout = (): void => {
    if (!!error.fullnameError || !!error.numberError || !!error.addressError) {
      Alert.alert('Fix all field error before submitting');
      return;
    }

    // handle payments
    openPaymentSheet();
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <View style={styles.page}>
        <View style={styles.country}>
          <Picker
            selectedValue={customerDetails.country}
            onValueChange={value => handleChange(value, 'country')}>
            {countries.map(country => (
              <Picker.Item
                key={country.code}
                value={country.code}
                label={country.name}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Full name (First and Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            onEndEditing={() => validateFields('fullnameError')}
            value={customerDetails.fullname}
            onChangeText={text => handleChange(text, 'fullname')}
          />
          {!!error.fullnameError && (
            <Text style={styles.error}>*{error.fullnameError}</Text>
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            keyboardType={'phone-pad'}
            style={styles.input}
            placeholder="Phone Number"
            onEndEditing={() => validateFields('numberError')}
            value={customerDetails.number}
            onChangeText={text => handleChange(text, 'number')}
          />
          {!!error.numberError && (
            <Text style={styles.error}>*{error.numberError}</Text>
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Address"
            onEndEditing={() => validateFields('addressError')}
            value={customerDetails.address}
            onChangeText={text => handleChange(text, 'address')}
          />
          {!!error.addressError && (
            <Text style={styles.error}>*{error.addressError}</Text>
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={customerDetails.city}
            onChangeText={text => handleChange(text, 'city')}
          />
        </View>
        <View style={styles.lastRow}>
          <View style={styles.row}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              placeholder="State"
              value={customerDetails.state}
              onChangeText={text => handleChange(text, 'state')}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ZIP Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Zip Code"
              value={customerDetails.zipCode}
              onChangeText={text => handleChange(text, 'zipCode')}
            />
          </View>
        </View>
        <View style={styles.ad}>
          <Text style={styles.lineOne}>Delivery instructions(optional)</Text>
          <Text style={styles.lineTwo}>
            Notes, preferences, access codes and more
          </Text>
        </View>
        <CustomButton
          text="Use this address"
          containerStyles={{backgroundColor: '#e3c985', height: 40}}
          onPress={onCheckout}
        />
      </View>
    </ScrollView>
  );
};

export default AddressScreen;
