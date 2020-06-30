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
import {ErrorUtils} from '../../../utils/auth.utils';
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
} from 'react-native-popup-dialog';
import {mealIndex, mealRequestAction} from '../../../actions/meal.actions';

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
  textBtnStyle: {
    height: 45,
    marginBottom: 20,
    width: '48%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#D3AB52',
    borderColor: 'white',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 15,
    color: '#fff',
    alignSelf: 'center',
  },
  header: {height: 50, backgroundColor: '#D3AB52'},
  text: {textAlign: 'center', fontWeight: '500', color: '#fff', fontSize: 14},
  rowsText: {padding: 5, color: '#000', fontSize: 14, fontWeight: '500'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
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

class MealPage extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'meal page');
    this.state = {
      tableHead: ['Meal Name', 'Category', 'Cost', 'Action'],
      widthArr: [200, 80, 50, 170],
      data: [],
      visible: false,
      actionData: [],
    };
    this.mealIndex();
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      console.log('call hi');

      this.mealIndex();
    });
  }

  async mealIndex() {
    try {
      const response = await this.props.dispatch(mealIndex());
      if (!response.success) {
        throw response;
      }
      this.setState({data: response.responseBody});
    } catch (error) {}
  }

  deleteFunction = (values) => {
    values['action'] = 'delete';
    this.setState({actionData: values});
    this.setState({visible: true});
  };

  disableFunction = (values) => {
    values['action'] = 'status';
    this.setState({actionData: values});
    this.setState({visible: true});
  };

  async mealRequestAction(values) {
    try {
      this.setState({visible: false});
      const response = await this.props.dispatch(mealRequestAction(values));
      if (!response.success) {
        throw response;
      }
      this.mealIndex();
    } catch (error) {}
  }

  actionModel() {
    const {visible, actionData} = this.state;
    let message = '';
    let acceptButton = '';
    let type = '';

    if (actionData.action == 'delete') {
      message =
        'Once you will delete All bookings for your meal will be removed.';
      acceptButton = 'YES, DELETE IT';
      type = 'delete';
    }
    if (actionData.action == 'status') {
      if (actionData.status == 1) {
        message = 'Once you will enable the meal it will show on your profile.';
        acceptButton = 'YES, ENABLE IT';
        type = 'enable';
      } else {
        message =
          'Once you will disable the meal it will not show on your profile.';
        acceptButton = 'YES, DISABLE IT';
        type = 'disable';
      }
    }
    if (type) {
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
                text={acceptButton}
                onPress={() =>
                  this.mealRequestAction({
                    menu_id: actionData.id,
                    action: actionData.action,
                    type: type,
                  })
                }
              />
            </DialogFooter>
          }>
          <DialogContent>
            <Text style={{marginTop: 20, fontSize: 14}}>{message}</Text>
          </DialogContent>
        </Dialog>
      );
    }
  }

  action(meal) {
    return (
      <View style={styles.actionBtnContainer}>
        <TouchableOpacity
          onPress={() => Actions.meal_edit_page({meal: meal})}
          style={styles.actionBtn}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.disableFunction(meal)}
          style={styles.actionBtn}>
          <Text style={styles.btnText}>
            {meal.status == 1 ? 'Enable' : 'Disable'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.deleteFunction(meal)}
          style={styles.actionBtn}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const tableData = [];
    const {data} = this.state;

    if (data.menus) {
      data.menus.map((meal) => {
        tableData.push([
          meal.name,
          meal.category,
          '$' + meal.cost,
          this.action(meal),
        ]);
      });
    }

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.txtInfor}>Meals List</Text>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => Actions.meal_add_page()}
            style={styles.textBtnStyle}>
            <Text style={styles.textStyle}>Add Meal</Text>
          </TouchableOpacity>
        </View>

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

        {this.actionModel()}
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

export default connect(mapStateToProps, mapDispatchToProps)(MealPage);
