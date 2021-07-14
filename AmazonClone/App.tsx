/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import {withAuthenticator, withOAuth} from 'aws-amplify-react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import config from './src/aws-exports';
Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

import React from 'react';
import 'react-native-gesture-handler';
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Router from './src/router';
import {StripeProvider} from '@stripe/stripe-react-native';

const App = ({googleSignIn}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar backgroundColor={'#80edeb'} />

      <StripeProvider publishableKey="pk_test_51IeDvNSACUKPl95IheL1lNZY0lDsiWcNUacUYfaIdvEi6E90XwhRxOihnaRcbI3VN4ZHwivu8oAtLSVYV07hIlC500ElCvhBfw" >
        <Router />
      </StripeProvider>

      {/*<Button title="Login with Google" onPress={googleSignIn} /> */}
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({});

export default withAuthenticator(App);
