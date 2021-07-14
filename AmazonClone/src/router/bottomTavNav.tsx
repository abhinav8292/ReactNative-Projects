import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import Entypo from 'react-native-vector-icons/Entypo';
import HomeTab from './HomeTab';
import CartTab from './CartTab';
import MenuScreen from '../screens/MenuScreen';
import OrderScreen from '../screens/OrderScreen';

const Tab = createBottomTabNavigator();

interface Props {}

const BottomTavNav: React.FC<Props> = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        inactiveTintColor: 'lightblue',
        activeTintColor: 'blue',
      }}>
      <Tab.Screen
        component={HomeTab}
        name="HomeScreen"
        options={{
          tabBarIcon: ({color}) => (
            <Entypo name="home" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        component={OrderScreen}
        name="OrderScreen"
        options={{
          tabBarIcon: ({color}) => (
            <Entypo name="user" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        component={CartTab}
        name="cart"
        options={{
          tabBarIcon: ({color}) => (
            <Entypo name="shopping-cart" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        component={MenuScreen}
        name="menu"
        options={{
          tabBarIcon: ({color}) => (
            <Entypo name="menu" color={color} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTavNav;
