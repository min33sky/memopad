import React, { Component } from 'react';
import { Memo } from '../components';
import PropTypes from 'prop-types';

class MemoList extends Component {

    render() {
        const mapToComponents = data => {

            // console.log("시발 :", data);
            return data.map((memo, i) => {
                return (<Memo
                            data={memo}
                            ownership={ memo.writer === this.props.currentUser}
                            key={memo._id}
                            index={i}
                            onEdit={this.props.onEdit}
                        />);
            })
        }

        return (
            <div>
                {mapToComponents(this.props.data)}
            </div>
        );
    }
}

MemoList.propTypes = {
    data: PropTypes.array,
    currentUser: PropTypes.string,
    onEdit: PropTypes.func
};

MemoList.defaultProps = {
    data: [],
    currentUser: '',
    onEdit: (id, index, contents) => {
        console.error('Edit funtion not defined');
    }
}

export default MemoList;