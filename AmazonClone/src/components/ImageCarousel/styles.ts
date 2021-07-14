import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  root: {},
  image: {
    margin: 10,
    resizeMode: 'contain',
    overflow: 'hidden',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: '#ededed',
    borderColor: '#c9c9c9',
    margin: 5,
  },
});

export default styles;
