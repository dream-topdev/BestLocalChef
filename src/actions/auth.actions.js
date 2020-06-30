import {fetchApi, getApi} from '../service/api';
import AsyncStorage from '@react-native-community/async-storage';

export const createNewUser = (payload) => {
  return async (dispatch) => {
    payload.device_token = await AsyncStorage.getItem('device_token');

    try {
      dispatch({
        type: 'CREATE_USER_LOADING',
      });
      const response = await fetchApi('/register', 'POST', payload, 200);

      if (response.success) {
        dispatch({
          type: 'CREATE_USER_SUCCESS',
        });
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: response.token,
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody.user,
        });

        return response;
      } else {
        throw response;
      }
    } catch (error) {
      dispatch({
        type: 'CREATE_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const loginUser = (payload) => {
  return async (dispatch) => {
    payload.device_token = await AsyncStorage.getItem('device_token');
    try {
      dispatch({
        type: 'LOGIN_USER_LOADING',
      });
      const response = await fetchApi('/login', 'POST', payload, 200);
      if (response.success) {
        dispatch({
          type: 'LOGIN_USER_SUCCESS',
        });
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: response.token,
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody.user,
        });
        return response;
      } else {
        throw response;
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const logoutUser = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: 'LOADING_START',
      });
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      const response = await fetchApi('/logout', 'GET', null, 200, token);
      dispatch({
        type: 'LOADING_STOP',
      });
      dispatch({
        type: 'USER_LOGGED_OUT_SUCCESS',
      });
    } catch (e) {
      dispatch({
        type: 'LOADING_STOP',
      });
    }
  };
};

export const forgotPass = (payload) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: 'LOADING_START',
      });
      const response = await fetchApi('/forgot', 'POST', payload, 200);
      if (response.success) {
        dispatch({
          type: 'LOADING_STOP',
        });
        return response;
      } else {
        throw response;
      }
    } catch (error) {
      dispatch({
        type: 'LOADING_STOP',
      });
      return error;
    }
  };
};

export const verifyEmail = (payload) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: 'LOADING_START',
      });
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      const response = await getApi(
        '/verifyEmail',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response);
      dispatch({
        type: 'LOADING_STOP',
      });
      // dispatch({
      //     type: "GET_USER_SUCCESS",
      //     payload: response.responseBody.user
      // });
      return response;
    } catch (e) {
      dispatch({
        type: 'LOADING_STOP',
      });
    }
  };
};
