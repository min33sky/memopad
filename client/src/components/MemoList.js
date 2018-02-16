import React, { Component } from 'react';
import { Memo } from '../components';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // Component Animation
import './MemoList.css';

class MemoList extends Component {

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
                        />);
            })
        }

        return (
            <div>
                <ReactCSSTransitionGroup
                    transitionName="memo"
                    transitionEnterTimeout={2000}
                    transitionLeaveTimeout={1000}
                >
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
    onRemove: PropTypes.func
};

MemoList.defaultProps = {
    data: [],
    currentUser: '',
    onEdit: (id, index, contents) => {
        console.error('Edit funtion not defined');
    },
    onRemove: (id, index) => {
        console.error('Remove function not defined');
    }
}

export default MemoList;