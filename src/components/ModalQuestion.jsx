
import React from 'react';
import PropTypes from 'prop-types';

class ModalQuestion extends React.Component {
    render() {
        return (
            <div className="modal fade modal-question" role="dialog" >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                {this.props.title}
                            </h5>
                        </div>

                        <div className="modal-body">
                            <p>{this.props.text}</p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-dismiss="modal"
                                onClick={ this.props.onYes}>
                                Yes
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                                onClick={ this.props.onNo}>
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
    text:   PropTypes.string
};

export default ModalQuestion;

