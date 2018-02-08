import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatusRequest } from '../actions/authentication';
import './App.css';

const $ = window.$;
const Materialize = window.Materialize;

class App extends Component {

  /**
   * 새로고침 시 세션 유지 확인
   */
  componentDidMount() {

    console.log('cookie ===> ', document.cookie);

    // GET COOKIE BY NAME
    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");

      if (parts.length === 2) return parts.pop().split(";").shift();
    }

    // get LoginData from cookie
    let loginData = getCookie('key');

    console.log('loginData ==> ', loginData);

    // if LoginData is undefined, do nothing
    if(typeof loginData === 'undefined') return;

    // decode base64 & parse json
    loginData = JSON.parse(atob(loginData));


    // if not Logged In, do nothing
    if(!loginData.isLoggedIn) return;

    // page refreshed & has a session in cookie,
    // check whether this cookie is valid or not
    this.props.getStatusRequest().then(
      () => {
        console.log(this.props.status);

        // if session is not valid
        if(!this.props.status.get('valid')) {
          // Logout the session
          loginData = {
            isLoggedIn: false,
            username: ''
          };

          document.cookie = 'key=' + btoa(JSON.stringify(loginData));

          // and notify
          const $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please log in again</span>');
          Materialize.toast($toastContent, 4000);
        }

      }
    )

  }




  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    status: state.authentication.get('status')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
