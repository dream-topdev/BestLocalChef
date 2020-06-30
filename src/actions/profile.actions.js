import {getApi} from '../service/api';

export const userProfileGet = () => {
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
      const response = await getApi('/profile', 'GET', null, 200, token);
      if (response.success) {
        dispatch({
          type: 'LOADING_STOP',
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
        type: 'LOADING_STOP',
      });
      return error;
    }
  };
};

export const userProfile = (payload) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          authData: {token},
        },
      } = state;

      dispatch({
        type: 'LOADING_START',
      });
      const response = await getApi(
        '/profile/update',
        'POST',
        payload,
        200,
        token,
      );

      if (response.success) {
        dispatch({
          type: 'LOADING_STOP',
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
        type: 'LOADING_STOP',
      });
      return error;
    }
  };
};

export const chefProfile = (payload) => {
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
        '/chef_profile/' + payload,
        'GET',
        null,
        200,
        token,
      );
      if (response.success) {
        dispatch({
          type: 'LOADING_STOP',
        });
        dispatch({
          type: 'UPDATE_COORDINATE',
          payload: response.responseBody,
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

export const changePassword = (payload) => {
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
        '/password/update',
        'POST',
        payload,
        200,
        token,
      );
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

export const submitCalendar = (payload) => {
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
        '/profile/calendar',
        'POST',
        payload,
        200,
        token,
      );
      if (response.success) {
        dispatch({
          type: 'LOADING_STOP',
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
        type: 'LOADING_STOP',
      });
      return error;
    }
  };
};

export const userImage = (payload) => {
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
        '/profile/user_image',
        'POST',
        payload,
        200,
        token,
      );
      if (response.success) {
        dispatch({
          type: 'LOADING_STOP',
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
        type: 'LOADING_STOP',
      });
      return error;
    }
  };
};

export const favorite = () => {
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
      const response = await getApi('/favorite', 'GET', null, 200, token);
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

export const favoriteAddChef = (payload) => {
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
        '/favorite/add',
        'POST',
        payload,
        200,
        token,
      );
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

export const thankYouData = (payload) => {
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
        '/thank_you/' + payload,
        'GET',
        null,
        200,
        token,
      );
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

export const submitReview = (payload) => {
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
        '/submitReview',
        'POST',
        payload,
        200,
        token,
      );
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

export const checkoutData = (payloads) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch({
        type: 'LOADING_START',
      });
      //const {authReducer: {authData: {token}}} = state;
      //console.log(payloads);
      dispatch({
        type: 'CHECKOUT_DATA',
        payload: payloads,
      });
      dispatch({
        type: 'LOADING_STOP',
      });

      return true;
    } catch (error) {
      dispatch({
        type: 'LOADING_STOP',
      });
      return error;
    }
  };
};

export const certRequestAction = (payload) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          authData: {token},
        },
      } = state;

      dispatch({
        type: 'LOADING_START',
      });
      const response = await getApi(
        '/profile/certificates',
        'POST',
        payload,
        200,
        token,
      );

      if (response.success) {
        dispatch({
          type: 'LOADING_STOP',
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
        type: 'LOADING_STOP',
      });
      return error;
    }
  };
};
