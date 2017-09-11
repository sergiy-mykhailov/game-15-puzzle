
import React from 'react';
import PropTypes from 'prop-types';

import  './Unit.css';

class Unit extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick        = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.props.isStarted && !this.props.isMixing) this.props.onClick(this.props.id);
    }

    render() {
        const styleContainer = {
            left: `${this.props.left}%`,
            top: `${this.props.top}%`,
            transitionProperty: 'left, top',
            transitionDuration: '100ms'
        };
        return (
            <div className="w-25 p-1 unit-container" style={styleContainer}
                 onTransitionEnd={this.props.onTransitionEnd}
            >
                <div className="unit-inner">
                    <div className="unit-content">
                        {(this.props.isStarted && !this.props.isMixing)

                            ? <button
                                type="button"
                                onClick={ this.handleClick}
                                className="btn btn-outline-primary w-100 h-100">
                                {this.props.title}
                            </button>

                            : <button
                                type="button"
                                onClick={ this.handleClick}
                                disabled
                                className="btn btn-outline-primary w-100 h-100 disabled">
                                {this.props.title}
                            </button>
                        }
                    </div>
                </div>

            </div>
        );
    }
}

Unit.propTypes = {
    id:                 PropTypes.number.isRequired,
    isStarted:          PropTypes.bool.isRequired,
    isMixing:           PropTypes.bool.isRequired,
    left:               PropTypes.number.isRequired,
    top:                PropTypes.number.isRequired,
    onTransitionEnd:    PropTypes.func.isRequired,
    onClick:            PropTypes.func.isRequired,
    title:              PropTypes.number.isRequired
};

export default Unit;
