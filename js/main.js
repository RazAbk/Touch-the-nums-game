
var gBoardSize = 9;
var gBoard;
var gCounter = 1;
var gIsFirstCellClicked = false;
var gStartTime;
var gTimer;

// Chose the Easy option to be sunken at beginning
var elLevels = document.querySelectorAll('.level');
elLevels[0].classList.add('chosen');


function init(){
    
    gBoard = createBoard(gBoardSize);
    renderBoard();
}

function renderBoard(gBoard){
    var strHTML = '<table>';

    var idx = 0;
    for(var i = 0; i < Math.sqrt(gBoardSize); i++){
        strHTML +='<tr>';
        for(var j = 0; j < Math.sqrt(gBoardSize); j++){
            strHTML += `<td onclick="cellClicked(this)">${gBoard[idx]}</td>`;
            idx++;
        }
        strHTML +='</tr>';
    }
    strHTML +='</table>';

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function cellClicked(elCell){
    // First time a user click the board
    if(!gIsFirstCellClicked){
        gIsFirstCellClicked = true;
        gStartTime = new Date();
    
        // Interval for the timer
        gTimer = setInterval(function() {
            var elTimer = document.querySelector('.timer');
            var now = new Date();
            elTimer.innerHTML = 'Timer:<br>' + ((now - gStartTime)/1000).toFixed(2);
        }, 85);
    }

    if(gCounter === gBoardSize){
        victory(gTimer);
    }
    
    // Add 'disabled' and 'clicked' class to each clicked cell
    elCell.classList.add('disabled');
    if(parseInt(elCell.innerText) === gCounter){
        elCell.classList.add('clicked');
        gCounter++;
    } else{ // Wrong click
        elCell.classList.add('clicked-wrong');
        setTimeout(function(){
            elCell.classList.remove('clicked-wrong');
            elCell.classList.remove('disabled');
        },500);
    }
}

function victory(gTimer){
    clearInterval(gTimer); // Stop the interval

    var now = new Date();
    var timerResult = now - gStartTime; // Store the time result here
    
    // Print the time
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = `<span>Victory!</span><br>Your time is:<br> ${(timerResult/1000).toFixed(2)} seconds`;
    
    // Make all the cells green
    var elClickedCells = document.querySelectorAll('td');
    for(var i = 0; i < elClickedCells.length; i++){
        elClickedCells[i].style.backgroundColor = 'green';
        elClickedCells[i].style.transition = '0.5s';
    }

    // Show the play again button
    var elPlayAgainButton = document.querySelector('.play-again');
    elPlayAgainButton.style.display = 'inline-block';
}

// Restart function when play again button is clicked
function restart(){
    clearInterval(gTimer);

    // Clear the timer msg
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '';

    // Clear the play again button
    var elPlayAgainButton = document.querySelector('.play-again');
    elPlayAgainButton.style.display = 'none';

    // Reset the parameters
    gCounter = 1;
    gIsFirstCellClicked = false;

    init();
}

function createBoard(boardSize){
    var newSortedBoard = [];
    // Create new board with numbers 1-gBoardSize
    for(var i = 0; i < boardSize; i++){
        newSortedBoard.push(i + 1);
    }

    // Shuffle the board
    var newBoard = [];
    for(var i = 0; i < boardSize; i++){
        var idx = Math.floor(Math.random()*newSortedBoard.length);
        newBoard[i] = newSortedBoard[idx];
        newSortedBoard.splice(idx,1);
    }

    return newBoard;
}

function chooseLevel(elLevelBtn){
    var elLevels = document.querySelectorAll('.level');

    for(var i = 0; i < elLevels.length; i++){
        elLevels[i].classList.remove('chosen');
    }

    switch(elLevelBtn.innerText){
        case 'Easy':
            gBoardSize = 9;
            break;
        case 'Medium':
            gBoardSize = 16;
            break;
        case 'Hard':
            gBoardSize = 25;
            break;        
    }

    elLevelBtn.classList.add('chosen');

    restart();
}