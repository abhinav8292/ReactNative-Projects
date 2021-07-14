import {SET_POST, ERROR_POST, SET_USER_POST} from '../action/action.types';

const initialState = {
  posts: null,
  userPosts: null,
  loading: true,
  error: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_POST:
      // console.log('reducer', action.payload);
      return {
        ...state,
        posts: action.payload,
        loading: false,
        error: false,
      };
    case SET_USER_POST:
      return {
        ...state,
        userPosts: action.payload,
        loading: false,
        error: false,
      };
    case ERROR_POST:
      return {
        ...state,
        error: true,
        loading: false,
      };
    default:
      return state;
  }
};
