import {getApi} from "../service/api";

export const paymentIndex = () => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });
            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/payment", "GET", null, 200, token);
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


export const paymentAdd = (payload) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });
            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/payment/store", "POST", payload, 200, token);
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


export const requestChef = () => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });
            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/requests/chef", "GET", null, 200, token);
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

export const requestUser = () => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });
            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/requests/user", "GET", null, 200, token);
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


export const notifications = () => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });
            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/notifications", "GET", null, 200, token);
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



export const payChef = (payload) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });
            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/payChef", "POST", payload, 200, token);
            //console.log(response)
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


export const checkCancelBooking = (payload) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });
            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/check_cancel_booking", "POST", payload, 200, token);
            //console.log(response)
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


export const cancleBookingRequest = (payload) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });
            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/cancel_booking", "POST", payload, 200, token);
            //console.log(response)
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



export const bookingRequestAction = (payload) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });

            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/req-"+payload.action, "POST", payload, 200, token);
            //console.log(response)
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



export const payBookingRequest = (payload) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });

            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/makePayment", "POST", payload, 200, token);
            //console.log(response)
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


export const paymentRequest = (payload) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            dispatch({
                type: "LOADING_START"
            });

            const {authReducer: {authData: {token}}} = state;
            const response = await getApi("/chef-payment-requests", "POST", payload, 200, token);
            //console.log(response)
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

