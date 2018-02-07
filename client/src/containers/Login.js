import React, { Component } from 'react';
import { Authentication } from '../components';
import { connect } from 'react-redux';
import { loginRequest } from '../actions/authentication';

class Login extends Component {

    handleLogin = (id, pw) => {
        return this.props.loginRequest(id, pw).then(
            () => {
                if(this.props.status === 'SUCCESS') {
                    // CREATE SESSION DATA
                    let loginData = {
                        isLoggedIn: true,
                        username: id
                    };

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                    window.Materialize.toast('Welcome ' + id + '!', 2000);
                    this.props.history.push('/');
                    return true;
                } else {
                    // let $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
                    window.Materialize.toast('Error', 2000);
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