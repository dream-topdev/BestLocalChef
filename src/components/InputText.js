import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {TextInput, Text, View, StyleSheet} from 'react-native';

const propTypes = {
  mapElement: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  keyboardType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  label: PropTypes.string,
};

const defaultProps = {
  mapElement: (n) => {},
  onSubmitEditing: () => {},
  onChangeText: () => {},
  value: '',
  placeholder: '',
  maxLength: 200,
  keyboardType: 'default',
  secureTextEntry: false,
  label: '',
};

const styles = StyleSheet.create({
  inputBox: {
    borderColor: '#555555',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    maxHeight: 150,
    marginBottom: 5,
    padding: 10,
    minHeight: 40,
    color: '#000',
  },
});

class InputText extends Component<{}> {
  constructor(props) {
    super(props);
    if (props.value) {
      this.state = {
        value: this.props.value,
      };
    } else if (props.defaultValue) {
      this.state = {
        value: this.props.defaultValue,
      };
    } else {
      this.state = {
        value: '',
      };
    }
  }
  componentDidMount() {
    if (this.props.reset) {
      this.setState({value: ''});
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.reset != prevState.reset) {
      if (nextProps.reset) {
        return {value: ''};
      }
    }
  }
  onChangeText = (value) => {
    if (this.props.placeholder == 'MM' && parseInt(value) > 12) {
      return;
    }
    this.setState(
      {
        value,
      },
      () => {
        this.props.onChangeText(value);
      },
    );
  };

  render() {
    const {
      placeholder,
      secureTextEntry,
      keyboardType,
      maxLength,
      onChangeText,
      onSubmitEditing,
      multiline,
    } = this.props;

    return (
      <View>
        <TextInput
          onFocus={() => {
            console.log(this.props.value);
            this.props.Focus();
          }}
          onBlur={() => this.props.Blur()}
          style={[styles.inputBox, this.props.style]}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={placeholder}
          selectionColor="#999999"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onSubmitEditing={this.props.onSubmitEditing()}
          returnKeyType={this.props.returnKeyType ? this.props.returnKeyType : 'default'}
          value={this.state.value}
          // onSubmitEditing={onSubmitEditing}
          onChangeText={this.onChangeText}
          multiline={multiline}
        />
      </View>
    );
  }
}

InputText.defaultProps = defaultProps;

InputText.propTypes = propTypes;

export default InputText;
