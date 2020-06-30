import {combineReducers} from 'redux';

const getUser = (state = {}, action) => {
  //console.log(action.payload);
  switch (action.type) {
    case 'GET_USER_LOADING':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        userDetails: null,
        errors: null,
      };

    case 'GET_USER_SUCCESS':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        userDetails: action.payload,
        errors: null,
      };

    case 'GET_USER_FAIL':
      return {
        isLoading: false,
        isError: true,
        isSuccess: false,
        userDetails: null,
        errors: action.payload,
      };

    default:
      return state;
  }
};

const propsData = (state = {}, action) => {
  //console.log(action.payload);
  switch (action.type) {
    case 'DELETE_COORDINATE':
      return {
        isLoading: true,
        isError: false,
        isSuccess: false,
        coordinateData: null,
        errors: null,
      };

    case 'UPDATE_COORDINATE':
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        coordinateData: action.payload,
        errors: null,
      };

    default:
      return state;
  }
};

const loader = (state = {}, action) => {
  //console.log(action.payload);
  switch (action.type) {
    case 'LOADING_START':
      return {
        isLoading: true,
      };

    case 'LOADING_STOP':
      return {
        isLoading: false,
      };

    default:
      return state;
  }
};

const checkout = (state = {}, action) => {
  //console.log(action.payload);
  switch (action.type) {
    case 'CHECKOUT_DATA':
      return {
        checkoutData: action.payload,
      };

    default:
      return state;
  }
};
const changeTab = (state = 0, acttion) => {
  switch (acttion.type) {
    case 'CHANGE_TAB':
      return {
        checkoutData: action,
      };
    default:
      return state;
  }
};
export default combineReducers({
  getUser,
  propsData,
  checkout,
  loader,
});
