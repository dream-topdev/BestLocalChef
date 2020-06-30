import React, {Component} from 'react';
import {
  Text,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
//import BackgroundTimer from 'react-native-background-timer';
import {messagesIndex} from '../../../actions/messages.actions';

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
    marginBottom: 20,
  },
  userList: {
    borderTopColor: '#e2e2e2',
    borderTopWidth: 1,
    padding: 5,
    flexDirection: 'row',
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  userName: {
    padding: 10,
    fontSize: 14,
    fontWeight: '500',
  },
});

class MessagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.getMessages();
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      console.log('call hi');
      this.getMessages();
    });
  }
  async getMessages() {
    try {
      const response = await this.props.dispatch(messagesIndex());
      if (!response.success) {
        throw response;
      }
      console.log(response);
      this.setState({messages: response.responseBody.users});
      // stop the timer
      //BackgroundTimer.stop();
    } catch (error) {}
  }

  _renderUsers() {
    const {messages} = this.state;
    if (messages.length > 0) {
      return messages.map((user) => {
        let name = user.first_name + ' ' + user.last_name;
        return (
          <TouchableOpacity
            onPress={() => Actions.chat({title: name, message: user})}
            style={styles.userList}>
            <Image source={{uri: user.profile_pic}} style={styles.userImage} />
            <Text style={styles.userName}>{name}</Text>
          </TouchableOpacity>
        );
      });
    } else {
      return <Text style={styles.body}>No messages found</Text>;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Direct Messages</Text>

        {this._renderUsers()}
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

export default connect(mapStateToProps, mapDispatchToProps)(MessagePage);
