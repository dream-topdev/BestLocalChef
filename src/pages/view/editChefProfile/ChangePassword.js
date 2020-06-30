import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Picker,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {Field, reduxForm, change} from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Actions} from 'react-native-router-flux';
import {ErrorUtils} from '../../../utils/auth.utils';
import InputText from '../../../components/InputText';
import {changePassword} from '../../../actions/profile.actions';
import Loader from '../../../components/Loader';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  mainContainer: {
    ...Platform.select({
      ios: {
        paddingRight: 15,
        paddingLeft: 15,
      },
      android: {
        paddingRight: 0,
        paddingLeft: 0,
      },
    }),
  },
  textStyle: {
    color: '#555555',
    fontSize: 15,
  },
  textInputStyle: {
    borderColor: '#555555',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    marginTop: 10,
    padding: 5,
  },
  pickerStyle: {
    borderColor: '#555555',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    marginTop: 10,
    justifyContent: 'center',
  },
  title: {
    color: '#D3AB52',
    fontSize: 22,
    width: '100%',
  },
  textStyleBtn: {
    fontSize: 15,
    color: '#fff',
    alignSelf: 'center',
  },
  textBtnStyle: {
    height: 45,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#D3AB52',
    borderColor: 'white',
    justifyContent: 'center',
  },
  errorText: {
    color: '#eb0808',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
});

class ChangePassword extends React.Component {
  state = {
    loading: false,
  };
  onSubmit = (values) => {
    this.setState({loading: true});
    this.changePassword(values);
  };

  changePassword = async (values) => {
    try {
      const response = await this.props.dispatch(changePassword(values));
      console.log(response, 'this is true res');

      if (!response.success) {
        this.setState({loading: false});

        throw response;
      }
      const newError = new ErrorUtils(response.responseBody, 'Change Password');
      this.props.dispatch(change('ChangePassword', 'password', ''));
      this.props.dispatch(change('ChangePassword', 'new_password', ''));
      this.props.dispatch(change('ChangePassword', 'confirm_password', ''));

      newError.showAlert();
      Actions.pop();
      this.setState({loading: false});
    } catch (error) {
      const newError = new ErrorUtils(error, 'Oops');
      this.setState({loading: false});
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
      input: {onChange, value, ...restInput},
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
          value={value}
          {...restInput}
        />
        {touched && error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  _renderTextInput(label, ref) {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flexDirection: 'column', width: '100%'}}>
          <Text style={styles.textStyle}>{label}</Text>
          <Field
            name={ref}
            secureTextEntry={true}
            component={this.renderTextInput}
          />
        </View>
      </View>
    );
  }

  render() {
    const {handleSubmit} = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView>
          <ScrollView style={styles.mainContainer}>
            {this._renderTextInput('Current Password', 'password')}
            {this._renderTextInput('New Password', 'new_password')}
            {this._renderTextInput('Confirm Password', 'confirm_password')}

            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                disabled={this.state.loading}
                style={styles.textBtnStyle}
                onPress={handleSubmit(this.onSubmit)}>
                <Text style={styles.textStyleBtn}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const validate = (values) => {
  const errors = {};

  if (!values.password) {
    errors.password = 'Current Password is required.';
  }
  if (values.password && values.password.length < 8) {
    errors.password = 'Current Password  must be at least 8 characters.';
  }
  if (!values.new_password) {
    errors.new_password = 'New Password is required.';
  }
  if (values.new_password && values.new_password.length < 8) {
    errors.new_password = 'New Password  must be at least 8 characters.';
  }
  if (!values.confirm_password) {
    errors.confirm_password = 'Confirm Password is required';
  }
  if (values.confirm_password !== values.new_password) {
    errors.confirm_password = `Confirm password doesn't match.`;
  }
  return errors;
};

mapStateToProps = (state) => ({
  getUser: state.authReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'ChangePassword',
    validate,
  }),
)(ChangePassword);
