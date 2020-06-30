import React, {Component} from 'react';
import {Router, Drawer, Scene} from 'react-native-router-flux';
import {Actions} from 'react-native-router-flux';
import {SafeAreaView} from 'react-native';
import Splash from '../pages/auth/Splash';
import Login from '../pages/auth/Login';
import CustomerRegister from '../pages/auth/CustomerRegister';
import ChefRegister from '../pages/auth/ChefRegister';
import Forgot from '../pages/auth/Forgot';

import Profile from '../pages/view/Profile';
import ChangePassword from '../pages/view/editChefProfile/ChangePassword';
import Certificates from '../pages/view/editChefProfile/Certificates';

import ChefProfile from '../pages/view/ChefProfile';
import FindChef from '../pages/view/FindChef';
import Checkout from '../pages/view/Checkout';

import Chat from '../pages/view/Chat';

import MealAddPage from '../pages/view/editChefProfile/MealAddPage';
import MealEditPage from '../pages/view/editChefProfile/MealEditPage';

import PaymentAddPage from '../pages/view/editChefProfile/PaymentAddPage';
import PaymentEditPage from '../pages/view/editChefProfile/PaymentEditPage';
import ThankYou from '../pages/view/ThankYou';
import Sidebar from '../pages/layouts/Sidebar';

class Routes extends Component {
  render() {
    return (
      <Router>
        <Scene>
          <Scene key="root" hideNavBar={true} initial={!this.props.isLoggedIn}>
            <Scene
              key="splash"
              component={Splash}
              title="Splash"
              initial={true}
            />
            <Scene key="login" component={Login} title="Login" />
            <Scene
              key="customer_register"
              component={CustomerRegister}
              title="Customer Register"
            />
            <Scene
              key="chef_register"
              component={ChefRegister}
              title="Chef Register"
            />
            <Scene key="forgot" component={Forgot} title="Forgot" />
          </Scene>
          <Scene key="app" hideNavBar={true} initial={this.props.isLoggedIn}>
            <Drawer
              drawer
              key="drawer"
              contentComponent={(router) => {
                return (
                  <SafeAreaView style={{flex: 1}}>
                    <Sidebar />
                  </SafeAreaView>
                );
              }}
              hideNavBar={true}>
              <Scene
                key="profile"
                component={Profile}
                title="Profile"
                initial={true}
                hideNavBar={true}
              />
              <Scene
                key="find_chef"
                hideNavBar={true}
                component={FindChef}
                title="Find Chef"
              />
            </Drawer>
            <Scene
              key="change_password"
              component={ChangePassword}
              hideNavBar={false}
              title="Change Password"
            />
            <Scene
              key="meal_add_page"
              component={MealAddPage}
              hideNavBar={false}
              title="Add Meal"
            />
            <Scene
              key="meal_edit_page"
              component={MealEditPage}
              hideNavBar={false}
              title="Edit Meal"
            />
            <Scene
              key="payment_add_page"
              component={PaymentAddPage}
              hideNavBar={false}
              title="Add Payment Method"
            />
            <Scene
              key="payment_edit_page"
              component={PaymentEditPage}
              hideNavBar={false}
              title="Edit Payment Method"
            />
            {/* <Scene
              key="sidebar"
              component={Sidebar}
              title="Profile"
              hideNavBar={false}
            /> */}
            <Scene
              key="checkout"
              path={'/checkout/:id/'}
              component={Checkout}
              hideNavBar={false}
              title="Checkout"
            />
            <Scene
              key="thank_you"
              path={'/thank_you/:id/'}
              component={ThankYou}
              title="Thank You"
            />

            <Scene
              key="chef_profile"
              path={'/chef_profile/:id/'}
              component={ChefProfile}
              title="Chef Profile"
            />
            <Scene
              key="chat"
              component={Chat}
              title="Chat"
              hideNavBar={false}
              leftTitle="Back"
              onLeft={() => {
                Actions.profile({route: 2});
              }}
            />
            <Scene
              key="certificates"
              component={Certificates}
              title="Certificates"
              hideNavBar={false}
              leftTitle="Back"
              onLeft={() => {
                Actions.pop({route: 0});
              }}
            />
          </Scene>
        </Scene>
      </Router>
    );
  }
}

export default Routes;
