import * as types from '../actions/ActionTypes';
import { Map } from 'immutable';

const initialState = Map({
    login: Map({
        status: 'INIT'
    }),
    status: Map({
        isLoggedIn: false,
        currentUser: ''
    })
});


// 리듀서 : 액션객체를 받아 상태를 바꾸는 함수
export default function authentication(state = initialState, action) {

    if(typeof state === "undefined")
        state = initialState;

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

        default:
            return state;
    }
};