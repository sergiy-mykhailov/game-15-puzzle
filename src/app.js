// Created by Sergiy Mykhailov
;
var jQuery =  require('jquery');

window.FifteenPuzzle = (function() {

    /**
     * Constructor.
     *
     * @private
     * @param {string} cssSelector The css-selector.
     * @param {Object} options The default options.
     */
    function Fifteen(cssSelector, options) {

        this.container = (cssSelector) ? cssSelector : 'body';

        // default options
        var defaultOptions = {
            delay:          400,
            delayShort:     80,
            elemInterval:   10,
            elemSize:       80
        };
        this._options = jQuery.extend({}, defaultOptions, options);

        this._arr15 = this._getNewArray15();
        this._arr15Position = [];
        this._arr15Queue = [];
        this._level = 0;

        this.initialize();

    }

    /*****  initialize game  *****/

    Fifteen.prototype.initialize = function() {
        this._addElements();
        this._addStyle();
        this._addPosition();
        this._addHandlers();
    };

    Fifteen.prototype._addElements = function() {

        jQuery(this.container).append('<div class="fifteen"></div>');

        jQuery('.fifteen')
            .append('<div class="fControls"></div>')
            .append('<div class="fField"></div>')
            .append('<div class="fDescription">Keyboard controls:<br/>s - start game<br/>Up, Down, Left, Right - move element</div>')
        ;

        jQuery('.fControls')
            .append('<div class="fStartReset">Start / Reset</div>')
            .append('<div class="fScore">Score: <strong class="fClickCont">0</strong> Level: <strong class="fLevel">0</strong></div>')
        ;

        var htmlSquares = '';
        for (var i = 0; i < this._arr15.length; i++) {
            var lineArray = this._arr15[i];
            for (var j = 0; j < lineArray.length; j++) {
                htmlSquares += '<div class=\"s' + this._arr15[i][j] + ' square\">' +
                    this._arr15[i][j] + '</div>';
            }
        }

        jQuery('.fField')
            .append(htmlSquares)
            .append('<div class="fVictory">YOU WIN ! ! ! !</div>');

        jQuery('.fVictory').hide();

    };

    Fifteen.prototype._addStyle = function() {

        jQuery('.fifteen').css({
            "margin":           "auto",
            "width":            "390px",
            "height":           "545px",
            "border":           "1px solid #ccc",
            "background-color": "#ededed"
        });
        jQuery('.fControls').css({
            "position":         "relative",
            "margin":           "auto",
            "margin-top":       "10px",
            "width":            "370px",
            "height":           "60px",
            "background-color": "#ccc"
        });
        jQuery('.fStartReset').css({
            "position":         "absolute",
            "margin-left":      "10px",
            "margin-top":       "10px",
            "padding":          "10px 0 0 20px",
            "width":            "100px",
            "height":           "30px",
            "background-color": "#555",
            "color":            "#fff",
            "cursor":           "pointer"
        });
        jQuery('.fScore').css({
            "position":         "absolute",
            "left":             "130px",
            "margin-left":      "20px",
            "margin-top":       "10px",
            "padding":          "10px 0 0 0",
            "width":            "210px",
            "height":           "30px"
        });
        jQuery('.fField').css({
            "position":         "relative",
            "margin":           "auto",
            "margin-top":       "10px",
            "width":            "370px",
            "height":           "370px",
            "background-color": "#ccc"
        });
        jQuery('.fVictory').css({
            "position":         "absolute",
            "top":              "120px",
            "left":             "-50px",
            "padding":          "18px 0 0 0",
            "width":            "470px",
            "height":           "82px",
            "text-align":       "center",
            "text-valign":      "center",
            "font-size":        "3em",
            "font-family":      "'Cooper Black', 'Showcard Gothic', 'Berlin Sans FB Demi', 'Microsoft Yi Baiti', Arial, sans-serif ",
            "color":            "#F02151",
            "background-color": "#FFFFC9"
        });
        jQuery('.fDescription').css({
            "margin":           "auto",
            "margin-top":       "10px",
            "padding":          "5px 0 0 10px",
            "width":            "360px",
            "height":           "70px",
            "color":            "#444",
            "background-color": "#ccc"
        });
        jQuery('.square').css({
            "position":         "absolute",
            "padding":          "8px 0 0 0",
            "width":            "80px",
            "height":           "72px",
            "text-align":       "center",
            "font-size":        "3em",
            "font-family":      "'Cooper Black', 'Showcard Gothic', 'Berlin Sans FB Demi', 'Microsoft Yi Baiti', Arial, sans-serif ",
            "background-color": "#474762",
            "color":            "#fff",
            "cursor":           "pointer"

        });
    };

    Fifteen.prototype._addPosition = function() {

        for (var i = 0; i < this._arr15.length; i++) {

            var elemTop = this._options.elemInterval + (i * this._options.elemSize + i * this._options.elemInterval);

            for (var j = 0; j < this._arr15[i].length; j++) {

                var elemLeft = this._options.elemInterval + (j * this._options.elemSize + j * this._options.elemInterval);

                jQuery('.s' + this._arr15[i][j]).css({
                    "top":  elemTop,
                    "left": elemLeft
                });

                this._arr15Position[this._arr15[i][j]] =
                    {
                        top:    elemTop,
                        left:   elemLeft
                    };
            }
        }

        jQuery('.s0').css({
            "display":  "none"
        });

    };

    Fifteen.prototype._addHandlers = function() {
        var self = this;

        // start game and random move elements
        jQuery('.fStartReset').click(function () {

            var reg = /\d+/g;
            var levelText = prompt("Enter level (1 - 100)!","30");
            if(levelText !== null){
                self._level = Number(levelText.match(reg));
                if((1 <= self._level) && (self._level <= 100)) {

                    self._arr15Queue = [];
                    self._arr15 = self._getNewArray15();
                    self._addPosition();

                    self._mixElements();
                    self._moveElements(self._options.delayShort);
                    self._checkForVictory();

                    jQuery('.fClickCont').text(0);
                    jQuery('.fLevel').text(self._level);
                }
            }
        });

        // move element
        jQuery('.square').click(function (eventObject) {

            self._arr15Queue = [];
            var elemNumber = Number(jQuery(eventObject.target).text());

            self._checkAndChangeElement(elemNumber);
            self._moveElements(self._options.delay);
            self._checkForVictory();

        });

        // keyboard control
        jQuery(document).keydown(function (eventObject) {

            if(eventObject.which === 83) {
                jQuery('.fStartReset').click();
            }else{
                self._arr15Queue = [];
                self._checkElementByKeyboard(eventObject.which);
                self._moveElements(self._options.delay);
                self._checkForVictory();
            }
        });

        // hide victory message
        jQuery('.fVictory').click(function () {

            jQuery('.fVictory').fadeOut(2000);

        });

    };

    /*****  core game  *****/

    Fifteen.prototype._checkAndChangeElement = function(elemNumber) {

        for (var i = 0; i < this._arr15.length; i++) {

            var j = this._arr15[i].indexOf(elemNumber);
            if(j === -1) continue;

            var iUp     = i - 1;
            var iDown   = i + 1;
            var jUp     = j - 1;
            var jDown   = j + 1;

            if((0 <= iUp) && (iUp < this._arr15.length)
                && (this._arr15[iUp][j] === 0)){

                this._changePosition("up", elemNumber);
                this._swapElemArray(i, j, iUp, j);

            }else if((0 <= iDown) && (iDown < this._arr15.length)
                && (this._arr15[iDown][j] === 0)){

                this._changePosition("down", elemNumber);
                this._swapElemArray(i, j, iDown, j);

            }else if((0 <= jUp) && (jUp < this._arr15[i].length)
                && (this._arr15[i][jUp] === 0)){

                this._changePosition("left", elemNumber);
                this._swapElemArray(i, j, i, jUp);

            }else if((0 <= jDown) && (jDown < this._arr15[i].length)
                && (this._arr15[i][jDown] === 0)){

                this._changePosition("right", elemNumber);
                this._swapElemArray(i, j, i, jDown);

            }
            break;

        }
    };

    Fifteen.prototype._changePosition = function(direction, elemNumber) {

        var elemTop     = this._arr15Position[elemNumber].top;
        var elemLeft    = this._arr15Position[elemNumber].left;
        var step        = this._options.elemInterval + this._options.elemSize;

        switch (direction){
            case "up":
                elemTop = elemTop - step;
                break;
            case "down":
                elemTop = elemTop + step;
                break;
            case "left":
                elemLeft = elemLeft - step;
                break;
            case "right":
                elemLeft = elemLeft + step;
                break;
        }

        var currentPosition = {
            element:    elemNumber,
            top:        elemTop,
            left:       elemLeft
        };
        this._arr15Queue.push(currentPosition);

        this._arr15Position[elemNumber].top     = elemTop;
        this._arr15Position[elemNumber].left    = elemLeft;

        this._countUp();
    };

    Fifteen.prototype._moveElements = function(duration) {
        if (this._arr15Queue.length === 0) return;

        duration = duration || this._options.delay;
        var currentElement = this._arr15Queue[0];
        var self = this;

        jQuery('.s' + currentElement.element)
            .animate({
                    "top": currentElement.top,
                    "left": currentElement.left
                },
                duration,
                function () {
                    self._arr15Queue.shift();
                    self._moveElements(duration);
                });
    };

    Fifteen.prototype._checkForVictory = function(){

        jQuery('.fVictory').hide();

        if((this._arr15.join(",") === this._getNewArray15().join(","))
            && Number(jQuery('.fLevel').text()) !== 0){
            jQuery('.fVictory').fadeIn(3000);
        }

    };

    Fifteen.prototype._mixElements = function() {

        // обход количества уровней
        for (var k = 1; k <= this._level; k++) {
            var randomArray = [];

            // найти соседние элементы нуля
            for (var i = 0; i < this._arr15.length; i++) {

                var j = this._arr15[i].indexOf(0);
                if (j === -1) continue;

                randomArray = [];
                var iUp     = i - 1;
                var iDown   = i + 1;
                var jUp     = j - 1;
                var jDown   = j + 1;

                if ((0 <= iUp) && (iUp < this._arr15.length)
                    && (this._arr15[iUp][j] !== 0)) {

                    randomArray.push(this._arr15[iUp][j]);

                }
                if ((0 <= iDown) && (iDown < this._arr15.length)
                    && (this._arr15[iDown][j] !== 0)) {

                    randomArray.push(this._arr15[iDown][j]);

                }
                if ((0 <= jUp) && (jUp < this._arr15[i].length)
                    && (this._arr15[i][jUp] !== 0)) {

                    randomArray.push(this._arr15[i][jUp]);

                }
                if ((0 <= jDown) && (jDown < this._arr15[i].length)
                    && (this._arr15[i][jDown] !== 0)) {

                    randomArray.push(this._arr15[i][jDown]);

                }
                break;
            }

            if(randomArray.length > 0) {

                // один и тот же єлемент туда-сюда не двигаем
                if(elemNumber) {
                    var indexLastElem = randomArray.indexOf(elemNumber);
                    if (indexLastElem != -1) {
                        randomArray.splice(indexLastElem, 1);
                    }
                }

                // выбрать один из ниx для движения
                var randomIndex   = this._randomInRange(0, randomArray.length - 1);
                var elemNumber      = randomArray[randomIndex];

                // двигать выбранный элемент
                this._checkAndChangeElement(elemNumber);

            }
        }
    };

    Fifteen.prototype._checkElementByKeyboard = function(keyCode){

        // найти соседние элементы нуля
        for (var i = 0; i < this._arr15.length; i++) {

            var newI, newJ;
            var j = this._arr15[i].indexOf(0);
            if (j === -1) continue;

            switch (keyCode){
                case 40:
                    newI = i - 1;
                    newJ = j;
                    break;
                case 38:
                    newI = i + 1;
                    newJ = j;
                    break;
                case 39:
                    newI = i;
                    newJ = j - 1;
                    break;
                case 37:
                    newI = i;
                    newJ = j + 1;
                    break;
            }

            if (((0 <= newI) && (newI <= 3))
                && ((0 <= newJ) && (newJ <= 3))){

                var selectedNumber = this._arr15[newI][newJ];
                // двигать выбранный элемент
                this._checkAndChangeElement(selectedNumber);
            }
            break;
        }
    };

    /*****  service functions  *****/

    Fifteen.prototype._getNewArray15 = function() {

        return [[0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15]];

    };

    Fifteen.prototype._countUp = function(){

        var divCounter = jQuery('.fClickCont');
        divCounter.text(Number(divCounter.text()) + 1);

    };

    Fifteen.prototype._swapElemArray = function(i1, j1, i2, j2) {

        var buffer = this._arr15[i1][j1];
        this._arr15[i1][j1] = this._arr15[i2][j2];
        this._arr15[i2][j2] = buffer;

    };

    Fifteen.prototype._randomInRange = function(start, finish){

        return Math.floor(( Math.random() * (finish - start + 1) ) + start);

    };

    return Fifteen;

})();

if (document.querySelector('.fifteen-puzzle')) {
    var fifteenPuzzle = new FifteenPuzzle('.fifteen-puzzle');
}
