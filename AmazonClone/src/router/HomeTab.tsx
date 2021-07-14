import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import {TextInput, View} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import {StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const HomeStack = createStackNavigator();

interface HeaderProps {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({searchValue, setSearchValue}) => {
  return (
    <View style={{backgroundColor: '#80edeb'}}>
      <View style={styles.searchbar}>
        <Feather name="search" size={20} />
        <TextInput
          style={{height: 40, marginLeft: 5}}
          placeholder="search"
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>
    </View>
  );
};

const HomeTab: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  return (
    <HomeStack.Navigator
      initialRouteName="home"
      screenOptions={{
        header: () => (
          <Header searchValue={searchValue} setSearchValue={setSearchValue} />
        ),
      }}>
      <HomeStack.Screen name="home">
        {() => <HomeScreen searchValue={searchValue} />}
      </HomeStack.Screen>
      <HomeStack.Screen component={ProductScreen} name="ProductDetails" />
    </HomeStack.Navigator>
  );
};

const styles = StyleSheet.create({
  searchbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 10,
    padding: 4,
    borderRadius: 3,
  },
});

export default HomeTab;
