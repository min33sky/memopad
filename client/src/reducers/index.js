import authentication from './authentication';
import memo from './memo';
import search from './search';

import { combineReducers } from 'redux';

// 리듀서를 합치는 함수를 내보낸다.
export default combineReducers({
    authentication,
    memo,
    search
});