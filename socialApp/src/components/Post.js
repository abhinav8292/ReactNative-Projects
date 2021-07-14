import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import database from '@react-native-firebase/database';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import EmptyContainer from './EmptyContainer';

const Post = ({item, userDetails}) => {
  const navigation = useNavigation();

  const [upVote, setUpVote] = useState(0);
  const [downVote, setDownVote] = useState(0);
  const [userLiked, setuserLiked] = useState(null);
  const [currUserDetails, setCurrUserDetails] = useState(null);

  const getCurrUser = () => {
    if (item) {
      database()
        .ref(`/users/${item.userId}`)
        .on('value', snapshot => setCurrUserDetails({...snapshot.val()}));
    }
  };

  useEffect(() => {
    getCurrUser();
    return () =>
      database().ref(`/users/${item.userId}`).off('value', getCurrUser);
  }, []);

  const upVotePost = () => {
    database()
      .ref(`/posts/${item.id}/vote/${userDetails.uid}`)
      .set({
        upvote: 1,
      })
      .then(() => console.log('UPVOTED'));
  };

  const downVotePost = () => {
    database()
      .ref(`/posts/${item.id}/vote/${userDetails.uid}`)
      .set({
        downvote: 1,
      })
      .then(() => console.log('DOWNVOTED'));
  };

  useEffect(() => {
    if (item.vote) {
      // console.log(item.vote);
      let upVoteCount = 0;
      let downVoteCount = 0;
      Object.entries(item.vote).map(entry => {
        let vote = Object.keys(entry[1])[0];
        if (entry[0] === userDetails.uid) {
          setuserLiked(vote);
        }
        if (vote === 'upvote') {
          upVoteCount += 1;
        }
        if (vote === 'downvote') {
          downVoteCount += 1;
        }
      });
      setUpVote(upVoteCount);
      setDownVote(downVoteCount);
    }
  }, [item]);

  if (!currUserDetails) {
    return <EmptyContainer />;
  }

  return (
    <View
      style={{
        borderColor: '#0f4c75',
        marginVertical: 5,
      }}>
      <View style={styles.headerView}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProfilePage', {user: currUserDetails})
          }>
          <Image
            style={styles.headerImage}
            source={{uri: currUserDetails.image, width: 50, height: 50}}
          />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.username}>{currUserDetails.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
        </View>
      </View>
      <View>
        <Image
          source={{uri: item.picture}}
          style={{height: 200, width: null}}
        />
      </View>
      <View style={styles.footerView}>
        <View style={styles.description}>
          <Text style={{color: '#fff', paddingVertical: 10}}>
            {item.description}
          </Text>
        </View>
        <View style={styles.footerIcons}>
          <View style={styles.likeDislike}>
            <TouchableOpacity style={styles.icon} onPress={upVotePost}>
              {userLiked === 'upvote' ? (
                <Entypo
                  name="thumbs-up"
                  style={{fontSize: 20, color: '#fdcb9e'}}
                />
              ) : (
                <Feather
                  name="thumbs-up"
                  style={{fontSize: 20, color: '#fdcb9e'}}
                />
              )}
              <Text
                style={{
                  color: '#fdcb9e',
                  marginHorizontal: 10,
                }}>
                {upVote}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} onPress={downVotePost}>
              {userLiked === 'downvote' ? (
                <Entypo
                  name="thumbs-down"
                  style={{fontSize: 20, color: '#fdcb9e', marginLeft: 10}}
                />
              ) : (
                <Feather
                  name="thumbs-down"
                  style={{fontSize: 20, color: '#fdcb9e'}}
                />
              )}
              <Text
                style={{
                  color: '#fdcb9e',
                  marginHorizontal: 10,
                }}>
                {downVote}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.instaView}>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                Linking.openURL(`instagram://user?username=${item.instaId}`);
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
                style={{fontSize: 20, marginLeft: 20, color: '#fdcb9e'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  headerView: {
    backgroundColor: '#0f4c75',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  headerImage: {
    borderRadius: 250,
  },
  headerText: {
    marginHorizontal: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  location: {
    fontSize: 15,
    color: 'lightgrey',
  },
  footerView: {
    backgroundColor: '#0f4c75',
  },
  description: {
    marginHorizontal: 10,
  },
  footerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  likeDislike: {
    flexDirection: 'row',
  },
  icon: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
    paddingBottom: 10,
  },
  instaView: {
    flexDirection: 'row',
  },
});
