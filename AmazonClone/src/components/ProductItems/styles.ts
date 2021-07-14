import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    marginLeft: 8,
    marginRight: 8,
    marginVertical: 4,
    backgroundColor: 'white',
  },
  border: {
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 10,
  },
  image: {
    flex: 2,
    height: 150,
    resizeMode: 'contain',
  },
  info: {
    flex: 3,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    color: 'black',
    lineHeight: 25,
  },
  rating: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  ratingCount: {
    marginLeft: 5,
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  oldPrice: {
    fontSize: 12,
    fontWeight: 'normal',
    textDecorationLine: 'line-through',
  },
  options: {
    paddingVertical: 10,
  },
});

export default styles;
