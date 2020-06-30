import React, {Component} from 'react';
import {Text,
        FlatList,
        View,
        Image,
        StyleSheet
  } from 'react-native';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';

import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Actions} from 'react-native-router-flux';
import {ErrorUtils} from '../../utils/auth.utils';
import InputText from '../../components/InputText';
import {payChef} from '../../actions/payment.actions';
import Loader from '../../components/Loader';
import {RNToasty} from 'react-native-toasty';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  txtInfor: {
    color: '#D3AB52',
    fontSize: 22,
    width: '100%',
    marginTop: 10,
  },
  list: {
    width: '100%',
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  listTable: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    justifyContent: 'space-around',
  },
  col: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  col1: {
    flex: 1,
    fontSize: 16,
  },
  line: {
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
    marginBottom: 5,
    marginTop: 5,
  },
  buttonTextStyle: {
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 10,
    backgroundColor: '#D3AB52',
  },
  buttonPrevStyle: {
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 10,
    backgroundColor: '#333333',
  },
  textStyle: {
    color: '#fff',
  },
  CheifHeader: {    
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    backgroundColor: '#333333',
    height: 100
  },
  CheifColProfile: {
    textAlign: 'center',
    flex: 6,
    fontSize: 16,
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightColor: 'white',
    margin: 10
  },
  CheifColDate: {
    textAlign: 'center',
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightColor: 'white',
    margin: 10
  },
  CheifColGuest: {
    textAlign: 'center',
    flex: 2,
    fontSize: 16,
    fontWeight: 'bold',
    margin: 10
  },
  imgUserStyle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#d3ab52',
    marginRight: 20,
  },
  CheifLabel: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  CheifValue: {
    fontSize: 16,
    color: '#d3ab52',
    fontWeight: 'bold'
  },
  CheifGuestValue: {
    marginLeft: 15,
    fontSize: 16,
    color: '#d3ab52',
    fontWeight: 'bold'
  },
  MenuMealImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    marginLeft: 15,
  },
  MenuMealLabel: {
    marginTop: 15,
    fontSize: 16,    
  },
  MenuMealDetail: {
    fontSize: 14,
  },
  MenuMealCost: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  Payment: {    
    alignSelf: 'flex-end',
    width: 200
  }
});

class Checkout extends Component {
  constructor(props) {
    super(props);
    const {
      checkout: {checkoutData},
    } = this.props;
  }

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

  _renderView(label1, ref1, label2, ref2) {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flexDirection: 'column', width: '48%'}}>
          <Text style={styles.textStyleInput}>{label1}</Text>
          <Field name={ref1} component={this.renderTextInput} />
        </View>
        <View style={{width: 10}}></View>
        <View style={{flexDirection: 'column', width: '48%'}}>
          <Text style={styles.textStyleInput}>{label2}</Text>
          <Field name={ref2} component={this.renderTextInput} />
        </View>
      </View>
    );
  }

  _renderFullView(label1, ref1) {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flexDirection: 'column', width: '100%'}}>
          <Text style={styles.textStyleInput}>{label1}</Text>
          <Field
            name={ref1}
            multiline={true}
            component={this.renderTextInput}
          />
        </View>
      </View>
    );
  }

  _renderCard(label1, ref1) {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flexDirection: 'column', width: '100%'}}>
          <Text style={styles.textStyleInput}>{label1}</Text>
          <Field
            name={ref1}
            keyboardType="numeric"
            maxLength={16}
            component={this.renderTextInput}
          />
        </View>
      </View>
    );
  }

  _renderCvv() {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          paddingLeft: 2,
          paddingRight: 2,
        }}>
        <View style={{flexDirection: 'column', width: '68%'}}>
          <Text style={styles.textStyleInput}>Expiration Date</Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '40%', marginRight: 10}}>
              <Field
                name="expityMonth"
                placeholder="MM"
                keyboardType="numeric"
                maxLength={2}
                component={this.renderTextInput}
              />
            </View>
            <View style={{width: '40%'}}>
              <Field
                name="expityYear"
                placeholder="YYYY"
                keyboardType="number-pad"
                maxLength={4}
                component={this.renderTextInput}
              />
            </View>
          </View>
        </View>
        <View style={{width: 10}}></View>
        <View style={{flexDirection: 'column', width: '30%'}}>
          <Text style={styles.textStyleInput}>CV Code</Text>
          <Field
            name="cvCode"
            placeholder="CVV"
            keyboardType="numeric"
            maxLength={3}
            component={this.renderTextInput}
          />
        </View>
      </View>
    );
  }

  _step1() {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#fff',
          paddingRight: 15,
          paddingLeft: 15,
          paddingBottom: 100,
        }}>
        <Text style={styles.txtInfor}>Info</Text>
        {this._renderView('First Name', 'first_name', 'Last Name', 'last_name')}
        {this._renderView('Email', 'email', 'Phone Number', 'phone_number')}
        {this._renderFullView('Address', 'address')}
        {this._renderFullView('City', 'city')}
        {this._renderView('State', 'state', 'Zip Code', 'zip')}

        <Text style={styles.txtInfor}>Booking Address</Text>
        {this._renderFullView('Address', 'b_address')}
        {this._renderFullView('City', 'b_city')}
        {this._renderView('State', 'b_state', 'Zip Code', 'b_zip')}

        <Text style={styles.txtInfor}>Note Any Known Allergies</Text>
        {this._renderFullView('Notes', 'notes')}
      </View>
    );
  }

  _step2() {
    const {
      propsData: {coordinateData},
      checkout: {checkoutData},
      getUser: {userDetails},
    } = this.props;

    const meal = this.findMealById(checkoutData.meal, 'meal');
    console.log(checkoutData, 'check');

    let service_tax =
      (checkoutData.hidden_cost * userDetails.service_tax) / 100;
    let sales_tax = (checkoutData.hidden_cost * userDetails.sales_tax) / 100;
    let sub_total =
      parseFloat(checkoutData.hidden_cost) +
      parseFloat(service_tax) +
      parseFloat(sales_tax);

    return (
      <View
        style={{
          backgroundColor: '#fff',
        }}>
        <View>
          <View style={styles.CheifHeader}>
            <View style={styles.CheifColProfile}>
              <Image
                source={
                  coordinateData.chef
                    ? {uri: coordinateData.chef.profile_pic}
                    : {uri: 'https://gravatar.com/avatar'}
                }
                style={styles.imgUserStyle}
              />
              <View>
                <Text style={styles.CheifLabel}>Chef</Text>                
                <Text style={styles.CheifValue}>
                  {coordinateData.chef.first_name} {coordinateData.chef.last_name}
                </Text>
              </View>
            </View>
            <View style={styles.CheifColDate}>                
              <Text style={styles.CheifLabel}>Date/Time</Text>              
              <Text style={styles.CheifValue}>{checkoutData.booking_date}</Text>
              <Text style={styles.CheifValue}>{checkoutData.booking_time}</Text>
            </View>
            <View style={styles.CheifColGuest}>
              <Text style={styles.CheifLabel}>Guests</Text>              
              <Text style={styles.CheifGuestValue}>{checkoutData.guests}</Text>
            </View>
          </View>

          {meal && (
            <View>
              <View style={styles.listTable}>
                <View style={{ flex:1, marginRight: 15 }}>
                <Image
                  source={
                    meal.image
                      ? {uri: meal.image}
                      : {uri: 'https://gravatar.com/avatar'}
                  }
                  style={styles.MenuMealImage}
                />
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={styles.MenuMealLabel}>{meal.name}</Text>
                  <Text style={styles.MenuMealDetail}>{meal.category} Details ></Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.MenuMealLabel}>- {checkoutData.guests} +</Text>
                  <Text style={styles.MenuMealCost}>${meal.cost} each </Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.Payment}>
            <View style={styles.listTable}>
              <Text style={styles.col}>Total</Text>
              <Text style={styles.col}>${parseFloat(sub_total).toFixed(2)}</Text>
            </View>
            <View style={styles.listTable}>
              <Text style={styles.col}>Sales Tax</Text>
              <Text style={styles.col}>${parseFloat(sales_tax).toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.line}></View>

          {checkoutData.menus_desserts_list.length !== 0 && (
            <View style={{marginTop: 15}}>
              <View style={styles.listTable}>
                <Text style={styles.col}>Type</Text>
                <Text style={styles.col}>Dessert Name</Text>
                <Text style={styles.col}>Cost</Text>
                <Text style={styles.col}>Total Cost</Text>
              </View>
              <View style={styles.line}></View>

              {this._renderMeals('desserts')}
            </View>
          )}

          {checkoutData.menus_appetizers_list.length !== 0 && (
            <View style={{marginTop: 15}}>
              <View style={styles.listTable}>
                <Text style={styles.col}>Type</Text>
                <Text style={styles.col}>Appetizer Name</Text>
                <Text style={styles.col}>Cost</Text>
                <Text style={styles.col}>Total Cost</Text>
              </View>
              <View style={styles.line}></View>

              {this._renderMeals('appetizers')}
            </View>
          )}
        </View>
      </View>
    );
  }

  _renderMeals(type) {
    let data = [];
    let html = [];

    const {
      checkout: {checkoutData},
    } = this.props;

    if (type == 'desserts') {
      data = checkoutData.menus_desserts_list;
    } else if (type == 'appetizers') {
      data = checkoutData.menus_appetizers_list;
    }

    for (const index of data) {
      let item = this.findMealById(index.value, type);
      html.push(
        <View>
          <View style={styles.listTable}>
            <Text style={styles.col1}>{item.category}</Text>
            <Text style={styles.col1}>{item.name}</Text>
            <Text style={styles.col1}>${parseFloat(item.cost).toFixed(2)}</Text>
            <Text style={styles.col1}>
              ${parseFloat(item.cost * checkoutData.guests).toFixed(2)}
            </Text>
          </View>
          <View style={styles.line}></View>
        </View>,
      );
    }
    return html;
  }

  _step3() {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#fff',
          paddingRight: 15,
          paddingLeft: 15,
          paddingBottom: 150,
        }}>
        <Text style={styles.txtInfor}>Card Information</Text>
        {this._renderFullView('Name on Card', 'cardname')}
        {this._renderCard('Card Number', 'cardNumber')}
        {this._renderCvv()}
      </View>
    );
  }

  onSubmit = (values) => {
    const {
      checkout: {checkoutData},
    } = this.props;
    values['booking_date'] = checkoutData.booking_date;
    values['booking_time'] = checkoutData.booking_time;
    values['chef'] = checkoutData.chef_id;
    values['menu'] = checkoutData.meal;
    values['guests'] = checkoutData.guests;
    values['hidden_cost'] = checkoutData.hidden_cost;

    if (checkoutData.dessert_ids) {
      values['dessert_ids'] = checkoutData.dessert_ids;
    }
    if (checkoutData.appetizer_ids) {
      values['appetizer_ids'] = checkoutData.appetizer_ids;
    }
    this.payChef(values);
  };

  payChef = async (values) => {
    try {
      const response = await this.props.dispatch(payChef(values));
      if (!response.success) {
        throw response;
      } else {
        const newError = new ErrorUtils(
          'Success',
          'Order Requested',
        );
        newError.showAlert();
        Actions.thank_you(response.responseBody.data);
      }
    } catch (error) {
      const newError = new ErrorUtils(error, 'Server Error');
      newError.showAlert();
    }
  };

  findMealById(index, type) {
    let data = [];
    const {
      propsData: {coordinateData},
    } = this.props;
    if (type == 'meal') {
      data = coordinateData.menus_meals;
    } else if (type == 'desserts') {
      data = coordinateData.menus_desserts;
    } else if (type == 'appetizers') {
      data = coordinateData.menus_appetizers;
    }
    for (const item of data) {
      if (item.id === index) {
        return item;
      }
    }
  }

  render() {
    const {handleSubmit, loader} = this.props;
    const {
      checkout: {checkoutData},
    } = this.props;

    // if (checkoutData.chef_id == this.props.data) {
    return (
      <View style={styles.container}>
        {loader.isLoading && <Loader />}
        <ProgressSteps>
          <ProgressStep
            label="Info"
            nextBtnStyle={styles.buttonTextStyle}
            nextBtnTextStyle={styles.textStyle}>
            {this._step1()}
          </ProgressStep>

          <ProgressStep
            label="Item Details"
            previousBtnStyle={styles.buttonPrevStyle}
            previousBtnTextStyle={styles.textStyle}
            nextBtnStyle={styles.buttonTextStyle}
            nextBtnTextStyle={styles.textStyle}>
            {this._step2()}
          </ProgressStep>

          <ProgressStep
            onSubmit={handleSubmit(this.onSubmit)}
            label="Card Information"
            previousBtnStyle={styles.buttonPrevStyle}
            previousBtnTextStyle={styles.textStyle}
            nextBtnStyle={styles.buttonTextStyle}
            nextBtnTextStyle={styles.textStyle}>
            {this._step3()}
          </ProgressStep>
        </ProgressSteps>
      </View>
    );
    // } else {
    //   return <Loader />;
    // }
  }
}

const validateInitialValues = (values, book) => {
  if (values && book) {
    return {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone_number: values.phone_number,
      address: values.address,
      city: values.city,
      state: values.state,
      zip: values.zip,
      b_address: book.b_address,
      b_city: book.b_city,
      b_state: book.b_state,
      b_zip: book.b_zip,
    };
  }
  return {};
};

mapStateToProps = (state, props) => ({
  initialValues: validateInitialValues(
    state.userReducer.getUser.userDetails,
    state.userReducer.checkout.checkoutData,
  ),
  getUser: state.userReducer.getUser,
  propsData: state.userReducer.propsData,
  loader: state.userReducer.loader,
  checkout: state.userReducer.checkout,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'Checkout',
  }),
)(Checkout);
