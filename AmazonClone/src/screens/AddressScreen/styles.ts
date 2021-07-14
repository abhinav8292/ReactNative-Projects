import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#e6e6e6',
    padding: 10,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  page: {
    flex: 1,
  },
  country: {
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    height: 50,
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'darkgrey',
  },
  row: {
    flex: 1,
    marginVertical: 4,
  },
  label: {
    fontWeight: 'bold',
    marginLeft: 3,
  },
  input: {
    backgroundColor: 'white',
    padding: 5,
    marginVertical: 5,
    height: 45,
    borderWidth: 1,
    borderColor: 'darkgrey',
    borderRadius: 4,
    color: '#000',
  },
  lastRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  state: {
    justifyContent: 'center',
    height: 45,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'darkgrey',
    marginVertical: 5,
    marginRight: 10,
  },
  ad: {
    backgroundColor: 'white',
    marginVertical: 10,
    marginBottom: 15,
    padding: 10,
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  lineOne: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lineTwo: {},
  error: {
    color: 'red',
  },
});

export default styles;
