import React, { Component } from 'react';
import { Header, Write, MemoList } from '../components';
import { connect } from 'react-redux';

// SERVER API를 호출할 함수
import { logoutRequest } from '../actions/authentication';
import {
    memoPostRequest, memoListRequest,
    memoEditRequest, memoRemoveRequest, memoStarRequest
} from '../actions/memo';
import { searchRequest } from '../actions/search';

// propType module
import PropTypes from 'prop-types';
import './Home.css';

const Materialize = window.Materialize;
const $ = window.$;

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingState: false,    // 이전 글 로딩
            initiallyLoaded: false  // 검색시 로딩
        }
    }

    // ******************************************
    // 생명 주기 메서드
    // ******************************************

    // 컴포넌트 마운트되기 전에 글 목록 불러오기
    componentDidMount() {
        // LOAD NEW MEMO EVERY 5 SECONDS
        const loadMemoLoop = () => {
            this.loadNewMemo().then(
                () => {
                    this.memoLoaderTimeoutId = setTimeout(loadMemoLoop, 5000);
                }
            );
        };

        // 해상도가 클 때 스크롤바가 안나오는 경우를 대비
        const loadUntilScrollable = () => {
            // IF THE SCHROLLBAR DOES NOT EXIST,
            if ($('body').height() < $(window).height()) {
                this.loadOldMemo().then(
                    () => {
                        // DO THIS RECURSIVELY UNLESS IT'S LAST PAGE
                        if (!this.props.isLast) {
                            loadUntilScrollable();
                        }
                    }
                )
            }
        }

        // DO THE INITIAL LOADING
        this.props.memoListRequest(true, undefined, undefined, this.props.username).then(
            () => {
                // LOAD MEMO UNTIL SCHROLLABLE
                // 메모가 사라지는 에니메이션이 1초가 걸리므로 1초 뒤에 확인
                setTimeout(loadUntilScrollable(), 1000);
                // BEGIN NEW MEMO LOADING LOOP
                loadMemoLoop();

                // 서버에서 메모를 가져왔으니 상태값 변경
                this.setState({
                    initiallyLoaded: true
                });
            }
        );

        // 무한 스크롤링 기능
        $(window).scroll(() => {
            // WHEN HEIGHT UNDER SCROLLBOTTOM IS LESS THEN 250
            if ($(document).height() - $(window).height() - $(window).scrollTop() < 250) {
                if (!this.state.loadingState) {
                    this.loadOldMemo(); // 이전 메모를 불러온다.
                    this.setState({
                        loadingState: true
                    });
                }
            } else {
                if (this.state.loadingState) {
                    this.setState({
                        loadingState: false
                    })
                }
            }
        })
    }

    // 담벼락(Wall)에서는 홈 컴포넌트가 다시 마운트되지 않고 업데이트되므로
    // 직접 메서드를 실행하기 위한 코드이다
    componentDidUpdate(prevProps, prevState) {
        if(this.props.username !== prevProps.username) {
            // 다시 컴포넌트가 마운트나 언마운트가 되는건 아니다
            // 그냥 코드를 실행할 뿐....
            this.componentWillUnmount();
            this.componentDidMount();
        }
    }

    componentWillUnmount() {
        // STOPS THE loadMemoLoop
        clearTimeout(this.memoLoaderTimeoutId);

        // REMOVE WINDOWS SCROLL LISTENER
        $(window).unbind();

        this.setState({
            initiallyLoaded: false
        });
    }


    // **************************************************
    // 이벤트 핸들러
    // **************************************************


    // 최신 메모 불러오기
    loadNewMemo = () => {
        // CANCEL IF THERE IS A PENDING REQUEST
        if (this.props.listStatus === 'WAITING') {
            console.log("========= Server is working to load memoList =========");
            return new Promise((resolve, reject) => {
                resolve();
            })
        }

        // IF PAGE IS EMPTY, DO THE INITIAL LOADING
        if (this.props.memoData.get('data').size === 0) {
            console.log("저장된 메모가 없다.");
            return this.props.memoListRequest(true, undefined, undefined, this.props.username);
        }

        return this.props.memoListRequest(false, 'new', this.props.memoData.get('data').get(0).get('_id'), this.props.username);
    }

    // 오래된 메모 불러오기
    loadOldMemo = () => {
        // CANCEL IF USER IS READING THE LAST PAGE
        if (this.props.isLast) {
            return new Promise(
                (resolve, reject) => {
                    resolve();
                }
            )
        }

        // GET ID OF THE MEMO AT THE BOTTOM
        let lastId = this.props.memoData.get('data').get(this.props.memoData.get('data').size - 1).get('_id');


        // START REQUEST
        return this.props.memoListRequest(false, 'old', lastId, this.props.username).then(() => {
            // IF IT IS LAST PAGE, NOTIFY
            if (this.props.isLast) {
                Materialize.toast('마지막 페이지 :)', 2000);
            }
        })
    }


    // *******************************************
    // 로그아웃
    // ********************************************
    handleLogout = () => {
        this.props.logoutRequest()
            .then(() => {
                Materialize.toast('Good Bye!!!', 2000);

                // EMPTIES THE SESSION
                let loginData = {
                    isLoggedIn: false,
                    username: ''
                };

                // document.cookie = 'key=' + btoa(JSON.stringify(loginData));
                document.cookie = `key=${btoa(JSON.stringify(loginData))}; path=/`;
            });
    }


    // **************************************
    // 메모 쓰기
    // **************************************
    handlePost = (contents) => {
        return this.props.memoPostRequest(contents).then(() => {
            if (this.props.postStatus.get('status') === 'SUCCESS') {
                // TRIGGER LOAD NEW MEMO
                this.loadNewMemo().then(() => {
                    Materialize.toast('Success!', 2000);
                });
            } else {
                /*
                    ERROR CODES
                        1: NOT LOGGED IN
                        2: EMPTY CONTENTS
                */
                let $toastContent;
                switch (this.props.postStatus.get('error')) {
                    case 1:
                        // IF NOT LOGGED IN, NOTIFY AND REFRESH AFTER
                        $toastContent = $('<span style="color: ##FFB4BA">You are not logged in</span>');
                        Materialize.toast($toastContent, 2000);
                        // 2초후에 새로고침
                        setTimeout(() => {
                            window.location.reload(false);
                        }, 2000);
                        break;
                    case 2:
                        $toastContent = $('<span style="color: #FFB4BA">Please write something</span>');
                        Materialize.toast($toastContent, 2000);
                        break;

                    default:
                        $toastContent = $('<span style="color: #FFB4BA">Something Broke</span>');
                        Materialize.toast($toastContent, 2000);
                        break;
                }
            }
        })
    }

    /**
     * 메모 수정 핸들러
     */
    handleEdit = (id, index, contents) => {
        return this.props.memoEditRequest(id, index, contents).then(
            () => {
                if (this.props.editStatus.get('status') === 'SUCCESS') {
                    Materialize.toast('Success!', 2000);
                } else {
                    /*
                        ERROR CODES
                            1: INVALID ID,
                            2: EMPTY CONTENTS
                            3: NOT LOGGED IN
                            4: NO RESOURCE
                            5: PERMISSION FAILURE
                     */
                    let errorMessage = [
                        'Something broke',
                        'Please write soemthing',
                        'You are not logged in',
                        'That memo does not exist anymore',
                        'You do not have permission'
                    ];

                    let error = this.props.editStatus.get('error');

                    // NOTIFY ERROR
                    let $toastContent = $(`<span style="color: #FFB4BA">` + errorMessage[error - 1] + '</span>');
                    Materialize.toast($toastContent, 2000);

                    // IF NOT LOGGED IN, REFRESH THE PAGE AFTER 2 SECONDS
                    if (error === 3) {
                        setTimeout(() => { window.location.reload(false) }, 2000);
                    }
                }
            }
        )
    }

    // *****************************************************
    // 메모 삭제
    // *****************************************************
    handleRemove = (id, index) => {
        this.props.memoRemoveRequest(id, index).then(() => {
            if (this.props.removeStatus.get('status') === 'SUCCESS') {
                // LOAD MORE MEMO IF THERE IS NO SCROLLBAR
                // 1 SECOND LATER. (ANIMATION TAKES 1SEC)
                setTimeout(() => {
                    if ($('body').height() < $(window).height()) {
                        this.loadOldMemo();
                    }
                }, 1000);
            } else {
                // ERROR
                /*
                    DELETE MEMO: DELETE /api/memo/:id
                    ERROR CODES
                        1: INVALID ID
                        2: NOT LOGGED IN
                        3: NO RESOURCE
                        4: PERMISSION FAILURE
                */
                let errorMessage = [
                    'Something broke',
                    'You are not logged in',
                    'That memo does not exist',
                    'You do not have permission'
                ];

                // NOTIFY ERROR
                let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.removeStatus.error - 1] + '</span>');
                Materialize.toast($toastContent, 2000);


                // IF NOT LOGGED IN, REFRESH THE PAGE
                if (this.props.removeStatus.error === 2) {
                    setTimeout(() => { window.location.reload(false) }, 2000);
                }
            }
        })
    }

    // *******************************************************
    // 메모 삭제 - id : 글의 아이디, index : data배열의 인덱스
    // *******************************************************
    handleStar = (id, index) => {
        this.props.memoStarRequest(id, index).then(
            () => {
                if (this.props.starStatus.get('status') !== 'SUCCESS') {
                    /*
                        TOGGLES STAR OF MEMO: POST /api/memo/star/:id
                        ERROR CODES
                            1: INVALID ID
                            2: NOT LOGGED IN
                            3: NO RESOURCE
                    */
                    let errorMessage = [
                        'Something broke',
                        'You are not logged in',
                        'That memo does not exist'
                    ];


                    // NOTIFY ERROR
                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.starStatus.get('error') - 1] + '</span>');
                    Materialize.toast($toastContent, 2000);


                    // IF NOT LOGGED IN, REFRESH THE PAGE
                    // 클라이언트에서는 로그인 상태였지만 서버에선 비로그인상태일 때
                    if (this.props.starStatus.get('error') === 2) {
                        setTimeout(() => { window.location.reload(false) }, 2000);
                    }
                }
            }
        )
    }

    /**
     * 사용자 검색 핸들러
     */
    handleSearch = (keyword) => {
        // implemented
        this.props.searchRequest(keyword);
    }

    // ****************************************************************
    // 랜더링
    // ****************************************************************

    render() {

        const { data } = this.props.memoData.toJS();
        const write = (<Write onPost={this.handlePost} />);

        // 검색 데이터가 없을 때 보여지는 뷰
        const emptyView = (
            <div className="container">
                <div className="empty-page">
                    <b>{this.props.username}</b> 님은 존재하지 않는 사용자거나 혹은 어떤 글도 남기지 않았어요 :(
                </div>
            </div>
        );

        // 담벼락 헤더
        const wallHeader = (
            <div>
                <div className="container wall-info">
                    <div className="card wall-info indigo darken-1 white-text">
                        <div className="card-content">
                            {this.props.username} 님의 담벼락
                        </div>
                    </div>
                </div>
                { this.props.memoData.get('data').size === 0 && this.state.initiallyLoaded ? emptyView : undefined }
            </div>
        );


        return (
            <div>
                <Header
                    onSearch={this.handleSearch}
                    usernames={this.props.usernames.toJS()}
                    isLoggedIn={this.props.isLoggedIn}
                    onLogout={this.handleLogout} />
                <div className="wrapper">
                    { typeof this.props.username !== 'undefined' ? wallHeader : undefined }
                    {this.props.isLoggedIn && typeof this.props.username === 'undefined' ? write : undefined}
                    <MemoList data={data}
                        currentUser={this.props.currentUser}
                        onEdit={this.handleEdit}
                        onRemove={this.handleRemove}
                        onStar={this.handleStar}
                    />
                </div>
            </div>
        );
    }
}

Home.propTypes = {
    username: PropTypes.string
}

Home.defaultProps = {
    username: undefined
}

// REDUX와 COMPONENT 연결

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.getIn(['status', 'isLoggedIn']),
        postStatus: state.memo.get('post'),
        currentUser: state.authentication.getIn(['status', 'currentUser']),
        memoData: state.memo.get('memoList'),
        listStatus: state.memo.getIn(['memoList', 'status']),
        isLast: state.memo.getIn(['memoList', 'isLast']),
        editStatus: state.memo.get('edit'),
        removeStatus: state.memo.get('remove'),
        starStatus: state.memo.get('star'),
        usernames: state.search.get('usernames')
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logoutRequest: () => {
            return dispatch(logoutRequest());
        },
        memoPostRequest: (contents) => {
            return dispatch(memoPostRequest(contents));
        },
        memoListRequest: (isInitial, listType, id, username) => {
            return dispatch(memoListRequest(isInitial, listType, id, username));
        },
        memoEditRequest: (id, index, contents) => {
            return dispatch(memoEditRequest(id, index, contents));
        },
        memoRemoveRequest: (id, index) => {
            return dispatch(memoRemoveRequest(id, index));
        },
        memoStarRequest: (id, index) => {
            return dispatch(memoStarRequest(id, index));
        },
        searchRequest: (keyword) => {
            return dispatch(searchRequest(keyword));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);