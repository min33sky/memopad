import React, { Component } from 'react';
import { Header, Write } from '../components';
import { connect } from 'react-redux';
import { logoutRequest } from '../actions/authentication';
import { memoPostRequest } from '../actions/memo';
import './Home.css';

const Materialize = window.Materialize;
const $ = window.$;

class Home extends Component {

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
                Materialize.toast('Success!', 2000);
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

        const write = (<Write onPost={this.handlePost}/>);

        return (
            <div>
                <Header isLoggedIn={this.props.isLoggedIn} onLogout={this.handleLogout} />
                <div className="wrapper">
                    {this.props.isLoggedIn ? write : undefined}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.getIn(['status', 'isLoggedIn']),
        postStatus: state.memo.get('post')
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logoutRequest: () => {
            return dispatch(logoutRequest());
        },
        memoPostRequest: (contents) => {
            return dispatch(memoPostRequest(contents));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);