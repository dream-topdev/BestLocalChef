import React, {Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import Loader from '../../components/Loader';
import {thankYouData} from '../../actions/profile.actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  textBtnStyle: {
    height: 45,
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#D3AB52',
    borderColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 20,
  },
  textStyle: {
    color: '#fff',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  listTable: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },
  col: {
    width: '50%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  col1: {
    width: '50%',
    fontSize: 16,
  },
  col33: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  col133: {
    width: '100%',
    fontSize: 16,
  },
  line: {
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
    marginBottom: 5,
    marginTop: 5,
  },
});

class ThankYou extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.getData();
  }

  async getData() {
    try {
      const response = await this.props.dispatch(thankYouData(this.props.data));
      if (!response.success) {
        throw response;
      }
      this.setState({data: response.responseBody});
    } catch (error) {}
  }

  render() {
    const {
      getUser: {userDetails},
      checkout: {checkoutData},
    } = this.props;
    const {data} = this.state;
    console.log(data);

    let service_tax =
      (checkoutData.hidden_cost * userDetails.service_tax) / 100;
    let sales_tax = (checkoutData.hidden_cost * userDetails.sales_tax) / 100;
    let sub_total =
      parseFloat(checkoutData.hidden_cost) +
      parseFloat(service_tax) +
      parseFloat(sales_tax);
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{padding: 20}}>
          <Text style={styles.headerTitle}>
            You have successfully booked your chef.
          </Text>
          {data && data.order ? (
            <View>
              <View style={{marginTop: 15}}>
                <View style={styles.listTable}>
                  <Text style={styles.col}>Meal</Text>
                  <Text style={styles.col}>Price</Text>
                </View>
                <View style={styles.line}></View>
                <View style={styles.listTable}>
                  <View style={styles.col1}>
                    <Text>{data.menu.name}</Text>
                    <Text>({data.menu.ingredients})</Text>
                  </View>
                  <Text style={styles.col1}>
                    ${data.order.cost} x {data.order.guests}(guests) = $
                    {parseFloat(data.order.price_tot).toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.line}></View>

              <View style={{marginTop: 15}}>
                <View style={styles.listTable}>
                  <Text style={styles.col}>Desserts</Text>
                  <Text style={styles.col}>Price</Text>
                </View>

                {data.desserts.map((item, index) => {
                  return (
                    <View>
                      <View style={styles.line}></View>
                      <View style={styles.listTable}>
                        <View style={styles.col1}>
                          <Text>{item.name}</Text>
                          <Text>({item.ingredients})</Text>
                        </View>
                        <Text style={styles.col1}>
                          ${parseFloat(item.cost).toFixed(2)} x{' '}
                          {data.order.guests}(guests) = $
                          {parseFloat(item.cost * data.order.guests).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.line}></View>

              <View style={{marginTop: 15}}>
                <View style={styles.listTable}>
                  <Text style={styles.col}>Appetizers</Text>
                  <Text style={styles.col}>Price</Text>
                </View>

                {data.appetizers.map((item, index) => {
                  return (
                    <View>
                      <View style={styles.line}></View>
                      <View style={styles.listTable}>
                        <View style={styles.col1}>
                          <Text>{item.name}</Text>
                          <Text>({item.ingredients})</Text>
                        </View>
                        <Text style={styles.col1}>
                          ${parseFloat(item.cost).toFixed(2)} x{' '}
                          {data.order.guests}(guests) = $
                          {parseFloat(item.cost * data.order.guests).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.line}></View>

              <View>
                <View style={styles.listTable}>
                  <Text style={styles.col133}>
                    Booking Date:
                    <Text style={styles.col33}>{data.order.booking_date}</Text>
                  </Text>
                </View>
                <View style={styles.listTable}>
                  <Text style={styles.col133}>
                    Booking Time:
                    <Text style={styles.col33}>{data.order.booking_time}</Text>
                  </Text>
                </View>
                <View style={styles.listTable}>
                  <Text style={styles.col133}>
                    Guests:
                    <Text style={styles.col33}>{data.order.guests}</Text>
                  </Text>
                </View>
                <View style={styles.line}></View>
              </View>

              <View style={styles.listTable}>
                <Text style={styles.col}>
                  Service Tax ({userDetails.service_tax}%)
                </Text>
                <Text style={styles.col}>
                  ${parseFloat(service_tax).toFixed(2)}
                </Text>
              </View>
              <View style={styles.line}></View>
              <View style={styles.listTable}>
                <Text style={styles.col}>
                  Sales Tax ({userDetails.sales_tax}%)
                </Text>
                <Text style={styles.col}>
                  ${parseFloat(sales_tax).toFixed(2)}
                </Text>
              </View>
              <View style={styles.line}></View>
              <View style={styles.listTable}>
                <Text style={styles.col}>Total Price</Text>
                <Text style={styles.col}>
                  ${parseFloat(sub_total).toFixed(2)}
                </Text>
              </View>
            </View>
          ) : null}
        </ScrollView>
        <TouchableOpacity
          onPress={() => Actions.profile({route: 4})}
          style={styles.textBtnStyle}>
          <Text style={styles.textStyle}>Go To Profile</Text>
        </TouchableOpacity>
        {data && data.order ? null : <Loader />}
      </View>
    );
  }
}

mapStateToProps = (state) => ({
  getUser: state.userReducer.getUser,
  loader: state.userReducer.loader,
  checkout: state.userReducer.checkout,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ThankYou);
