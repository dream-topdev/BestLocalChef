import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CheckBox from 'react-native-check-box';

import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Actions} from 'react-native-router-flux';

import InputText from '../../components/InputText';
import {createNewUser} from '../../actions/auth.actions';
import Loader from '../../components/Loader';
import {ErrorUtils} from '../../utils/auth.utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topImgStyle: {
    width: '100%',
    height: 250,
  },
  contentViewStyle: {
    justifyContent: 'center',
    width: '100%',
    paddingLeft: 15,
    paddingRight: 15,
  },
  middleTextStyle: {
    color: '#555555',
    fontSize: 20,
    marginVertical: 10,
  },
  joinBtnStyle: {
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
  joinBtnTextStyle: {
    fontSize: 20,
    color: '#fff',
  },
  errorText: {
    color: '#eb0808',
    fontSize: 14,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  termsViewStyle: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  termsTextStyle: {
    fontSize: 15,
    color: '#555555',
    marginLeft: 5,
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

class CustomerRegister extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      checked: true,
    };
  }

  createNewUser = async (values) => {
    try {
      const response = await this.props.dispatch(createNewUser(values));
      if (!response.success) {
        throw response;
      } else {
        const newError = new ErrorUtils("Register Successful", 'Registration!');
        newError.showAlert();
        Actions.profile();
      }
    } catch (error) {
      const newError = new ErrorUtils(error, 'Signup Error');
      newError.showAlert();
    }
  };

  onSubmit = (values) => {
    values['user_type'] = 'user';
    this.createNewUser(values);
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
    const {handleSubmit, createUser} = this.props;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <Image
          source={require('../../assets/signup.png')}
          style={styles.topImgStyle}></Image>
        <TouchableOpacity
          onPress={() => Actions.login()}
          style={styles.imgPosStyle}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.imgStyleBack}
          />
        </TouchableOpacity>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          {createUser.isLoading && <Loader />}
          <View style={{flexDirection: 'column', marginBottom: 20}}>
            <View style={styles.contentViewStyle}>
              <Text style={styles.middleTextStyle}>First Name</Text>
              <Field name="first_name" component={this.renderTextInput} />

              <Text style={styles.middleTextStyle}>Last Name</Text>
              <Field name="last_name" component={this.renderTextInput} />

              <Text style={styles.middleTextStyle}>Email</Text>
              <Field name="email" component={this.renderTextInput} />

              <Text style={styles.middleTextStyle}>Phone Number</Text>
              <Field name="phone_number" component={this.renderTextInput} />

              <Text style={styles.middleTextStyle}>Password</Text>
              <Field
                name="password"
                secureTextEntry={true}
                component={this.renderTextInput}
              />

              <Text style={styles.middleTextStyle}>Confirm Password</Text>
              <Field
                name="password_confirmation"
                secureTextEntry={true}
                component={this.renderTextInput}
              />

              <View style={styles.termsViewStyle}>
                <CheckBox
                  onClick={() => this.setState({checked: !this.state.checked})}
                  isChecked={this.state.checked}
                  style={{width: 28, height: 28, alignItems: 'center'}}
                />

                <Text style={styles.termsTextStyle}>
                  I accept to the{' '}
                  <Text
                    onPress={() =>
                      Linking.openURL('https://bestlocalchef.com/terms-of-use')
                    }
                    style={{
                      color: '#D3AB52',
                      textDecorationLine: 'underline',
                    }}>
                    Terms of Use
                  </Text>{' '}
                  and{' '}
                  <Text
                    onPress={() =>
                      Linking.openURL(
                        'https://bestlocalchef.com/privacy-policy',
                      )
                    }
                    style={{
                      color: '#D3AB52',

                      textDecorationLine: 'underline',
                    }}>
                    Privacy Policy.
                  </Text>
                </Text>
              </View>
              {!this.state.checked && (
                <Text style={styles.errorText}>
                  please agree with our terms and condition if you want to
                  proceed
                </Text>
              )}

              <TouchableOpacity
                disabled={!this.state.checked}
                style={styles.joinBtnStyle}
                onPress={handleSubmit(this.onSubmit)}>
                <Text style={styles.joinBtnTextStyle}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.first_name) {
    errors.first_name = 'First Name is required';
  }
  if (!values.last_name) {
    errors.last_name = 'Last Name is required';
  }
  if (!values.email) {
    errors.email = 'Email is required';
  }
  if (!values.phone_number) {
    errors.phone_number = 'Phone Number is required';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  if (values.password && values.password.length < 8) {
    errors.password = 'The password must be at least 8 characters.';
  }
  if (!values.password_confirmation) {
    errors.password_confirmation = 'Confirm Password is required.';
  }
  if (values.password_confirmation !== values.password) {
    errors.password_confirmation = `Confirm password doesn't match.`;
  }

  return errors;
};

mapStateToProps = (state) => ({
  createUser: state.authReducer.createUser,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'CustomerRegister',
    validate,
  }),
)(CustomerRegister);
