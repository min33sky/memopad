import React, { Component } from 'react';
import { Home } from '../containers';

/**
 * 특정 유저의 게시글만 보여주는 컴포넌트
 */
class Wall extends Component {

    // 클라이언트 라우팅 this.props.match.params.username

    render() {
        return (
            <div>
                <Home username={this.props.match.params.username} />
            </div>
        );
    }
}

export default Wall;