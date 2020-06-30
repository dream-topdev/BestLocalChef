import React, {Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import RegisterModel from '../models/RegisterModel';

export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {modalVisible: false};
  }

  login() {
    Actions.login();
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  modalHide = () => {
    this.setState({modalVisible: false});
  };

  render() {
    const {modalVisible} = this.state;

    return (
      <View style={styles.container}>
        <Image
          source={require('../../assets/home.png')}
          style={styles.bgImgStyle}
        />
        <View style={styles.btnLayoutStyle}>
          <TouchableOpacity onPress={this.login} style={styles.loginBtnStyle}>
            <Text allowFontScaling={false} style={styles.loginBtnTextStyle}>
              LOGIN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setModalVisible(true)}
            style={styles.joinBtnStyle}>
            <Text allowFontScaling={false} style={styles.loginBtnTextStyle}>
              JOIN
            </Text>
          </TouchableOpacity>
        </View>

        <RegisterModel visible={modalVisible} modalHide={this.modalHide} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImgStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  btnLayoutStyle: {
    position: 'absolute',
    left: 0,
    bottom: 80,
    paddingLeft: 15,
    paddingRight: 15,
    height: '5%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loginBtnStyle: {
    width: '48%',
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnTextStyle: {
    fontSize: 15,
    color: '#fff',
  },
  joinBtnStyle: {
    width: '48%',
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#D3AB52',
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
