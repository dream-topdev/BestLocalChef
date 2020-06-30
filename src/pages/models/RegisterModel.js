import React, { Component } from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal
} from 'react-native';

import { Actions } from 'react-native-router-flux';

export default class RegisterModel extends Component {

    constructor(props) {
        super(props);
        this.customerRegister = this.customerRegister.bind(this);
        this.chefRegister = this.chefRegister.bind(this);
    }    

    customerRegister(){
        this.props.modalHide();
        Actions.customer_register()
    }

    chefRegister(){
        this.props.modalHide();
        Actions.chef_register()
    }

    render() {
        const { visible, modalHide } = this.props;

        return (
            <View>
                <Modal animationType='slide' visible={visible} transparent={true}>
                    <View style={{ backgroundColor: 'rgba(50, 50, 50, .9)', justifyContent: 'center', width: '100%', height: '100%' }}>
                        <View style={styles.joinModelStyle}>
                            <TouchableOpacity
                                onPress={modalHide}
                                style={styles.closeBtnStyle}>
                                <Image source={require('../../assets/icon_close.png')} style={{ width: 30, height: 30, padding: 10 }} ></Image>
                            </TouchableOpacity>
                            <Text style={styles.joinTextStyle}>Join Today</Text>
                            <View style={styles.columnRowViewStyle}>
                                <View style={{ flexDirection: 'column', width: '50%' }}>
                                    <Text style={styles.customerTextStyle}>CUSTOMER</Text>
                                    <TouchableOpacity
                                        onPress={this.customerRegister}
                                        style={styles.joinModelBtnStyle}>
                                        <Text style={styles.loginBtnTextStyle}>JOIN</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.seperaterViewStyle} />

                                <View style={styles.chefViewStyle}>
                                    <Text style={styles.customerTextStyle}>CHEF</Text>
                                    <TouchableOpacity
                                        onPress={this.chefRegister}
                                        style={styles.joinModelBtnStyle}>
                                        <Text style={styles.loginBtnTextStyle}>JOIN</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loginBtnTextStyle: {
        fontSize: 15,
        color: '#fff',
        paddingTop: '6%',
        paddingLeft: '40%'
    },
    joinModelStyle: {
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'white',
        margin: 40,
        paddingTop: 40,
        paddingRight: 15,
        paddingLeft: 5,
        paddingBottom: 20
    },
    joinModelBtnStyle: {
        width: '100%',
        height: 44,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#D3AB52',
        borderColor: 'white',
        alignContent: 'center'
    },
    closeBtnStyle: {
        position: 'absolute', right: 0, marginTop: -15, marginRight: -10
    },
    columnRowViewStyle: {
        flexDirection: 'row', width: '100%', marginTop: 10
    },
    joinTextStyle: {
        color: '#D3AB52', fontSize: 20, alignSelf: 'center'
    },
    customerTextStyle: {
        fontSize: 16, alignSelf: 'center'
    },
    seperaterViewStyle: {
        flexDirection: 'column', width: 0.5, backgroundColor: 'black', marginLeft: 5, marginRight: 5
    },
    chefViewStyle: {
        flexDirection: 'column', width: '50%', marginBottom: 30
    }
});