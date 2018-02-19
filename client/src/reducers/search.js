import * as types from '../actions/ActionTypes';
import { fromJS } from 'immutable';

// DEFAULT STATE
const initialState = fromJS({
    status: 'init',
    usernames: []
});

/**
 * 사용자 검색 리듀서 함수
 * @param {object} state 상태
 * @param {object} action 액션 객체
 */
export default function search(state = initialState,  action) {

    switch(action.type) {
        case types.SEARCH:
            return state.set('status', 'WAITING');

        case types.SEARCH_SUCCESS:
            return state.set('status', 'SUCCESS')
                        .set('usernames', fromJS(action.usernames));

        case types.SEARCH_FAILURE:
            return state.set('status', 'FAILURE')
                        .set('usernames', fromJS([]));

        default:
            return state;
    }
}