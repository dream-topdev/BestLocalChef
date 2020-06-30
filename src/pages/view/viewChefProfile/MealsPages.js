import React, {Component} from 'react';
import {
  Text,
  FlatList,
  View,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
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
  mealBody: {
    flexDirection: 'row',
  },
  mealsList: {
    width: 120,
    borderColor: '#fff',
    justifyContent: 'space-between',
    marginTop: 10,
    marginRight: 10,
  },
  mealImage: {
    width: 120,
    height: 120,
    borderRadius: 5,
  },
  mealsText: {
    fontSize: 11,
    marginTop: 5,
  },
  mealsDetails: {
    fontSize: 8,
    marginTop: 3,
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
  mainContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  dishTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  category: {
    marginTop: 10,
  },
  categoryTitle: {
    fontSize: 14,
  },
  categoryDesc: {
    fontSize: 12,
  },
});
class MealsPages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleMealsModal: false,
      item: [],
    };
  }

  setModalVisible(item) {
    this.setState({visibleMealsModal: true});
    this.setState({item: item});
  }

  _renderItems() {
    const {
      propsData: {coordinateData},
    } = this.props;
    return coordinateData.menus_meals.map((ite, i) => {
      return (
        <TouchableOpacity
          key={i}
          style={styles.mealsList}
          onPress={() => this.setModalVisible(ite)}>
          <Image source={{uri: ite.image}} style={styles.mealImage} />
          <Text style={styles.mealsText}>{ite.name}</Text>
          <Text style={styles.mealsDetails}>MEAL DETAILS</Text>
        </TouchableOpacity>
      );
    });
  }

  _renderModelImages(item) {
    if (item && item.images) {
      return item.images.map((img, i) => {
        return (
          <View key={i} style={styles.mealsList}>
            <Image source={{uri: img}} style={styles.mealImage} />
          </View>
        );
      });
    }
  }

  viewMealModel() {
    const {item} = this.state;
    return (
      <Modal
        animationType="slide"
        visible={this.state.visibleMealsModal}
        transparent={true}>
        <ScrollView
          style={{
            backgroundColor: 'rgba(50, 50, 50, .9)',
            width: '100%',
            height: '100%',
          }}>
          <View style={styles.modelStyle}>
            <TouchableOpacity
              onPress={() => this.setState({visibleMealsModal: false})}
              style={styles.closeBtnStyle}>
              <Image
                source={require('../../../assets/icon_close.png')}
                style={{width: 30, height: 30, padding: 10}}></Image>
            </TouchableOpacity>

            <View style={styles.mainContainer}>
              <Text style={styles.dishTitle}>{item.name}</Text>

              <View style={styles.category}>
                <Text style={styles.categoryTitle}>MEAL DESCRIPTION:</Text>
                <Text style={styles.categoryDesc}>{item.description}</Text>
              </View>

              <View style={styles.category}>
                <Text style={styles.categoryTitle}>MEAL INGREDIENTS:</Text>
                <Text style={styles.categoryDesc}>{item.ingredients}</Text>
              </View>

              <View style={styles.category}>
                <Text style={styles.categoryTitle}>MEAL PREFERENCES:</Text>
                <Text style={styles.categoryDesc}>{item.meal_prefrences}</Text>
              </View>

              <View style={styles.category}>
                <Text style={styles.categoryTitle}>MEAL PREP TIME:</Text>
                <Text style={styles.categoryDesc}>{item.prep_time}</Text>
              </View>

              <View style={styles.category}>
                <Text style={styles.categoryTitle}>MEAL CALORIES:</Text>
                <Text style={styles.categoryDesc}>{item.calories}</Text>
              </View>

              <View style={styles.category}>
                <Text style={styles.categoryTitle}>APPROXIMATE MEAL COST:</Text>
                <Text style={styles.categoryDesc}>${item.cost}</Text>
              </View>

              <View style={styles.mealBody}>
                <ScrollView horizontal={true}>
                  {this._renderModelImages(item)}
                </ScrollView>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>Meals</Text>

          <View style={styles.mealBody}>
            <ScrollView horizontal={true}>{this._renderItems()}</ScrollView>
          </View>
        </View>

        {this.viewMealModel()}
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

export default connect(mapStateToProps, mapDispatchToProps)(MealsPages);
