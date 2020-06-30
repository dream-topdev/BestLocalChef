import React, {Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import Loader from '../../components/Loader';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        marginTop: 47,
      },
      android: {
        marginTop: 0,
      },
    }),
  },
  topStyle: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
  },
  imgStyle: {
    paddingTop: 0,
    marginLeft: -80,
  },
  imgStyleThree: {
    width: 45,
    height: 30,
  },
  imgStyleBack: {
    width: 45,
    height: 20,
  },
  imgUserStyle: {
    marginTop: 60,
    marginLeft: -65,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D3AB52',
  },
  textStyle: {
    position: 'absolute',
    marginTop: 20,
    marginLeft: 15,
  },
  titleTextStyle: {
    marginTop: 15,
    color: 'white',
    fontSize: 22,
  },
  nameTextStyle: {
    color: '#D3AB52',
    marginTop: 15,
    fontSize: 25,
  },
  logoutText: {
    color: '#D3AB52',
    marginTop: 15,
  },
});

class ChefHeader extends Component {
  render() {
    const {
      propsData: {coordinateData},
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.topStyle}>
          <Image
            source={require('../../assets/top_profile_img.png')}
            style={styles.imgStyle}
          />
          <Image
            source={
              coordinateData
                ? {uri: coordinateData.chef.profile_pic}
                : {uri: 'https://gravatar.com/avatar'}
            }
            style={styles.imgUserStyle}
          />
        </View>

        <View style={styles.textStyle}>
          <TouchableOpacity onPress={() => Actions.pop()}>
            <Image
              source={require('../../assets/back.png')}
              style={styles.imgStyleBack}
            />
          </TouchableOpacity>
          <Text style={styles.titleTextStyle}>CHEF PROFILE</Text>
          <Text style={styles.nameTextStyle}>
            {coordinateData
              ? coordinateData.chef.first_name +
                ' ' +
                coordinateData.chef.last_name
              : ''}
          </Text>
        </View>
      </View>
    );
  }
}

mapStateToProps = (state) => ({
  propsData: state.userReducer.propsData,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChefHeader);
