import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Write.css';

// 메모 글 남기기 컴포넌트
class Write extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contents: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            contents: e.target.value
        });
    }

    handlePost = () => {
        let contents = this.state.contents;

        this.props.onPost(contents).then(
            () => {
                this.setState({
                    contents: ''
                });
            }
        )
    }


    render() {
        return (
            <div className="container write">
                <div className="card">
                    <div className="card-content">
                        <textarea className="materialize-textarea"
                                placeholder="Write down your memo"
                                onChange={this.handleChange}
                                value={this.state.contents}/>
                    </div>
                    <div className="card-action">
                        <a onClick={this.handlePost}>POST</a>
                    </div>
                </div>
            </div>
        );
    }
}

Write.propTypes = {
    onPost: PropTypes.func
}

Write.defaultProps = {
    onPost: (contents) => { console.error("Post Function not defined")}
}

export default Write;