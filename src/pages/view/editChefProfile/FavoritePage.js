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
import {favorite} from '../../../actions/profile.actions';

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
  },
  body: {
    color: '#000',
    fontSize: 14,
    width: '100%',
  },
  chefContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 8,
    position: 'relative',
  },
  chefsList: {
    padding: 5,
    marginBottom: 10,
  },
  chefImage: {
    ...Platform.select({
      ios: {
        width: 118,
        height: 118,
        borderRadius: 5,
      },
      android: {
        width: 100,
        height: 100,
        borderRadius: 5,
      },
    }),
  },
  chefName: {
    color: '#000',
    fontSize: 12,
    marginTop: 4,
  },
  chefProfile: {
    color: '#000',
    fontSize: 10,
    marginTop: 2,
  },
});

class FavoritePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.favoriteIndex();
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      console.log('call hi');
      this.favoriteIndex();
    });
  }
  async favoriteIndex() {
    try {
      const response = await this.props.dispatch(favorite());
      if (!response.success) {
        throw response;
      }
      this.setState({data: response.responseBody.data});
    } catch (error) {}
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      console.log('call hi');

      this.favoriteIndex();
    });
  }
  _renderChef() {
    const {data} = this.state;
    if (data) {
      return data.map((chef) => {
        return (
          <TouchableOpacity
            onPress={() => Actions.chef_profile(chef.id)}
            style={styles.chefsList}>
            <Image source={{uri: chef.profile_pic}} style={styles.chefImage} />
            <Text style={styles.chefName}>
              {chef.first_name} {chef.last_name}
            </Text>
            <Text style={styles.chefProfile}>VIEW PROFILE</Text>
          </TouchableOpacity>
        );
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>Favorite Chef</Text>
          {this.state.data == '' && (
            <Text style={styles.body}>
              You haven’t added any favorite chefs.
            </Text>
          )}
          <View style={styles.chefContainer}>{this._renderChef()}</View>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage);
