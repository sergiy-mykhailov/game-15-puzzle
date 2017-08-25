
import React from 'react';
import PropTypes from 'prop-types';

import Controls from './Controls.jsx';
import GameField from './GameField.jsx';
import ModalQuestion from './ModalQuestion.jsx';
import ModalVictory from './ModalVictory.jsx';

class GameFifteen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameArray:          this.getNewGameArray(),
            positionsArray:     [],
            queue:              [],
            unitSize:           25,
            stepLevel:          5,
            isStarted:          false,
            isResetting:        false,
            saves:              this.getEmptySaves(),
            level:              0,
            score:              0
        };

        this.getNewGameArray    = this.getNewGameArray.bind(this);
        this.getPositions       = this.getPositions.bind(this);
        this.getEmptySaves      = this.getEmptySaves.bind(this);
        this.saveResults        = this.saveResults.bind(this);

        this.getCurrentCoordinates  = this.getCurrentCoordinates.bind(this);
        this.getNewCoordinates      = this.getNewCoordinates.bind(this);
        this.swapElements           = this.swapElements.bind(this);
        this.getNewPosition         = this.getNewPosition.bind(this);
        this.changePositions        = this.changePositions.bind(this);

        this.getAdjacentUnits       = this.getAdjacentUnits.bind(this);
        this.randomInRange          = this.randomInRange.bind(this);
        this.getRandomUnitId        = this.getRandomUnitId.bind(this);
        this.mixUnits               = this.mixUnits.bind(this);
        this.checkForVictory        = this.checkForVictory.bind(this);
        this.resetGame              = this.resetGame.bind(this);

        this.handleStart            = this.handleStart.bind(this);
        this.handleReset            = this.handleReset.bind(this);
        this.handleUnitClick        = this.handleUnitClick.bind(this);
        this.handleTransitionEnd    = this.handleTransitionEnd.bind(this);

    }

    componentWillMount() {

        let saves = JSON.parse(localStorage.getItem('game-15-puzzle'));
        if (!saves) {
            saves = this.getEmptySaves();
            localStorage.setItem('game-15-puzzle', JSON.stringify(saves));
        }

        let level = (saves.currentLevel === 0) ? this.state.stepLevel : saves.currentLevel;

        this.setState({
            saves:          saves,
            level:          level,
            positionsArray: this.getPositions(this.state.gameArray)
        });
    }

    componentWillUnmount() {
        // save results
        this.saveResults(!this.state.isStarted);
    }

    getNewGameArray() {
        return [[0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15]];
    }

    getEmptySaves() {
        return { currentLevel: 0, playedGames: [] };
    }

    getPositions(gameArray) {
        const unitSize = this.state.unitSize;
        let positionsArray = [];

        gameArray.forEach((arr, i) => {
            let top = i * unitSize;

            arr.forEach((item, j) => {
               let left = j * unitSize;

                positionsArray[item] = { top, left };

            });
        });
        return positionsArray;
    }

    getCurrentCoordinates(id) {
        let coordinates = null;

        for (let y = 0; y < this.state.gameArray.length; y++) {

            let x = this.state.gameArray[y].indexOf(id);
            if (x === -1) continue;

            coordinates = { x, y } ;
            break;
        }

        return coordinates;
    }

    getAdjacentUnits(currentC, filterFunc) {
        let arr = [];

        arr.push({ direction: "left",   x: (currentC.x - 1), y: currentC.y });
        arr.push({ direction: "right",  x: (currentC.x + 1), y: currentC.y });
        arr.push({ direction: "up",     x: currentC.x,       y: (currentC.y - 1) });
        arr.push({ direction: "down",   x: currentC.x,       y: (currentC.y + 1) });

        return arr.filter((item) => {

            const itemInRange = ((0 <= item.x) && (item.x < this.state.gameArray.length)
                && (0 <= item.y) && (item.y < this.state.gameArray.length));

            switch (filterFunc) {
                case "zeroFilter":
                    return itemInRange && (this.state.gameArray[item.y][item.x] === 0);
                    break;
                case "notZeroFilter":
                    return itemInRange && (this.state.gameArray[item.y][item.x] !== 0);
                    break;
                default:
                    return;
            }

        });
    }

    getNewCoordinates(currentC) {

        let adjacentUnits   = this.getAdjacentUnits(currentC, 'zeroFilter');

        return adjacentUnits.length === 0 ? null : adjacentUnits[0];
    }

    swapElements(currentC, newC) {

        let gameArray = this.state.gameArray;
        const buffer = gameArray[currentC.y][currentC.x];

        gameArray[currentC.y][currentC.x]   = gameArray[newC.y][newC.x];
        gameArray[newC.y][newC.x]           = buffer;

        this.setState({
            gameArray:      gameArray
        });
    }

    getNewPosition(id, newC, posArray) {

        let top         = posArray[id].top;
        let left        = posArray[id].left;
        const unitSize  = this.state.unitSize;

        switch (newC.direction){
            case "up":
                top = top - unitSize;
                break;
            case "down":
                top = top + unitSize;
                break;
            case "left":
                left = left - unitSize;
                break;
            case "right":
                left = left + unitSize;
                break;
            default:
                return;
        }

        return { id, top, left };
    }

    changePositions() {
        if (this.state.queue.length === 0) return;

        let queue           = this.state.queue;
        const newPosition   = queue[0];
        let positionsArray  = this.state.positionsArray;

        positionsArray[newPosition.id].top  = newPosition.top;
        positionsArray[newPosition.id].left = newPosition.left;

        queue.splice(0, 1);

        this.setState({
            queue:          queue,
            positionsArray: positionsArray
        });
    }

    randomInRange(start, finish){
        return Math.floor(( Math.random() * (finish - start + 1) ) + start);
    }

    getRandomUnitId(adjacentUnits, lastId){
        let randomId = null;

        if(adjacentUnits.length > 0) {

            // The same element does not move back and forth
            if(lastId) {
                adjacentUnits = adjacentUnits.filter((item) => {
                    return this.state.gameArray[item.y][item.x] !== lastId;
                });
            }

            // Choose one for movement
            const randomIndex   = this.randomInRange(0, adjacentUnits.length - 1);
            const randomUnit    = adjacentUnits[randomIndex];
            randomId            = this.state.gameArray[randomUnit.y][randomUnit.x];
        }

        return randomId;
    }

    mixUnits() {

        let posArray    = this.getPositions(this.state.gameArray);
        let queue       = this.state.queue;
        let id          = null;

        for (let k = 1; k <= this.state.level; k++) {

            const currentCZero  = this.getCurrentCoordinates(0);
            const adjacentUnits = this.getAdjacentUnits(currentCZero, 'notZeroFilter');

            id = this.getRandomUnitId(adjacentUnits, id);

            const currentC    = this.getCurrentCoordinates(id);
            const newC        = this.getNewCoordinates(currentC);
            if (!newC) return;

            this.swapElements(currentC, newC);

            const newPosition = this.getNewPosition(id, newC, posArray);
            queue.push(newPosition);
            posArray  = this.getPositions(this.state.gameArray);

        }

        this.setState({
            queue:          queue
        });
    }

    checkForVictory() {

        if((this.state.gameArray.join(",") === this.getNewGameArray().join(","))
            && this.state.isStarted ) {

            $('.modal-victory').modal('show');

            // save results
            this.saveResults(true);

            this.resetGame();
        }
    }

    resetGame() {

        this.setState({
            isStarted:      false
        });

        setTimeout(() => {

            const gameArray = this.getNewGameArray();
            this.setState({
                gameArray:      gameArray,
                positionsArray: this.getPositions(gameArray),
                queue:          [],
                score:          0
            });

        }, 300);
    }

    saveResults(win) {

        let saves = this.state.saves;

        if (win) saves.currentLevel += this.state.stepLevel;

        saves.playedGames.push({
            level:  this.state.level,
            score:  this.state.score,
            win:    win
        });

        localStorage.setItem('game-15-puzzle', JSON.stringify(saves));

        console.log(JSON.stringify(saves));
    }

    handleUnitClick(id) {

        const currentC  = this.getCurrentCoordinates(id);
        const newC      = this.getNewCoordinates(currentC);
        if (!newC) return;

        this.swapElements(currentC, newC);

        const newPosition   = this.getNewPosition(id, newC, this.state.positionsArray);

        let queue = this.state.queue;
        queue.push(newPosition);

        this.setState({
            queue: queue,
            score: this.state.score + 1
        });

        this.changePositions();
    }

    handleStart() {

        // TODO: add Modal components for chose level

        this.setState({
            isStarted: true
        });

        setTimeout(() => {
            this.mixUnits();
            this.changePositions();
        }, 100);

    }

    handleReset() {

        // save results
        this.saveResults(false);

        this.resetGame();
    }

    handleTransitionEnd(event) {
        if (event.target.classList.contains("unit-container")) {
            this.changePositions();

            if (this.state.queue.length === 0) this.checkForVictory();
        }
    }

    render() {
        return (
            <div className="row">
                <div className="card bg-light border-primary col-xs-12 col-sm-11 col-md-8 col-lg-6 col-xl-5 p-0" >
                    <div className="card-header">
                        <Controls
                            isStarted={this.state.isStarted}
                            onStart={this.handleStart}
                            level={this.state.level}
                            playedGames={this.state.saves.playedGames}
                            score={this.state.score}
                        />
                    </div>

                    <div className="card-body p-0 " ref="cardBody">
                        <GameField
                            isStarted={this.state.isStarted}
                            positionsArray={this.state.positionsArray}
                            onClick={this.handleUnitClick}
                            onTransitionEnd={this.handleTransitionEnd}
                        />
                    </div>
                </div>

                <ModalQuestion
                    title="Reset game"
                    text="Do you really want to reset the game? :("
                    onYes={this.handleReset}
                />
                <ModalVictory
                    title="You win ! ! ! !"
                />

            </div>
        );
    }
}

// GameFifteen.propTypes = {
//     router: PropTypes.object.isRequired
// };

export default GameFifteen;


// TODO: on START add Modal for chose level
// TODO: progressbar on open
