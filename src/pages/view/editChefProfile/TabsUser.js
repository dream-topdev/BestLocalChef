import React, {Component} from 'react';
import {View, StyleSheet, DeviceEventEmitter} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import {connect} from 'react-redux';

import ProfilePage from './ProfilePage';
import MessagePage from './MessagePage';
import NotificationPage from './NotificationPage';
import RequestUserPage from './RequestUserPage';
import FavoritePage from './FavoritePage';

class TabsUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      index: 0,
      routes: [
        {key: '1', title: 'PROFILE'},
        {key: '2', title: 'NOTIFICATIONS'},
        {key: '3', title: 'MESSAGES'},
        {key: '4', title: 'FAVORITE'},
        {key: '5', title: 'REQUESTS'},
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
    '1': () => <ProfilePage {...this.props}></ProfilePage>,
    '2': () => <NotificationPage {...this.props}></NotificationPage>,
    '3': () => <MessagePage {...this.props}></MessagePage>,
    '4': () => <FavoritePage {...this.props}></FavoritePage>,
    '5': () => <RequestUserPage {...this.props}></RequestUserPage>,
  });

  _renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{borderWidth: 5, borderColor: '#D3AB52'}}
        scrollEnabled={true}
        bounces={true}
        labelStyle={{color: '#555555', fontSize: 16}}
        style={{backgroundColor: '#F1F1F1'}}
      />
    );
  };

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

export default connect(mapStateToProps, mapDispatchToProps)(TabsUser);
