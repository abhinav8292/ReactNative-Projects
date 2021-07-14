import database from '@react-native-firebase/database';
import {SET_POST, ERROR_POST, SET_USER_POST} from './action.types';

export const getPosts = () => async dispatch => {
  try {
    database()
      .ref('/posts/')
      .orderByChild('date')
      .on('value', snapshot => {
        const posts = [];
        snapshot.forEach(snap => {
          posts.push({...snap.val()});
        });
        // console.log('posts', posts);
        // console.log('User Data:', snapshot.val());
        if (posts) {
          dispatch({
            type: SET_POST,
            // payload: Object.values(snapshot.val()),
            payload: posts.reverse(),
          });
        } else {
          dispatch({
            type: SET_POST,
            payload: [],
          });
        }
      });
  } catch (error) {
    dispatch({
      type: ERROR_POST,
    });
  }
};
export const getUserPosts = userId => async dispatch => {
  try {
    console.log('called');
    database()
      .ref('/posts/')
      .orderByChild('userId')
      .equalTo(userId)
      .on('value', snapshot => {
        const posts = [];
        snapshot.forEach(snap => {
          posts.push({...snap.val()});
        });
        // console.log('posts', posts);
        posts.sort((a, b) => (a.date > b.date ? -1 : b.date > a.date ? 1 : 0));
        // console.log('User Data:', snapshot.val());
        if (posts) {
          dispatch({
            type: SET_USER_POST,
            // payload: Object.values(snapshot.val()),
            payload: posts,
          });
        } else {
          dispatch({
            type: SET_POST,
            payload: [],
          });
        }
      });
  } catch (error) {
    dispatch({
      type: ERROR_POST,
    });
  }
};
