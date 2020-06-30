import React, {Component} from 'react';
import {Text, FlatList, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {notifications} from '../../../actions/payment.actions';
import {ErrorUtils} from '../../../utils/auth.utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    width: '100%',
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 30,
  },
  header: {
    color: '#D3AB52',
    fontSize: 22,
    width: '100%',
    marginBottom: 10,
  },
  body: {
    color: '#000',
    fontSize: 14,
    width: '100%',
  },
  boxContainer: {
    backgroundColor: '#e2e2e2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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

class NotificationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.notifications();
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      console.log('call hi');
      this.notifications();
    });
  }
  async notifications() {
    try {
      const response = await this.props.dispatch(notifications());
      if (!response.success) {
        throw response;
      }
      this.setState({data: response.responseBody});
    } catch (error) {}
  }

  getNoti() {
    const {data} = this.state;
    if (data.notifications && data.notifications.length > 0) {
      return data.notifications.map((req) => {
        if (req.message && req.message.type == 'review') {
          return (
            <View style={styles.boxContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.boxBoldStyle}>Review Completed! </Text>
                <Text style={styles.boxStyle}>{req.message.message}</Text>
              </View>
            </View>
          );
        }
        if (req.message && req.message.type == 'chef-book') {
          return (
            <View style={styles.boxContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.boxBoldStyle}>Booking Request! </Text>
                <Text style={styles.boxStyle}>
                  Booking Date: {req.message.booking_date}
                </Text>
              </View>
            </View>
          );
        }
        if (req.message && req.message.type == 'payment') {
          return (
            <View style={styles.boxContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.boxBoldStyle}>Booking Payment! </Text>
                <Text style={styles.boxStyle}>{req.message.message}</Text>
              </View>
            </View>
          );
        }
        if (req.message && req.message.type == 'booking-confirm') {
          return (
            <View style={styles.boxContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.boxBoldStyle}>Booking Confirm! </Text>
                <Text style={styles.boxStyle}>{req.message.message}</Text>
              </View>
            </View>
          );
        }
      });
    } else {
      return <Text style={styles.body}>No recent notifications</Text>;
    }
  }

  render() {
    const {data} = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>Notifications</Text>
          {this.getNoti()}
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationPage);
