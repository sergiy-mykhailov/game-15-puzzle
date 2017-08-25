
import React from 'react';
import PropTypes from 'prop-types';

class ModalQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textInput: this.props.textInput
        };
        this.handleChange   = this.handleChange.bind(this);
        this.handleYes      = this.handleYes.bind(this);
        this.handleNo       = this.handleNo.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.enableInput) {
            if (nextProps.textInput !== this.state.textInput) {
                this.setState({
                    textInput: nextProps.textInput
                });
            }
        }
    }

    handleChange(event) {
        if (this.props.enableInput) {
            this.setState({
                textInput: event.target.value
            });
        }
    }

    handleYes(event) {
        if (this.props.onYes) {
            this.props.onYes(this.state.textInput, event);
        }
    }

    handleNo(event) {
        if (this.props.onNo) this.props.onNo(event);
    }

    render() {
        return (
            <div className="modal fade" id={this.props.id} role="dialog" >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                {this.props.title}
                            </h5>
                        </div>

                        <div className="modal-body">
                            <p>{this.props.text}</p>
                            {this.props.enableInput
                                ? <div className="input-group">
                                    <span className="input-group-addon">
                                        {this.props.labelInput}
                                    </span>
                                    <input type="text"
                                           className="form-control"
                                           value={this.state.textInput}
                                           onChange={this.handleChange}/>
                                </div>
                                : ''
                             }
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-dismiss="modal"
                                onClick={this.handleYes}>
                                Yes
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                                onClick={this.handleNo}>
                                No
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

ModalQuestion.propTypes = {
    onYes:  PropTypes.func,
    onNo:   PropTypes.func,
    title:  PropTypes.string,
    text:   PropTypes.string,
    enableInput:    PropTypes.bool,
    labelInput:     PropTypes.string,
    textInput:      PropTypes.string
};

export default ModalQuestion;

