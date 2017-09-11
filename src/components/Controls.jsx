
import React from 'react';
import PropTypes from 'prop-types';

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
                <div className="game-control col-3 px-2">
                    {this.props.isStarted
                        ? <button
                            type="button"
                            className="btn btn-outline-info w-100"
                            onClick={this.props.onReset}
                            data-toggle="modal" data-target="#modal-reset"
                        >
                            Reset
                        </button>
                        : <button
                            type="button"
                            className="btn btn-outline-success w-100"
                            onClick={this.props.onStart}
                        >
                            Start
                        </button>
                    }
                </div>

                <div className="game-info col-9 px-2">
                    <div className="row">
                        <div className="col-lg-6 col-sm-12 text-primary px-1">
                            <span>
                                Score:
                                <span className="badge badge-pill badge-warning mx-1">
                                    {this.props.score}
                                </span>
                            </span>
                            <span>
                                Level:
                                <span className="badge badge-pill badge-warning mx-1">
                                    {this.props.level}
                                </span>
                            </span>
                        </div>

                        <div className="col-lg-6  col-sm-12 text-secondary px-1 my-auto">
                            <span>Played games: {this.props.playedGames.length}</span>
                            <span className="mx-1">(wins: {this.getWinsNumber()})</span>
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
