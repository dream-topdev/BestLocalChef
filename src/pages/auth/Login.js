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

import {connect} from 'react-redux';
import {compose} from 'redux';
import {Field, reduxForm} from 'redux-form';

import InputText from '../../components/InputText';
import RegisterModel from '../../pages/models/RegisterModel';
import {loginUser} from '../../actions/auth.actions';
import Loader from '../../components/Loader';
import {ErrorUtils} from '../../utils/auth.utils';
import {RNToasty} from 'react-native-toasty';
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
    fontSize: 20,
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
  registerViewStyle: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
  },
  register1TextStyle: {
    fontSize: 15,
    color: 'white',
  },
  register2TextStyle: {
    fontSize: 15,
    color: '#D3AB52',
    marginLeft: 5,
  },
  emailTextStyle: {
    color: '#D3AB52',
    fontSize: 20,
    marginTop: 210,
    marginBottom: 10,
  },
  passwordTextStyle: {
    color: '#D3AB52',
    fontSize: 20,
    marginVertical: 10,
  },
  errorText: {
    color: '#eb0808',
    fontSize: 14,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  imgStyleBack: {
    width: 45,
    height: 20,
  },
  imgPosStyle: {
    position: 'absolute',
    marginTop: 35,
    marginLeft: 15,
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {modalVisible: false};
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  modalHide = () => {
    this.setState({modalVisible: false});
  };

  onSubmit = (values) => {
    this.loginUser(values);
  };

  loginUser = async (values) => {
    try {
      const response = await this.props.dispatch(loginUser(values));
      if (!response.success) {
        throw response;
      } else {
        Actions.profile();
      }
    } catch (error) {
      console.log(error)
      const newError = new ErrorUtils(error, 'Login Error!');
      newError.showAlert();
    }
  };

  renderTextInput = (field) => {
    const {
      meta: {touched, error},
      label,
      secureTextEntry,
      maxLength,
      keyboardType,
      placeholder,
      input: {onChange, ...restInput},
    } = field;
    return (
      <View>
        <InputText
          Focus={() => {}}
          Blur={() => {}}
          onChangeText={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          label={label}
          {...restInput}
        />
        {touched && error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  render() {
    const {modalVisible} = this.state;
    const {handleSubmit, loginUser} = this.props;
    return (
      <View style={styles.container}>
        {loginUser.isLoading && <Loader />}
        <Image
          source={require('../../assets/login_bg.png')}
          style={styles.bgImgStyle}
        />
        <TouchableOpacity
          onPress={() => Actions.splash()}
          style={styles.imgPosStyle}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.imgStyleBack}
          />
        </TouchableOpacity>

        <View style={styles.contentViewStyle}>
          <View style={styles.verticalViewStyle}>
            <Text style={styles.emailTextStyle}>Email</Text>
            <Field name="email" component={this.renderTextInput} />

            <Text style={styles.passwordTextStyle}>Password</Text>
            <Field
              name="password"
              secureTextEntry={true}
              component={this.renderTextInput}
            />

            <TouchableOpacity
              style={styles.loginBtnStyle}
              onPress={handleSubmit(this.onSubmit)}>
              <Text style={styles.loginBtnTextStyle}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setModalVisible(true)}
              style={styles.registerViewStyle}>
              <Text style={styles.register1TextStyle}>
                {' '}
                Don't have an account?
              </Text>
              <Text style={styles.register2TextStyle}>Register Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Actions.forgot()}
              style={styles.registerViewStyle}>
              <Text style={styles.register2TextStyle}>Forgot my password</Text>
            </TouchableOpacity>
          </View>

          <RegisterModel visible={modalVisible} modalHide={this.modalHide} />
        </View>
      </View>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email is required';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  return errors;
};

mapStateToProps = (state) => ({
  loginUser: state.authReducer.loginUser,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'login',
    validate,
  }),
)(Login);
