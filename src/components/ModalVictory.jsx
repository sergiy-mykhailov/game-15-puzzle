
import React from 'react';
import PropTypes from 'prop-types';

import  './GameFonts.css';

class ModalVictory extends React.Component {
    render() {
        return (
            <div className="modal fade modal-victory" role="dialog" >
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content  border-success">

                        <div className="modal-header border-success">
                            <h1 className="display-4 modal-title text-center w-100">
                                <span className="text-success main-font">
                                    {this.props.title}
                                </span>
                            </h1>
                        </div>

                        <div className="modal-footer border-success">

                            <button
                                type="button"
                                className="btn btn-outline-success"
                                data-dismiss="modal"
                                onClick={ this.props.onClose}>

                                Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

ModalVictory.propTypes = {
    onClose:    PropTypes.func,
    title:      PropTypes.string.isRequired
};

export default ModalVictory;

