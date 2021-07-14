import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import ProgressBar from 'react-native-progress/Bar';

import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {options} from '../utils/options';

import {connect} from 'react-redux';
import propTypes from 'prop-types';
import shortid from 'shortid';
import Icon from 'react-native-vector-icons/Ionicons';
import {requestPermission} from '../utils/AskPermission';

const AddPost = ({navigation, userState}) => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const [imageUploading, setImageUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const captureImage = async () => {
    const permission = await requestPermission();
    console.log(permission);
    if (permission) {
      launchCamera(options, response => {
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

  const chooseImage = async () => {
    const permission = await requestPermission();
    if (permission) {
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
      setImage(url);
      setImageUploading(false);
    });
  };

  const addPost = async () => {
    try {
      if (!location || !description || !image) {
        return Snackbar.show({
          text: 'Please add all fields',
          textColor: 'white',
          backgroundColor: 'red',
        });
      }
      const uid = shortid.generate();
      await database().ref(`/posts/${uid}`).set({
        location,
        description,
        picture: image,
        by: userState.name,
        userId: userState.uid,
        date: Date.now(),
        instaId: userState.instaUserName,
        userImage: userState.image,
        id: uid,
      });
      console.log('Post Added SUCCESS');
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
      Snackbar.show({
        text: 'Post upload failed',
        textColor: 'white',
        backgroundColor: 'red',
      });
    }
  };

  return (
    <KeyboardAvoidingView enabled={true} style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {image && (
          <Image
            source={{uri: image}}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        <View regular style={styles.formItem}>
          <TextInput
            placeholder="location"
            value={location}
            style={styles.input}
            onChangeText={text => setLocation(text)}
          />
        </View>

        {imageUploading ? (
          <ProgressBar progress={uploadStatus} style={styles.progress} />
        ) : (
          <>
            <TouchableOpacity style={styles.formItem} onPress={chooseImage}>
              <View style={styles.imageUploader}>
                <Icon name="md-image-outline" style={styles.icon} />
                <Text
                  style={{
                    color: '#fdcb9e',
                  }}>
                  CHOOSE IMAGE
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formItem, {marginTop: -15}]}
              onPress={captureImage}>
              <View style={styles.imageUploader}>
                <Icon name="md-camera-outline" style={styles.icon} />
                <Text
                  style={{
                    color: '#fdcb9e',
                  }}>
                  CAPTURE IMAGE
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        <View regular style={styles.formItem}>
          <TextInput
            multiline={true}
            numberOfLines={8}
            placeholder="Some description..."
            value={description}
            style={[styles.input, {textAlignVertical: 'top'}]}
            onChangeText={text => setDescription(text)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={addPost}>
          <Text style={styles.buttonText}>Add Post</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = state => ({
  userState: state.auth.user,
});

AddPost.propTypes = {
  userState: propTypes.object.isRequired,
};

export default connect(mapStateToProps, null)(AddPost);

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    backgroundColor: '#2C384A',
    flex: 1,
    justifyContent: 'flex-start',
  },
  formItem: {
    marginBottom: 20,
  },
  imageUploader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f4c75',
    marginHorizontal: 10,
    paddingVertical: 15,
  },
  icon: {fontSize: 20, color: '#fdcb9e', marginRight: 10},
  image: {width: null, height: 150, marginVertical: 15},
  progress: {width: null, marginBottom: 20},
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
