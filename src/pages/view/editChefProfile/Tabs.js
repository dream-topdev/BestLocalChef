import React, {Component} from 'react';
import {View, StyleSheet, Dimensions, DeviceEventEmitter} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import {connect} from 'react-redux';

import ProfilePage from './ProfilePage';
import MealPage from './MealPage';
import MessagePage from './MessagePage';
import NotificationPage from './NotificationPage';
import RequestPage from './RequestPage';
import PaymentPage from './PaymentPage';

class Tabs extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'tab props');
    this.state = {
      checked: false,
      index: 0,
      routes: [
        {key: '1', title: 'PROFILE'},
        {key: '2', title: 'MEALS'},
        {key: '3', title: 'MESSAGES'},
        {key: '4', title: 'NOTIFICATIONS'},
        {key: '5', title: 'REQUESTS'},
        {key: '6', title: 'PAYMENT'},
      ],
    };
  }
  componentWillMount() {
    DeviceEventEmitter.addListener('notificationActionReceived', () => {
      this.setState({index: 5}, () => {
        console.log(this.state.index);
      });
    });
  }
  _handleIndexChange = (index) => {
    this.setState({index});
    this.props.changeIndex(index);
  };

  _renderScene = SceneMap({
    '1': ({route}) =>
      route.key == '1' && (
        <ProfilePage
          key={this.state.index}
          tabIndex={this.state.index}
          {...this.props}></ProfilePage>
      ),
    '2': () => <MealPage {...this.props}></MealPage>,
    '3': () => <MessagePage {...this.props}></MessagePage>,
    '4': () => <NotificationPage {...this.props}></NotificationPage>,
    '5': ({route}) =>
      route.key == '5' && (
        <RequestPage
          key={this.state.index}
          tabIndex={this.state.index}
          {...this.props}></RequestPage>
      ),
    '6': () => <PaymentPage {...this.props}></PaymentPage>,
  });

  _renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{borderWidth: 5, borderColor: '#D3AB52'}}
      scrollEnabled={true}
      bounces={true}
      labelStyle={{color: '#555555', fontSize: 16}}
      style={{backgroundColor: '#F1F1F1'}}
    />
  );

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

mapStateToProps = (state) => ({
  getUser: state.authReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
