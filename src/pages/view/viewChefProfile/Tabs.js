import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { connect } from "react-redux";

import MealsPages from "./MealsPages";
import DessertsPages from "./DessertsPages";
import AppetizersPages from "./AppetizersPages";


class Tabs extends Component {
  constructor(props){
    super(props);
    this.state = {
      checked: false,
      index: 0,
      routes: [
        { key: '1', title: 'MEALS' },
        { key: '2', title: 'DESSERTS' },
        { key: '3', title: 'APPETIZERS' },
      ]
    }
  }


  _handleIndexChange = index => this.setState({ index });

  _renderScene = SceneMap({
    '1': () => <MealsPages {...this.props}></MealsPages>,
    '2': () => <DessertsPages {...this.props}></DessertsPages>,
    '3': () => <AppetizersPages {...this.props}></AppetizersPages>,
  });

  _renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ borderWidth: 5, borderColor: '#D3AB52'}}
      scrollEnabled={true}
      bounces={true}
      labelStyle={{ color: '#555555', fontSize: 16 }}
      style={{ backgroundColor: '#F1F1F1' }} />
  );


  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange} />
    )
  }
}


mapStateToProps = (state) => ({
  getUser: state.userReducer.getUser
})

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);