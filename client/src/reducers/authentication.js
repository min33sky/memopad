import * as types from '../actions/ActionTypes';
import { Map } from 'immutable';

// DEFAULT STATE
const initialState = Map({
    login: Map({
        status: 'INIT'
    }),
    status: Map({
        isLoggedIn: false,
        currentUser: '',
        valid: false
    }),
    register: Map({
        status: 'INIT',
        error: -1
    })
});


// 리듀서 : 액션객체를 받아 상태를 바꾸는 함수
export default function authentication(state = initialState, action) {

    // if(typeof state === "undefined")
    //     state = initialState;

    switch(action.type) {
        // LOGIN
        case types.AUTH_LOGIN:
            return state.setIn(['login', 'status'], 'WAITING');

        case types.AUTH_LOGIN_SUCCESS:
            return state.setIn(['login', 'status'], 'SUCCESS')
                        .setIn(['status', 'isLoggedIn'], true)
                        .setIn(['status', 'currentUser'], action.username);

        case types.AUTH_LOGIN_FAILURE:
            return state.setIn(['login', 'status'], 'FAILURE');

        // REGISTER
        case types.AUTH_REGISTER:
            return state.setIn(['register', 'status'], 'WAITING')
                        .setIn(['register','error'], -1);

        case types.AUTH_REGISTER_SUCCESS:
            return state.setIn(['register', 'status'], 'SUCCESS');

        case types.AUTH_REGISTER_FAILURE:
            return state.setIn(['register', 'status'], 'FAILURE')
                        .setIn(['register', 'error'], action.error);


        // STATUS (Session)
        case types.AUTH_GET_STATUS:
            return state.setIn(['status', 'isLoggedIn'], true);

        case types.AUTH_GET_STATUS_SUCCESS:
            return state.setIn(['status', 'valid'], true)
                        .setIn(['status', 'currentUser'], action.username);

        case types.AUTH_GET_STATUS_FAILURE:
            return state.setIn(['status', 'valid'], false)
                        .setIn(['status', 'isLoggedIn'], false);

        // LOGOUT
        case types.AUTH_LOGOUT:
            return state.setIn(['status', 'isLoggedIn'], false)
                        .setIn(['status', 'currentUser'], '');

        default:
            return state;
    }
};