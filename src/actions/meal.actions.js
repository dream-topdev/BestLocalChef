import {getApi} from '../service/api';

export const mealIndex = () => {
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
      const response = await getApi('/menu', 'GET', null, 200, token);
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

export const mealAdd = (payload) => {
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
      const response = await getApi('/menu/store', 'POST', payload, 200, token);
      //console.log(response);
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

export const mealUpdate = (payload) => {
  console.log(payload, 'payload');

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
        '/menu/update/' + payload.update_id,
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

export const mealRequestAction = (payload) => {
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
        '/menu_' + payload.action,
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
