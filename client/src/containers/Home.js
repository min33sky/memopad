import React, { Component } from 'react';
import { Header, Write } from '../components';
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

        const write = (<Write />);

        return (
            <div>
                <Header isLoggedIn={this.props.isLoggedIn} onLogout={this.handleLogout}/>
                {this.props.isLoggedIn ? write : undefined }
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