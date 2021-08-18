// game table generation
const gameTable = document.querySelector('.game-table');
function tableGenerationFunc() {
    gameTable.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        let emptyCell = document.createElement('div');
        emptyCell.classList.add('empty-cell');
        gameTable.append(emptyCell);
        let cell = document.createElement('div');
        cell.classList.add('cell');
        emptyCell.append(cell);
    }
}


// game start param
const mainBlock = document.querySelector('.main');
const endGameWindow = document.querySelector('.end-game-window');
const menuWindow = document.querySelector('.menu-window');
mainBlock.style.height = window.innerHeight + 'px';
endGameWindow.style.height = window.innerHeight + 'px';
menuWindow.style.height = window.innerHeight + 'px';

const ls_currentRoundSave = localStorage.getItem('currentRoundSave');
if (ls_currentRoundSave == null) tableGenerationFunc();
else gameTable.innerHTML = ls_currentRoundSave;

const cells = document.querySelectorAll('.cell');




// cell creation
function num_2CreationFunc() {
    let resultCell = '';
    let l = 0;
    while (resultCell == '' && l < 100) {
        l++;
        if (l < 100) {
            const randomCell = cells[Math.floor(Math.random() * cells.length)];
            if (randomCell.innerHTML == '') resultCell = randomCell;
        }
        else defeatCheckFunc();
    }

    if (resultCell != '') {
        resultCell.classList.add('num_2', 'cell-append');
        resultCell.innerHTML = 2;
    }
}
if (ls_currentRoundSave == null) {
    num_2CreationFunc();
    num_2CreationFunc();
}






// best score + current score
let score = 0;
const scoreBlock = document.querySelector('.current-score');
const bestScoreBlock = document.querySelector('.best-score');
const bestScore = localStorage.getItem('bestScore');
if (bestScore != null && bestScore != '') bestScoreBlock.innerHTML = bestScore;

const ls_currentScore = +localStorage.getItem('currentScore'); 
if (ls_currentScore != null) {
    scoreBlock.innerHTML = ls_currentScore;
    score = ls_currentScore;
} 




const victoryNum = 2048;
let cellCombine = 0;
let specialCellIndex = 0;





// controls
function rightMoveFunc() {
    specialCellIndex = 0;
    cellCombine = 0;
    for (let i = 0; i < cells.length; i++) {
        if (i % 4 === 0) {
            const row = [cells[i].innerHTML, cells[i+1].innerHTML, cells[i+2].innerHTML, cells[i+3].innerHTML];

            let filledCellsRow = [];
            let emptyCellsRow = [];
            for (let elem of row) {
                if (elem !== '') filledCellsRow.push(+elem);
                else emptyCellsRow.push('');
            }
            
            if (filledCellsRow.length > 1) {
                for (let j = 0; j < filledCellsRow.length - 1; j++) {
                    if (filledCellsRow[j] === filledCellsRow[j+1] && filledCellsRow[j+1] === filledCellsRow[j+2] && filledCellsRow[j+2] !== filledCellsRow[j+3]) {
                        cellCombine = filledCellsRow[j+1] + filledCellsRow[j+2];
                        score = score + cellCombine;

                        // victory check
                        if (cellCombine === victoryNum) endGameFunc('Victory!');

                        filledCellsRow[j+2] = cellCombine;
                        filledCellsRow.splice(j+1, 1);
                        filledCellsRow.unshift('');
                    }
                    else if (filledCellsRow[j] === filledCellsRow[j+1]) {
                        cellCombine = filledCellsRow[j] + filledCellsRow[j+1];
                        score = score + cellCombine;

                        // victory check
                        if (cellCombine === victoryNum) endGameFunc('Victory!');

                        emptyCellsRow.push('');
                        filledCellsRow[j+1] = cellCombine;
                        filledCellsRow.splice(j, 1);
                    }
                }
            }

            const correctRow = emptyCellsRow.concat(filledCellsRow);
            for (let k = 0; k < 4; k++) {
                cells[i+k].innerHTML = correctRow[k];
                if (correctRow[k] != '') cells[i+k].classList = `cell num_${correctRow[k]}`;
                else cells[i+k].classList = `cell`;
            }
            
            // animations
            let elemsSum = 0;
            for (let elem of row) {
                if (elem !== '' && correctRow.indexOf(+elem) === -1 && +elem !== elemsSum % 2) {
                    elemsSum = +elem * 2;
                    specialCellIndex = i + correctRow.indexOf(elemsSum);
                    cells[specialCellIndex].classList.add('cell-filling');
                }
            }
        }
    }
    num_2CreationFunc();
    progressSaveFunc();
}



function leftMoveFunc() {
    specialCellIndex = 0;
    cellCombine = 0;
    for (let i = 0; i < cells.length; i++) {
        if (i % 4 === 0) {
            const row = [cells[i].innerHTML, cells[i+1].innerHTML, cells[i+2].innerHTML, cells[i+3].innerHTML];
            
            let filledCellsRow = [];
            let emptyCellsRow = [];
            for (let elem of row) {
                if (elem !== '') filledCellsRow.push(+elem);
                else emptyCellsRow.push('');
            }
            if (filledCellsRow.length > 1) {
                for (let j = 0; j < filledCellsRow.length - 1; j++) {
                    if (filledCellsRow[j] === filledCellsRow[j+1]) {
                        cellCombine = filledCellsRow[j] + filledCellsRow[j+1];
                        score = score + cellCombine;
                        
                        // victory check
                        if (cellCombine === victoryNum) endGameFunc('Victory!');

                        emptyCellsRow.push('');
                        filledCellsRow[j] = cellCombine;
                        filledCellsRow.splice(j+1, 1);
                    }
                }
            }

            const correctRow = filledCellsRow.concat(emptyCellsRow);
            for (let k = 0; k < 4; k++) {
                cells[i+k].innerHTML = correctRow[k];
                if (correctRow[k] != '') cells[i+k].classList = `cell num_${correctRow[k]}`;
                else cells[i+k].classList = `cell`;
            }
            
            // animations
            let elemsSum = 0;
            let elemsSumPos = 0;
            for (let elem of row) {
                if (elem !== '' && correctRow.indexOf(+elem) === -1 && +elem !== elemsSum % 2) {
                    elemsSum = +elem * 2;

                    if (elemsSum == correctRow[0] || elemsSum == correctRow[1]) {
                        for (let k = 3; k >= 0; k--) {
                            if (elemsSum == correctRow[k] && elemsSumPos === 0) elemsSumPos = k;
                        }
                        specialCellIndex = i + elemsSumPos;
                        cells[specialCellIndex].classList.add('cell-filling');
                    }
                    else {
                        elemsSumPos = correctRow.indexOf(elemsSum); 
                        specialCellIndex = i + elemsSumPos;
                        cells[specialCellIndex].classList.add('cell-filling');
                    }
                }
            }
        }
    }
    num_2CreationFunc();
    progressSaveFunc();
}



function downMoveFunc() {
    specialCellIndex = 0;
    cellCombine = 0;
    for (let i = 0; i < 4; i++) {
        const column = [cells[i].innerHTML, cells[i+4].innerHTML, cells[i+8].innerHTML, cells[i+12].innerHTML];
        
        let filledCellsColumn = [];
        let emptyCellsColumn = [];
        for (let elem of column) {
            if (elem !== '') filledCellsColumn.push(+elem);
            else emptyCellsColumn.push('');
        }
        
        if (filledCellsColumn.length > 1) {
            for (let j = 0; j < filledCellsColumn.length - 1; j++) {
                if (filledCellsColumn[j] === filledCellsColumn[j+1] && filledCellsColumn[j+1] === filledCellsColumn[j+2] && filledCellsColumn[j+2] !== filledCellsColumn[j+3]) {
                    cellCombine = filledCellsColumn[j+1] + filledCellsColumn[j+2];
                    score = score + cellCombine;
                    
                    // victory check
                    if (cellCombine === victoryNum) endGameFunc('Victory!');

                    filledCellsColumn[j+2] = cellCombine;
                    filledCellsColumn.splice(j+1, 1);
                    filledCellsColumn.unshift('');
                }
                else if (filledCellsColumn[j] === filledCellsColumn[j+1]) {
                    cellCombine = filledCellsColumn[j] + filledCellsColumn[j+1];
                    score = score + cellCombine;
                    
                    // victory check
                    if (cellCombine === victoryNum) endGameFunc('Victory!');

                    emptyCellsColumn.push('');
                    filledCellsColumn[j+1] = cellCombine;
                    filledCellsColumn.splice(j, 1);
                }
            }
        }
        
        const correctColumn = emptyCellsColumn.concat(filledCellsColumn);
        let l = 0;
        for (let k = 0; k < 16; k++) {
            if (k % 4 === 0) {
                cells[i+k].innerHTML = correctColumn[l];
                if (correctColumn[l] != '') cells[i+k].classList = `cell num_${correctColumn[l]}`;
                else cells[i+k].classList = `cell`;
                l++;
            }
        }


        // animations
        let elemsSum = 0;
        for (let elem of column) {
            if (elem !== '' && correctColumn.indexOf(Number(elem)) === -1 && +elem !== elemsSum % 2) {
                elemsSum = +elem * 2;
                
                const verticalElemsSumPos = correctColumn.indexOf(elemsSum);
                l = 0;
                for (let k = 0; k < 16; k++) {
                    if (k % 4 === 0 && l <= 3) {
                        if (verticalElemsSumPos === l) {
                            specialCellIndex = i + k;
                            if (specialCellIndex != -1) cells[specialCellIndex].classList.add('cell-filling');
                        }
                        l++;
                    }
                }
            }
        }
    }
    num_2CreationFunc();
    progressSaveFunc();
}




function upMoveFunc() {
    specialCellIndex = 0;
    cellCombine = 0;
    for (let i = 0; i < 4; i++) {
        const column = [cells[i].innerHTML, cells[i+4].innerHTML, cells[i+8].innerHTML, cells[i+12].innerHTML];
        
        let filledCellsColumn = [];
        let emptyCellsColumn = [];
        for (let elem of column) {
            if (elem !== '') filledCellsColumn.push(+elem);
            else emptyCellsColumn.push('');
        }
        
        if (filledCellsColumn.length > 1) {
            for (let j = 0; j < filledCellsColumn.length - 1; j++) {
                if (filledCellsColumn[j] === filledCellsColumn[j+1]) {
                    cellCombine = filledCellsColumn[j] + filledCellsColumn[j+1];
                    score = score + cellCombine;
                    
                    // victory check
                    if (cellCombine === victoryNum) endGameFunc('Victory!');

                    emptyCellsColumn.push('');
                    filledCellsColumn[j+1] = cellCombine;
                    filledCellsColumn.splice(j, 1);
                }
            }
        }
        
        const correctColumn = filledCellsColumn.concat(emptyCellsColumn);
        let l = 0;
        for (let k = 0; k < 16; k++) {
            if (k % 4 === 0) {
                cells[i+k].innerHTML = correctColumn[l];
                if (correctColumn[l] != '') cells[i+k].classList = `cell num_${correctColumn[l]}`;
                else cells[i+k].classList = `cell`;
                l++;
            }
        }


        // animations
        let elemsSum = 0;
        let verticalElemsSumPos = 0;
        for (let elem of column) {
            if (elem !== '' && correctColumn.indexOf(Number(elem)) === -1 && +elem !== elemsSum % 2) {
                elemsSum = +elem * 2;

                for (let k = 3; k >= 0; k--) {
                    if (elemsSum == correctColumn[k] && verticalElemsSumPos === 0) verticalElemsSumPos = k;
                }
                if (verticalElemsSumPos === 0) specialCellIndex = i;
                else if (verticalElemsSumPos === 1) specialCellIndex = i + 4;
                else if (verticalElemsSumPos === 2) specialCellIndex = i + 8;
                cells[specialCellIndex].classList.add('cell-filling');
            }
        }
    }
    num_2CreationFunc();
    progressSaveFunc();
}









// eventListeners
function listeningStartFunc() {
    window.addEventListener('keyup', moveFunc_keyBoard);
    window.addEventListener('touchstart', moveFunc_touchStart);
    window.addEventListener('touchmove', moveFunc_touchMove);
}
listeningStartFunc();

function moveFunc_keyBoard(e) {
    if (e.key == 'ArrowRight') rightMoveFunc();
    else if (e.key == 'ArrowLeft') leftMoveFunc();
    else if (e.key == 'ArrowDown') downMoveFunc();
    else if (e.key == 'ArrowUp') upMoveFunc();
}


let clientX = '';
let clientY = '';
let l = 0;
function moveFunc_touchStart(e) {
    l = 0;
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
}
function moveFunc_touchMove(e) {
    if (clientX == '' && clientY == '') return false;

    if (l < 1) {
        const clientX_onMove = e.touches[0].clientX;
        const clientY_onMove = e.touches[0].clientY;
        const xSing = clientX_onMove - clientX;
        const ySing = clientY_onMove - clientY;
        if (Math.abs(xSing) > Math.abs(ySing)) {
            if (xSing > 0) rightMoveFunc();
            else leftMoveFunc();
        }
        else {
            if (ySing > 0) downMoveFunc();
            else upMoveFunc();
        }
    }
    l++;
}


function listeningStopFunc() {
    window.removeEventListener('keyup', moveFunc_keyBoard);
    window.removeEventListener('touchstart', moveFunc_touchStart);
    window.removeEventListener('touchmove', moveFunc_touchMove);
}






// victory and defeat
const endGameText = document.querySelectorAll('.end-game-text');
const endGameBg = document.querySelector('.end-game-bg');
function endGameFunc(gameResult) {
    const gameResultBlock = document.querySelector('.game-result');
    const endGameScore = document.querySelector('.end-game-score');
    const endGameExtraText = document.querySelector('.end-game-extra-text');
    const endGameClickArea = document.querySelector('.end-game-click-area');

    gameResultBlock.innerHTML = gameResult;
    endGameScore.innerHTML = score;
    endGameWindow.style.display = 'flex';
    setTimeout("endGameWindow.style.transform = 'translateY(-100%)'", 100);
    endGameText.forEach(text => text.classList.add('end-game-text-animation'));
    endGameExtraText.style.animationName = 'text-appearing';
    endGameBg.style.animationName = 'opacityOn';

    endGameClickArea.addEventListener('click', endGameClickFunc);
    endGameClickArea.addEventListener('touchend', endGameClickFunc);
    window.addEventListener('keyup', e => {
        if (e.key == 'Enter') endGameClickFunc();
    });

    listeningStopFunc();

    const ls_bestScore = localStorage.getItem('bestScore');
    if (ls_bestScore != null) {
        if (ls_bestScore < score) localStorage.setItem('bestScore', score);
    }
    else localStorage.setItem('bestScore', score);

    setTimeout("localStorage.removeItem('currentRoundSave')", 1500);
    setTimeout("localStorage.removeItem('currentScore');", 1500);
}




function defeatCheckFunc() {
    let defeatCheck = false;
    for (let i = 0; i < cells.length; i++) {
        if (i % 4 === 0) {
            if (+cells[i].innerHTML == +cells[i+1].innerHTML || +cells[i+1].innerHTML == +cells[i+2].innerHTML || +cells[i+2].innerHTML == +cells[i+3].innerHTML) {
                defeatCheck = true;
            }
        }
    }
    for (let i = 0; i < 4; i++) {
        if (+cells[i].innerHTML == +cells[i+4].innerHTML || +cells[i+4].innerHTML == +cells[i+8].innerHTML || +cells[i+8].innerHTML == +cells[i+12].innerHTML) {
            defeatCheck = true;
        }
    }

    if (defeatCheck === false) endGameFunc('Game Over');
}



function endGameClickFunc() {
    endGameText.forEach(text => {
        text.classList.remove('end-game-text-animation')
        text.classList.add('text-pulse-onclick');
    });
    endGameBg.style.opacity = '1';
    endGameWindow.style.transform = 'translateY(0)';
    setTimeout('tableGenerationFunc()', 800);
    setTimeout('location.reload()', 1500);
}





// save the progress
function progressSaveFunc() {
    const currentRoundSave = gameTable.innerHTML;
    localStorage.setItem('currentRoundSave', currentRoundSave);

    localStorage.setItem('currentScore', score);
    scoreBlock.innerHTML = score;
}




// menu
const menuButtonShell = document.querySelector('.menu-button-shell');
const continueBut = document.querySelector('.menu-continue');
const restartBut = document.querySelector('.menu-restart');
const menuButton = document.querySelector('.menu-button-click-area');

menuButton.addEventListener('click', menuOpeningFunc);

function menuOpeningFunc() {
    listeningStopFunc();

    menuWindow.style.display = 'flex';
    setTimeout('menuWindow.style.transform = "translateY(-100%)"', 10);

    continueBut.addEventListener('click', continueButFunc);
    window.addEventListener('keyup', e => {
        if (e.key == 'Escape') continueButFunc();
    });
    restartBut.addEventListener('click', restartButFunc);
}


function continueButFunc() {
    setTimeout("menuWindow.style.display = 'none'", 600);
    menuWindow.style.transform = 'translateY(0)';
    continueBut.removeEventListener('click', continueButFunc);
    restartBut.removeEventListener('click', restartButFunc);

    listeningStartFunc();
}
function restartButFunc() {
    localStorage.removeItem('currentScore');
    localStorage.removeItem('currentRoundSave');
    tableGenerationFunc();
    menuWindow.style.transform = 'translateY(0)';
    setTimeout('location.reload()', 600);
}