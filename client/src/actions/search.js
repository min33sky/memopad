import { SEARCH, SEARCH_FAILURE, SEARCH_SUCCESS } from './ActionTypes';
import axios from 'axios';

/**
 * 사용자 검색 액션 생성자
 */

// Redux-thunk
export function searchRequest(keyword) {
    return (dispatch) => {
        // INFORM SEARCH IS STARTING
        dispatch(search());

        return axios.get('/api/account/search/' + keyword)
                    .then((response) => {
                        dispatch(searchSuccess(response.data));
                    }).catch((error) => {
                        dispatch(searchFailure());
                    });
    }
}

export function search(){
    return {
        type: SEARCH
    }
}
export function searchSuccess(usernames){
    console.log("검색된 사용자명 :", usernames);
    return {
        type: SEARCH_SUCCESS,
        usernames
    }
}
export function searchFailure(){
    return {
        type: SEARCH_FAILURE
    }
}

