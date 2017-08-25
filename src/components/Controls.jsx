
import React from 'react';
import PropTypes from 'prop-types';

class Controls extends React.Component {
    constructor(props) {
        super(props);
        this.getWinsNumber = this.getWinsNumber.bind(this);
    }

    getWinsNumber() {
        if (this.props.playedGames.length === 0) return 0;
        let arr =this.props.playedGames.filter((item) => {
           return (!!item.win);
        });
        return arr.length;
    }

    render() {
        return (
            <div className="">
                {this.props.isStarted
                    ? <button
                        type="button"
                        className="btn btn-outline-info"
                        onClick={this.props.onReset}
                        data-toggle="modal" data-target=".modal-question"
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

                <div className="game-info float-right mt-1">
                    <span className="h5 text-primary">
                        Score:
                        <span className="badge badge-pill badge-warning">
                            {this.props.score}
                        </span>
                        &#160; Level:
                        <span className="badge badge-pill badge-warning">
                            {this.props.level}
                        </span>
                    </span>

                    <span className="text-secondary">
                        <small>
                            &#160; Played games: {this.props.playedGames.length}
                            &#160;( wins: {this.getWinsNumber()} )
                        </small>
                    </span>
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
