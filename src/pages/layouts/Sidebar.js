import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {logoutUser} from '../../actions/auth.actions';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RNToasty} from 'react-native-toasty';
const styles = StyleSheet.create({
  container: {
    flex: 1,

    width: '100%',

    // backgroundColor: 'red',
  },
  textBtnStyle: {
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
    padding: 5,
    height: 45,
  },
  textStyle: {
    fontSize: 18,
    color: '#000',
    padding: 5,
  },
});

class Sidebar extends Component {
  logoutUser = async () => {
    await this.props.dispatch(logoutUser());
  };

  render() {
    const {
      getUser: {userDetails},
    } = this.props;
    console.log(this.props.getUser);
    if (typeof userDetails == 'undefined') {
      return <Text style={styles.textStyle}>Loading</Text>;
    }
    return (
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: '#000',
            height: 150,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => Actions.drawerClose()}
            style={{position: 'absolute', right: 10, top: 20}}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            style={{height: 100, width: 100}}
            resizeMode="contain"
            source={require('../../assets/logo.png')}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            Actions.profile();
            Actions.drawerClose();
          }}
          style={styles.textBtnStyle}>
          <Text style={styles.textStyle}>Profile</Text>
        </TouchableOpacity>
        {userDetails.user_type !== 'chef' && (
          <TouchableOpacity
            onPress={() => {
              Actions.find_chef();
              Actions.drawerClose();
            }}
            style={styles.textBtnStyle}>
            <Text style={styles.textStyle}>Find Chef</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={this.logoutUser} style={styles.textBtnStyle}>
          <Text style={styles.textStyle}>Logout</Text>
        </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
