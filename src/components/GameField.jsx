
import React from 'react';
import PropTypes from 'prop-types';

import Unit from './Unit.jsx';

import  './GameField.css';

class GameField extends React.Component {

    render() {
        return (
            <div className="w-100 p-1">
                <div className="game-field-container" >
                    <div className="game-field-content" >

                        {this.props.positionsArray.map((item, i) => {
                            if (i === 0) return;
                            return (
                                <Unit
                                    key={i}
                                    id={i}
                                    title={i}
                                    left={item.left}
                                    top={item.top}
                                    onClick={this.props.onClick}
                                    onTransitionEnd={this.props.onTransitionEnd}
                                    isStarted={this.props.isStarted}
                                />
                            );
                        })}

                    </div>
                </div>
            </div>
        );
    }
}

GameField.propTypes = {
    positionsArray:     PropTypes.array.isRequired,
    onClick:            PropTypes.func.isRequired,
    onTransitionEnd:    PropTypes.func.isRequired,
    isStarted:          PropTypes.bool.isRequired,
};

export default GameField;

