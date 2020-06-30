import React, {Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';

import {connect} from 'react-redux';
import Header from '../layouts/Header';
import Tabs from './editChefProfile/Tabs';
import TabsUser from './editChefProfile/TabsUser';
import Loader from '../../components/Loader';
import Verify from '../auth/Verify';
import {userProfileGet} from '../../actions/profile.actions';
import {mealIndex} from '../../actions/meal.actions';
import {messagesIndex} from '../../actions/messages.actions';
import {
  notifications,
  requestChef,
  paymentIndex,
  requestUser,
} from '../../actions/payment.actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Profile extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'profile');

    this.state = {
      route: 0,
      refreshing: false,
      index: 0,
    };
  }
  _onRefresh() {
    const {
      getUser: {userDetails},
    } = this.props;
    this.setState({refreshing: true});
    if (userDetails.user_type == 'user') {
      switch (this.state.index) {
        case 0:
          this._getData(userProfileGet);
          break;
        case 1:
          this._getData(notifications);
          break;
        case 2:
          this._getData(messagesIndex);
          break;
        case 3:
          this._getData(favorite);
          break;
        case 4:
          this._getData(requestUser);

          break;

        default:
          this._getData(userProfileGet);
      }
    } else
      switch (this.state.index) {
        case 0:
          this._getData(userProfileGet);
          break;
        case 1:
          this._getData(mealIndex);
          break;
        case 2:
          this._getData(messagesIndex);
          break;
        case 3:
          this._getData(notifications);
          break;
        case 4:
          this._getData(requestChef);

          break;
        case 5:
          this._getData(paymentIndex);
          break;
        default:
          this._getData(userProfileGet);
      }
  }
  async _getData(fnc = () => {}) {
    try {
      const response = await this.props.dispatch(fnc());
      // console.log(response, 'this is data');
      if (!response.success) {
        throw response;
      }
      this.setState({refreshing: false});
    } catch (error) {
      const newError = new ErrorUtils(error, 'Server Error');
      newError.showAlert();
    }
  }
  render() {
    const {
      getUser: {userDetails},
      loader,
    } = this.props;
    const {refreshing} = this.state;
    if (userDetails && userDetails.user_type) {
      if (userDetails.email_verified_at == null) {
        return <Verify />;
      } else {
        return (
          <SafeAreaView style={{flex: 1}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : null}
              style={styles.container}>
              {loader.isLoading && <Loader />}
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                  />
                }
                ref={(e) => (this.scroll = e)}>
                <Header />
                {userDetails.user_type == 'user' && (
                  <TabsUser
                    navigation={this.props.navigation}
                    changeIndex={(index) => {
                      this.setState({index});
                    }}
                  />
                )}
                {userDetails.user_type == 'chef' && (
                  <Tabs
                    navigation={this.props.navigation}
                    onDateSectionPress={() => {
                      this.scroll.scrollTo({y: 567});
                    }}
                    changeIndex={(index) => {
                      this.setState({index});
                    }}
                    // index={route}
                  />
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        );
      }
    } else {
      return <Loader />;
    }
  }
}

mapStateToProps = (state) => ({
  getUser: state.userReducer.getUser,
  loader: state.userReducer.loader,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
