import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {connect} from 'react-redux';
import {signIn} from '../action/auth';
import propTypes from 'prop-types';

import Welcome from '../assets/Welcome.png';

const SignIn = ({navigation, signIn}) => {
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });

  const {email, password} = userDetails;

  const doSignIn = () => {
    signIn({email, password});
  };

  const handleChange = (text, field) => {
    setUserDetails({...userDetails, [field]: text});
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Text style={styles.heading}>
          Welcome to the Travel-gram Social App
        </Text>

        <Image
          source={Welcome}
          style={{width: null, height: 150, marginTop: 30}}
          resizeMode="contain"
        />

        <View rounded style={styles.formItem}>
          <TextInput
            placeholder="enter your registerd email"
            value={email}
            style={styles.input}
            onChangeText={text => handleChange(text, 'email')}
          />
        </View>
        <View rounded style={styles.formItem}>
          <TextInput
            placeholder="enter your registerd password"
            value={password}
            secureTextEntry={true}
            style={styles.input}
            onChangeText={text => handleChange(text, 'password')}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={doSignIn}>
          <Text style={styles.buttonText}>SignIn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          style={{marginTop: 10}}>
          <Text style={{color: '#fff', textAlign: 'center'}}>
            Do not have an account, SignUp here
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const mapDispatchToProps = {
  signIn: data => signIn(data),
};

SignIn.propTypes = {
  signIn: propTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(SignIn);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C384A',
    flex: 1,
    justifyContent: 'flex-start',
  },
  heading: {
    textAlign: 'center',
    color: '#fdcb9e',
    marginHorizontal: 5,
    marginTop: 30,
    fontSize: 23,
  },
  formItem: {
    marginBottom: 20,
  },
  input: {
    color: '#eee',
    borderWidth: 1,
    borderColor: 'white',
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  button: {
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f4c75',
    height: 50,
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 17,
    fontFamily: 'bold',
    color: 'white',
  },
});
