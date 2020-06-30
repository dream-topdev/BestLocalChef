import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import {connect} from 'react-redux';

import Routes from './components/Routes';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});


class Main extends Component {
  render() {
    const {authData:{isLoggedIn}} = this.props;

    return (
        <View style={styles.container}>
          <Routes isLoggedIn={isLoggedIn} />
        </View>
    )
  }
}



mapStateToProps = (state) => ({
    authData: state.authReducer.authData
})

export default connect(mapStateToProps, null)(Main);