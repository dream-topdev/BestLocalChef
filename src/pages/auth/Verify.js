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
import {logoutUser} from '../../actions/auth.actions';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Field, reduxForm} from 'redux-form';

import {forgotPass, verifyEmail} from '../../actions/auth.actions';
import Loader from '../../components/Loader';
import {ErrorUtils} from '../../utils/auth.utils';
import {userProfileGet} from '../../actions/profile.actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImgStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  contentViewStyle: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  verticalViewStyle: {
    flexDirection: 'column',
    width: '100%',
  },
  loginBtnTextStyle: {
    fontSize: 16,
    color: '#fff',
  },
  loginBtnStyle: {
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#D3AB52',
    borderColor: 'white',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  TextStyle: {
    color: '#fff',
    fontSize: 24,
    marginTop: 200,
    textAlign: 'center',
  },
  imgStyleBack: {
    width: 45,
    height: 20,
  },
  imgPosStyle: {
    position: 'absolute',
    marginTop: 20,
    marginLeft: 15,
  },
});

class Verify extends Component {
  constructor(props) {
    super(props);
  }

  async sendRequest() {
    try {
      const response = await this.props.dispatch(
        verifyEmail({action: 'verify'}),
      );
      if (!response.success) {
        throw response;
      } else {
        const newError = new ErrorUtils(
          response.responseBody,
          'Email Verify Request!',
        );
        newError.showAlert();
        Actions.profile();
      }
    } catch (error) {
      const newError = new ErrorUtils(error, 'Server Error');
      newError.showAlert();
    }
  }

  async getData() {
    try {
      const response = await this.props.dispatch(userProfileGet());
      console.log(response);
      if (!response.success) {
        throw response;
      }
    } catch (error) {
      const newError = new ErrorUtils(error, 'Server Error');
      newError.showAlert();
    }
  }

  render() {
    const {loader} = this.props;
    return (
      <View style={styles.container}>
        {loader.isLoading && <Loader />}
        <Image
          source={require('../../assets/login_bg.png')}
          style={styles.bgImgStyle}
        />

        <View style={styles.contentViewStyle}>
          <View style={styles.verticalViewStyle}>
            <Text style={styles.TextStyle}>Verify Your Email Address</Text>

            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                textAlign: 'center',
                marginTop: 20,
              }}>
              Before proceeding, please check your email for a verification
              link. If you did not receive the email.
            </Text>
            <TouchableOpacity
              style={styles.loginBtnStyle}
              onPress={() => this.sendRequest()}>
              <Text style={styles.loginBtnTextStyle}>
                click here to request another.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginBtnStyle}
              onPress={() => this.getData()}>
              <Text style={styles.loginBtnTextStyle}>
                Already Verified.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await this.props.dispatch(logoutUser());
              }}
              style={styles.loginBtnStyle}>
              <Text style={[styles.loginBtnTextStyle,{color:"#000"}]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

mapStateToProps = (state) => ({
  getUser: state.userReducer.getUser,
  loader: state.userReducer.loader,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'verify',
  }),
)(Verify);
