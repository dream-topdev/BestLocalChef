import React, {Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Picker,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Actions} from 'react-native-router-flux';
import {findChef} from '../../actions/findchef.actions';
import InputText from '../../components/InputText';
import Loader from '../../components/Loader';
import moment from 'moment';
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  imgStyle: {
    width: '100%',
  },
  mainBody: {
    position: 'absolute',
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
  imgStyleThree: {
    width: 45,
    height: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    marginTop: 8,
  },
  btnViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  textBtnStyle: {
    height: 45,
    width: '48%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'white',
    justifyContent: 'center',
  },
  searchBtnZip: {
    marginTop: 8,
  },
  textStyleBtn: {
    fontSize: 15,
    color: '#000',
    alignSelf: 'center',
  },
  mealsListContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  mealsList: {
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 6,
    borderRadius: 5,
    width: 70,
    height: 70,
  },
  mealsList1: {
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 6,
    borderRadius: 5,
    width: 70,
    height: 70,
  },
  mealImage: {
    height: 30,
    width: 30,
  },
  mealsText: {
    color: '#fff',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 4,
  },
  searchBtnContainer: {
    marginTop: 8,
    width: '100%',
  },
  searchBtn: {
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#D3AB52',
    borderColor: '#D3AB52',
    justifyContent: 'center',
  },
  searchBtnText: {
    fontSize: 15,
    color: '#fff',
    alignSelf: 'center',
  },
  resultsContainer: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  resultText: {
    justifyContent: 'center',
    fontSize: 20,
    color: '#D3AB52',
    width: '100%',
    marginTop: 8,
  },
  chefContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 8,
    position: 'relative',
  },
  chefsList: {
    padding: 5,
    marginBottom: 10,
  },
  chefImage: {
    ...Platform.select({
      ios: {
        width: 118,
        height: 118,
        borderRadius: 5,
      },
      android: {
        width: 100,
        height: 100,
        borderRadius: 5,
      },
    }),
  },
  chefName: {
    color: '#000',
    fontSize: 12,
    marginTop: 4,
  },
  chefProfile: {
    color: '#000',
    fontSize: 10,
    marginTop: 2,
  },
});

class FindChef extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        {
          key: '1',
          slug: 'Meat',
          title: 'Meat',
          image: require('../../assets/meat.png'),
        },
        {
          key: '2',
          slug: 'Vegan',
          title: 'Vegan',
          image: require('../../assets/vegan.png'),
        },
        {
          key: '3',
          slug: 'Vegetarian',
          title: 'Vegetarian',
          image: require('../../assets/vegetarian.png'),
        },
        {
          key: '4',
          slug: 'Athlete',
          title: 'Athlete',
          image: require('../../assets/athlete.png'),
        },
        {
          key: '5',
          slug: 'Plant_based',
          title: 'Plant Based',
          image: require('../../assets/plant_based.png'),
        },
        {
          key: '6',
          slug: 'Gluten_free',
          title: 'Gluten Free',
          image: require('../../assets/gluten_free.png'),
        },
      ],
      data: [],
      date: '',
      time: 'Select Time',
      meal: '',
      showTimePicker: false,
    };
    this.findChef();
  }

  async findChef(values = null) {
    try {
      const response = await this.props.dispatch(findChef(values));
      if (!response.success) {
        throw response;
      }
      console.log(response)
      this.setState({data: response.responseBody});
    } catch (error) {}
  }

  onSubmit = (values) => {
    values['available_dates'] = this.state.date;
    values['time'] = this.state.time;
    values['meal_prefrences'] = this.state.meal;
    this.findChef(values);
  };

  _renderItems() {
    return this.state.items.map((item) => {
      return (
        <TouchableOpacity
          style={[
            this.state.meal && this.state.meal == item.slug
              ? styles.mealsList1
              : styles.mealsList,
          ]}
          onPress={() => this.setState({meal: item.slug})}>
          <Image source={item.image} style={styles.mealImage} />
          <Text style={styles.mealsText}>{item.title}</Text>
        </TouchableOpacity>
      );
    });
  }

  _renderChef() {
    const {data} = this.state;
    if (data && data.chefs) {
      return data.chefs.map((chef) => {
        return (
          <TouchableOpacity
            onPress={() => Actions.chef_profile(chef.id)}
            style={styles.chefsList}>
            <Image source={{uri: chef.profile_pic}} style={styles.chefImage} />
            <Text style={styles.chefName}>
              {chef.first_name} {chef.last_name}
            </Text>
            <Text style={styles.chefProfile}>VIEW PROFILE</Text>
          </TouchableOpacity>
        );
      });
    }
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

  render() {
    const {handleSubmit, loader} = this.props;
    const timeArray = [
      '12:00 AM',
      '01:00 AM',
      '02:00 AM',
      '03:00 AM',
      '04:00 AM',
      '05:00 AM',
      '06:00 AM',
      '07:00 AM',
      '08:00 AM',
      '09:00 AM',
      '10:00 AM',
      '11:00 AM',
      '01:00 PM',
      '02:00 PM',
      '03:00 PM',
      '04:00 PM',
      '05:00 PM',
      '06:00 PM',
      '07:00 PM',
      '08:00 PM',
      '09:00 PM',
      '10:00 PM',
      '11:00 PM',
    ];
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {loader.isLoading && <Loader />}
        <ScrollView>
          <View style={styles.topStyle}>
            <Image
              source={require('../../assets/find_chef.png')}
              style={styles.imgStyle}
            />
          </View>

          <View style={styles.mainBody}>
            <TouchableOpacity onPress={() => Actions.drawerOpen()}>
              <Image
                source={require('../../assets/threelines.png')}
                style={styles.imgStyleThree}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>FIND A CHEF</Text>

            <View style={styles.btnViewStyle}>
              <View style={styles.textBtnStyle}>
                <DatePicker
                  style={{width: '100%', padding: 5}}
                  date={this.state.date}
                  mode="date"
                  placeholder="Select Date"
                  format="MM/DD/YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  minDate={new Date()}
                  onDateChange={(date) => {
                    this.setState({date: date});
                  }}
                  showIcon={false}
                  customStyles={{
                    dateInput: {borderWidth: 0},
                    placeholderText: {color: '#000'},
                    dateText: {color: '#000'},
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  this.setState({showTimePicker: true});
                }}
                style={[
                  styles.textBtnStyle,
                  {overflow: 'hidden', alignItems: 'center'},
                ]}>
                <DateTimePicker
                  
                  isVisible={this.state.showTimePicker}
                  mode="time"
                  textColor="#000"
                  
                  onDateChange={(date) => {
                    this.setState({
                      time: moment(date).format('h:mm A'),
                      showTimePicker: false,
                    });
                  }}
                  onCancel={() => {
                    this.setState({showTimePicker: false});
                  }}
                  onConfirm={(date) => {
                    this.setState({
                      time: moment(date).format('h:mm A'),
                      showTimePicker: false,
                    });
                  }}
                />

                <Text>{this.state.time}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchBtnZip}>
              <Field
                name="service_area"
                placeholder="Search by Zip Code"
                component={this.renderTextInput}
              />
            </View>

            <View style={styles.mealsListContainer}>
              <ScrollView horizontal={true}>{this._renderItems()}</ScrollView>
            </View>

            <View style={styles.searchBtnContainer}>
              <TouchableOpacity
                onPress={handleSubmit(this.onSubmit)}
                style={styles.searchBtn}>
                <Text style={styles.searchBtnText}>
                  Find Best Local Chefs Near You
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.resultsContainer}>
            <Text style={styles.resultText}>
              {this.state.data.total_chef} Results Found
            </Text>
            <View style={styles.chefContainer}>{this._renderChef()}</View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

mapStateToProps = (state) => ({
  loader: state.userReducer.loader,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'FindChef',
  }),
)(FindChef);
