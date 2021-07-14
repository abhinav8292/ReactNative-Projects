import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import ProgressBar from 'react-native-progress/Bar';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {options} from '../utils/options';

import propTypes from 'prop-types';
import {signUp} from '../action/auth';
import {connect} from 'react-redux';
import {requestPermission} from '../utils/AskPermission';

const SignUp = ({signUp}) => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    password: '',
    instaUserName: '',
    country: '',
    bio: '',
    image:
      'https://firebase.google.com/images/brand-guidelines/logo-logomark.png',
  });
  const {name, email, password, instaUserName, country, bio, image} =
    userDetails;

  const [imageUploading, setImageUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const chooseImage = async () => {
    const permission = await requestPermission();
    console.log(permission);
    if (permission === 'granted') {
      launchImageLibrary(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled camera picker');
        } else if (response.errorCode == 'camera_unavailable') {
          console.log('Camera not available on device');
        } else if (response.errorCode == 'permission') {
          console.log('Permission not satisfied');
        } else if (response.errorCode == 'others') {
          console.log(response.errorMessage);
        } else {
          console.log('img');
          console.log(response.assets[0]);
          uploadImage(response.assets[0]);
        }
      });
    }
  };

  const uploadImage = async response => {
    setImageUploading(true);
    const reference = storage().ref(response.fileName);
    const task = reference.putFile(response.uri);
    task.on('state_changed', taskSnapshot => {
      const percentage =
        (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 1000;
      setUploadStatus(percentage);
    });
    task.then(async () => {
      const url = await reference.getDownloadURL();
      setUserDetails({...userDetails, image: url});
      setImageUploading(false);
    });
  };

  const doSignUp = async () => {
    signUp({name, email, password, instaUserName, bio, country, bio, image});
  };

  const handleChange = (text, field) => {
    setUserDetails({...userDetails, [field]: text});
  };

  return (
    <KeyboardAvoidingView enabled={true} style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={chooseImage}>
            <Image source={{uri: image, width: 200, height: 150}} />
          </TouchableOpacity>
        </View>

        {imageUploading && (
          <ProgressBar progress={uploadStatus} style={styles.progress} />
        )}

        <View regular style={styles.formItem}>
          <TextInput
            placeholder="name"
            value={name}
            style={styles.input}
            onChangeText={text => handleChange(text, 'name')}
          />
        </View>
        <View regular style={styles.formItem}>
          <TextInput
            placeholder="email"
            value={email}
            style={styles.input}
            onChangeText={text => handleChange(text, 'email')}
          />
        </View>
        <View regular style={styles.formItem}>
          <TextInput
            placeholder="password"
            value={password}
            secureTextEntry={true}
            style={styles.input}
            onChangeText={text => handleChange(text, 'password')}
          />
        </View>
        <View regular style={styles.formItem}>
          <TextInput
            placeholder="Instagram user name"
            value={instaUserName}
            style={styles.input}
            onChangeText={text => handleChange(text, 'instaUserName')}
          />
        </View>
        <View regular style={styles.formItem}>
          <TextInput
            placeholder="Your Short Bio"
            value={bio}
            style={styles.input}
            onChangeText={text => handleChange(text, 'bio')}
          />
        </View>
        <View regular style={styles.formItem}>
          <TextInput
            placeholder="country"
            value={country}
            style={styles.input}
            onChangeText={text => handleChange(text, 'country')}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={doSignUp}>
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const mapDispatchToProps = {
  signUp: data => signUp(data),
};

SignUp.propTypes = {
  signUp: propTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(SignUp);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C384A',
    flex: 1,
    justifyContent: 'flex-start',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  progress: {width: null, marginBottom: 20},
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
