import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Search } from '../components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './Header.css';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: false
        }
    }

    // TOGGLES THE SEARCH STATE
    toggleSearch = () => {
        this.setState({
            search: !this.state.search
        });
    }


    render() {

        const loginButton = (
            <li>
                <Link to="/login">
                    <i className="material-icons">vpn_key</i>
                </Link>
            </li>
        );

        const logoutButton = (
            <li>
                <a onClick={this.props.onLogout}>
                    <i className="material-icons">lock_open</i>
                </a>
            </li>
        );

        return (
            <div>
                <nav>
                    <div className="nav-wrapper indigo darken-1">
                        <Link to="/" className="brand-logo center">MEMOPAD</Link>

                        <ul>
                            <li><a onClick={ this.toggleSearch }><i className="material-icons">search</i></a></li>
                        </ul>

                        <div className="right">
                            <ul>
                                {this.props.isLoggedIn ? logoutButton : loginButton}
                            </ul>
                        </div>
                    </div>
                </nav>
                <ReactCSSTransitionGroup transitionName="search" transitionEnterTimeout={300} transitionLeaveTimeout={300} >
                    { this.state.search ?
                        <Search onClose={this.toggleSearch} onSearch={this.props.onSearch} usernames={this.props.usernames}/> : undefined }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

Header.propTypes = {
    isLoggedIn: PropTypes.bool,
    onLogout: PropTypes.func,
    onSearch: PropTypes.func,
    usernames: PropTypes.array
}

Header.defaultProps = {
    isLoggedIn: false,
    onLogout: () => { console.error("Logout Function not defined"); },
    onSearch: () => { console.error("Search Function not defined"); },
    usernames: []
}

export default Header;