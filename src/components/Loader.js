import React, {Component} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';

export default class Loader extends Component<{}> {
  state = {animating: true};

  render() {
    const animating = this.state.animating;
    return (
      <ActivityIndicator
        color="#D3AB52"
        size="large"
        style={styles.container}
        animating={animating}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100000,
    opacity: 0.7,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
