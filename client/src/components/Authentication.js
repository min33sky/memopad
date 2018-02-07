import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Authentication.css';

/**
 * 인증 관련 컴포넌트 (로그인, 회원가입)
 */
class Authentication extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    handleChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleLogin = () => {
        let id = this.state.username;
        let pw = this.state.password;

        this.props.onLogin(id, pw).then(
            (success) => {
                if(!success) {
                    this.setState({
                        password: ''
                    });
                }
            }
        )
    }

    render() {

        const { mode } = this.props;
        const { username, password } = this.state;
        const { handleChange, handleLogin } = this;


        const inputBoxes = (
            <div>
                <div className="input-field col s12 username">
                    <label>Username</label>
                    <input
                    name="username"
                    type="text"
                    className="validate"
                    onChange={handleChange}
                    value={username}
                    />
                </div>
                <div className="input-field col s12">
                    <label>Password</label>
                    <input
                    name="password"
                    type="password"
                    className="validate"
                    onChange={handleChange}
                    value={password}
                    />
                </div>
            </div>
        );

        const loginView = (
            <div>
                <div className="card-content">
                    <div className="row">
                        { inputBoxes }
                        <a className="waves-effect waves-light btn"
                            onClick={handleLogin}>SUBMIT</a>
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