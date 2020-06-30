import React, {Component} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import {connect} from 'react-redux';

import BioPages from './BioPages';
import CertificatesPages from './CertificatesPages';
import ReviewsPages from './ReviewsPages';
import VideosPages from './VideosPages';
import Map from './Map';

class TabsBottom extends Component {
  state = {
    checked: false,
    index: 0,
    routes: [
      {key: '1', title: 'BIO'},
      {key: '2', title: 'CERTIFICATES'},
      {key: '3', title: 'REVIEWS'},
      {key: '4', title: 'VIDEOS'},
      {key: '5', title: 'MAP'},
    ],
  };

  _handleIndexChange = (index) => this.setState({index});

  _renderScene = SceneMap({
    '1': () => <BioPages {...this.props}></BioPages>,
    '2': () => <CertificatesPages {...this.props}></CertificatesPages>,
    '3': () => <ReviewsPages {...this.props}></ReviewsPages>,
    '4': () => <VideosPages {...this.props}></VideosPages>,
    '5': () => <Map {...this.props}></Map>,
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

export default connect(mapStateToProps, mapDispatchToProps)(TabsBottom);
