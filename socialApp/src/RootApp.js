import React from 'react';
import {View, Text} from 'react-native';
import {Provider} from 'react-redux';
import store from './store';
import App from './App';

const RootApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default RootApp;
