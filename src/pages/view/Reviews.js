import React, { Component } from 'react';
import {
    StyleSheet,
    StatusBar,
    View,
    Text,
    TouchableOpacity
} from 'react-native';

import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Loader from "../../components/Loader";
import { submitReview } from "../../actions/profile.actions";
import { ErrorUtils } from "../../utils/auth.utils";
import InputText from "../../components/InputText";
import { Field, reduxForm } from 'redux-form';
import { compose } from "redux";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white'
    },
    headerTitel: {
        color: '#D3AB52',
        fontSize: 22,
        width: '100%',
        marginBottom: 10
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
    textStyleAddBtn: {
        marginTop: 15,
        position: 'absolute',
        zIndex: 999,
        justifyContent: 'center',
        alignSelf: 'center',
    },

});

class Reviews extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: 3
        }
    }

    renderTextInput = (field) => {
        const { meta: { touched, error }, label, secureTextEntry, maxLength, keyboardType, placeholder, input: { onChange, ...restInput } } = field;
        return (
            <View>
                <InputText
                    Focus={() => { }}
                    Blur={() => { }}
                    onChangeText={onChange}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    label={label}
                    {...restInput} />
                {(touched && error) && <Text style={styles.errorText}>{error}</Text>}
            </View>
        );
    }

    ratingCompleted(rating) {
        this.setState({ rating: rating });
    }


    onSubmit = (values) => {
        values['rating'] = this.state.rating;
        values['menu_id'] = this.props.mid;
        values['bid'] = this.props.bid;
        this.submitReview(values);
    }

    async submitReview(values) {
        try {
            const response = await this.props.dispatch(submitReview(values));
            if (!response.success) {
                throw response;
            }
            //console.log(response)
            Actions.profile({ route: 4 });
        } catch (error) { }
    }

    render() {
        const { handleSubmit, loader } = this.props;
        return (
            <View style={styles.container}>
                {loader.isLoading && <Loader />}

                <Text style={styles.headerTitel}>Add Review</Text>
                <Rating
                    showRating
                    imageSize={30}
                    onFinishRating={(rating) => this.ratingCompleted(rating)}
                />

                <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textStyle}>Review</Text>
                    <Field
                        name="review"
                        multiline={true}
                        component={this.renderTextInput} />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                    <TouchableOpacity
                        onPress={handleSubmit(this.onSubmit)}
                        style={styles.textBtnStyle}>
                        <Text style={styles.textStyleAddBtn}>Submit</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}


mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser,
    loader: state.userReducer.loader
})

mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: "reviews"
    })
)(Reviews);
