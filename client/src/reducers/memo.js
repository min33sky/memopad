import * as types from '../actions/ActionTypes';
import { Map } from 'immutable';

// Default State
const initialState = Map({
    post: Map({
        status: 'INIT',
        error: -1
    })
});

// REDUCER FUNCTION
export default function memo(state = initialState, action) {
    switch(action.type) {
        case types.MEMO_POST:
            return state.setIn(['post', 'status'], 'WAITING')
                        .setIn(['post', 'error'], -1);

        case types.MEMO_POST_SUCCESS:
            return state.setIn(['post', 'status'], 'SUCCESS');

        case types.MEMO_POST_FAILURE:
            return state.setIn(['post', 'status'], 'FAILURE')
                        .setIn(['post', 'error'], action.error);

        default:
            return state;
    }
}