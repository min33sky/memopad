import {
    AUTH_LOGIN, AUTH_LOGIN_FAILURE, AUTH_LOGIN_SUCCESS,
    AUTH_REGISTER, AUTH_REGISTER_FAILURE, AUTH_REGISTER_SUCCESS,
    AUTH_GET_STATUS, AUTH_GET_STATUS_FAILURE, AUTH_GET_STATUS_SUCCESS,
    AUTH_LOGOUT
} from './ActionTypes';
import axios from 'axios';

// ********************************************************************
//  authentication - LOGIN
// ********************************************************************

// REACT-THUNK에서 사용할 함수(함수를 리턴한다)
// thunk : 특정 작업의 처리를 미루기위해 함수로 wrapping 하는 것을 의미
export function loginRequest(username, password) {
    // dispatch를 파라미터로 갖는 thunk를 리턴
    return (dispatch) => {

        // Inform Login API is starting
        dispatch(login());

        // API REQUEST
        return axios.post('/api/account/signin', { username, password })
            .then((response) => {
                // SUCCEED
                dispatch(loginSuccess(username));
            }).catch((error) => {
                // FAILED
                dispatch(loginFailure());
            });
    }
}

// ACTION CREATOR
export function login() {
    return {
        type: AUTH_LOGIN
    }
}

export function loginSuccess(username) {
    return {
        type: AUTH_LOGIN_SUCCESS,
        username
    }
}

export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    }
}


// ********************************************************************
//  authentication - REGISTER
// ********************************************************************

// redux-thunk
export function registerRequest(username, password) {
    return (dispatch) => {
        // INFORM REGISTER API IS STARTING
        dispatch(register());

        return axios.post('/api/account/signup', {username, password})
                    .then((response) => {

                        console.log(response);

                        dispatch(registerSuccess());
                    }).catch((error) => {

                        console.log(error);

                        dispatch(registerFailure(error.response.data.code));
                    });
    };
}

// action creators
export function register() {
    return {
        type: AUTH_REGISTER
    };
}

export function registerSuccess(){
    return {
        type: AUTH_REGISTER_SUCCESS
    };
}

export function registerFailure(error){
    return {
        type: AUTH_REGISTER_FAILURE,
        error
    };
}

// ********************************************************************
//  authentication - STATUS
// ********************************************************************

// react-thunk
export function getStatusRequest() {
    return (dispatch) => {
        // INFORM GET STATUS API IS STARTING
        dispatch(getStatus());

        return axios.get('/api/account/getInfo')
                    .then((response) => {
                        dispatch(getStatusSuccess(response.data.info.username));
                    }).catch((error) => {
                        dispatch(getStatusFailure());
                    });
    }
}

export function getStatus() {
    return {
        type: AUTH_GET_STATUS
    }
}

export function getStatusSuccess(username) {
    return {
        type: AUTH_GET_STATUS_SUCCESS,
        username
    }
}

export function getStatusFailure() {
    return {
        type: AUTH_GET_STATUS_FAILURE
    }
}

// ********************************************************************
//  authentication - LOGOUT
// ********************************************************************

// redux-thunk
export function logoutRequest() {
    return (dispatch) => {

        return axios.post('/api/account/logout')
                    .then((response) => {
                        dispatch(logout());
                    });
    }
}

export function logout() {
    return {
        type: AUTH_LOGOUT
    }
}