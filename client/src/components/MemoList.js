import React, { Component } from 'react';
import { Memo } from '../components';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // Component Animation
import './MemoList.css';

class MemoList extends Component {

    // 전달받은 props값이 변경될 때만 render() 실행
    shouldComponentUpdate(nextProps, nextState) {
        let update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
        return update;
    }

    render() {

        const mapToComponents = data => {

            return data.map((memo, i) => {
                return (<Memo
                            data={memo}
                            ownership={ memo.writer === this.props.currentUser}
                            key={memo._id}
                            index={i}
                            onEdit={this.props.onEdit}
                            onRemove={this.props.onRemove}
                            onStar={this.props.onStar}
                            currentUser={this.props.currentUser}
                        />);
            })
        }

        return (
            <div>
                <ReactCSSTransitionGroup
                    transitionName="memo"
                    transitionEnterTimeout={2000}
                    transitionLeaveTimeout={1000}>
                        {mapToComponents(this.props.data)}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

MemoList.propTypes = {
    data: PropTypes.array,
    currentUser: PropTypes.string,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onStar: PropTypes.func
};

MemoList.defaultProps = {
    data: [],
    currentUser: '',
    onEdit: (id, index, contents) => {
        console.error('Edit funtion not defined');
    },
    onRemove: (id, index) => {
        console.error('Remove function not defined');
    },
    onStar: (id, index) => {
        console.error('Star function not defined');
    }
}

export default MemoList;