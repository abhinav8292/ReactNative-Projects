import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NativeBaseProvider, Spinner} from 'native-base';

const EmptyContainer = () => {
  return (
    <NativeBaseProvider>
      <View style={styles.emptyContainer}>
        <Spinner />
      </View>
    </NativeBaseProvider>
  );
};

export default EmptyContainer;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: '#1b262c',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
