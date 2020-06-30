import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {
  requestUser,
  checkCancelBooking,
  cancleBookingRequest,
  payBookingRequest,
} from '../../../actions/payment.actions';
import {ErrorUtils} from '../../../utils/auth.utils';
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
} from 'react-native-popup-dialog';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    width: '100%',
    paddingRight: 15,
    paddingLeft: 15,
  },
  btnViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  allReq: {
    marginTop: 20,
  },
  textStyle: {
    fontSize: 15,
    color: '#fff',
    alignSelf: 'center',
  },
  txtMessage: {
    fontWeight: 'bold',
  },
  textBtnStyle: {
    height: 45,
    width: '48%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#000',
    borderColor: 'white',
    justifyContent: 'center',
  },
  notSelected: {
    height: 45,
    width: '48%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#D3AB52',
    borderColor: 'white',
    justifyContent: 'center',
  },
  boxContainer: {
    backgroundColor: '#e2e2e2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  textContainer: {
    flexDirection: 'row',
  },
  boxBoldStyle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  boxStyle: {
    width: '100%',
    fontSize: 12,
    flexDirection: 'row',
  },
});

class RequestUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnSelected: 1,
      data: [],
      visible: false,
      cancleBooking: [],
      tip: 0,
    };
    this.requestIndex();
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      console.log('call hi');

      this.requestIndex();
    });
  }
  async requestIndex() {
    try {
      const response = await this.props.dispatch(requestUser());
      if (!response.success) {
        throw response;
      }

      this.setState({data: response.responseBody});
    } catch (error) {}
  }

  newRequest() {
    const {data} = this.state;
    const {
      getUser: {userDetails},
    } = this.props;
    if (data.upcoming_requests && data.upcoming_requests.length > 0) {
      return data.upcoming_requests.map((req) => {
        let totalPrice =
          req.price +
          req.desserts_cost * req.guests +
          req.appetizers_cost * req.guests;
        let salesTax = (totalPrice / 100) * userDetails.sales_tax;
        let serviceTax = (totalPrice / 100) * userDetails.service_tax;
        let finalPrice = totalPrice + salesTax + serviceTax;
        return (
          <View style={styles.boxContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>DATE/TIME: </Text>
              <Text style={styles.boxStyle}>
                {req.booking_date} | {req.booking_time}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Address: </Text>
              <Text style={styles.boxStyle}>{req.location}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Meal Requested: </Text>
              <Text style={styles.boxStyle}>{req.name}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Number Of Guests: </Text>
              <Text style={styles.boxStyle}>{req.guests}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Meal Cost: </Text>
              <Text style={styles.boxStyle}>${req.price}</Text>
            </View>

            {req.desserts_cost > 0 && (
              <View style={styles.textContainer}>
                <Text style={styles.boxBoldStyle}>Dessert Cost: </Text>
                <Text style={styles.boxStyle}>
                  ${parseFloat(req.desserts_cost).toFixed(2) * req.guests}
                </Text>
              </View>
            )}
            {req.appetizers_cost > 0 && (
              <View style={styles.textContainer}>
                <Text style={styles.boxBoldStyle}>Appetizers Cost: </Text>
                <Text style={styles.boxStyle}>
                  ${parseFloat(req.appetizers_cost).toFixed(2) * req.guests}
                </Text>
              </View>
            )}

            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Sales Tax: </Text>
              <Text style={styles.boxStyle}>${salesTax.toFixed(2)}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Service Tax: </Text>
              <Text style={styles.boxStyle}>${serviceTax.toFixed(2)}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Total Cost: </Text>
              <Text style={styles.boxStyle}>${finalPrice}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Notes: </Text>
              <Text style={styles.boxStyle}>{req.notes ?? 'N/A'}</Text>
            </View>

            <View style={[styles.btnViewStyle, {marginTop: 15}]}>
              {req.completed == 'confirm-pending' && req.combinedDT > req.now && (
                <TouchableOpacity
                  onPress={() => this.cancleBooking({id: req.id})}
                  style={styles.textBtnStyle}>
                  <Text style={styles.textStyle}>Cancel Booking</Text>
                </TouchableOpacity>
              )}
              {req.completed == 'canceled' && (
                <TouchableOpacity style={styles.notSelected}>
                  <Text style={styles.textStyle}>Canceled</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      });
    } else {
      return (
        <Text style={styles.txtMessage}>You don't have any new requests.</Text>
      );
    }
  }

  activeRequest() {
    const {data} = this.state;
    const {
      getUser: {userDetails},
    } = this.props;
    if (data.active_requests && data.active_requests.length > 0) {
      return data.active_requests.map((req) => {
        let totalPrice =
          req.price +
          req.desserts_cost * req.guests +
          req.appetizers_cost * req.guests;
        let salesTax = (totalPrice / 100) * userDetails.sales_tax;
        let serviceTax = (totalPrice / 100) * userDetails.service_tax;
        let finalPrice = totalPrice + salesTax + serviceTax;
        return (
          <View style={styles.boxContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>DATE/TIME: </Text>
              <Text style={styles.boxStyle}>
                {req.booking_date} | {req.booking_time}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Address: </Text>
              <Text style={styles.boxStyle}>{req.location}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Meal Requested: </Text>
              <Text style={styles.boxStyle}>{req.name}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Number Of Guests: </Text>
              <Text style={styles.boxStyle}>{req.guests}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Meal Cost: </Text>
              <Text style={styles.boxStyle}>${req.price}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Sales Tax: </Text>
              <Text style={styles.boxStyle}>${salesTax.toFixed(2)}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Service Tax: </Text>
              <Text style={styles.boxStyle}>${serviceTax.toFixed(2)}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Total Cost: </Text>
              <Text style={styles.boxStyle}>${finalPrice}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Notes: </Text>
              <Text style={styles.boxStyle}>{req.notes ?? 'N/A'}</Text>
            </View>

            {req.completed == 'full-paid' && (
              <View style={styles.btnViewStyle}>
                <TouchableOpacity style={styles.textBtnStyle}>
                  <Text style={styles.textStyle}>Paid</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.notSelected}>
                  <Text style={styles.textStyle}>Complete</Text>
                </TouchableOpacity>
              </View>
            )}

            {req.completed != 'full-paid' && (
              <View style={styles.btnViewStyle}>
                <TouchableOpacity
                  onPress={() =>
                    this.payBooking({
                      id: req.id,
                      action: 'pay',
                      amount: totalPrice,
                      mid: req.mid,
                    })
                  }
                  style={styles.textBtnStyle}>
                  <Text style={styles.textStyle}>Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.cancleBooking({id: req.id})}
                  style={styles.notSelected}>
                  <Text style={styles.textStyle}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      });
    } else {
      return (
        <Text style={styles.txtMessage}>
          You don't have any active requests.
        </Text>
      );
    }
  }

  completedRequest() {
    const {data} = this.state;
    let {
      getUser: {userDetails},
    } = this.props;
    if (data.past_requests && data.past_requests.length > 0) {
      return data.past_requests.map((req) => {
        let totalPrice =
          req.price +
          req.desserts_cost * req.guests +
          req.appetizers_cost * req.guests;
        let salesTax = (totalPrice / 100) * userDetails.sales_tax;
        let serviceTax = (totalPrice / 100) * userDetails.service_tax;
        let finalPrice = totalPrice + salesTax + serviceTax;
        return (
          <View style={styles.boxContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>DATE/TIME: </Text>
              <Text style={styles.boxStyle}>
                {req.booking_date} | {req.booking_time}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Address: </Text>
              <Text style={styles.boxStyle}>{req.location}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Number Of Guests: </Text>
              <Text style={styles.boxStyle}>{req.guests}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Meal Cost: </Text>
              <Text style={styles.boxStyle}>${req.price}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Dessert Cost: </Text>
              <Text style={styles.boxStyle}>
                ${req.desserts_cost * req.guests}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Appetizers Cost: </Text>
              <Text style={styles.boxStyle}>
                ${req.appetizers_cost * req.guests}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Total Cost: </Text>
              <Text style={styles.boxStyle}>${finalPrice}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Tip: </Text>
              <Text style={styles.boxStyle}>${req.tip ?? 0}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Notes: </Text>
              <Text style={styles.boxStyle}>{req.notes ?? 'N/A'}</Text>
            </View>
          </View>
        );
      });
    } else {
      return (
        <Text style={styles.txtMessage}>
          You don't have any completed jobs.
        </Text>
      );
    }
  }

  declinedRequest() {
    const {data} = this.state;
    let {
      getUser: {userDetails},
    } = this.props;
    if (data.dec_requests && data.dec_requests.length > 0) {
      return data.dec_requests.map((req) => {
        let totalPrice =
          req.price +
          req.desserts_cost * req.guests +
          req.appetizers_cost * req.guests;
        let salesTax = (totalPrice / 100) * userDetails.sales_tax;
        let serviceTax = (totalPrice / 100) * userDetails.service_tax;
        let finalPrice = totalPrice + salesTax + serviceTax;
        return (
          <View style={styles.boxContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>DATE/TIME: </Text>
              <Text style={styles.boxStyle}>
                {req.booking_date} | {req.booking_time}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Address: </Text>
              <Text style={styles.boxStyle}>{req.location}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Meal Requested: </Text>
              <Text style={styles.boxStyle}>{req.name}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Number Of Guests: </Text>
              <Text style={styles.boxStyle}>{req.guests}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Meal Cost: </Text>
              <Text style={styles.boxStyle}>${req.price}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Dessert Cost: </Text>
              <Text style={styles.boxStyle}>
                ${req.desserts_cost * req.guests}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Appetizers Cost: </Text>
              <Text style={styles.boxStyle}>
                ${req.appetizers_cost * req.guests}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Total Cost: </Text>
              <Text style={styles.boxStyle}>${finalPrice}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Notes: </Text>
              <Text style={styles.boxStyle}>{req.notes ?? 'N/A'}</Text>
            </View>
          </View>
        );
      });
    } else {
      return (
        <Text style={styles.txtMessage}>
          You don't have any declined requests.
        </Text>
      );
    }
  }

  async cancleBooking(values) {
    try {
      const response = await this.props.dispatch(checkCancelBooking(values));
      if (!response.success) {
        throw response;
      }

      this.setState({cancleBooking: response.responseBody});
      this.setState({visible: true});
    } catch (error) {}
  }

  payBooking(values) {
    this.setState({visible: true});
    this.setState({cancleBooking: values});
  }

  async cancleBookingRequest(values) {
    try {
      this.setState({visible: false});
      const response = await this.props.dispatch(cancleBookingRequest(values));
      if (!response.success) {
        throw response;
      }
      this.requestIndex();
    } catch (error) {}
  }

  async payBookingRequest(values) {
    try {
      values['tip'] = this.state.tip;
      this.setState({visible: false});
      const response = await this.props.dispatch(payBookingRequest(values));
      if (!response.success) {
        throw response;
      }
      Actions.reviews({mid: values.mid, bid: values.id});
    } catch (error) {}
  }

  BookingModel() {
    const {visible, cancleBooking} = this.state;
    if (cancleBooking.action == 'pay') {
      return (
        <Dialog
          visible={visible}
          width="91%"
          dialogTitle={<DialogTitle title="Are you sure?" />}
          footer={
            <DialogFooter>
              <DialogButton
                textStyle={{fontSize: 14, color: '#d3ab55'}}
                text="CANCEL"
                onPress={() => this.setState({visible: false})}
              />
              <DialogButton
                textStyle={{fontSize: 14, color: '#dc3545'}}
                text="YES, PAY"
                onPress={() =>
                  this.payBookingRequest({
                    id: cancleBooking.id,
                    mid: cancleBooking.mid,
                  })
                }
              />
            </DialogFooter>
          }>
          <DialogContent>
            <Text style={{marginTop: 20, fontSize: 14}}>
              You will be charged{' '}
              <Text style={{fontWeight: 'bold'}}>${cancleBooking.amount}?</Text>
            </Text>
            <TextInput
              style={{
                borderColor: '#555555',
                backgroundColor: '#fff',
                borderRadius: 10,
                borderWidth: 1,
                height: 40,
                marginTop: 15,
                padding: 10,
              }}
              placeholder="Add a tip?"
              name="tip"
              keyboardType="numeric"
              onChangeText={(value) => this.setState({tip: value})}
            />
          </DialogContent>
        </Dialog>
      );
    } else {
      return (
        <Dialog
          visible={visible}
          width="91%"
          dialogTitle={<DialogTitle title="Are you sure?" />}
          footer={
            <DialogFooter>
              <DialogButton
                textStyle={{fontSize: 14, color: '#d3ab55'}}
                text="NO, DON'T CANCEL"
                onPress={() => this.setState({visible: false})}
              />
              <DialogButton
                textStyle={{fontSize: 14, color: '#dc3545'}}
                text="YES, CANCEL!"
                onPress={() =>
                  this.cancleBookingRequest({id: cancleBooking.id})
                }
              />
            </DialogFooter>
          }>
          <DialogContent>
            <Text style={{marginTop: 20, fontSize: 14}}>
              You want to cancel this booking, you will be charged{' '}
              <Text style={{fontWeight: 'bold'}}>${cancleBooking.amount}?</Text>
            </Text>
          </DialogContent>
        </Dialog>
      );
    }
  }

  render() {
    const {data} = this.state;
    let totalRequests = 0;
    if (data.upcoming_requests && data.upcoming_requests.length > 0) {
      totalRequests = data.upcoming_requests.length;
    }
    return (
      <View style={styles.container}>
        <View style={styles.btnViewStyle}>
          <TouchableOpacity
            onPress={() => this.setState({btnSelected: 1})}
            style={
              this.state.btnSelected == 1
                ? styles.textBtnStyle
                : styles.notSelected
            }>
            <Text style={styles.textStyle}>New Requests ({totalRequests})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({btnSelected: 2})}
            style={
              this.state.btnSelected == 2
                ? styles.textBtnStyle
                : styles.notSelected
            }>
            <Text style={styles.textStyle}>Active Requests</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.btnViewStyle}>
          <TouchableOpacity
            onPress={() => this.setState({btnSelected: 3})}
            style={
              this.state.btnSelected == 3
                ? styles.textBtnStyle
                : styles.notSelected
            }>
            <Text style={styles.textStyle}>Completed Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({btnSelected: 4})}
            style={
              this.state.btnSelected == 4
                ? styles.textBtnStyle
                : styles.notSelected
            }>
            <Text style={styles.textStyle}>Declined Requests</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.allReq}>
          {this.state.btnSelected == 1 && this.newRequest()}
          {this.state.btnSelected == 2 && this.activeRequest()}
          {this.state.btnSelected == 3 && this.completedRequest()}
          {this.state.btnSelected == 4 && this.declinedRequest()}
        </View>

        {this.BookingModel()}
      </View>
    );
  }
}

mapStateToProps = (state) => ({
  getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestUserPage);
