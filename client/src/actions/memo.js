import { MEMO_POST, MEMO_POST_FAILURE, MEMO_POST_SUCCESS } from './ActionTypes';
import axios from 'axios';

// ************************************************************************
// 메모 관련 액션 생성자
// ************************************************************************

// redux-thunk
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