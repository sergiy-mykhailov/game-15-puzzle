
import React from 'react';

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
            stepLevel:          2,
            isStarted:          false,
            isMixing:           false,
            saves:              this.getEmptySaves(),
            level:              0,
            score:              0
        };

        this.getNewGameArray    = this.getNewGameArray.bind(this);
        this.getPositions       = this.getPositions.bind(this);
        this.getEmptySaves      = this.getEmptySaves.bind(this);
        this.saveResults        = this.saveResults.bind(this);
        this.getResults         = this.getResults.bind(this);

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

        this.handleBtnStart         = this.handleBtnStart.bind(this);
        this.handleStart            = this.handleStart.bind(this);
        this.handleReset            = this.handleReset.bind(this);
        this.handleUnitClick        = this.handleUnitClick.bind(this);
        this.handleTransitionEnd    = this.handleTransitionEnd.bind(this);

    }

    componentWillMount() {

        this.setState({
            positionsArray: this.getPositions(this.state.gameArray)
        });
    }

    componentWillUnmount() {

        this.saveResults(!this.state.isStarted);
    }

    getResults() {

        let saves = JSON.parse(localStorage.getItem('game-15-puzzle'));
        if (!saves) {
            saves = this.getEmptySaves();
            localStorage.setItem('game-15-puzzle', JSON.stringify(saves));
        }

        const level = (saves.currentLevel === 0) ? this.state.stepLevel : saves.currentLevel;

        this.setState({
            saves:          saves,
            level:          level,
        });
    }

    saveResults(win) {

        let saves = this.state.saves;

        if (saves.currentLevel === 0) saves.currentLevel = this.state.stepLevel;
        if (win) saves.currentLevel += this.state.stepLevel;

        if (this.state.score !== 0) {
            saves.playedGames.push({
                level:  this.state.level,
                score:  this.state.score,
                win:    win
            });
        }

        localStorage.setItem('game-15-puzzle', JSON.stringify(saves));
    }

    getNewGameArray() {
        return [[0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15]];
    }

    getEmptySaves() {
        return { currentLevel: 0, playedGames: [] };
    }

    randomInRange(start, finish){
        return Math.floor(( Math.random() * (finish - start + 1) ) + start);
    }


    getPositions(gameArray) {

        const unitSize = this.state.unitSize;
        let positionsArray = [];

        gameArray.forEach((arr, i) => {
            const top = i * unitSize;

            arr.forEach((item, j) => {
                const left = j * unitSize;

                positionsArray[item] = { top, left };

            });
        });
        return positionsArray;
    }

    getCurrentCoordinates(id) {
        let coordinates = null;

        for (let y = 0; y < this.state.gameArray.length; y++) {

            const x = this.state.gameArray[y].indexOf(id);
            if (x === -1) continue;

            coordinates = { x, y } ;
            break;
        }

        return coordinates;
    }

    getNewCoordinates(currentC) {

        const adjacentUnits   = this.getAdjacentUnits(currentC, 'zeroFilter');

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
        if (this.state.queue.length === 0) {
            if (this.state.isStarted && this.state.isMixing) {
                this.setState({
                    isMixing:  false,
                });
            }
            return;
        }

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


    mixUnits(level) {

        let posArray    = this.getPositions(this.state.gameArray);
        let queue       = this.state.queue;
        let id          = null;

        for (let k = 1; k <= level; k++) {

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

    handleBtnStart() {

        this.getResults();

        $('#modal-start').modal('show');

    }

    handleStart(inputText) {

        if (!inputText) return;

        const reg = /\d+/g;
        const levelTxt = inputText.match(reg);
        if (!levelTxt) return;

        const level = Number(levelTxt);
        if (isNaN(level) || level === 0) return;

        this.setState({
            isStarted:  true,
            isMixing:   true,
            level:      level
        });

        this.mixUnits(level);
        this.changePositions();
    }

    handleReset() {

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
                <div className="col-xs-12 col-sm-9 col-md-7 col-lg-6 col-xl-5 p-0 mx-auto game-container">

                    <div className="card bg-light border-primary" >
                        <div className="card-header">
                            <Controls
                                isStarted={this.state.isStarted}
                                level={this.state.level}
                                playedGames={this.state.saves.playedGames}
                                score={this.state.score}
                                onStart={this.handleBtnStart}
                            />
                        </div>

                        <div className="card-body p-0 ">
                            <GameField
                                isStarted={this.state.isStarted}
                                isMixing={this.state.isMixing}
                                positionsArray={this.state.positionsArray}
                                onClick={this.handleUnitClick}
                                onTransitionEnd={this.handleTransitionEnd}
                            />
                        </div>
                    </div>

                    <ModalQuestion
                        id="modal-reset"
                        title="Reset game"
                        text="Do you really want to reset the game? :("
                        onYes={this.handleReset}
                        enableInput={false}
                    />
                    <ModalQuestion
                        id="modal-start"
                        title="Start game"
                        text="Select level of the game:"
                        onYes={this.handleStart}
                        enableInput={true}
                        labelInput="Level:"
                        textInput={String(this.state.level)}
                    />
                    <ModalVictory
                        title="You win ! ! ! !"
                    />

                </div>
            </div>
        );
    }
}

export default GameFifteen;
