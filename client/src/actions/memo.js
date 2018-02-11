import { MEMO_POST, MEMO_POST_FAILURE, MEMO_POST_SUCCESS,
        MEMO_LIST, MEMO_LIST_FAILURE, MEMO_LIST_SUCCESS
} from './ActionTypes';
import axios from 'axios';

// ************************************************************************
// 메모 관련 액션 생성자
// ************************************************************************

/**
 * REDUX-THUNK
 * @param {*} contents memo post contents
 */
export function memoPostRequest(contents) {
    return (dispatch) => {
        // Inform MEMO POST API is starting
        dispatch(memoPost);

        return axios.post('/api/memo', { contents })
                    .then((response) => {
                        dispatch(memoPostSuccess());
                    }).catch((error) => {
                        dispatch(memoPostFailure(error.response.data.code));
                    })
    }
}

export function memoPost() {
    return {
        type: MEMO_POST
    }
}

export function memoPostSuccess() {
    return {
        type: MEMO_POST_SUCCESS
    }
}
export function memoPostFailure(error) {
    return {
        type: MEMO_POST_FAILURE,
        error
    }
}


// ************************************************************************
// 메모 리스트 관련 액션 생성자
// ************************************************************************

/**
 * REDUX-THUNK
 * @param {*} isInitial whether it is for initial loading
 * @param {*} listType  OPTIONAL; Loading 'old' memo or 'new' memo
 * @param {*} id        OPTIONAL; memo id (one at the bottom or one at the top)
 * @param {*} username  OPTIONAL; find memos of following user
 */
export function memoListRequest(isInitial, listType, id, username) {
    return (dispatch) => {

        // INFORM memo list API is starting
        dispatch(memoList());

        let url = '/api/memo';

        if(typeof username === 'undefined') {
            // USERNAME not given, LOAD public memo
            url = isInitial ? url : `${url}/${listType}/${id}`;
        } else {
            // LOAD memos of specific USER

        }

        return axios.get(url)
                    .then((response) => {
                        dispatch(memoListSuccess(response.data, isInitial, listType));
                    }).catch((error) => {
                        dispatch(memoListFailure());
                    });
    }
}

export function memoList() {
    return {
        type: MEMO_LIST
    }
}

export function memoListSuccess(data, isInitial, listType) {
    return {
        type: MEMO_LIST_SUCCESS,
        data,
        isInitial,
        listType
    }
}

export function memoListFailure() {
    return {
        type: MEMO_LIST_FAILURE
    }
}
