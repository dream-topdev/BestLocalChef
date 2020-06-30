import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Field, reduxForm, change,focus  } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { ErrorUtils } from '../../../utils/auth.utils';

import { Calendar } from 'react-native-calendars';
import InputText from '../../../components/InputText';
import { Tooltip } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import {
  userProfile,
  userProfileGet,
  submitCalendar,
} from '../../../actions/profile.actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  textStyle: {
    color: '#555555',
    fontSize: 12,
    marginBottom: 5,
  },
  errorText: {
    color: '#eb0808',
    fontSize: 14,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  BtnTextStyle: {
    fontSize: 20,
    color: '#fff',
  },
  BtnStyle: {
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
  blackStyle: {
    backgroundColor: '#000',
  },
  alert: {
    backgroundColor: '#d1ecf1',
    marginBottom: 5,
  },
  alertText: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    padding: 10,
    borderColor: '#bee5eb',
    fontSize: 12,
  },
});

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      available_dates:
        this.props.initialValues && this.props.initialValues.available_dates
          ? this.props.initialValues.available_dates
          : [],
      showLoader: false,
      extraMonth: new Date().getMonth() + 1,
    };

    this.getData();
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.getData();
    });
  }
  componentWillReceiveProps(newProps) {
    console.log(newProps, 'dog');

    // let user = newProps.getUser.userDetails;
    // newProps.dispatch(
    //   change('ProfilePage', 'first_name', user.first_name, false),
    // );
    // newProps.dispatch(
    //   change('ProfilePage', 'last_name', user.last_name, false),
    // );
    // newProps.dispatch(change('ProfilePage', 'email', user.email, false));
    // newProps.dispatch(
    //   change('ProfilePage', 'phone_number', user.phone_number, false),
    // );
    // newProps.dispatch(change('ProfilePage', 'college', user.college, false));
    // if (user.graduate_year !== null) {
    //   newProps.dispatch(
    //     change('ProfilePage', 'graduate_year', user.graduate_year, false),
    //   );
    // }
    // if (user.experience !== null) {
    //   newProps.dispatch(
    //     change('ProfilePage', 'experience', user.experience, false),
    //   );
    // }
    // if (user.video_url !== null) {
    //   newProps.dispatch(
    //     change('ProfilePage', 'video_url', user.video_url, false),
    //   );
    // }
    // if (user.miles_away !== null) {
    //   newProps.dispatch(
    //     change('ProfilePage', 'miles_away', user.miles_away, false),
    //   );
    // }
    // if (user.bio !== null) {
    //   newProps.dispatch(change('ProfilePage', 'bio', user.bio, false));
    // }
    // if (user.service_area !== null) {
    //   newProps.dispatch(
    //     change('ProfilePage', 'service_area', user.service_area, false),
    //   );
    // }
    // if (user.zip !== null) {
    //   newProps.dispatch(change('ProfilePage', 'zip', user.zip, false));
    // }
    // if (user.state !== null) {
    //   newProps.dispatch(change('ProfilePage', 'state', user.state, false));
    // }
    // if (user.city !== null) {
    //   newProps.dispatch(change('ProfilePage', 'city', user.city, false));
    // }
    // if (user.address !== null) {
    //   newProps.dispatch(change('ProfilePage', 'address', user.address, false));
    // }
  }
  async getData() {
    try {
      const response = await this.props.dispatch(userProfileGet());
      // console.log(response, 'this is data');
      if (!response.success) {
        throw response;
      }
    } catch (error) {
      const newError = new ErrorUtils(error, 'Server Error');
      newError.showAlert();
    }
  }

  onSubmit = (values) => {
    this.setState({ showLoader: true });

    this.userProfile(values);
  };

  onSubmitCalendar = async () => {
    this.setState({ showLoader: true });
    try {
      const response = await this.props.dispatch(
        submitCalendar({ dates: this.state.available_dates }),
      );

      this.setState({ showLoader: false });
      if (!response.success) {
        this.getData();

        throw response;
      }

      const newError = new ErrorUtils(
        'Success',
        'Calender Updated.',
      );
      newError.showAlert();
      this.getData();
    } catch (error) {
      this.setState({ showLoader: false });

      const newError = new ErrorUtils(error, 'Server Error');
      newError.showAlert();
    }
  };

  userProfile = async (values) => {
    try {
      const response = await this.props.dispatch(userProfile(values));
      this.setState({ showLoader: false });
      if (!response.success) {
        throw response;
      }
      this.getData();
      const newError = new ErrorUtils('Success', 'Profile Update.');
      newError.showAlert();
    } catch (error) {
      const newError = new ErrorUtils(error, 'Server Error');
      newError.showAlert();
      this.setState({ showLoader: true });
    }
  };

  renderTextInput = (field) => {
    let {
      meta: { touched, error },
      label,
      secureTextEntry,
      maxLength,
      keyboardType,
      placeholder,
      multiline,
      input: { onChange, name, value, ...restInput },
      onEnter,
      refField
    } = field;
    console.log(field, 'kokokoko')


    console.log(touched, error, value, 'error');

    return (
      <View>
        <InputText
          Focus={() => { }}
          Blur={() => { }}
          returnKeyType='next'
          // ref={refField}
          onSubmitEditing={onEnter}
          onChangeText={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          label={label}
          {...restInput}
          multiline={multiline}
          value={value}
        />

        {touched && error && value.length == 0 && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>
    );
  };

  _renderView(label1, ref1, tooltip1, label2, ref2, tooltip2, value1, value2) {
    console.log(ref1, ref2);

    // this.props.dispatch(change('ProfilePage', label1, value1));
    // this.props.dispatch(change('ProfilePage', label2, value2));

    return (
      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ flexDirection: 'column', width: '50%' }}>
          <Text style={styles.textStyle}>{label1}</Text>
          {tooltip1 && (
            <View style={{ position: 'absolute', right: 0 }}>
              <Tooltip
                width={250}
                backgroundColor={'#000'}
                popover={<Text style={{ color: '#fff' }}>{tooltip1}</Text>}>
                <Image
                  source={require('../../../assets/info_circle.png')}
                  style={{ width: 20, height: 20 }}
                />
              </Tooltip>
            </View>
          )}
          <Field
            // forwardRef
            onEnter={() => {
              // this.props.dispatch(focus('ProfilePage','experience'))
              // this.ref2.focus()
            }}
            // ref={(componentRef) => this.ref1 = componentRef}
            // ref = {refField}
            // refField={ref1}
           
            nextField={ref2}
            // refField={componentRef =>
            //   (this.ref1= componentRef) }
            name={ref1}
            keyboardType={
              ref1 == 'experience' || ref1 == 'miles_away' || ref1 == 'zip'
                ? 'number-pad'
                : 'default'
            }
            onChange={(e) => {
              console.log(e, 'event');
            }}
            maxLength={
              ref1 == 'experience'
                ? 3
                : ref1 == 'miles_away'
                  ? 4
                  : ref1 == 'zip'
                    ? 6
                    : null
            }
            // value={value1}
            component={this.renderTextInput}
          />
        </View>
        <View style={{ width: 10 }}></View>
        <View style={{ flexDirection: 'column', width: '50%' }}>
          <Text style={styles.textStyle}>{label2}</Text>
          {tooltip2 && (
            <View style={{ position: 'absolute', right: 0 }}>
              <Tooltip
                width={250}
                height={70}
                backgroundColor={'#000'}
                popover={<Text style={{ color: '#fff' }}>{tooltip2}</Text>}>
                <Image
                  source={require('../../../assets/info_circle.png')}
                  style={{ width: 20, height: 20 }}
                />
              </Tooltip>
            </View>
          )}
          <Field
            name={ref2}
            refField={ref2}
            keyboardType={
              ref2 == 'graduate_year' ||
                ref2 == 'phone_number' ||
                ref2 == 'service_area'
                ? 'number-pad'
                : 'default'
            }
            maxLength={ref2 == 'service_area' ? 6 : null}
            // value={value2}
            component={this.renderTextInput}
          />
        </View>
      </View>
    );
  }

  _renderFullView(label1, ref1, value) {
    console.log(label1, value, 'got it');
    // this.props.dispatch(change('ProfilePage', label1, value));

    return (
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <View style={{ flexDirection: 'column', width: '100%' }}>
          <Text style={styles.textStyle}>{label1}</Text>
          <Field
            name={ref1}
            multiline={true}
            component={this.renderTextInput}
            // value={value}
            maxLength={100000}
          />
        </View>
      </View>
    );
  }

  onChangeDate(date) {
    let test = [];
    test = [...this.state.available_dates];
    var index = test.indexOf(date);
    if (index !== -1) {
      test.splice(index, 1);
      this.setState({
        available_dates: test,
      });
    } else {
      test.push(date);
      this.setState({
        available_dates: [...test],
      });
    }
  }

  _userTypeFields() {
    const {
      getUser: { userDetails },
    } = this.props;
    if (userDetails.user_type == 'user') {
      return (
        <View>
          {this._renderFullView('Address', 'address', userDetails.address)}
          {this._renderFullView('City', 'city', userDetails.city)}
          {this._renderView(
            'State',
            'state',
            null,
            'Zip',
            'zip',
            null,
            userDetails.state,
          )}
        </View>
      );
    }
    if (userDetails.user_type == 'chef') {
      return (
        <View>
          {this._renderView(
            'College',
            'college',
            null,
            'Completion Year',
            'graduate_year',
            null,
            userDetails.college,
            userDetails.graduate_year,
          )}
          {this._renderView(
            'Years Experience',
            'experience',
            null,
            'Service Area by Zip Code',
            'service_area',
            null,
            userDetails.experience,
            userDetails.service_area,
          )}
          {this._renderView(
            'Service Area by Range',
            'miles_away',
            'How many miles outside of this zip code do you want to travel?',
            'Video URL',
            'video_url',
            'To increase your chances of getting hired, please provide a video displaying yourself and your work.',
            userDetails.miles_away,
            userDetails.video_url,
          )}
          {this._renderFullView('Bio', 'bio', userDetails.bio)}
        </View>
      );
    }
  }

  SelectAllDate = () => {
    let today = new Date();
    let onlyDate = today.getDate();

    let numOfDays = new Date(
      today.getFullYear(),
      this.state.extraMonth,
      0,
    ).getDate();
    let dates = [];
    let month = this.state.extraMonth;
    console.log(numOfDays, onlyDate);

    let year = today.getFullYear();
    for (let j = today.getMonth() + 1; j <= this.state.extraMonth; j++) {
      let numOfDays = new Date(today.getFullYear(), j, 0).getDate();
      if (j == today.getMonth() + 1) {
        for (let i = 0; i <= numOfDays - onlyDate; i++) {
          let startDateFrom = onlyDate + i;
          dates.push(
            `${year}-${j.toString().length == 1 ? '0' + j : j}-${
            startDateFrom.toString().length == 1
              ? '0' + startDateFrom
              : startDateFrom
            }`,
          );
        }
      } else {
        for (let i = 0; i <= numOfDays; i++) {
          dates.push(
            `${year}-${j.toString().length == 1 ? '0' + j : j}-${
            i.toString().length == 1 ? '0' + i : i
            }`,
          );
        }
      }
    }
    console.log(dates);

    this.setState({
      available_dates: dates,
    });
  };

  ClearAllDate = () => {
    this.setState({ available_dates: [] });
  };

  render() {
    const {
      getUser: { userDetails },
      handleSubmit,
      initialValues,
    } = this.props;
    console.log(userDetails, 'this is set data');
    let today = new Date();
    let month = '';
    let day = '';
    if (parseInt(today.getMonth() + 1) > 9) {
      month = parseInt(today.getMonth() + 1);
    } else {
      month = '0' + parseInt(today.getMonth() + 1);
    }

    if (parseInt(today.getDate()) > 9) {
      day = today.getDate();
    } else {
      day = '0' + today.getDate();
    }

    let todayDate = today.getFullYear() + '-' + month + '-' + day;
    let mark = {};
    let { available_dates } = this.state;

    if (available_dates) {
      available_dates.forEach((day) => {
        mark[day] = { marked: true, color: '#276190' };
      });
    }

    let altCount = 0;
    if (userDetails.available_dates.length == 0) {
      altCount = 1;
    }
    if (userDetails.menu_count == 0) {
      altCount = 1;
    }
    return (
      <View style={styles.container}>
        {userDetails.user_type == 'chef' && altCount == 1 && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>
              Please complete your profile to get hired.
            </Text>
          </View>
        )}

        {userDetails.user_type == 'chef' &&
          userDetails.available_dates.length == 0 && (
            <View style={styles.alert}>
              <TouchableOpacity
                onPress={() => {
                  this.props.onDateSectionPress();
                }}>
                <Text style={styles.alertText}>
                  Please set available dates/times to get hired.
                </Text>
              </TouchableOpacity>
            </View>
          )}

        {userDetails.user_type == 'chef' && userDetails.menu_count == 0 && (
          <View style={styles.alert}>
            <TouchableOpacity onPress={() => Actions.meal_add_page()}>
              <Text style={styles.alertText}>
                Please add at least one meal to get hired
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {this._renderView(
          'First Name',
          'first_name',
          null,
          'Last Name',
          'last_name',
          null,
          userDetails.first_name,
          userDetails.last_name,
        )}
        {this._renderView(
          'Email',
          'email',
          null,
          'Phone Number',
          'phone_number',
          null,
          userDetails.email,
          userDetails.phone_number,
        )}
        {this._userTypeFields()}

        <TouchableOpacity
          style={styles.BtnStyle}
          onPress={handleSubmit(this.onSubmit)}>
          <Text style={styles.BtnTextStyle}>Update Profile</Text>
        </TouchableOpacity>
        {userDetails.user_type == 'chef' && (
          <TouchableOpacity
            style={[styles.BtnStyle, styles.blackStyle]}
            onPress={() => Actions.certificates()}>
            <Text style={styles.BtnTextStyle}>Certificates</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 20 }}></View>

        {userDetails.user_type == 'chef' && (
          <View>
            <Text style={{ color: '#D3AB52', fontSize: 20 }}>Availble Dates</Text>
            <View style={{ flexDirection: 'row' }}>
              <Calendar
                style={{ width: '100%' }}
                minDate={todayDate}
                markedDates={mark}
                markingType={'period'}
                onMonthChange={(month) => {
                  console.log('month changed', month);

                  this.setState({ extraMonth: month.month });
                }}
                onDayPress={(day) =>
                  this.onChangeDate(day.dateString)
                }></Calendar>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={[styles.BtnStyle, { width: '48%' }]}
                onPress={this.SelectAllDate}>
                <Text style={styles.BtnTextStyle}>Select All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.BtnStyle, { width: '48%' }]}
                onPress={this.ClearAllDate}>
                <Text style={styles.BtnTextStyle}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.BtnStyle}
              onPress={this.onSubmitCalendar}>
              <Text style={styles.BtnTextStyle}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.BtnStyle, styles.blackStyle]}
          onPress={() => Actions.change_password()}>
          <Text style={styles.BtnTextStyle}>Change Password</Text>
        </TouchableOpacity>
        {/* {this.state.showLoader && <Loader />} */}
      </View>
    );
  }
}

const validate = (values) => {
  console.log(values, 'validate');

  let regExGetVMID = (url) => {
    var regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/gm;

    return regExp.test(url);
  };
  let regExGetYTID = (url) => {
    var regExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm;
    return regExp.test(url);
  };
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
    errors.phone_number = 'Phone is required';
  }
  if (!values.college) {
    errors.college = 'College is required';
  }
  if (!values.graduate_year) {
    errors.graduate_year = 'Completion Year is required';
  }
  if (
    (values.graduate_year && values.graduate_year.length !== 4) ||
    (values.graduate_year &&
      parseInt(values.graduate_year) > new Date().getFullYear() - 1)
  ) {
    errors.graduate_year = 'Please enter valid Completion Year';
  }
  if (!values.experience) {
    errors.experience = 'Years Experience is required';
  }
  if (
    (values.experience && parseInt(values.experience) < 1) ||
    (values.experience && parseInt(values.experience) > 100)
  ) {
    errors.experience = 'Experience must between 1 to 100';
  }
  if (!values.service_area) {
    errors.service_area = 'Zip Code is required';
  }
  if (!values.miles_away) {
    errors.miles_away = 'Area Range is required';
  }

  if (
    (values.miles_away && parseInt(values.miles_away) < 1) ||
    (values.miles_away && parseInt(values.miles_away) > 1000)
  ) {
    errors.miles_away = 'Area Range is must between 1 to 1000';
  }
  if (!values.video_url) {
    errors.video_url = 'Video URL is required';
  }
  if (!regExGetVMID(values.video_url) && !regExGetYTID(values.video_url)) {
    errors.video_url = 'Only Youtube and vimeo urls are supported.';
  }
  if (
    values.video_url &&
    !/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(
      values.video_url,
    )
  ) {
    errors.video_url = 'Please enter valid Video URL';
  }
  if (!values.bio) {
    errors.bio = 'Bio is required';
  }

  if (!values.address) {
    errors.address = 'Address is required';
  }
  if (!values.city) {
    errors.city = 'City is required';
  }
  if (!values.state) {
    errors.state = 'State is required';
  }
  if (!values.zip) {
    errors.zip = 'Zip is required';
  }

  return errors;
};

mapStateToProps = (state) => ({
  initialValues: state.userReducer.getUser.userDetails,
  getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'ProfilePage',
    enableReinitialize: false,
    validate,
  }),
)(ProfilePage);
