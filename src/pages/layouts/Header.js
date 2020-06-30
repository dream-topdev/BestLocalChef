import React, {Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
  ScrollView,
  Modal,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import Loader from '../../components/Loader';
import {userImage} from '../../actions/profile.actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topStyle: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
  },
  imgStyle: {
    paddingTop: 0,
    marginLeft: -80,
    zIndex: 0,
  },
  imgStyleThree: {
    width: 45,
    height: 30,
  },
  clickBtnStyle: {
    position: 'absolute',
    zIndex: 9,
  },
  imgUserStyle: {
    marginLeft: -65,
    marginTop: 60,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D3AB52',
    zIndex: 9,
  },
  textStyle: {
    position: 'absolute',
    marginTop: 20,
    marginLeft: 15,
  },
  titleTextStyle: {
    marginTop: 50,
    color: 'white',
    fontSize: 22,
  },
  nameTextStyle: {
    color: '#D3AB52',
    marginTop: 15,
    fontSize: 25,
  },
  logoutText: {
    color: '#D3AB52',
    marginTop: 15,
  },
  modelStyle: {
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'white',
    margin: 20,
    paddingTop: 40,
    marginTop: 50,
    paddingRight: 15,
    paddingLeft: 5,
    paddingBottom: 10,
  },
  closeBtnStyle: {
    position: 'absolute',
    right: 0,
    marginTop: -15,
    marginRight: -10,
  },
  BtnStyle: {
    height: 45,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#D3AB52',
    borderColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  textBtnStyle: {
    fontSize: 15,
    color: '#fff',
    alignSelf: 'center',
  },
  btnPlus: {
    fontSize: 10,
    width: '100%',
    height: 20,
    backgroundColor: '#e2e2e2',
    paddingTop: 2,
    textAlign: 'center',
  },
  uploadAvatar: {
    width: '100%',
    height: 250,
  },
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      avatarSource: '',
    };
  }

  userImage = async () => {
    try {
      this.setState({visibleModal: false});
      const response = await this.props.dispatch(
        userImage({avatarSource: this.state.avatarSource}),
      );

      if (!response.success) {
        throw response;
      }
    } catch (error) {
      const newError = new ErrorUtils(error, 'Server Error');
      newError.showAlert();
    }
  };

  chooseImage() {
    ImagePicker.openPicker({
      cropping: true,
      width: 300,
      height: 300,
      includeBase64: true,
    }).then((image) => {
      this.setState({
        avatarSource: image,
      });
    });
  }

  _changeProfile() {
    const {
      getUser: {userDetails},
    } = this.props;
    const profile_pic = userDetails
      ? userDetails.profile_pic
      : 'https://gravatar.com/avatar';

    let avatarSource = '';
    if (this.state.avatarSource) {
      avatarSource = this.state.avatarSource.path;
    } else {
      avatarSource = profile_pic;
    }

    return (
      <Modal
        animationType="slide"
        visible={this.state.visibleModal}
        transparent={true}>
        <ScrollView
          style={{
            backgroundColor: 'rgba(50, 50, 50, .9)',
            width: '100%',
            height: '100%',
          }}>
          <View style={styles.modelStyle}>
            <TouchableOpacity
              onPress={() => this.setState({visibleModal: false})}
              style={styles.closeBtnStyle}>
              <Image
                source={require('../../assets/icon_close.png')}
                style={{width: 30, height: 30, padding: 10}}></Image>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <View style={{marginTop: 0}}>
                <Text style={{color: '#D3AB52', fontSize: 22, width: '100%'}}>
                  Profile Image
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    width: '100%',
                    position: 'relative',
                  }}>
                  <TouchableOpacity
                    style={{width: '100%'}}
                    onPress={() => this.chooseImage()}>
                    <Image
                      source={{uri: avatarSource}}
                      style={styles.uploadAvatar}
                    />
                    <Text style={styles.btnPlus}>Choose Image</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => this.userImage()}
                style={styles.BtnStyle}>
                <Text style={styles.textBtnStyle}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    );
  }

  render() {
    const {
      getUser: {userDetails},
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.topStyle}>
          <Image
            source={require('../../assets/top_profile_img.png')}
            style={styles.imgStyle}
          />
          <TouchableOpacity onPress={() => this.setState({visibleModal: true})}>
            <Image
              source={
                userDetails
                  ? {uri: userDetails.profile_pic}
                  : {uri: 'https://gravatar.com/avatar'}
              }
              style={styles.imgUserStyle}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.textStyle}>
          <TouchableOpacity
            onPress={() => Actions.drawerOpen()}
            style={styles.clickBtnStyle}>
            <Image
              source={require('../../assets/threelines.png')}
              style={styles.imgStyleThree}
            />
          </TouchableOpacity>
          <Text style={styles.titleTextStyle}>PROFILE</Text>
          <Text style={styles.nameTextStyle}>
            {userDetails
              ? userDetails.first_name + ' ' + userDetails.last_name
              : ''}
          </Text>
        </View>
        {this._changeProfile()}
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
