import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Table, Rows, Row} from 'react-native-table-component';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {paymentIndex, paymentRequest} from '../../../actions/payment.actions';
import {ErrorUtils} from '../../../utils/auth.utils';
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
} from 'react-native-popup-dialog';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    width: '100%',
    paddingRight: 15,
    paddingLeft: 15,
  },
  txtInfor: {
    color: '#D3AB52',
    fontSize: 22,
    width: '100%',
    marginBottom: 10,
  },
  txtMessage: {
    color: '#000',
    fontSize: 12,
    width: '100%',
  },
  marginStyle: {
    marginTop: 0,
    marginBottom: 40,
  },
  textBtnStyle: {
    height: 45,
    marginBottom: 20,
    width: '48%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#D3AB52',
    borderColor: 'white',
    justifyContent: 'center',
    marginTop: 10,
  },
  textStyle: {
    fontSize: 15,
    color: '#fff',
    alignSelf: 'center',
  },
  header: {height: 50, backgroundColor: '#D3AB52'},
  text: {textAlign: 'center', color: '#fff', fontSize: 14, fontWeight: '500'},
  rowsText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
  txtTotalAmount: {
    color: '#000',
    marginTop: 10,
    fontSize: 14,
  },
  bankHeader: {
    marginBottom: 20,
  },
  actionBtnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    position: 'relative',
    marginLeft: 10,
  },
  actionBtn: {
    backgroundColor: '#9e9e9e',
    borderRadius: 2,
    marginRight: 5,
  },
  btnText: {
    padding: 2,
    paddingLeft: 5,
    paddingRight: 5,
  },
});

class PaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHeadBank: ['Routing\nNumber', 'Account\nNumber', 'Action'],
      tableHead: [
        'Meal',
        'Date',
        'Meal\nCost',
        'Dessert\nCost',
        'App\nCost',
        'Chef\nShare',
        'Tip',
        'Status',
        'Action',
      ],
      widthArr: [150, 100, 50, 60, 50, 50, 50, 100, 100],
      data: [],
      visible: false,
    };
    this.paymentIndex();
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.paymentIndex();
    });
  }
  async paymentIndex() {
    try {
      const response = await this.props.dispatch(paymentIndex());

      if (!response.success) {
        throw response;
      }
      //console.log(response.responseBody)
      this.setState({data: response.responseBody});
    } catch (error) {}
  }

  action(bank) {
    return (
      <View style={styles.actionBtnContainer}>
        <TouchableOpacity
          onPress={() => Actions.payment_edit_page({bank: bank})}
          style={styles.actionBtn}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async paymentRequest(values) {
    try {
      this.setState({visible: false});
      const response = await this.props.dispatch(paymentRequest(values));
      if (!response.success) {
        throw response;
      }
      Actions.profile({route: 5});
    } catch (error) {
      const newError = new ErrorUtils(error, 'Server Error');
      newError.showAlert();
    }
  }

  paymentRequestModel(values) {
    const {visible} = this.state;

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
              text="Yes Request"
              onPress={() => this.paymentRequest(values)}
            />
          </DialogFooter>
        }>
        <DialogContent>
          <Text style={{marginTop: 20, fontSize: 14}}>
            You want to request.
          </Text>
        </DialogContent>
      </Dialog>
    );
  }

  render() {
    const tableData = [];
    const tableDataBank = [];
    const {data} = this.state;

    if (data.bank_info) {
      data.bank_info.map((bank) => {
        tableDataBank.push([
          bank.routing_number,
          bank.account_number,
          this.action(bank),
        ]);
      });
    }

    if (data.payment_booking) {
      data.payment_booking.map((item) => {
        tableData.push([
          item.name,
          item.booking_date,
          item.cost,
          item.desserts_cost,
          item.appetizers_cost,
          item.total_cost,
          item.tip,
          item.payment_request,
          item.completed,
        ]);
      });
    }

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.txtInfor}>Payment Information</Text>

          {!tableDataBank.length > 0 && (
            <View>
              <Text style={styles.txtMessage}>
                * To receive payment from jobs that you complete, please add
                your banking information below
              </Text>
              <TouchableOpacity
                onPress={() => Actions.payment_add_page()}
                style={styles.textBtnStyle}>
                <Text style={styles.textStyle}>Add Bank</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.marginStyle}>
          <View style={styles.bankHeader}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <Row
                data={this.state.tableHeadBank}
                style={styles.header}
                textStyle={styles.text}
              />
            </Table>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              {tableDataBank.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  style={[
                    styles.row,
                    index % 2 && {backgroundColor: '#F7F6E7'},
                  ]}
                  textStyle={styles.rowsText}
                />
              ))}
            </Table>
          </View>

          <Text style={styles.txtInfor}>Payment List</Text>

          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row
                  data={this.state.tableHead}
                  widthArr={this.state.widthArr}
                  style={styles.header}
                  textStyle={styles.text}
                />
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  {tableData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={this.state.widthArr}
                      style={[
                        styles.row,
                        index % 2 && {backgroundColor: '#F7F6E7'},
                      ]}
                      textStyle={styles.rowsText}
                    />
                  ))}
                </Table>
              </ScrollView>
            </View>
          </ScrollView>

          <Text style={styles.txtTotalAmount}>
            Total Amount: ${data.total_amount}
          </Text>

          {tableDataBank.length == 0 && (
            <Text style={{marginTop: 10, fontSize: 14}}>
              Add Account details to send request for Payment.
            </Text>
          )}

          {tableDataBank.length > 0 && data.total_amount > 0 && (
            <TouchableOpacity
              onPress={() => this.setState({visible: true})}
              style={styles.textBtnStyle}>
              <Text style={styles.textStyle}>Request for Payment</Text>
            </TouchableOpacity>
          )}
          {this.paymentRequestModel({book_ids: data.payids})}
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPage);
