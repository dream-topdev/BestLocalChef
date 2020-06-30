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
  list: {
    width: '100%',
    marginTop: 10,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  description: {
    fontSize: 10,
    marginBottom: 10,
  },
});

class CertificatesPages extends Component {
  viewCert() {
    const {
      propsData: {coordinateData},
    } = this.props;

    if (coordinateData.chef.certificate_data == null) {
      return (
        <Text style={[styles.name, {marginTop: 10}]}>
          No certificates added.
        </Text>
      );
    }
    return coordinateData.chef.certificate_data.map((cert) => {
      return (
        <View style={styles.list}>
          <Text style={styles.name}>Certificate Name: {cert.names}</Text>
          <Text style={styles.description}>
            Certificate Number: {cert.numbers}
          </Text>
        </View>
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>Certificates</Text>

          <View>{this.viewCert()}</View>
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

export default connect(mapStateToProps, mapDispatchToProps)(CertificatesPages);
