
import React from 'react';
import PropTypes from 'prop-types';

import  './Unit.css';
import  './GameFonts.css';

class Unit extends React.Component {
    constructor(props) {
        super(props);
        this._getUnitClassName = this._getUnitClassName.bind(this);
    }

    _getUnitClassName() {
        let className = '';
        className += (this.props.id === 0) ? ' invisible' : '';
        className += (this.props.isStarted) ? '' : ' disabled';
        return className;
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
                        <button
                            type="button"
                            onClick={ this.props.onClick.bind(null, this.props.id)}
                            className={"btn btn-outline-primary w-100 h-100 main-font" + this._getUnitClassName()}>
                            {this.props.title}
                        </button>
                    </div>
                </div>

            </div>
        );
    }
}

Unit.propTypes = {
    id:                 PropTypes.number.isRequired,
    isStarted:          PropTypes.bool.isRequired,
    left:               PropTypes.number.isRequired,
    top:                PropTypes.number.isRequired,
    onTransitionEnd:    PropTypes.func.isRequired,
    onClick:            PropTypes.func.isRequired,
    title:              PropTypes.number.isRequired
};

export default Unit;
