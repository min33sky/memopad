import React, { Component } from 'react';
import { Authentication } from '../components';
import { connect } from 'react-redux';
import { loginRequest } from '../actions/authentication';

const $ = window.$;
const Materialize = window.Materialize;

class Login extends Component {

    handleLogin = (id, pw) => {
        // return을 해야 authentication 컴포넌트로 true/false값을 넘겨서 authentication 컴포넌트에서 .then() 사용이 가능
        return this.props.loginRequest(id, pw).then(
            () => {
                if(this.props.status === 'SUCCESS') {
                    // CREATE SESSION DATA
                    let loginData = {
                        isLoggedIn: true,
                        username: id
                    };

                    // btoa : base64 인코딩 함수
                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                    Materialize.toast('Welcome ' + id + '!', 2000);
                    // 라우팅을 트리거(<Link>와 같은 효과)
                    this.props.history.push('/');
                    return true;
                } else {

                    let $toastContent = $('<span style="color: #a5d8ff">Incorrect username or password</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;

                }
            }
        )
    }

    render() {

        const { handleLogin } = this;

        return (
            <div>
                <Authentication mode={true} onLogin={handleLogin} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.getIn(['login', 'status'])
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => {
            return dispatch(loginRequest(id, pw));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);