import {getApi} from "../service/api";

export const findChef = (payload) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });
            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/find_chef", "POST", payload, 200, token);
            
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
