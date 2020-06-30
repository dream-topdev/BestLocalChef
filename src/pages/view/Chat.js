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
  Keyboard,
  FlatList,
  Platform,
} from 'react-native';

//import BackgroundTimer from 'react-native-background-timer';

import {Field, reduxForm, change, reset} from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';

import AutoScroll from 'react-native-auto-scroll';

import Loader from '../../components/Loader';
import {loadmsgs, sendMessage} from '../../actions/messages.actions';

import {ErrorUtils} from '../../utils/auth.utils';
import InputText from '../../components/InputText';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row', width: '100%'
  },
  messageList: {
    padding: 5,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    alignSelf: 'flex-start',
    borderRadius: 5,
    fontSize: 14,
    maxWidth: '80%',
  },
  messageListRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
});

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      load: 0,
      newMessage: '',
      keyboardOffset: 0,
      isSend: false,
    };
    this.getMessages();
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.interval = setInterval(() => {
        this.getMessages();
      }, 2000);
    });
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    clearInterval(this.interval);
  }

  _keyboardDidShow(event) {
    this.setState({
      keyboardOffset: event.endCoordinates.height,
    });
  }

  _keyboardDidHide() {
    this.setState({
      keyboardOffset: 0,
    });
  }

  async getMessages() {
    try {
      // let intervalId;
      // if(intervalId){
      //   BackgroundTimer.clearInterval(intervalId);
      // }
      //BackgroundTimer.stop();
      const response = await this.props.dispatch(
        loadmsgs({uid: this.props.message.id}),
      );
      if (!response.success) {
        throw response;
      } else {
        this.setState({messages: response.responseBody.response.reverse()});
        this.setState({load: 1});

        // const EventEmitter = Platform.select({
        //   ios: () => NativeAppEventEmitter,
        //   android: () => DeviceEventEmitter,
        // })();
        // // start a global timer
        // BackgroundTimer.start(5000); // delay in milliseconds only for Android
        // // listen for event
        // EventEmitter.addListener('backgroundTimer', () => {
        //     this.getMessages();
        //     //console.log('toe');
        // });

        // setInterval(() => {
        //  this.getMessages();
        //  console.log('tic');
        // }, 6000);

        //android

        // const EventEmitter = Platform.select({
        //   ios: () => NativeAppEventEmitter,
        //   android: () => DeviceEventEmitter,
        // })();

        // BackgroundTimer.start(5000); // delay in milliseconds only for Android

        // // listen for event
        // EventEmitter.addListener('backgroundTimer', () => {
        //   // this will be executed once after 5 seconds
        //   console.log('toe');
        //   this.getMessages();
        // });
        // // stop the timer
        // BackgroundTimer.stop();
      }
    } catch (error) {}
  }

  renderTextInput = (field) => {
    let {
      meta: {touched, error},
      label,
      secureTextEntry,
      maxLength,
      keyboardType,
      placeholder,
      input: {onChange, value, ...restInput},
    } = field;
    if (this.state.isSend) {
      value = '';
    }
    return (
      <View>
        <InputText
          Focus={() => {}}
          Blur={() => {}}
          onChangeText={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          label={label}
          value={value}
          {...restInput}
          reset={this.state.isSend}
        />
        {touched && error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  onSubmit = (values) => {
    values['user_id'] = this.props.message.id;
    console.log(values);

    if (!values['message'] || values['message'].trim().length == 0) {
      return;
    }
    this.sendMessage(values);

    this.setState({isSend: true}, () => {
      this.props.dispatch(reset('Chat'));
    });
  };

  sendMessage = async (values) => {
    try {
      const response = await this.props.dispatch(sendMessage(values));
      this.setState({isSend: false});
      if (!response.success) {
        throw response;
      } else {
        this.getMessages();
      }
    } catch (error) {
      const newError = new ErrorUtils(error, 'Server Error');
      this.setState({isSend: false});

      newError.showAlert();
    }
  };

  _renderMessages() {
    const {
      getUser: {userDetails},
      loader,
    } = this.props;
    const {messages} = this.state;
    if (messages.length > 0) {
      return messages.map((user) => {
        return (
          <View>
            {user.sender == userDetails.id && (
              <Text style={[styles.messageList, styles.messageListRight]}>
                {user.message}
              </Text>
            )}

            {user.sender == this.props.message.id && (
              <Text style={styles.messageList}>{user.message}</Text>
            )}
          </View>
        );
      });
    }
  }

  render() {
    const {
      handleSubmit,
      loader,
      getUser: {userDetails},
    } = this.props;
    const {route, messages} = this.state;
    return (
      <View style={styles.container}>
        {this.state.load == 0 && loader.isLoading && <Loader />}
        {/* <AutoScroll style={{flex:1}}>
          <View style={{flex:1, marginTop: 20, marginBottom: 65, paddingRight: 15, paddingLeft: 15 }}>
            {this._renderMessages()}
            
          </View>
        </AutoScroll> */}
        {/* <View style={{ flex: 1 }}> */}
        <FlatList
          data={messages}
          inverted
          contentContainerStyle={{
            padding: 15,
            paddingTop:
              Platform.OS === 'ios' ? this.state.keyboardOffset + 60 : 60,
          }}
          style={{flex: 1}}
          keyExtractor={(dat, ind) => ind.toString()}
          renderItem={(data) => {
            return (
              <View key={data.index}>
                {data.item.sender == userDetails.id && (
                  <Text style={[styles.messageList, styles.messageListRight]}>
                    {data.item.message}
                  </Text>
                )}

                {data.item.sender == this.props.message.id && (
                  <Text style={styles.messageList}>{data.item.message}</Text>
                )}
              </View>
            );
          }}
        />
        {/* </View>  */}

        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            bottom: Platform.OS === 'android' ? 0 : this.state.keyboardOffset,
            right: 0,
            left: 0,
            marginTop: 10,
            height: 60,
            backgroundColor: '#e2e2e2',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingTop: 10,
              paddingRight: 15,
              paddingLeft: 15,
            }}>
            <View style={{flexDirection: 'column', width: '83%'}}>
              <Field
                name="message"
                placeholder="Type message..."
                component={this.renderTextInput}
              />
            </View>
            <View style={{width: '2%'}}></View>
            <TouchableOpacity
              disabled={this.state.isSend}
              style={{
                flexDirection: 'column',
                width: '15%',
                backgroundColor: 'green',
                borderRadius: 10,
                borderWidth: 1,
                height: 40,
              }}
              onPress={handleSubmit(this.onSubmit)}>
              <Text style={{color: '#fff', textAlign: 'center', marginTop: 8}}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

mapStateToProps = (state) => ({
  getUser: state.userReducer.getUser,
  loader: state.userReducer.loader,
  initialValues: state.newMessage,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'Chat',
  }),
)(Chat);
