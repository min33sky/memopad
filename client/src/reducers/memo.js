import * as types from '../actions/ActionTypes';
import { Map, List } from 'immutable';

// Default State
const initialState = Map({
    post: Map({
        status: 'INIT',
        error: -1
    }),
    memoList: Map({
        status: 'INIT',
        data: List([]),
        isLast: false
    })
});

// REDUCER FUNCTION
export default function memo(state = initialState, action) {

    switch(action.type) {

        // MEMO POST
        case types.MEMO_POST:
            return state.setIn(['post', 'status'], 'WAITING')
                        .setIn(['post', 'error'], -1);

        case types.MEMO_POST_SUCCESS:
            return state.setIn(['post', 'status'], 'SUCCESS');

        case types.MEMO_POST_FAILURE:
            return state.setIn(['post', 'status'], 'FAILURE')
                        .setIn(['post', 'error'], action.error);

        // MEMO LIST
        case types.MEMO_LIST:
            return state.setIn(['memoList', 'status'], 'WAITING');

        case types.MEMO_LIST_SUCCESS:
            if(action.isInitial) {
                return state.setIn(['memoList', 'status'], 'SUCCESS')
                            .setIn(['memoList', 'data'], action.data)
                            .setIn(['memoList', 'isLast'], action.data.length < 6);
            }

            return state;

        case types.MEMO_LIST_FAILURE:
            return state.setIn(['memoList', 'status'], 'FAILURE');


        default:
            return state;
    }
}