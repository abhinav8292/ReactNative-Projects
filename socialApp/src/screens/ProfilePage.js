import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import {connect} from 'react-redux';
import propTypes from 'prop-types';
import {getUserPosts} from '../action/post';
import Post from '../components/Post';
import {useRoute} from '@react-navigation/native';
import ProgressBar from 'react-native-progress/Bar';
import {requestPermission} from '../utils/AskPermission';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {options} from '../utils/options';
import Snackbar from 'react-native-snackbar';

const ProfilePage = ({getUserPosts, userPostState, userDetails}) => {
  const route = useRoute();
  const {user} = route.params;

  // console.log(user);

  useEffect(() => {
    getUserPosts(user.uid);
  }, []);

  const [userImage, setUserImage] = useState(user.image);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const chooseImage = async () => {
    if (user.uid === userDetails.uid) {
      const permission = await requestPermission();
      console.log(permission);
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
    } else {
      Snackbar.show({
        text: 'You can only change your own profile picture',
        textColor: 'red',
        backgroundColor: 'black',
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
      setUserImage(url);
      Snackbar.show({
        text: 'Profile picture successfully updated',
        textColor: 'white',
        backgroundColor: 'green',
      });
    });
  };

  const saveImageToDatabase = () => {
    database()
      .ref(`/users/${user.uid}`)
      .update({image: userImage})
      .then(() => setImageUploading(false));
  };

  useEffect(() => {
    saveImageToDatabase();
  }, [userImage]);

  // console.log('posts', postState.posts);

  if (userPostState.loading) {
    return <EmptyContainer />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.userDetails}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={chooseImage}>
            <Image
              style={styles.userImage}
              source={{
                uri: userImage,
                width: 120,
                height: 120,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.userTitle}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userCountry}>{user.country}</Text>
          <Text style={styles.userBio}>{user.bio}</Text>
          <View style={styles.instaView}>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                Linking.openURL(
                  `instagram://user?username=${user.instaUserName}`,
                );
              }}>
              <Text
                style={{
                  color: '#fdcb9e',
                  fontSize: 15,
                }}>
                OPEN IN
              </Text>
              <Feather
                name="instagram"
                style={{fontSize: 20, marginLeft: 10, color: '#fdcb9e'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {imageUploading && (
        <ProgressBar progress={uploadStatus} style={styles.progress} />
      )}
      <SafeAreaView style={{flex: 1, marginTop: 5}}>
        <FlatList
          data={userPostState.userPosts}
          keyExtractor={item => item.id}
          renderItem={({item, index, separators}) => (
            <Post item={item} userDetails={userDetails} key={item.id} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text>No post to show</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = state => ({
  userPostState: state.post,
  userDetails: state.auth.user,
});

const mapDispatchToProps = {
  getUserPosts: data => getUserPosts(data),
};

ProfilePage.propTypes = {
  getUserPosts: propTypes.func.isRequired,
  userPostState: propTypes.object.isRequired,
  userDetails: propTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b262c',
    flex: 1,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: -10,
  },
  imageContainer: {
    padding: 10,
  },
  userImage: {
    borderRadius: 80,
  },
  icon: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
    paddingBottom: 10,
  },
  instaView: {
    // justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 20,
    flexDirection: 'row',
  },
  userTitle: {
    marginTop: 5,
  },
  userName: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  userCountry: {
    fontSize: 20,
    color: 'grey',
  },
  userBio: {
    fontSize: 15,
    color: '#bbbcbd',
    textAlign: 'justify',
    width: 270,
  },
  progress: {width: null, marginBottom: 10},
});
