import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  item: {
    margin: 5,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  quantity: {
    marginVertical: 12,
  },
  delete: {
    width: 80,
    height: 35,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
