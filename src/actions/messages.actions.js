import {getApi} from "../service/api";
import { change } from "redux-form";

export const messagesIndex = () => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });
            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/messages", "GET", null, 200, token);
            if(response.success) {
                dispatch({
                    type: "LOADING_STOP"
                    
                });
                return response;
            } else {
                throw response;
            }
        } catch (error) {
            dispatch({
                type: "LOADING_STOP"
            });
            return error;
        }
    }
}

export const loadmsgs = (payload) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });
            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/loadmsgs", "POST", payload, 200, token);
            if(response.success) {
                dispatch({
                    type: "LOADING_STOP"
                });
                return response;
            } else {
                throw response;
            }
        } catch (error) {
            dispatch({
                type: "LOADING_STOP"
            });
            return error;
        }
    }
}

export const sendMessage = (payload) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });
            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/sendMessage", "POST", payload, 200, token);
            if(response.success) {
              
                dispatch({
                    type: "LOADING_STOP"
                });
                return response;
            } else {
                throw response;
            }
        } catch (error) {
            dispatch({
                type: "LOADING_STOP"
            });
            return error;
        }
    }
}

