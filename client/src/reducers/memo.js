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
            // Reference
            const data = state.getIn(['memoList', 'data']);

            if(action.isInitial) {
                return state.setIn(['memoList', 'status'], 'SUCCESS')
                            .setIn(['memoList', 'data'], action.data)
                            .setIn(['memoList', 'isLast'], action.data.length < 6);
            } else {

                if(action.listType === 'new') {
                    // console.log('action.data ===>', action.data[0]._id);
                    // console.log('reducer.data ===>', data[0]._id);
                    if(action.data.length !== 0){
                        console.log('action data', action.data);
                        /**
                         * State에 중복값이 들어가서 Duplicate Key Error가 나는걸 막아주는 작업
                         * : memoList.date에 있는 List의 키값을 모두 불러와서 배열에 저장해 놓는다.
                        */
                        let original = List(data).toArray();
                        let oArr = [];
                        for(var memo of original){
                            oArr.push(memo._id);
                        }

                        // 새로 들어온 값과 기존 값의 _id를 비교해서 새로운 값만 업데이트한다.
                        let nArr = [];
                        for(var i=0; i<action.data.length; i++){
                            if(oArr.indexOf(action.data[i]._id) === -1) nArr.push(action.data[i]);
                        }

                        console.log("업데이트될 내용: ", nArr);

                        // memoList.data 배열 앞부분에 추가한다.
                        if(nArr.length !== 0){
                            nArr.map(e => data.unshift(e));
                        }
                    }
                    return state.setIn(['memoList', 'status'], 'SUCCESS');

                } else {
                    // 이전 메모 불러오기
                    for(var dt of action.data){
                        data.push(dt);
                    }

                    return state.setIn(['memoList', 'status'], 'SUCCESS')
                                .setIn(['memoList', 'isLast'], action.data.length < 6);
                }
            }

        case types.MEMO_LIST_FAILURE:
            return state.setIn(['memoList', 'status'], 'FAILURE');


        default:
            return state;
    }
}