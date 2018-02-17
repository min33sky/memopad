import * as types from '../actions/ActionTypes';
import { fromJS } from 'immutable';

const initialState = fromJS({
    post: {
        status: 'INIT',
        error: -1
    },
    memoList: {
        status: 'INIT',
        data: [],
        isLast: false
    },
    edit: {
        status: 'INIT',
        error: -1
    },
    remove: {
        status: 'INIT',
        error: -1
    },
    star: {
        status: 'INIT',
        error: -1
    }
});

// REDUCER FUNCTION
export default function memo(state = initialState, action) {

    // Reference
    const data = state.getIn(['memoList', 'data']);
    // console.log("기본 data형 : ", data);

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

            // console.log("리듀서 데이터 ", action.data);
            // console.log('상테 데이터 : ', data);

            if(action.isInitial) {
                return state.setIn(['memoList', 'status'], 'SUCCESS')
                            .setIn(['memoList', 'data'], fromJS(action.data))
                            .setIn(['memoList', 'isLast'], fromJS(action.data.length < 6));
            } else {

                if(action.listType === 'new') {


                    if(action.data.length !== 0){
                        // 상태의 데이터에서 _id값만 뽑아온다.
                        let _ids = data.map(e => e.get('_id'));

                        let insertData = action.data.filter(e => !_ids.contains(e._id));

                        // console.log('들어갈 데이터 : ', insertData);



                        // const newData = action.data.reduce((acc, item) => acc.unshift(fromJS(item)), data);
                        insertData.reduce((acc, item) => acc.unshift(fromJS(item)), data);

                        return state
                                    .setIn(['memoList', 'status'], 'SUCCESS')
                                    // .setIn(['memoList', 'data'], newData);
                                    .setIn(['memoList', 'data'], fromJS(insertData).concat(data));

                    } else {
                        return state.setIn(['memoList', 'status'], 'SUCCESS')
                    }


                } else {

                    // const oldData = action.data.reduce((acc, item) => acc.push(fromJS(item)), data);

                    return state.setIn(['memoList', 'status'], 'SUCCESS')
                                .setIn(['memoList', 'data'], data.concat(fromJS(action.data)))
                                // .setIn(['memoList', 'data'], oldData)
                                .setIn(['memoList', 'isLast'], action.data.length < 6);
                }
            }

        case types.MEMO_LIST_FAILURE:
            return state.setIn(['memoList', 'status'], 'FAILURE');

        // MEMO EDIT
        case types.MEMO_EDIT:
            return state.setIn(['edit', 'status'], 'WAITING')
                        .setIn(['edit', 'error'], -1)
                        .setIn(['edit', 'memo'], undefined);

        case types.MEMO_EDIT_SUCCESS:
            // editData.set(action.index, action.memo);
            console.log('수정 인덱스 : ', action.index);
            console.log('수정 데이터 : ', action.memo);
            return state.setIn(['edit', 'status'], 'SUCCESS')
                        .setIn(['memoList', 'data'], data.set(action.index, fromJS(action.memo)));


        case types.MEMO_EDIT_FAILURE:
            return state.setIn(['edit', 'status'], 'FAILURE')
                        .setIn(['edit', 'error'], action.error);

        // 메모 삭제 관련
        case types.MEMO_REMOVE:
            return state.setIn(['remove', 'status'], 'WAITING')
                        .setIn(['remove', 'error'], -1);

        case types.MEMO_REMOVE_SUCCESS:
            return state.setIn(['remove', 'status'], 'SUCCESS')
                        .setIn(['memoList', 'data'], data.delete(action.index));

        case types.MEMO_REMOVE_FAILURE:
            return state.setIn(['remove', 'status'], 'FAILURE')
                        .setIn(['remove', 'error'], action.error);


        // 별점 관련
        case types.MEMO_STAR:
            return state.setIn(['star', 'status'], 'WAITING');

        case types.MEMO_STAR_SUCCESS:
            return state.setIn(['star', 'status'], 'SUCCESS')
                        .setIn(['memoList', 'data'], data.set(action.index, fromJS(action.memo)));

        case types.MEMO_STAR_FAILURE:
            return state.setIn(['star', 'status'], 'FAILURE')
                        .setIn(['star', 'error'], action.error);

        default:
            return state;
    }
}