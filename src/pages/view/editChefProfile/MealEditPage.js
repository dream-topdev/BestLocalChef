import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  Select,
  View,
  Image,
  TextInput,
  Picker,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import ImagePicker from 'react-native-image-crop-picker';
import {Actions} from 'react-native-router-flux';
import {RNToasty} from 'react-native-toasty';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {ErrorUtils} from '../../../utils/auth.utils';
import InputText from '../../../components/InputText';
import {mealUpdate} from '../../../actions/meal.actions';
import Loader from '../../../components/Loader';
import {Tooltip} from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  mainContainer: {
    ...Platform.select({
      ios: {
        paddingRight: 15,
        paddingLeft: 15,
      },
      android: {
        paddingRight: 0,
        paddingLeft: 0,
      },
    }),
  },
  textStyle: {
    color: '#555555',
    fontSize: 15,
    marginBottom: 5,
  },
  textInputStyle: {
    borderColor: '#555555',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    marginTop: 10,
    padding: 5,
  },
  pickerStyle: {
    borderColor: '#555555',
    borderRadius: 10,
    borderWidth: 1,
    height:Platform.OS=="ios"? 40:50,
    justifyContent: 'center',
  },
  textStyleBtn: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 999,
    opacity: 0.4,
    backgroundColor: 'black',
  },
  textStyleAddBtn: {
    marginTop: 15,
    position: 'absolute',
    zIndex: 999,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  btnPlus: {
    fontSize: 30,
    color: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  btnPlusText: {
    fontSize: 16,
    color: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  imageStyle: {
    backgroundColor: '#D3AB52',
    borderColor: '#fff',
    borderWidth: 2,
    width: '33%',
    height: 100,
  },
  textBtnStyle: {
    height: 45,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#D3AB52',
    borderColor: 'white',
    justifyContent: 'center',
  },
  errorText: {
    color: '#eb0808',
    fontSize: 10,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  btnRemove: {
    fontSize: 10,
    width: '100%',
    height: 20,
    backgroundColor: '#ff2c1d',
    paddingTop: 2,
    textAlign: 'center',
    color: '#fff',
  },
});

class MealEditPage extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'edit meal');
    this.state = {
      showImage: [],
      getImages: [],
      images: props.meal.images == '' ? [] : props.meal.images,
      filePath: [],
      category: props.meal.category,
      meal_prefrences: props.meal.meal_prefrences,
      update_id: props.meal.id,
      AvoidingView: false,
    };
    //this.getImage();
  }

  displayImage(response) {
    this.setState((state) => {
      state.filePath.push(response);
    });
    this.renderImages();
  }

  removeImage(response) {
    const {filePath} = this.state;
    for (const [index, item] of filePath.entries()) {
      if (item.path === response.path) {
        filePath.splice(index, 1);
      }
    }
    this.renderImages();
  }

  renderImages() {
    const {filePath} = this.state;
    let test = [];
    for (const [index, item] of filePath.entries()) {
      test.push(
        <View style={styles.imageStyle}>
          <Image
            source={{uri: item.path}}
            style={{width: '100%', height: 76}}
          />
          <TouchableOpacity onPress={() => this.removeImage(item)}>
            <Text style={styles.btnRemove}>Remove</Text>
          </TouchableOpacity>
        </View>,
      );
    }

    this.setState({
      showImage: [...test],
    });
  }

  removeImage1(response) {
    let images = this.state.images;
    let index = images.indexOf(response);
    delete images[index];
    this.setState({images});
    this.getImage();
  }

  getImage() {
    const {images} = this.state;
    console.log(images, 'image');
    if (images != null) {
      return images.map((img) => {
        return (
          <View style={styles.imageStyle}>
            <Image source={{uri: img}} style={{width: '100%', height: 76}} />
            <TouchableOpacity onPress={() => this.removeImage1(img)}>
              <Text style={styles.btnRemove}>Remove</Text>
            </TouchableOpacity>
          </View>
        );
      });
    }
  }

  onSubmit = (values) => {
    values['category'] = this.state.category;
    values['meal_prefrences'] = this.state.meal_prefrences;
    values['filePath'] = this.state.filePath;
    values['update_id'] = this.state.update_id;
    values['storeImages'] = this.state.images;
    this.mealUpdate(values);
  };

  mealUpdate = async (values) => {
    try {
      const response = await this.props.dispatch(mealUpdate(values));
      if (!response.success) {
        throw response;
      }
      const newError = new ErrorUtils('Success', 'Meal Updated');
      newError.showAlert();

      Actions.profile({route: 1});
    } catch (error) {
      const newError = new ErrorUtils(error, 'Server Error');
      newError.showAlert();
    }
  };

  renderTextInput = (field) => {
    console.log(field);
    const {
      meta: {touched, error},
      label,
      secureTextEntry,
      maxLength,
      keyboardType,
      placeholder,
      input: {name, onChange, ...restInput},
    } = field;
    return (
      <View>
        <InputText
          Focus={() => {
            if (
              name === 'calories' ||
              name === 'prep_time' ||
              name === 'cost'
            ) {
              this.setState({AvoidingView: true}, () => {
                this.refs._scrollView.scrollToEnd({Animated: true});
              });
            }
          }}
          Blur={() => {
            if (
              name === 'calories' ||
              name === 'prep_time' ||
              name === 'cost'
            ) {
              this.setState({AvoidingView: false});
            }
          }}
          onChangeText={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          label={label}
          {...restInput}
        />
        {touched && error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  _renderInlinePickerTextInput(label1, ref1, label2, ref2) {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flexDirection: 'column', width: '48%'}}>
          <Text style={styles.textStyle}>{label1}</Text>
          <View style={[styles.pickerStyle, {overflow: 'hidden'}]}>
            <RNPickerSelect
              style={{
                inputIOS: {
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#000',
                },
                inputAndroid: {
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#000',
                },
                placeholder: {color: '#000'},
              }}
              placeholder={{
                label: this.props.meal[ref1],
                value: this.props.meal[ref1],
              }}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({category: itemValue});
              }}
              items={[
                {label: 'Meal', value: 'Meal'},
                {
                  label: 'Dessert',
                  value: 'Dessert',
                },
                {
                  label: 'Appetizer',
                  value: 'Appetizer',
                },
              ]}
            />
            {/* <Picker
              mode="dropdown"
              selectedValue={this.state.category}
              ref={ref1}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({category: itemValue})
              }>
              <Picker.Item label="Meal" value="Meal" />
              <Picker.Item label="Dessert" value="Dessert" />
              <Picker.Item label="Appetizer" value="Appetizer" />
            </Picker> */}
          </View>
        </View>
        <View style={{width: '4%'}}></View>
        <View style={{flexDirection: 'column', width: '48%'}}>
          <Text style={styles.textStyle}>{label2}</Text>
          <Field name={ref2} component={this.renderTextInput} />
        </View>
      </View>
    );
  }

  _renderPicker(label, ref) {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flexDirection: 'column', width: '100%'}}>
          <Text style={styles.textStyle}>{label}</Text>
          <View style={[styles.pickerStyle, {overflow: 'hidden'}]}>
            <RNPickerSelect
              style={{
                inputIOS: {
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#000',
                },
                inputAndroid: {
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#000',
                },
                placeholder: {color: '#000'},
              }}
              placeholder={{
                label: this.props.meal[ref],
                value: this.props.meal[ref],
              }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({meal_prefrences: itemValue})
              }
              items={[
                {value: 'Meat', label: 'Meat'},
                {value: 'Vegan', label: 'Vegan'},
                {value: 'Vegetarian', label: 'Vegetarian'},
                {value: 'Athlete', label: 'Athlete'},
                {value: 'Plant_based', label: 'Plant_based'},
                {value: 'Gluten_free', label: 'Gluten_free'},
                {value: 'Other', label: 'Other'},
              ]}
            />
            {/* <Picker
              mode="dropdown"
              selectedValue={this.state.meal_prefrences}
              ref={ref}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({meal_prefrences: itemValue})
              }>
              <Picker.Item value="Meat" label="Meat" />
              <Picker.Item value="Vegan" label="Vegan" />
              <Picker.Item value="Vegetarian" label="Vegetarian" />
              <Picker.Item value="Athlete" label="Athlete" />
              <Picker.Item value="Plant_based" label="Plant based" />
              <Picker.Item value="Gluten_free" label="Gluten free" />
              <Picker.Item value="Other" label="Other" />
            </Picker> */}
          </View>
        </View>
      </View>
    );
  }

  _renderTextInput(label, ref, tooltip = null) {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flexDirection: 'column', width: '100%'}}>
          <Text style={styles.textStyle}>{label}</Text>
          {tooltip && (
            <View style={{position: 'absolute', right: 0}}>
              <Tooltip
                width={250}
                backgroundColor={'#000'}
                popover={<Text style={{color: '#fff'}}>{tooltip}</Text>}>
                <Image
                  source={require('../../../assets/info_circle.png')}
                  style={{width: 20, height: 20}}
                />
              </Tooltip>
            </View>
          )}
          <Field name={ref} component={this.renderTextInput} />
        </View>
      </View>
    );
  }

  _renderInlineTextInput(
    label1,
    ref1,
    label2,
    ref2,
    keyboardType1 = null,
    keyboardType2 = null,
  ) {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{flexDirection: 'column', width: '48%'}}>
          <Text style={styles.textStyle}>{label1}</Text>
          <Field
            name={ref1}
            keyboardType={keyboardType1}
            component={this.renderTextInput}
          />
        </View>
        <View style={{width: '4%'}}></View>
        <View style={{flexDirection: 'column', width: '48%'}}>
          <Text style={styles.textStyle}>{label2}</Text>
          <Field
            name={ref2}
            keyboardType={keyboardType2}
            component={this.renderTextInput}
          />
        </View>
      </View>
    );
  }

  _renderAddImage() {
    const {showImage} = this.state;
    return (
      <View style={{marginTop: 10}}>
        <Text style={styles.textStyle}>
          Add Images
         
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            marginTop: 10,
            position: 'relative',
          }}>
          {this.getImage()}
          {showImage}

          <TouchableOpacity
            style={styles.imageStyle}
            onPress={() => this.chooseImage()}>
            <View style={styles.textStyleAddBtn}>
              <Text style={styles.btnPlusText}>Browse Image</Text>
              <Text style={styles.btnPlus}>+</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  chooseImage() {
    ImagePicker.openPicker({
      cropping: true,
      width: 300,
      height: 200,
      includeBase64: true,
    }).then((image) => {
      this.displayImage(image);
    });
  }

  render() {
    const {handleSubmit, loader} = this.props;
    //const {propsData: {coordinateData}} = this.props;

    return (
      <SafeAreaView style={styles.container}>
        {loader.isLoading && <Loader />}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          enabled={this.state.AvoidingView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.mainContainer}
            ref="_scrollView"
            contentContainerStyle={{
              paddingBottom: Platform.OS === 'ios' ? 250 : 0,
            }}>
            {this._renderInlinePickerTextInput(
              'Meal Category',
              'category',
              'Meal Name',
              'name',
            )}

            {this._renderPicker('Meal Preference', 'meal_prefrences')}

            {this._renderTextInput(
              'Meal Ingredients(List items followed by comma)',
              'ingredients',
            )}

            {this._renderTextInput(
              'Requirements',
              'requirements',
              '2 stove tops, ovens, gas grill, etc.',
            )}

            {this._renderTextInput('Description', 'description')}

            {this._renderAddImage()}

            {this._renderTextInput(
              'Nutritional Facts',
              'calories',
              'Calories 105, Sugar 3gm, Total Fat 10g, Sodium 107g, Protein 7g.',
            )}

            {this._renderInlineTextInput(
              'Prep Time',
              'prep_time',
              'Meal Cost',
              'cost',
              'number-pad',
              'number-pad',
            )}

            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={handleSubmit(this.onSubmit)}
                style={styles.textBtnStyle}>
                <Text style={styles.textStyleAddBtn}>Update Meal</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Meal Name is required';
  }
  if (!values.ingredients) {
    errors.ingredients = 'Meal Ingredients is required';
  }
  if (!values.requirements) {
    errors.requirements = 'Requirements is required';
  }
  if (!values.description) {
    errors.description = 'Description is required';
  }
  if (!values.calories) {
    errors.calories = 'Nutritional Facts is required';
  }
  if (!values.prep_time) {
    errors.prep_time = 'Pref Time is required';
  }
  if (!values.cost) {
    errors.cost = 'Meal Cost is required';
  }
  return errors;
};

mapStateToProps = (state, props) => ({
  loader: state.userReducer.loader,
  initialValues: props.meal,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'MealEditPage',
    validate,
  }),
)(MealEditPage);
