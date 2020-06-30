import React, {Component} from 'react';
import {Text, FlatList, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

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
});

class BioPages extends Component {
  render() {
    const {
      propsData: {coordinateData},
    } = this.props;

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>Bio</Text>
          <Text style={styles.body}>{coordinateData.chef.bio}</Text>
        </View>
      </View>
    );
  }
}

mapStateToProps = (state) => ({
  propsData: state.userReducer.propsData,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(BioPages);
