import { AUTH_LOGIN, AUTH_LOGIN_FAILURE, AUTH_LOGIN_SUCCESS } from './ActionTypes';
import axios from 'axios';

//
//  authentication - LOGIN
//

// REACT-THUNK에서 사용할 함수(함수를 리턴한다)
// thunk : 특정 작업의 처리를 미루기위해 함수로 wrapping 하는 것을 의미
export function loginRequest(username, password) {
    // dispatch를 파라미터로 갖는 thunk를 리턴
    return (dispatch) => {

        // Inform Login API is starting
        dispatch(login());

        // API REQUEST
        return axios.post('/api/acoount/signin', {username, password})
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