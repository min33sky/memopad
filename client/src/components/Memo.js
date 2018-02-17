import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import './Memo.css';

const $ = window.$;

class Memo extends Component {


    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            value: this.props.data.contents
        }
    }

    componentDidMount() {
        // WHEN COMPONENT MOUNTS, INITIALIZE DROPDOWN
        // (TRIGGERED WHEN FREFRESHED)
        $(`#dropdown-button-` + this.props.data._id).dropdown({
            belowOrigin: true // Display dropdown below the button
        });
    }

    componentDidUpdate() {
        // WHEN COMPONENT UPDATES, INITIALIZE DROPDOWN
        // (TRIGGERED WHEN LOGGED IN)
        $(`#dropdown-button-` + this.props.data._id).dropdown({
            beloworigin: true // Display dropdown below the button
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        let current = {
            props: this.props,
            state: this.state
        };

        let next = {
            props: nextProps,
            state: nextState
        }

        let update = JSON.stringify(current) !== JSON.stringify(next);

        return update;
    }

    // Edit Toggle handler
    toggleEdit = () => {

        if(this.state.editMode) {
            let id = this.props.data._id;
            let index = this.props.index;
            let contents = this.state.value;

            this.props.onEdit(id, index, contents).then(() => {
                this.setState({
                    editMode: !this.state.editMode
                })
            })
        } else {
            this.setState({
                editMode: !this.state.editMode
            })
        }

    }

    // Text Input handler
    handleChange = (e) => {
        this.setState({
            value: e.target.value
        });
    }

    // 삭제 핸들러
    handleRemove = () => {
        let id = this.props.data._id;
        let index = this.props.index;
        this.props.onRemove(id, index);
    }

    /**
     * 별점 핸들러
     */
    handleStar = () => {
        // 로그인 상태가 아닐 때
        if(this.props.currentUser === ''){
            let $toastContent = $('<span style="color: #FFB4BA">로그인이 필요해요 :)</span>');
            window.Materialize.toast($toastContent, 2000);
            return;
        }


        let id = this.props.data._id;
        let index = this.props.index;
        this.props.onStar(id, index);
    }

    render() {

        // IF IT IS STARRED (CHECKS WHETHER THE USERNAME EXISTS IN THE ARRAY)
        // RETURN STYLE THAT HAS A YELLOW COLOR
        let starStyle = (this.props.data.starred.indexOf(this.props.currentUser) > -1) ? { color: '#FF9980' } : {};

        const { data, ownership } = this.props;

        // DROP-DOWN MENU
        const dropDownMenu = (
            <div className="option-button">
                <a className="dropdown-button"
                    id={`dropdown-button-${data._id}`}
                    data-activates={`dropdown-${data._id}`}>
                    <i className="material-icons icon-button">more_vert</i>
                </a>
                <ul id={`dropdown-${data._id}`} className="dropdown-content">
                    <li><a onClick={this.toggleEdit}>Edit</a></li>
                    <li><a onClick={this.handleRemove}>Remove</a></li>
                </ul>
            </div>
        );

        // EDITED INFO
        let editedInfo = (
            <span style={{color: '#AAB5BC'}}>· Edited <TimeAgo date={data.date.edited} live={true}/></span>
        )


        /**
         * MEMO VIEW (editMode = false)
         */
        const memoView = (
            <div className="card">
                    <div className="info">
                        <a className="username">{data.writer}</a> wrote a log · <TimeAgo date={this.props.data.date.created}/>
                        { data.is_edited ? editedInfo : undefined}
                        { ownership ? dropDownMenu : undefined }
                    </div>
                    <div className="card-content">
                        {data.contents}
                    </div>
                    <div className="footer">
                        <i
                            className="material-icons log-footer-icon star icon-button"
                            style={starStyle}
                            onClick={this.handleStar}>star</i>
                        <span className="star-count">{data.starred.length}</span>
                    </div>
                </div>
        );

        /**
         * EDIT VIEW (editMode = true)
         */
        const editView = (
            <div className="write">
                <div className="card">
                    <div className="card-content">
                        <textarea
                            className="materialize-textarea"
                            value={this.state.value}
                            onChange={this.handleChange}>
                        </textarea>
                    </div>
                    <div className="card-action">
                        <a onClick={this.toggleEdit}>OK</a>
                    </div>
                </div>
            </div>
        )

        return (
            <div className="container memo">
                { this.state.editMode ? editView : memoView }
            </div>
        );
    }
}

Memo.propTypes = {
    data: PropTypes.object,
    ownership: PropTypes.bool,
    onEdit: PropTypes.func,
    index: PropTypes.number,
    onRemove: PropTypes.func,
    onStar: PropTypes.func,
    currentUser: PropTypes.string
};

Memo.defaultProps = {
    data: {
        _id: 'id1234567890',
        writer: 'Writer',
        contents: 'Contents',
        is_edited: false,
        date: {
            edited: new Date(),
            created: new Date()
        },
        starred: []
    },
    ownership: true,
    onEdit: (id, index, contents) => {
        console.error('onEdit function not defined');
    },
    index: -1,
    onRemove: (id, index) => {
        console.error('Remove function not defined');
    },
    onStar: (id, index) => {
        console.error('Star function not defined');
    },
    currentUser: ''
}

export default Memo;