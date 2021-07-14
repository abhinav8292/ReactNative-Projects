import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import propTypes from 'prop-types';
import {signOut} from '../action/auth';

const Header = ({signOut, authState, navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.title}>Social App</Text>
      </TouchableOpacity>
      {authState.isAuthenticated && (
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => navigation.navigate('AddPost')}>
            <Text style={{color: '#fdcb9e', fontSize: 18}}>ADD POST</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => signOut()}>
            <Icon
              name="log-out-outline"
              color="red"
              size={25}
              style={{marginLeft: 40, marginRight: 10}}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  authState: state.auth,
});

const mapDispatchToProps = {
  signOut,
};

Header.propTypes = {
  signOut: propTypes.func.isRequired,
  authState: propTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f4c75',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
