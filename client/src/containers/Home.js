import React, { Component } from 'react';
import Header from '../components/Header';
import { connect } from 'react-redux';
import { logoutRequest } from '../actions/authentication';

const Materialize = window.Materialize;

class Home extends Component {

    handleLogout = () => {
        this.props.logoutRequest()
            .then(() => {
                Materialize.toast('Good Bye!!!', 2000);

                // EMPTIES THE SESSION
                let loginData = {
                    isLoggedIn: false,
                    usernaem: ''
                };

                document.cookie = 'key=' + btoa(JSON.stringify(loginData));
            });
    }

    render() {
        return (
            <div>
                <Header isLoggedIn={this.props.isLoggedIn} onLogout={this.handleLogout}/>
                Home
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.getIn(['status', 'isLoggedIn'])
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logoutRequest: () => {
            return dispatch(logoutRequest());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);