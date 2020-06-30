import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  SafeAreaView,
  Picker,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {Field, reduxForm, change} from 'redux-form';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import DatePicker from 'react-native-modal-datetime-picker';

import {ErrorUtils} from '../../utils/auth.utils';
import InputText from '../../components/InputText';

import {
  chefProfile,
  favoriteAddChef,
  checkoutData,
} from '../../actions/profile.actions';
import Loader from '../../components/Loader';

import ChefHeader from '../layouts/ChefHeader';
import Tabs from './viewChefProfile/Tabs';
import TabsBottom from './viewChefProfile/TabsBottom';
import SelectMultiple from 'react-native-select-multiple';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,

    backgroundColor: '#fff',
    width: '100%',
  },
  textStyle: {
    fontSize: 15,
    color: '#fff',
    alignSelf: 'center',
  },
  textStyleInput: {
    fontSize: 12,
    color: '#000',
    marginBottom: 2,
    marginLeft: 5,
  },
  textBtnStyle: {
    height: 45,
    width: '48%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#D3AB52',
    borderColor: 'white',
    justifyContent: 'center',
  },
  BtnStyle: {
    height: 45,
    width: '48%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#D3AB52',
    borderColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  btnColorDark: {
    backgroundColor: '#333333',
  },
  topImgStyle: {
    backgroundColor: '#F1F1F1',
    marginTop: 20,
    zIndex: 1,
  },
  imgUserStyle: {
    position: 'absolute',
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modelStyle: {
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'white',
    margin: 20,
    paddingTop: 40,
    marginTop: 50,
    paddingRight: 15,
    paddingLeft: 5,
    paddingBottom: 10,
  },
  closeBtnStyle: {
    position: 'absolute',
    right: 0,
    marginTop: -15,
    marginRight: -10,
  },
  nameTextStyle: {
    alignSelf: 'center',
    color: '#D3AB52',
    marginTop: 15,
    fontSize: 20,
  },
  textBook: {
    alignSelf: 'center',
    fontSize: 22,
  },
  hireNote: {
    alignSelf: 'center',
    fontSize: 11,
  },
  inputContainer: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  pickerStyle: {
    borderColor: '#555555',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  errorText: {
    color: '#eb0808',
    fontSize: 10,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  clickButon: {
    borderColor: '#555555',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    marginBottom: 5,
    padding: 10,
  },
});

class ChefProfile extends Component {
  constructor(props) {
    super(props);
    let today = new Date();
    today.setDate(today.getDate() + 1);
    this.state = {
      visibleModal: false,
      booking_date: moment(today).format('DD/MM/YYYY'),
      booking_time: moment(today).format('HH:mm'),
      meal: '',
      desserts: '',
      appetizers: '',
      guests_count: 1,
      fav: 0,
      meal_cost: 0,
      hidden_cost: 0,
      menus_appetizers_list: [],
      menus_desserts_list: [],
      desserts_show: false,
      appetizers_show: false,
      desserts_cost: 0,
      appetizers_cost: 0,
      dessert_ids: [],
      appetizer_ids: [],
      AvoidingView: false,
      showDatePicker: false,
      dateMode: 'date',
      tempDate: new Date(),
    };
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.getProfile();
    });
  }
  onSelectionsChangeDesserts = (menus_desserts_list) => {
    this.setState({menus_desserts_list}, () => {
      console.log(this.state.menus_desserts_list, 'desert');
    });
    let cost = 0;
    let {guests_count} = this.state;
    let dessert_ids = [];

    if (guests_count && guests_count > 0) {
      guests_count = guests_count;
    } else {
      guests_count = parseFloat(1);
    }

    for (const index of menus_desserts_list) {
      let item = this.findMealById(index, 'desserts');
      cost = parseFloat(cost) + parseFloat(item.cost);
      dessert_ids.push(item.id);
    }

    this.setState({dessert_ids: dessert_ids, desserts_cost: cost});

    let totalCost =
      parseFloat(this.state.meal_cost * guests_count) +
      cost * guests_count +
      parseFloat(this.state.appetizers_cost * guests_count);
    this.setState({hidden_cost: parseFloat(totalCost).toFixed(2)});
  };

  onSelectionsChangeAppetizers = (menus_appetizers_list) => {
    this.setState({menus_appetizers_list});
    let cost = 0;
    let {guests_count} = this.state;
    let appetizer_ids = [];

    if (guests_count && guests_count > 0) {
      guests_count = guests_count;
    } else {
      guests_count = parseFloat(1);
    }

    for (const index of menus_appetizers_list) {
      let item = this.findMealById(index, 'appetizers');

      cost = parseFloat(cost) + parseFloat(item.cost);
      appetizer_ids.push(item.id);
    }
    this.setState({appetizer_ids: appetizer_ids, appetizers_cost: cost});

    let totalCost =
      parseFloat(this.state.meal_cost * guests_count) +
      parseFloat(this.state.desserts_cost * guests_count) +
      cost * guests_count;
    this.setState({hidden_cost: parseFloat(totalCost).toFixed(2)});
  };

  findMealById(index, type) {
    let data = [];
    const {
      propsData: {coordinateData},
    } = this.props;
    if (type == 'desserts') {
      data = coordinateData.menus_desserts;
    } else {
      data = coordinateData.menus_appetizers;
    }
    for (const item of data) {
      if (item.id === index.value) {
        return item;
      }
    }
  }

  onSubmit = (values) => {
    console.log(this.state.booking_date, this.state.booking_time);
    if (this.state.booking_date == '') {
      alert('Please Select Booking Date');
      return;
    }
    if (this.state.booking_time == '') {
      alert('Please Select Booking Time');
      return;
    }
    if (this.state.meal_cost == 0 && this.state.meal == '') {
      alert('Please Select Meal');
      return;
    }
    values['booking_date'] = this.state.booking_date;
    values['booking_time'] = this.state.booking_time;
    values['meal'] = this.state.meal;
    values['desserts'] = this.state.desserts;
    values['appetizers'] = this.state.appetizers;
    values['hidden_cost'] = this.state.hidden_cost;
    values['chef_id'] = this.props.data;
    values['meal_cost'] = this.state.meal_cost;
    values['menus_appetizers_list'] = this.state.menus_appetizers_list;
    values['menus_desserts_list'] = this.state.menus_desserts_list;
    values['desserts_cost'] = this.state.desserts_cost;
    values['appetizers_cost'] = this.state.appetizers_cost;
    values['dessert_ids'] = this.state.dessert_ids;
    values['appetizer_ids'] = this.state.appetizer_ids;

    this.bookChefs(values);
  };

  async bookChefs(value) {
    try {
      const response = await this.props.dispatch(checkoutData(value));
      if (!response) {
        throw response;
      }
      this.resetValue();
      const newError = new ErrorUtils('Success', 'Request Sent Successful');
      newError.showAlert();

      Actions.checkout(this.props.data);
    } catch (error) {
      const newError = new ErrorUtils(error, 'Error!');
      newError.showAlert();
    }
  }

  async getProfile() {
    try {
      const response = await this.props.dispatch(chefProfile(this.props.data));
      console.log(response, 'res');
      if (!response.success) {
        throw response;
      }
      if (response.responseBody.favorite == 1) {
        this.setState({fav: 1});
      }
    } catch (error) {
      console.log(error, 'errr');
    }
  }
  resetValue() {
    let today = new Date();
    today.setDate(today.getDate() + 1);
    this.setState({
      booking_date: moment(today).format('DD/MM/YYYY'),
      booking_time: moment(today).format('HH:mm'),
      meal: '',
      desserts: '',
      appetizers: '',
      guests_count: 1,
      meal_cost: 0,
      hidden_cost: 0,
      menus_appetizers_list: [],
      menus_desserts_list: [],
      desserts_show: false,
      appetizers_show: false,
      desserts_cost: 0,
      appetizers_cost: 0,
      dessert_ids: [],
      appetizer_ids: [],
      visibleModal: false,
    });
    this.props.dispatch(change('ChefProfilePage', 'b_address', ''));
    this.props.dispatch(change('ChefProfilePage', 'b_city', ''));
    this.props.dispatch(change('ChefProfilePage', 'b_state', ''));
    this.props.dispatch(change('ChefProfilePage', 'b_zip', ''));
    this.props.dispatch(change('ChefProfilePage', 'guests', ''));
  }
  renderTextInput = (field) => {
    if (field && field.input.name == 'guests') {
      this.setState({guests_count: field.input.value});

      let guests_count = 1;
      if (field.input.value && field.input.value > 0) {
        guests_count = field.input.value;
      }

      let totalCost =
        parseFloat(this.state.meal_cost) * parseInt(guests_count) +
        parseFloat(this.state.desserts_cost) * parseInt(guests_count) +
        parseFloat(this.state.appetizers_cost) * parseInt(guests_count);

      this.setState({hidden_cost: parseFloat(totalCost).toFixed(2)});
    }

    const {
      meta: {touched, error},
      label,
      secureTextEntry,
      maxLength,
      keyboardType,
      placeholder,
      input: {onChange, name, value, ...restInput},
    } = field;

    return (
      <View>
        <InputText
          Focus={() => {
            if (name === 'b_state' || name === 'b_zip' || name === 'b_city') {
              this.setState({AvoidingView: true}, () => {
                this.refs._scrollView.scrollToEnd({Animated: true});
              });
            }
          }}
          Blur={() => {
            if (name === 'b_state' || name === 'b_zip' || name === 'b_city') {
              this.setState({AvoidingView: false});
            }
          }}
          style={{height: 40}}
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
  formatDate() {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  _renderDateTime(label1, ref1, label2, ref2) {
    const {
      propsData: {coordinateData},
    } = this.props;

    let avlDate =
      coordinateData.chef.available_dates !== null
        ? coordinateData.chef.available_dates.filter(
            (d) => d != this.formatDate(),
          )
        : [];
    avlDate.sort();
    let today = new Date();
    today.setDate(today.getDate() + 1);
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <DatePicker
          mode={this.state.dateMode}
          minimumDate={today}
          textColor="#000"
          isVisible={this.state.showDatePicker}
          onCancel={() => {
            this.setState({showDatePicker: false});
          }}
          onConfirm={(date) => {
            if (this.state.dateMode == 'date') {
              this.setState({
                booking_date: moment(date).format('DD/MM/YYYY'),
                tempDate: date,
                showDatePicker: false,
              });
            } else {
              // if (moment(this.state.tempDate).isBefore(today)) {
              //   alert('Please Select after an hour time for booking');
              //   return;
              // }
              this.setState({
                booking_time: moment(date).format('HH:mm'),
                showDatePicker: false,
              });
            }
          }}
        />
        <View style={{flexDirection: 'column', width: '50%'}}>
          <Text style={styles.textStyleInput}>{label1}</Text>
          <View style={[styles.pickerStyle, {alignItems: 'center'}]}>
            {/* <Picker
              selectedValue={this.state.booking_date}
              ref={ref1}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({booking_date: itemValue})
              }>
              <Picker.Item label="Select Date" value="" />
              {coordinateData.chef.available_dates.map((item, index) => {
                return <Picker.Item key={index} label={item} value={item} />;
              })}
            </Picker> */}
            <RNPickerSelect
              style={{
                inputIOS: {
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#000',
                },
                inputAndroid: {
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#000',
                },
              }}
              placeholder={{
                label: 'Select Booking Date',
                value: '',
              }}
              items={avlDate.map((data) => ({
                label: data,
                value: data,
              }))}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({booking_date: itemValue})
              }
            />

            {/* <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                this.setState({dateMode: 'date', showDatePicker: true});
              }}
              style={[styles.pickerStyle, {alignItems: 'center'}]}>
              <Text>
                {this.state.booking_date == ''
                  ? label1
                  : this.state.booking_date}
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={{width: 10}}></View>
        <View style={{flexDirection: 'column', width: '50%'}}>
          <Text style={styles.textStyleInput}>{label2}</Text>
          <View>
            {/* <Picker
              selectedValue={this.state.booking_time}
              ref={ref1}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({booking_time: itemValue})
              }>
              <Picker.Item label="Select Time" value="" />
              {timeArray.map((item, index) => {
                return <Picker.Item label={item} value={item} />;
              })}
            </Picker> */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                this.setState({dateMode: 'time', showDatePicker: true});
              }}
              style={[styles.pickerStyle, {alignItems: 'center'}]}>
              <Text>
                {this.state.booking_time == ''
                  ? label2
                  : this.state.booking_time}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  _renderMeal(label1, ref1, label2, ref2) {
    const {
      propsData: {coordinateData},
    } = this.props;
    const {hidden_cost, meal} = this.state;
    console.log(hidden_cost, 'cost');

    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flexDirection: 'column', width: '50%'}}>
          <Text style={styles.textStyleInput}>{label1}</Text>
          <View
            style={[
              styles.pickerStyle,
              {alignItems: 'center', justifyContent: 'center'},
            ]}>
            {/* <Picker
              selectedValue={this.state.meal}
              ref={ref1}
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue == '') {
                  this.setState({hidden_cost: 0});
                }
                this.setHiddenMealCost({meal: itemValue});
              }}>
              <Picker.Item label="Select Meal" value="" />
              {coordinateData.menus_meals.map((item, index) => {
                return (
                  <Picker.Item key={index} label={item.name} value={item.id} />
                );
              })}
            </Picker> */}
            <RNPickerSelect
              placeholder={{
                label: 'Select Meal',
                value: '',
              }}
              style={{
                inputIOS: {
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#000',
                },
                inputAndroid: {
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#000',
                },
              }}
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue == '') {
                  this.setState(
                    {
                      meal: '',
                      desserts: '',
                      appetizers: '',

                      meal_cost: 0,
                      hidden_cost: 0,
                      menus_appetizers_list: [],
                      menus_desserts_list: [],
                      desserts_show: false,
                      appetizers_show: false,
                      desserts_cost: 0,
                      appetizers_cost: 0,
                      dessert_ids: [],
                      appetizer_ids: [],
                    },
                    // () => {
                    //   this.props.dispatch(
                    //     change('ChefProfilePage', 'guests', ''),
                    //   );
                    // },
                  );
                }
                this.setHiddenMealCost({meal: itemValue});
              }}
              items={coordinateData.menus_meals.map((data) => ({
                label: data.name,
                value: data.id,
              }))}
            />
          </View>
          {hidden_cost > 0 && meal.length !== 0 && (
            <Text
              style={{fontSize: 12, fontWeight: 'bold', textAlign: 'right'}}>
              Cost ${hidden_cost}
            </Text>
          )}
        </View>
        <View style={{width: 10}}></View>
        <View style={{flexDirection: 'column', width: '50%'}}>
          <Text style={styles.textStyleInput}>{label2}</Text>
          <Field
            name={ref2}
            keyboardType="numeric"
            value={1}
            component={this.renderTextInput}
          />
        </View>
      </View>
    );
  }

  setHiddenMealCost(meal) {
    this.setState(meal);
    const {
      propsData: {coordinateData},
    } = this.props;
    let {guests_count} = this.state;
    if (guests_count && guests_count > 0) {
      guests_count = guests_count;
    } else {
      guests_count = parseFloat(1);
    }

    let cost = 0;
    for (const item of coordinateData.menus_meals) {
      if (item.id === meal.meal) {
        cost = item.cost;
      }
    }

    this.setState({meal_cost: cost});
    let totalCost =
      parseFloat(cost * guests_count) +
      parseFloat(this.state.desserts_cost) +
      parseFloat(this.state.appetizers_cost);
    this.setState({hidden_cost: parseFloat(totalCost).toFixed(2)});
  }

  _renderDessert(label1, ref1, label2, ref2) {
    const {
      propsData: {coordinateData},
    } = this.props;

    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flexDirection: 'column', width: '50%'}}>
          <Text style={styles.textStyleInput}>{label1}</Text>
          <View>
            <TouchableOpacity
              onPress={() => this.setState({desserts_show: true})}
              style={styles.clickButon}>
              <Text numberOfLines={1} ellipsizeMode="tail">
                {this.state.menus_desserts_list.length > 0
                  ? this.state.menus_desserts_list.map((item, i) => {
                      return item.label + ', ';
                    })
                  : 'Select Desserts'}
              </Text>
            </TouchableOpacity>
            {this.state.desserts_show && (
              <SelectMultiple
                rowStyle={{padding: 2}}
                labelStyle={{fontSize: 12}}
                items={coordinateData.menus_desserts_list}
                selectedItems={this.state.menus_desserts_list}
                onSelectionsChange={this.onSelectionsChangeDesserts}
              />
            )}
          </View>
        </View>
        <View style={{width: 10}}></View>
        <View style={{flexDirection: 'column', width: '50%'}}>
          <Text style={styles.textStyleInput}>{label2}</Text>
          <View>
            <TouchableOpacity
              onPress={() => this.setState({appetizers_show: true})}
              style={styles.clickButon}>
              <Text numberOfLines={1} ellipsizeMode="tail">
                Select Appetizers
              </Text>
            </TouchableOpacity>

            {this.state.appetizers_show && (
              <View style={{flexWrap: 'wrap'}}>
                <SelectMultiple
                  rowStyle={{padding: 2}}
                  labelStyle={{fontSize: 12}}
                  items={coordinateData.menus_appetizers_list}
                  selectedItems={this.state.menus_appetizers_list}
                  onSelectionsChange={this.onSelectionsChangeAppetizers}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  _renderView(label1, ref1, label2, ref2) {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flexDirection: 'column', width: '50%'}}>
          <Text style={styles.textStyleInput}>{label1}</Text>
          <Field name={ref1} component={this.renderTextInput} />
        </View>
        <View style={{width: 10}}></View>
        <View style={{flexDirection: 'column', width: '50%'}}>
          <Text style={styles.textStyleInput}>{label2}</Text>
          <Field
            name={ref2}
            maxLength={ref2 == 'b_zip' ? 6 : null}
            keyboardType={ref2 == 'b_zip' ? 'number-pad' : 'default'}
            component={this.renderTextInput}
          />
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

  bookModel() {
    const {
      propsData: {coordinateData},
      handleSubmit,
    } = this.props;
    return (
      <Modal
        onRequestClose={() => {
          this.setState({visibleModal: false});
        }}
        onDismiss={() => {
          this.setState({visibleModal: false});
        }}
        animationType="slide"
        visible={this.state.visibleModal}
        transparent={true}>
        <SafeAreaView
          style={{
            backgroundColor: 'rgba(50, 50, 50, .9)',
            width: '100%',
            height: '100%',
          }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            enabled={this.state.AvoidingView}>
            <ScrollView
              bounces={false}
              ref="_scrollView"
              contentContainerStyle={{
                paddingBottom: Platform.OS === 'ios' ? 250 : 0,
              }}>
              <View style={styles.topImgStyle}>
                <Image
                  source={
                    coordinateData.chef
                      ? {uri: coordinateData.chef.profile_pic}
                      : {uri: 'https://gravatar.com/avatar'}
                  }
                  style={styles.imgUserStyle}
                />
              </View>

              <View style={styles.modelStyle}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      visibleModal: false,
                      booking_date: '',
                      booking_time: '',
                      meal: '',
                      desserts: '',
                      appetizers: '',
                      guests_count: 1,
                      fav: 0,
                      meal_cost: 0,
                      hidden_cost: 0,
                      menus_appetizers_list: [],
                      menus_desserts_list: [],
                      desserts_show: false,
                      appetizers_show: false,
                      desserts_cost: 0,
                      appetizers_cost: 0,
                      dessert_ids: [],
                      appetizer_ids: [],
                    });
                    this.props.dispatch(
                      change('ChefProfilePage', 'b_address', ''),
                    );
                    this.props.dispatch(
                      change('ChefProfilePage', 'b_city', ''),
                    );
                    this.props.dispatch(
                      change('ChefProfilePage', 'b_state', ''),
                    );
                    this.props.dispatch(change('ChefProfilePage', 'b_zip', ''));
                  }}
                  style={styles.closeBtnStyle}>
                  <Image
                    source={require('../../assets/icon_close.png')}
                    style={{width: 30, height: 30, padding: 10}}></Image>
                </TouchableOpacity>

                <Text style={styles.nameTextStyle}>
                  {coordinateData.chef.first_name +
                    ' ' +
                    coordinateData.chef.last_name}
                </Text>
                <Text style={styles.textBook}>BOOK THIS CHEF</Text>
                <Text style={styles.hireNote}>
                  Please only hire you are in 10 miles radius of{' '}
                  {coordinateData.chef.service_area}
                </Text>

                <View style={styles.inputContainer}>
                  {this._renderDateTime(
                    'Select Date',
                    'booking_date',
                    'Select Time',
                    'booking_time',
                  )}
                  {this._renderMeal(
                    'Select Meal',
                    'meal',
                    'Number of Guests',
                    'guests',
                  )}
                  {this._renderDessert(
                    'Add Dessert',
                    'desserts',
                    'Add Appetizter',
                    'appetizers',
                  )}
                  {this._renderFullView('Address', 'b_address')}
                  {this._renderFullView('City', 'b_city')}
                  {this._renderView('State', 'b_state', 'Zip Code', 'b_zip')}

                  <TouchableOpacity
                    onPress={handleSubmit(this.onSubmit)}
                    style={styles.BtnStyle}>
                    <Text style={styles.textStyle}>Submit Request</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  }

  _bookChefModel() {
    const {
      getUser: {userDetails},
    } = this.props;
    if (userDetails.user_type == 'chef') {
      alert('You can’t book a chef with a chef account');
    } else {
      this.setState({visibleModal: true});
    }
  }

  async _favoriteChef(id) {
    try {
      const response = await this.props.dispatch(
        favoriteAddChef({chef_id: id}),
      );
      if (!response.success) {
        throw response;
      }
      if (this.state.fav == 1) {
        this.setState({fav: 0});
      } else {
        this.setState({fav: 1});
      }
    } catch (error) {}
  }

  render() {
    const {
      propsData: {coordinateData},
      getUser: {userDetails},
      loader,
      data,
    } = this.props;
    console.log(coordinateData);

    if (
      coordinateData &&
      coordinateData.chef &&
      coordinateData.chef.id == this.props.data
    ) {
      return (
        <View style={styles.container}>
          {loader.isLoading && <Loader />}
          <ScrollView>
            <ChefHeader />

            <Tabs />

            <TabsBottom />
          </ScrollView>
          {userDetails.user_type == 'user' && (
            <View style={styles.btnViewStyle}>
              <TouchableOpacity
                onPress={() => this._bookChefModel()}
                style={styles.textBtnStyle}>
                <Text style={styles.textStyle}>Book This Chef</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this._favoriteChef(coordinateData.chef.id)}
                style={[styles.textBtnStyle, styles.btnColorDark]}>
                <Text style={styles.textStyle}>
                  {this.state.fav == 0 ? 'Add Favorite' : 'Remove Favorite'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {this.bookModel()}
        </View>
      );
    } else {
      return <Loader />;
    }
  }
}

const validate = (value) => {
  const errors = {};

  if (!value.guests) {
    errors.guests = 'Guests is required';
  }
  if (value.guests && /\./g.test(value.guests)) {
    errors.guests = 'Guests count must be in Intiger';
  }
  if (!value.b_address) {
    errors.b_address = 'Address is required';
  }
  if (!value.b_city) {
    errors.b_city = 'City is required';
  }
  if (!value.b_state) {
    errors.b_state = 'State is required';
  }
  if (!value.b_zip) {
    errors.b_zip = 'Zip Code is required';
  }
  return errors;
};

mapStateToProps = (state) => ({
  propsData: state.userReducer.propsData,
  getUser: state.userReducer.getUser,
  loader: state.userReducer.loader,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'ChefProfilePage',
    validate,
  }),
)(ChefProfile);
