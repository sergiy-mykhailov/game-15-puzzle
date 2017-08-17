/**
 * Created by Sergiy Mykhailov on 21.05.2015.
 */

// вариант: добавить jquery программно (если не добавлять в head)
/*var headElements = document.querySelector("head");
headElements.insertAdjacentHTML("afterBegin", '<script src="http://code.jquery.com/jquery-2.1.4.js" type="text/javascript"></script>');
*/

var jQuery =  require('jquery');

var elemBetween         = 10;
var elemSize            = 80;
var completedMoving     = 0;

function initializeFifteen(fifteenArray) {

    jQuery('body').append('<div id="fifteen"></div>');

    jQuery('#fifteen')
        .append('<div id="controls"></div>')
        .append('<div id="fifteenField"></div>')
        .append('<div id="controlDescription">Keyboard controls:<br>s - start game<br>Up, Down, Left, Right - move element</div>')
    ;

    jQuery('#controls')
        .append('<div id="startReset">Start / Reset</div>')
        .append('<div id="score">Score: <strong id="clickCont">0</strong> Level: <strong id="level">0</strong></div>')
    ;

    for (var i = 0; i < fifteenArray.length; i++) {
        var lineArray = fifteenArray[i];
        for (var j = 0; j < lineArray.length; j++) {
            jQuery('#fifteenField').append('<div id=\"s' + fifteenArray[i][j] + '\" class =\"square\">' + fifteenArray[i][j] + '</div>');
        }
    }

    jQuery('#fifteenField').append('<div id="victory">YOU WIN ! ! ! !</div>');

    jQuery('#victory').hide();
}

function initializeFifteenStyle() {

    jQuery('#fifteen').css({
        "margin":           "auto",
        "width":            "390px",
        "height":           "545px",
        "border":           "1px solid #ccc",
        "background-color": "#ededed"
    });
    jQuery('#controls').css({
        "position":         "relative",
        "margin":           "auto",
        "margin-top":       "10px",
        "width":            "370px",
        "height":           "60px",
        //"border":           "1px solid #acacac",
        "background-color": "#ccc"
    });
    jQuery('#startReset').css({
        "position":         "absolute",
        "margin-left":      "10px",
        "margin-top":       "10px",
        "padding":          "10px 0 0 20px",
        "width":            "100px",
        "height":           "30px",
        //"border":           "1px solid #acacac",
        "background-color": "#555",
        "color":            "#fff",
        "cursor":           "pointer"
    });
    jQuery('#score').css({
        "position":         "absolute",
        "left":             "130px",
        "margin-left":      "20px",
        "margin-top":       "10px",
        "padding":          "10px 0 0 0",
        "width":            "210px",
        "height":           "30px"
    });
    jQuery('#fifteenField').css({
        "position":         "relative",
        "margin":           "auto",
        "margin-top":       "10px",
        "width":            "370px",
        "height":           "370px",
        //"border":           "1px solid #acacac",
        "background-color": "#ccc"
    });
    jQuery('#victory').css({
        "position":         "absolute",
        "top":              "120px",
        "left":             "-50px",
        //"margin":           "auto",
        //"margin-top":       "10px",
        "padding":          "18px 0 0 0",
        "width":            "470px",
        "height":           "82px",
        "text-align":       "center",
        "text-valign":      "center",
        "font-size":        "3em",
        //"font-weight":      "bolder",
        "font-family":      "'Cooper Black', 'Showcard Gothic', 'Berlin Sans FB Demi', 'Microsoft Yi Baiti', Arial, sans-serif ",
        "color":            "#F02151",
        "background-color": "#FFFFC9"   //"#F0CE6A"
    });
    jQuery('#controlDescription').css({
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

}

function initializePosition(fifteenArray, currentPositionArray) {

    for (var i = 0; i < fifteenArray.length; i++) {

        var elemTop = elemBetween + (i * elemSize + i * elemBetween);

        for (var j = 0; j < fifteenArray[i].length; j++) {

            var elemLeft = elemBetween + (j * elemSize + j * elemBetween);

            jQuery('#s' + fifteenArray[i][j]).css({
                "top":  elemTop,
                "left": elemLeft
            });

            currentPositionArray[fifteenArray[i][j]] =
                {
                    top:    elemTop,
                    left:   elemLeft
                };
        }
    }

    jQuery('#s0').css({
        "display":  "none"
    });

}

function initializeFifteenArray() {

    return [[0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15]];
}

function checkElement(fifteenArray, currentPositionArray, historyPositionsArray, elemNumber) {

    for (var i = 0; i < fifteenArray.length; i++) {

        var j = fifteenArray[i].indexOf(elemNumber);

        if(j != -1){

            var iUp     = i - 1;
            var iDown   = i + 1;
            var jUp     = j - 1;
            var jDown   = j + 1;

            if((0 <= iUp) && (iUp < fifteenArray.length) && (fifteenArray[iUp][j] == 0)){

                changePosition("up", currentPositionArray, historyPositionsArray, elemNumber);
                changeElementsInArray(fifteenArray, i, j, iUp, j);

            }else if((0 <= iDown) && (iDown < fifteenArray.length) && (fifteenArray[iDown][j] == 0)){

                changePosition("down", currentPositionArray, historyPositionsArray, elemNumber);
                changeElementsInArray(fifteenArray, i, j, iDown, j);

            }else if((0 <= jUp) && (jUp < fifteenArray[i].length) && (fifteenArray[i][jUp] == 0)){

                changePosition("left", currentPositionArray, historyPositionsArray, elemNumber);
                changeElementsInArray(fifteenArray, i, j, i, jUp);

            }else if((0 <= jDown) && (jDown < fifteenArray[i].length) && (fifteenArray[i][jDown] == 0)){

                changePosition("right", currentPositionArray, historyPositionsArray, elemNumber);
                changeElementsInArray(fifteenArray, i, j, i, jDown);

            }
            return;
        }
    }
} // checkElement()

function changePosition(direction, currentPositionArray, historyPositionsArray, elemNumber) {

    var elemTop     = currentPositionArray[elemNumber].top;
    var elemLeft    = currentPositionArray[elemNumber].left;
    var step        = elemBetween + elemSize;

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
    historyPositionsArray.push(currentPosition);

    currentPositionArray[elemNumber].top     = elemTop;
    currentPositionArray[elemNumber].left    = elemLeft;

    countUp();

}

function moveElements(historyPositionsArray, duration, delay) {

    for(var i=0;i<historyPositionsArray.length;i++) {

        var currentElement = historyPositionsArray[i];

        jQuery('#s' + currentElement.element)
            .animate({
                    "top":  currentElement.top,
                    "left": currentElement.left
                },
                duration
                ,
                function () {
                    completedMoving++;
                })
        ;

        // остальным задать задержку
        if((!isNaN(delay)) && (delay != 0)) {
            addDelay(delay, currentElement.element);
        }
    }

}

function changeElementsInArray(fifteenArray, i1, j1, i2, j2) {

    var buffer = fifteenArray[i1][j1];
    fifteenArray[i1][j1] = fifteenArray[i2][j2];
    fifteenArray[i2][j2] = buffer;

}

function randomElements(fifteenArray, currentPositionArray, historyPositionsArray, level) {

    // обход количества уровней
    for (var k = 1; k <= level; k++) {

        var randomArray = [];

        // найти соседние элементы нуля
        for (var i = 0; i < fifteenArray.length; i++) {

            var j = fifteenArray[i].indexOf(0);
            if (j != -1) {

                randomArray = [];
                var iUp = i - 1;
                var iDown = i + 1;
                var jUp = j - 1;
                var jDown = j + 1;

                if ((0 <= iUp) && (iUp < fifteenArray.length) && (fifteenArray[iUp][j] != 0)) {
                    randomArray.push(fifteenArray[iUp][j]);
                }
                if ((0 <= iDown) && (iDown < fifteenArray.length) && (fifteenArray[iDown][j] != 0)) {
                    randomArray.push(fifteenArray[iDown][j]);
                }
                if ((0 <= jUp) && (jUp < fifteenArray[i].length) && (fifteenArray[i][jUp] != 0)) {
                    randomArray.push(fifteenArray[i][jUp]);
                }
                if ((0 <= jDown) && (jDown < fifteenArray[i].length) && (fifteenArray[i][jDown] != 0)) {
                    randomArray.push(fifteenArray[i][jDown]);
                }
                break;
            }
        }

        if(randomArray.length > 0) {

            // один и  тот же єлемент туда-сюда не двигаем
            if(elemNumber) {
                var indexLastElem = randomArray.indexOf(elemNumber);
                if (indexLastElem != -1) {
                    randomArray.splice(indexLastElem, 1);
                }
            }

            // выбрать один из ниx для движения
            var randomCounter   = randomInRange(0, randomArray.length - 1);
            var elemNumber      = randomArray[randomCounter];

            // двигать выбранный элемент
            checkElement(fifteenArray, currentPositionArray, historyPositionsArray, elemNumber);

        }

    }

} // randomSquare()

function randomInRange(start, finish){

    return Math.floor(( Math.random() * (finish - start + 1) ) + start);

}

function addDelay(duration, exclude){

    //// old technology:
    //if(duration > 0) {
    //    for (var i = 0; i < fifteenArray.length; i++) {
    //        for (var j = 0; j < fifteenArray[i].length; j++) {
    //            // установить задержку для всех, кроме нулевого элемента и текщего (у него анимация с задержкой)
    //            if ((fifteenArray[i][j] != 0) && (fifteenArray[i][j] != exclude)) {
    //                jQuery('#s' + fifteenArray[i][j]).delay(duration);
    //            }
    //        }
    //    }
    //}

    if(duration > 0) {
        jQuery('.square').each(function () {
            var elemNumber = Number(jQuery(this).text());
            if ((elemNumber != 0) && (elemNumber != exclude)) {
                jQuery(this).delay(duration);
            }
        });
    }
}

function countUp(){

    var divCounter = jQuery('#clickCont');
    divCounter.text(Number(divCounter.text()) + 1);
}

function checkForVictory(firstArray, secondArray){

    jQuery('#victory').hide();

    if((firstArray.join(",") == secondArray.join(",")) && Number(jQuery('#level').text()) != 0){
        jQuery('#victory').fadeIn(3000);
    }

}

function checkElementByKeyboard(fifteenArray, currentPositionArray, historyPositionsArray, keyCode){

    // найти соседние элементы нуля
    for (var i = 0; i < fifteenArray.length; i++) {

        var j = fifteenArray[i].indexOf(0);
        if (j != -1) {

            switch (keyCode){
                case 40:
                    var newI = i - 1;
                    var newJ = j;
                    break;
                case 38:
                    var newI = i + 1;
                    var newJ = j;
                    break;
                case 39:
                    var newI = i;
                    var newJ = j - 1;
                    break;
                case 37:
                    var newI = i;
                    var newJ = j + 1;
                    break;
            }

            if (((0 <= newI) && (newI <= 3))
                && ((0 <= newJ) && (newJ <= 3))){

                var selectedNumber = fifteenArray[newI][newJ];
                // двигать выбранный элемент
                checkElement(fifteenArray, currentPositionArray, historyPositionsArray, selectedNumber);

            }
            break;
        }
    }

}

// выполняется после построения DOM
jQuery(document).ready(function(){

    // initialize
    var duration                = 400;
    var delay                   = 80;  //80;
    var fifteenArray            = initializeFifteenArray();
    var currentPositionArray    = [];
    var historyPositionsArray   = [];
    completedMoving             = 0;
    var level                   = 0;

    initializeFifteen(fifteenArray);
    initializeFifteenStyle();
    initializePosition(fifteenArray, currentPositionArray);

    // start game and random move elements
    jQuery('#startReset').click(function () {

        var reg = /\d+/g;
        var levelText = prompt("Enter level (1 - 100)!","30");
        if(levelText != null){
            level = Number(levelText.match(reg));
            if((1 <= level) && (level <= 100)) {

                //jQuery('#clickCont').text(0);
                //jQuery('#level').text(level);
                completedMoving         = 0;
                historyPositionsArray   = [];
                fifteenArray = initializeFifteenArray();
                initializePosition(fifteenArray, currentPositionArray);

                randomElements(fifteenArray, currentPositionArray, historyPositionsArray, level);
                moveElements(historyPositionsArray, delay, delay);
                checkForVictory(fifteenArray, initializeFifteenArray());

                jQuery('#clickCont').text(0);
                jQuery('#level').text(level);

            }
        }

    });

    // move element
    jQuery('.square').click(function (elementObject) {

        completedMoving         = 0;
        historyPositionsArray   = [];
        var elemNumber          = Number(jQuery(elementObject.target).text());

        checkElement(fifteenArray, currentPositionArray, historyPositionsArray, elemNumber);
        moveElements(historyPositionsArray, duration, 0);
        checkForVictory(fifteenArray, initializeFifteenArray());

    });

    // check winning
    jQuery('#victory').click(function () {

        jQuery('#victory').fadeOut(2000);

    });

    // keyboard control
    jQuery(document).keydown(function (eventObject) {
        if(eventObject.which == 83) {
            jQuery('#startReset').click();
        }else{
            completedMoving         = 0;
            historyPositionsArray   = [];
            checkElementByKeyboard(fifteenArray, currentPositionArray, historyPositionsArray, eventObject.which);
            moveElements(historyPositionsArray, duration, 0);
        }
    });

    // firefox - при смене вкладок перезапускаем анимацию т.к. она останавливается и не корректно отрабатывает...
    jQuery(document).blur(function(){

        jQuery('.square').each(function () {
            jQuery(this).stop(true);
        });

    });

    jQuery(document).focus(function(){

        if((completedMoving >= 0) && (completedMoving < historyPositionsArray.length) && (completedMoving < level)){

            // вернуться в очереди до момента остановки
            for(var i=historyPositionsArray.length-1;i>=completedMoving;i--){
                var newHistoryPositionsArray = [];
                var currentElement = historyPositionsArray[i];
                checkElement(fifteenArray, currentPositionArray, newHistoryPositionsArray, currentElement.element);
            }

            // заново запустить анимацию с момента остановки
            var newHistoryPositionsArray = [];
            for(var i=completedMoving;i<historyPositionsArray.length;i++){
                var currentElement = historyPositionsArray[i];
                checkElement(fifteenArray, currentPositionArray, newHistoryPositionsArray, currentElement.element);
            }
            moveElements(newHistoryPositionsArray, delay, delay);

        }
    });

});// ******** конец ready ********
