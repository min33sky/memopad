import React, { Component } from 'react';
// withRouter로 상위 컴포넌트로부터 history props를 가져올 수 있다.
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Search.css';


/**
 * 사용자 검색 컴포넌트
 */
class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keyword: ''
        }

        document.onkeydown = this.listenEscKey;
    }

    // LISTEN ESC KEY, CLOSE IF PRESSED
    listenEscKey = (event) => {
        event = event || window.event;
        // if(event.keyCode === 27) {   // event.key == 'Escape'
        if(event.key === 'Escape') {   // event.key == 'Escape'
            this.handleClose();
        }
    }

    // 종료 핸들러
    handleClose = () => {
        this.handleSearch('');  //  검색어 초기화
        document.onkeydown = null; // 키 이벤트 종료
        this.props.onClose();
    }

    // 인풋 핸들러
    handleChange = (e) => {
        this.setState({
            keyword: e.target.value
        });
        this.handleSearch(e.target.value);
    }

    // 검색 핸들러
    handleSearch = (keyword) => {
        this.props.onSearch(keyword);
    }

    // 엔터키로 첫번째 출력되는 유저 검색하기
    handleKeyDown = (e) => {
        // IF PRESSED ENTER, TRIGGER TO NAVIGATE TO THE FIRST USER SHOWN
        if(e.key === 'Enter') {
            if(this.props.usernames.length > 0) {
                this.props.history.push('/wall/' + this.props.usernames[0].username);
                this.handleClose();
            }
        }
    }

    render() {


        // 검색된 사용자들을 각각 링크 형태로 출력해준다.
        const mapDataToLinks = (data) => {
            // map data array to array of LINK components
            // create LINKS to '/wall/:username'
            console.log("데이터 : ", data);
            return data.map((user, i) => {
                return (
                    <Link
                        to={`/wall/${user.username}`}
                        onClick={this.handleSearch}
                        key={i}>
                        {user.username}
                    </Link>);
            });
        };

        return (
            <div className="search-screen white-text">
                <div className="right">
                    <a className="waves-effect waves-light btn red lighten-1"
                        onClick={this.handleClose}>CLOSE</a>
                </div>
                <div className="container">
                    <input
                        placeholder="Search a user"
                        value={this.state.keyword}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                    />
                    <ul className="search-results">
                        { mapDataToLinks(this.props.usernames) }
                    </ul>
                </div>
            </div>

        );
    }
}

Search.propTypes = {
    onClose: PropTypes.func,
    onSearch: PropTypes.func,
    usernames: PropTypes.array
}

Search.defaultProps = {
    onClose: () => {
        console.error('onClose not defined');
    },
    onSearch: () => {
        console.error('onSearch not defined');
    },
    usernames: []
}

// withRouter 사용해서 history 함수를 이용한다.
export default withRouter(Search);