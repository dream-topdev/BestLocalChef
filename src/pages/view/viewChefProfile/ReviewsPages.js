import React, { Component } from 'react';
import { Text, FlatList, View, StyleSheet } from "react-native";
import {connect} from "react-redux";
import { Rating, AirbnbRating } from 'react-native-ratings';

const styles = StyleSheet.create({
    container: {
        flex: 1, marginTop: 20, width:'100%', paddingRight:15, paddingLeft:15, marginBottom:30
    },
    header: {
        color: '#D3AB52',
        fontSize: 22,
        width: '100%'
    },
    title:{
        fontSize:14
    },
    testimonial:{
        width: '100%', paddingTop:10, borderTopColor: '#e2e2e2', borderTopWidth: 1
    },
    name:{
        fontWeight: 'bold', fontSize:14
    },
    review:{
        fontSize:14, marginBottom:10
    }
});

class ReviewsPages extends Component {

    viewReviews() {
        const {propsData: {coordinateData}} = this.props;
        console.log(coordinateData)
        return coordinateData.reviews.map((review) => {
            return (
                <View style={styles.testimonial}>
                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>                        
                        <Text style={styles.name}>-{review.first_name}</Text>
                        <Text style={styles.review}>"{review.review}"</Text>
                    </View>
                    <AirbnbRating
                        count={5}
                        defaultRating={review.rating}
                        size={20}
                        isDisabled={true}
                        reviewSize={0}
                        starContainerStyle={{width:'100%', paddingTop:0, marginTop:0}}
                    />
                </View>
            );
        });
    }


    render() {        
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.header}>Reviews</Text>
                    <Text style={styles.title}>WHAT CUSTOMERS ARE SAYING:</Text>

                    <View style={{marginTop:10}}>
                        {this.viewReviews()}
                    </View>

                </View>
            </View>
        );
    }
}


mapStateToProps = (state) => ({
    propsData: state.userReducer.propsData
})

mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewsPages);