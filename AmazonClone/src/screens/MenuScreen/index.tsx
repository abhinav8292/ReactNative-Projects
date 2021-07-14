import React from 'react';
import {View, Text, Pressable} from 'react-native';
import Auth from '@aws-amplify/auth';
import CustomButton from '../../components/CustomButtom';

interface Props {}

const MenuScreen: React.FC<Props> = () => {
  const logout = () => {
    Auth.signOut();
  };

  return (
    <View>
      <CustomButton text="Sign Out" onPress={logout} />
    </View>
  );
};

export default MenuScreen;
