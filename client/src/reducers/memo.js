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
                        let original = List(data).toArray();
                        let oArr = [];
                        // console.log('오리지나르:', original);
                        for(var memo of original){
                            oArr.push(memo._id);
                        }

                        let nArr = [];
                        for(var i=0; i<action.data.length; i++){
                            if(oArr.indexOf(action.data[i]._id) === -1) nArr.push(action.data[i]);
                        }

                        console.log("ㅋㅋㅋ: ", nArr);


                        // console.log('뉴데이터===>', newerData.length);
                        // if(newerData.length !== 0){
                        //     newerData.map(e => data.unshift(e));
                        // }

                        // console.log('action.data', action.data);
                        if(nArr.length !== 0){
                            nArr.map(e => data.unshift(e));
                        }
                    }
                    return state.setIn(['memoList', 'status'], 'SUCCESS');

                } else {
                    return state.setIn(['memoList', 'success'], 'SUCCESS')
                                // .updateIn(['memoList', 'data'], list => list.push(action.data))
                                // .setIn(['memoList', 'isLast'], action.data.length < 6);
                }
            }

        case types.MEMO_LIST_FAILURE:
            return state.setIn(['memoList', 'status'], 'FAILURE');


        default:
            return state;
    }
}