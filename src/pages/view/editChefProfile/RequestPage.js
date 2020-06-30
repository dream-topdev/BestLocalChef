import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {
  requestChef,
  bookingRequestAction,
} from '../../../actions/payment.actions';
import {ErrorUtils} from '../../../utils/auth.utils';
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
} from 'react-native-popup-dialog';

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

class RequestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnSelected: 1,
      data: [],
      visible: false,
      bookingData: [],
    };
    this.requestIndex();
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.requestIndex();
    });
  }
  async requestIndex() {
    try {
      const response = await this.props.dispatch(requestChef());
      //console.log(response);

      if (!response.success) {
        throw response;
      }

      this.setState({data: response.responseBody});
    } catch (error) {}
  }

  newRequest() {
    const {data} = this.state;
    console.log(data, 'req data');

    if (data.upcoming_requests && data.upcoming_requests.length > 0) {
      return data.upcoming_requests.map((req) => {
        let serviceTex =
          ((parseFloat(req.price) +
            parseFloat(req.desserts_cost) * parseInt(req.guests) +
            parseFloat(req.appetizers_cost) * parseInt(req.guests)) *
            3) /
          100;
        let tex =
          ((parseFloat(req.price) +
            parseFloat(req.desserts_cost) * parseInt(req.guests) +
            parseFloat(req.appetizers_cost) * parseInt(req.guests)) *
            8.25) /
          100;
        let total =
          parseFloat(req.price) +
          parseFloat(req.desserts_cost) * parseInt(req.guests) +
          parseFloat(req.appetizers_cost) * parseInt(req.guests) +
          tex +
          serviceTex;
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
                ${parseFloat(req.desserts_cost) * parseInt(req.guests)}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Appetizers Cost: </Text>
              <Text style={styles.boxStyle}>
                ${parseFloat(req.appetizers_cost) * parseInt(req.guests)}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Total Cost: </Text>
              <Text style={styles.boxStyle}>${total.toFixed(2)}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Notes: </Text>
              <Text style={styles.boxStyle}>{req.notes ?? 'N/A'}</Text>
            </View>

            <View style={styles.btnViewStyle}>
              {req.completed == 'confirmed' && (
                <TouchableOpacity style={styles.textBtnStyle}>
                  <Text style={styles.textStyle}>Accepted</Text>
                </TouchableOpacity>
              )}

              {req.completed == 'declined' && (
                <TouchableOpacity style={styles.notSelected}>
                  <Text style={styles.textStyle}>Declined</Text>
                </TouchableOpacity>
              )}
            </View>

            {req.completed != 'confirmed' && req.completed != 'declined' && (
              <View style={styles.btnViewStyle}>
                <TouchableOpacity
                  onPress={() =>
                    this.bookingAction({id: req.id, action: 'accept'})
                  }
                  style={styles.textBtnStyle}>
                  <Text style={styles.textStyle}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.bookingAction({id: req.id, action: 'decline'})
                  }
                  style={styles.notSelected}>
                  <Text style={styles.textStyle}>Decline</Text>
                </TouchableOpacity>
              </View>
            )}
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
    if (data.active_requests && data.active_requests.length > 0) {
      return data.active_requests.map((req) => {
        let serviceTex =
          ((parseFloat(req.price) +
            parseFloat(req.desserts_cost) * parseInt(req.guests) +
            parseFloat(req.appetizers_cost) * parseInt(req.guests)) *
            3) /
          100;
        let tex =
          ((parseFloat(req.price) +
            parseFloat(req.desserts_cost) * parseInt(req.guests) +
            parseFloat(req.appetizers_cost) * parseInt(req.guests)) *
            8.25) /
          100;
        let total =
          parseFloat(req.price) +
          parseFloat(req.desserts_cost) * parseInt(req.guests) +
          parseFloat(req.appetizers_cost) * parseInt(req.guests) +
          tex +
          serviceTex;
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
                ${parseFloat(req.desserts_cost) * parseInt(req.guests)}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Appetizers Cost: </Text>
              <Text style={styles.boxStyle}>
                ${parseFloat(req.appetizers_cost) * parseInt(req.guests)}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Total Cost: </Text>
              <Text style={styles.boxStyle}>${total.toFixed(2)}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Notes: </Text>
              <Text style={styles.boxStyle}>{req.notes ?? 'N/A'}</Text>
            </View>

            {req.completed == 'full-paid' && (
              <View>
                <View style={styles.textContainer}>
                  <Text style={styles.boxBoldStyle}>Payment status: </Text>
                  <Text style={styles.boxStyle}>Paid</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.boxBoldStyle}>Status: </Text>
                  <Text style={styles.boxStyle}>Pending</Text>
                </View>
              </View>
            )}

            {req.completed != 'full-paid' && (
              <View style={styles.textContainer}>
                <Text style={styles.boxBoldStyle}>Payment status: </Text>
                <Text style={styles.boxStyle}>Pending</Text>
              </View>
            )}

            <View style={styles.btnViewStyle}>
              <TouchableOpacity
                onPress={() =>
                  this.bookingAction({id: req.id, action: 'decline'})
                }
                style={styles.notSelected}>
                <Text style={styles.textStyle}>Decline</Text>
              </TouchableOpacity>
            </View>
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
    if (data.past_requests && data.past_requests.length > 0) {
      return data.past_requests.map((req) => {
        let serviceTex =
          ((parseFloat(req.price) +
            parseFloat(req.desserts_cost) * parseInt(req.guests) +
            parseFloat(req.appetizers_cost) * parseInt(req.guests)) *
            3) /
          100;
        let tex =
          ((parseFloat(req.price) +
            parseFloat(req.desserts_cost) * parseInt(req.guests) +
            parseFloat(req.appetizers_cost) * parseInt(req.guests)) *
            8.25) /
          100;
        let total =
          parseFloat(req.price) +
          parseFloat(req.desserts_cost) * parseInt(req.guests) +
          parseFloat(req.appetizers_cost) * parseInt(req.guests) +
          tex +
          serviceTex;
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
                ${parseFloat(req.desserts_cost) * parseInt(req.guests)}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Appetizers Cost: </Text>
              <Text style={styles.boxStyle}>
                ${parseFloat(req.appetizers_cost) * parseInt(req.guests)}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Total Cost: </Text>
              <Text style={styles.boxStyle}>${total.toFixed(2)}</Text>
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
    if (data.dec_requests && data.dec_requests.length > 0) {
      return data.dec_requests.map((req) => {
        let serviceTex =
          ((parseFloat(req.price) +
            parseFloat(req.desserts_cost) * parseInt(req.guests) +
            parseFloat(req.appetizers_cost) * parseInt(req.guests)) *
            3) /
          100;
        let tex =
          ((parseFloat(req.price) +
            parseFloat(req.desserts_cost) * parseInt(req.guests) +
            parseFloat(req.appetizers_cost) * parseInt(req.guests)) *
            8.25) /
          100;
        let total =
          parseFloat(req.price) +
          parseFloat(req.desserts_cost) * parseInt(req.guests) +
          parseFloat(req.appetizers_cost) * parseInt(req.guests) +
          tex +
          serviceTex;
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
                ${parseFloat(req.desserts_cost) * parseInt(req.guests)}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Appetizers Cost: </Text>
              <Text style={styles.boxStyle}>
                ${parseFloat(req.appetizers_cost) * parseInt(req.guests)}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Total Cost: </Text>
              <Text style={styles.boxStyle}>${total.toFixed(2)}</Text>
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

  bookingAction(values) {
    this.setState({bookingData: values});
    this.setState({visible: true});
  }

  async bookingRequestAction(values) {
    try {
      this.setState({visible: false});
      const response = await this.props.dispatch(bookingRequestAction(values));
      if (!response.success) {
        throw response;
      }
      this.requestIndex();
    } catch (error) {}
  }

  bookingActionModel() {
    const {visible, bookingData} = this.state;
    let message = '';
    let acceptButton = '';
    if (bookingData.action == 'accept') {
      message = 'Do You want to accept booking?';
      acceptButton = 'Accept';
    }
    if (bookingData.action == 'decline') {
      message = 'You want to decline this booking?';
      acceptButton = 'YES, DECLINE IT';
    }

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
              text={acceptButton}
              onPress={() => this.bookingRequestAction(bookingData)}
            />
          </DialogFooter>
        }>
        <DialogContent>
          <Text style={{marginTop: 20, fontSize: 14}}>{message}</Text>
        </DialogContent>
      </Dialog>
    );
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
        {this.bookingActionModel()}
      </View>
    );
  }
}

mapStateToProps = (state) => ({
  getUser: state.authReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestPage);
