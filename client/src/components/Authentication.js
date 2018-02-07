import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Authentication.css';

/**
 * 인증 관련 컴포넌트 (로그인, 회원가입)
 */
class Authentication extends Component {
    render() {

        const { mode } = this.props;

        const inputBoxes = (
            <div>
                <div className="input-field col s12 username">
                    <label>Username</label>
                    <input
                    name="username"
                    type="text"
                    className="validate"/>
                </div>
                <div className="input-field col s12">
                    <label>Password</label>
                    <input
                    name="password"
                    type="password"
                    className="validate"/>
                </div>
            </div>
        );

        const loginView = (
            <div>
                <div className="card-content">
                    <div className="row">
                        { inputBoxes }
                        <a className="waves-effect waves-light btn">SUBMIT</a>
                    </div>
                </div>

                <div className="footer">
                    <div className="card-content">
                        <div className="right">
                            New Here? <Link to="/register">Create an account</Link>
                        </div>
                    </div>
                </div>
            </div>
        );

        const registerView = (
            <div className="card-content">
                <div className="row">
                    { inputBoxes }
                    <a className="waves-effect waves-light btn">CREATE</a>
                </div>
            </div>
        );

        return (
            <div className="container auth">
                <Link className="logo" to="/">MEMOPAD</Link>
                <div className="card">
                    <div className="header blue white-text center">
                        <div className="card-content">
                            {mode ? "LOGIN" : "REGISTER" }
                        </div>
                    </div>
                    {mode ? loginView : registerView}
                </div>
            </div>
        );
    }
}

/**
 * mode - true(Login), false(register)
 */
Authentication.propTypes = {
    mode: PropTypes.bool,
    onLogin: PropTypes.func,
    onRegister: PropTypes.func
}

Authentication.defaultProps = {
    mode: true,
    onLogin: (id, pw) => { console.error("Login Function not defined")},
    onRegister: (id, pw) => { console.error("Register Function not defined")}
}

export default Authentication;