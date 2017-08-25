
import React from 'react';
import PropTypes from 'prop-types';

import  './Controls.css';

class Controls extends React.Component {
    constructor(props) {
        super(props);
        this.getWinsNumber = this.getWinsNumber.bind(this);
    }

    getWinsNumber() {
        if (this.props.playedGames.length === 0) return 0;
        let arr = this.props.playedGames.filter((item) => {
           return (!!item.win);
        });
        return arr.length;
    }

    render() {
        return (
            <div className="row">
                <div className="game-control col-2 px-2">
                    {this.props.isStarted
                        ? <button
                            type="button"
                            className="btn btn-outline-info"
                            onClick={this.props.onReset}
                            data-toggle="modal" data-target="#modal-reset"
                        >
                            Reset
                        </button>
                        : <button
                            type="button"
                            className="btn btn-outline-success"
                            onClick={this.props.onStart}
                        >
                            Start
                        </button>
                    }
                </div>

                <div className="game-info col-10 px-2">
                    <div className="row">
                        <div className="col-6 text-primary text-right px-1">
                            Score:&#160;
                            <span className="badge badge-pill badge-warning">
                                {this.props.score}
                            </span>
                            &#160; Level:&#160;
                            <span className="badge badge-pill badge-warning">
                                {this.props.level}
                            </span>
                        </div>

                        <div className="col-6 text-secondary text-left px-1">
                            Played games: {this.props.playedGames.length}
                            &#160;( wins: {this.getWinsNumber()} )
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Controls.propTypes = {
    isStarted:      PropTypes.bool.isRequired,
    onReset:        PropTypes.func,
    onStart:        PropTypes.func,
    level:          PropTypes.number,
    score:          PropTypes.number,
    playedGames:    PropTypes.array
};

export default Controls;
