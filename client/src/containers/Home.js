import React, { Component } from 'react';
import { Header, Write, MemoList } from '../components';
import { connect } from 'react-redux';
import { logoutRequest } from '../actions/authentication';
import { memoPostRequest, memoListRequest } from '../actions/memo';
import './Home.css';

const Materialize = window.Materialize;
const $ = window.$;

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingState: false
        }
    }


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
            if($('body').height() < $(window).height()) {
                this.loadOldMemo().then(
                    () => {
                        // DO THIS RECURSIVELY UNLESS IT'S LAST PAGE
                        if(!this.props.isLast){
                            loadUntilScrollable();
                        }
                    }
                )
            }
        }

        this.props.memoListRequest(true).then(
            () => {

                loadUntilScrollable();
                // BEGIN NEW MEMO LOADING LOOP
                loadMemoLoop();
            }
        );

        $(window).scroll(() => {
            // WHEN HEIGHT UNDER SCROLLBOTTOM IS LESS THEN 250
            if($(document).height() - $(window).height() - $(window).scrollTop() < 250) {
                if(!this.state.loadingState) {
                    this.loadOldMemo(); // 이전 메모를 불러온다.
                    this.setState({
                        loadingState: true
                    });
                }
            } else {
                if(this.state.loadingState) {
                    this.setState({
                        loadingState: false
                    })
                }
            }
        })
    }

    componentWillUnmount() {
        // STOPS THE loadMemoLoop
        clearTimeout(this.memoLoaderTimeoutId);

        // REMOVE WINDOWS SCROLL LISTENER
        $(window).unbind();
    }

    // 최신 메모 불러오기
    loadNewMemo = () => {
        // CANCEL IF THERE IS A PENDING REQUEST
        if(this.props.listStatus === 'WAITING'){
            console.log("================기 다 려=================");
            return new Promise((resolve, reject) => {
                resolve();
            })
        }

        // IF PAGE IS EMPTY, DO THE INITIAL LOADING
        if(this.props.memoData.get('data').length === 0)
            return this.props.memoListRequest(true);

        return this.props.memoListRequest(false, 'new', this.props.memoData.get('data')[0]._id);
        // return this.props.memoListRequest(true);
    }

    // 오래된 메모 불러오기
    loadOldMemo = () => {
        // CANCEL IF USER IS READING THE LAST PAGE
        if(this.props.isLast) {
            return new Promise(
                (resolve, reject) => {
                    resolve();
                }
            )
        }

        // GET ID OF THE MEMO AT THE BOTTOM
        let lastId = this.props.memoData.get('data')[this.props.memoData.get('data').length - 1]._id;

        // START REQUEST
        return this.props.memoListRequest(false, 'old', lastId).then(() => {
            // IF IT IS LAST PAGE, NOTIFY
            if(this.props.isLast) {
                Materialize.toast('마지막 페이지 :)', 2000);
            }
        })
    }



    // 로그아웃
    handleLogout = () => {
        this.props.logoutRequest()
            .then(() => {
                Materialize.toast('Good Bye!!!', 2000);

                // EMPTIES THE SESSION
                let loginData = {
                    isLoggedIn: false,
                    username: ''
                };

                document.cookie = 'key=' + btoa(JSON.stringify(loginData));
            });
    }


    // 메모 쓰기
    handlePost = (contents) => {
        return this.props.memoPostRequest(contents).then(() => {
            if(this.props.postStatus.get('status') === 'SUCCESS') {
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
                switch(this.props.postStatus.get('error')) {
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

    render() {

        const { data } = this.props.memoData.toJS();

        const write = (<Write onPost={this.handlePost}/>);

        return (
            <div>
                <Header isLoggedIn={this.props.isLoggedIn} onLogout={this.handleLogout} />
                <div className="wrapper">
                    {this.props.isLoggedIn ? write : undefined}
                    <MemoList data={data} currentUser={this.props.currentUser} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.getIn(['status', 'isLoggedIn']),
        postStatus: state.memo.get('post'),
        currentUser: state.authentication.getIn(['status', 'currentUser']),
        memoData: state.memo.get('memoList'),
        listStatus: state.memo.getIn(['memoList', 'status']),
        isLast: state.memo.getIn(['memoList', 'isLast'])
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);