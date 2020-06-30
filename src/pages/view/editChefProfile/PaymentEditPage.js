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
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Actions} from 'react-native-router-flux';

import {ErrorUtils} from '../../../utils/auth.utils';
import InputText from '../../../components/InputText';
import {paymentAdd} from '../../../actions/payment.actions';
import Loader from '../../../components/Loader';
import {RNToasty} from 'react-native-toasty';

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
    marginBottom: 5,
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
    fontSize: 10,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
});

class PaymentEditPage extends React.Component {
  onSubmit = (values) => {
    values['account_type'] = 'custom';
    this.paymentAdd(values);
  };

  paymentAdd = async (values) => {
    try {
      const response = await this.props.dispatch(paymentAdd(values));
      if (!response.success) {
        throw response;
      } else {
        const newError = new ErrorUtils(
          'Success',
          'Payment Method Edited.',
        );
        newError.showAlert();
        Actions.profile({route: 5});
      }
    } catch (error) {
      const newError = new ErrorUtils(error, 'Server Error');
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

  _renderInlineTextInput(label1, ref1, label2, ref2) {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flexDirection: 'column', width: '48%'}}>
          <Text style={styles.textStyle}>{label1}</Text>
          <Field name={ref1} component={this.renderTextInput} />
        </View>
        <View style={{width: '4%'}}></View>
        <View style={{flexDirection: 'column', width: '48%'}}>
          <Text style={styles.textStyle}>{label2}</Text>
          <Field
            name={ref2}
            keyboardType="number-pad"
            component={this.renderTextInput}
          />
        </View>
      </View>
    );
  }

  _renderTextInput(label, ref) {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flexDirection: 'column', width: '100%'}}>
          <Text style={styles.textStyle}>{label}</Text>
          <Field
            name={ref}
            keyboardType={ref == 'account_number' ? 'number-pad' : null}
            component={this.renderTextInput}
          />
        </View>
      </View>
    );
  }

  render() {
    const {handleSubmit, loader} = this.props;

    return (
      <SafeAreaView style={styles.container}>
        {loader.isLoading && <Loader />}
        <KeyboardAvoidingView>
          <ScrollView style={styles.mainContainer}>
            {this._renderInlineTextInput(
              'Name',
              'bank_name',
              'Routing Number',
              'routing_number',
            )}

            {this._renderTextInput('Account Number', 'account_number')}

            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={styles.textBtnStyle}
                onPress={handleSubmit(this.onSubmit)}>
                <Text style={styles.textStyleBtn}>Update Bank</Text>
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
  if (!values.bank_name) {
    errors.bank_name = 'Bank Name is required';
  }
  if (!values.routing_number) {
    errors.routing_number = 'Routing Number is required';
  }
  if (!values.account_number) {
    errors.account_number = 'Account Number is required';
  }
  return errors;
};

mapStateToProps = (state, props) => ({
  loader: state.userReducer.loader,
  initialValues: props.bank,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'PaymentEditPage',
    validate,
  }),
)(PaymentEditPage);
