import React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  Modal,
  TextInput,
  Picker,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {ErrorUtils} from '../../../utils/auth.utils';
import Loader from '../../../components/Loader';
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
} from 'react-native-popup-dialog';
import {Actions} from 'react-native-router-flux';
import {certRequestAction} from '../../../actions/profile.actions';
import {RNToasty} from 'react-native-toasty';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  textBtnStyle: {
    height: 45,
    width: '100%',
    borderRadius: 10,
    marginVertical:20,
    borderWidth: 1,
    backgroundColor: '#D3AB52',
    borderColor: 'white',
    justifyContent: 'center',
  },
  textStyleBtn: {
    fontSize: 15,
    color: '#fff',
    alignSelf: 'center',
  },
  boxContainer: {
    backgroundColor: '#e2e2e2',
    padding: 10,
    marginTop: 20,
    borderRadius: 6,
  },
  textContainer: {
    marginTop: 10,
  },
  boxBoldStyle: {
    fontWeight: 'bold',
    fontSize: 14,
    width: '100%',
  },
  boxStyle: {
    width: '100%',
    fontSize: 12,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textStyle: {
    fontSize: 15,
    color: '#fff',
    alignSelf: 'center',
  },
  textStyleLabel: {
    fontSize: 15,
    color: '#000',
  },
  editBtn: {
    marginTop: 10,
    height: 45,
    width: '48%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#000',
    borderColor: 'white',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: 'red',
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
  errorText: {
    color: '#eb0808',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  inputBox: {
    borderColor: '#555555',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    marginBottom: 5,
    padding: 10,
    color: '#000',
  },
});

class Certificates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      visible: false,
      editId: '',
      name: '',
      number: '',
      action: '',
      numberAlt: false,
      nameAlt: false,
    };
  }

  componentDidMount() {
    const {
      getUser: {userDetails},
    } = this.props;
    console.log(userDetails.certificate_data);

    if (
      userDetails.certificate_data == null ||
      typeof userDetails.certificate_data.names == 'undefined' ||
      userDetails.certificate_data.names.length == 0
    ) {
      this.actionCert({action: 'add'});
    }
  }
  actionCert(values) {
    this.setState({action: values.action});

    if (values.action == 'add') {
      this.setState({name: ''});
      this.setState({number: ''});
      this.setState({visibleModal: true});
    }
    if (values.action == 'edit') {
      this.setState({editId: values.editId});
      this.setState({name: values.name});
      this.setState({number: values.number});
      this.setState({visibleModal: true});
    }
    if (values.action == 'delete') {
      this.setState({editId: values.editId});
      this.setState({visible: true});
    }
  }

  _renderCert() {
    let html = [];
    const {
      getUser: {userDetails},
    } = this.props;
    console.log(userDetails.certificate_data, 'hjhjh');
    if (
      userDetails.certificate_data != null &&
      typeof userDetails.certificate_data.names != 'undefined'
    ) {
      for (var i = 0; i < userDetails.certificate_data.names.length; i++) {
        let name = userDetails.certificate_data.names[i];
        let number = userDetails.certificate_data.numbers[i];
        let editId = i;
        html.push(
          <View key={i} style={styles.boxContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Certification name: </Text>
              <Text style={styles.boxStyle}>{name}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boxBoldStyle}>Certification number: </Text>
              <Text style={styles.boxStyle}>{number}</Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() =>
                  this.actionCert({
                    action: 'edit',
                    editId: editId,
                    name: name,
                    number: number,
                  })
                }
                style={styles.editBtn}>
                <Text style={styles.textStyle}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.actionCert({action: 'delete', editId: editId})
                }
                style={[styles.editBtn, styles.deleteBtn]}>
                <Text style={styles.textStyle}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>,
        );
      }
    }

    return html;
  }

  onSubmit = () => {
    const {editId, name, number, action} = this.state;
    this.setState({numberAlt: false, nameAlt: false});
    if (name == '') {
      this.setState({nameAlt: true});
    } else if (number == '') {
      this.setState({numberAlt: true});
    } else {
      this.certRequestAction({
        editId: editId,
        name: name,
        number: number,
        action: action,
      });
    }
  };

  async certRequestAction(values) {
    try {
      this.setState({visible: false});
      this.setState({visibleModal: false});
      const response = await this.props.dispatch(certRequestAction(values));
      //console.log("response")
      console.log(response);
      if (!response.success) {
        throw response;
      }
      const newError = new ErrorUtils(
        'Success',
        this.state.action == 'edit'
          ? 'Certificate Edited'
          : 'Certificate Added',
      );
      newError.showAlert();

      // Actions.certificates();
    } catch (error) {}
  }

  certActionModel() {
    const {visible, editId, action} = this.state;

    return (
      <Dialog
        visible={visible}
        width="91%"
        dialogTitle={<DialogTitle title="Are you sure?" />}
        footer={
          <DialogFooter>
            <DialogButton
              textStyle={{fontSize: 14, color: '#d3ab55'}}
              text="CANCEL"
              onPress={() => this.setState({visible: false})}
            />
            <DialogButton
              textStyle={{fontSize: 14, color: '#dc3545'}}
              text="YES, DELETE IT"
              onPress={() =>
                this.certRequestAction({editId: editId, action: action})
              }
            />
          </DialogFooter>
        }>
        <DialogContent>
          <Text style={{marginTop: 20, fontSize: 14}}>
            Do You want to delete certificate?
          </Text>
        </DialogContent>
      </Dialog>
    );
  }

  certModel() {
    let title = 'Add';
    let submitButton = 'Add';

    if (this.state.action == 'edit') {
      title = 'Edit';
      submitButton = 'Update';
    }

    return (
      <Modal
        animationType="slide"
        visible={this.state.visibleModal}
        transparent={true}>
        <SafeAreaView
          style={{
            backgroundColor: 'rgba(50, 50, 50, .9)',
            width: '100%',
            height: '100%',
          }}>
          <KeyboardAvoidingView>
            <ScrollView>
              <View style={styles.modelStyle}>
                <TouchableOpacity
                  onPress={() => this.setState({visibleModal: false})}
                  style={styles.closeBtnStyle}>
                  <Image
                    source={require('../../../assets/icon_close.png')}
                    style={{width: 30, height: 30, padding: 10}}></Image>
                </TouchableOpacity>

                <View style={{paddingLeft: 10}}>
                  <Text style={{color: '#D3AB52', fontSize: 18}}>
                    {title} Certificate
                  </Text>

                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View style={{flexDirection: 'column', width: '100%'}}>
                      <Text style={styles.textStyleLabel}>
                        Certification name
                      </Text>
                      <TextInput
                        style={styles.inputBox}
                        name="certification_name"
                        value={this.state.name}
                        onChangeText={(eventName) =>
                          this.setState({name: eventName})
                        }
                      />
                      {this.state.nameAlt && (
                        <Text style={styles.errorText}>
                          Certificate name is required.
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View style={{flexDirection: 'column', width: '100%'}}>
                      <Text style={styles.textStyleLabel}>
                        Certification number
                      </Text>
                      <TextInput
                        style={styles.inputBox}
                        name="certification_number"
                        value={this.state.number}
                        onChangeText={(eventNumber) =>
                          this.setState({number: eventNumber})
                        }
                      />
                      {this.state.numberAlt && (
                        <Text style={styles.errorText}>
                          Certificate number is required.
                        </Text>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.textBtnStyle, {marginTop: 10}]}
                    onPress={() => this.onSubmit()}>
                    <Text style={styles.textStyleBtn}>{submitButton}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  }

  render() {
    const {loader} = this.props;
    return (
      <View style={styles.container}>
        {loader.isLoading && <Loader />}
        <KeyboardAvoidingView>
          <ScrollView>
            

            {this._renderCert()}
            <TouchableOpacity
              style={styles.textBtnStyle}
              onPress={() => this.actionCert({action: 'add'})}>
              <Text style={styles.textStyleBtn}>Add More</Text>
            </TouchableOpacity>
            {this.certModel()}
          </ScrollView>
        </KeyboardAvoidingView>
        {this.certActionModel()}
      </View>
    );
  }
}

mapStateToProps = (state) => ({
  getUser: state.userReducer.getUser,
  loader: state.userReducer.loader,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'Certificates',
  }),
)(Certificates);
