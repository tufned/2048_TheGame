// game table generation
const gameTable = document.querySelector('.game-table');
function tableGenerationFunc(tableSize) {
    gameTable.innerHTML = '';
    for (let i = 0; i < tableSize; i++) {
        let emptyCell = document.createElement('div');
        emptyCell.classList.add('empty-cell');
        gameTable.append(emptyCell);
        let cell = document.createElement('div');
        if (tableSize === 9) cell.classList = 'cell cell_3x3';
        else if (tableSize === 16) cell.classList = 'cell';
        emptyCell.append(cell);
    }
}





// best score + current score
let score = 0;
const scoreBlock = document.querySelector('.current-score');
const bestScoreBlock = document.querySelector('.best-score');
const bestScore_3x3 = localStorage.getItem('bestScore_3x3');
const bestScore_4x4 = localStorage.getItem('bestScore_4x4');

const ls_currentScore = +localStorage.getItem('currentScore'); 
if (ls_currentScore != null) {
    scoreBlock.innerHTML = ls_currentScore;
    score = ls_currentScore;
} 





// game start param
const tipBlock = document.querySelector('.tip-shell');
const finalScore = document.querySelector('.final-score');

const mainBlock = document.querySelector('.main');
const endGameWindow = document.querySelector('.end-game-window');
const menuWindow = document.querySelector('.menu-window');
mainBlock.style.height = window.innerHeight + 'px';
endGameWindow.style.height = window.innerHeight + 'px';
menuWindow.style.height = window.innerHeight + 'px';

let victoryNum = 2048;
const ls_currentRoundSave = localStorage.getItem('currentRoundSave');
const lineSize = +localStorage.getItem('lineSize');

if (ls_currentRoundSave == null) {
    if (lineSize != 0) {
        if (lineSize === 3) {
            tableGenerationFunc(9);
            victoryNum = 128;
            gameTable.classList.add('game-table_3x3');
            if (bestScore_3x3 != null && bestScore_3x3 != '') bestScoreBlock.innerHTML = bestScore_3x3;
            finalScore.innerHTML = victoryNum;
            tipBlock.style.animationName = 'tip-appearing';
        }
        else if (lineSize === 4) {
            tableGenerationFunc(16);
            if (bestScore_4x4 != null && bestScore_4x4 != '') bestScoreBlock.innerHTML = bestScore_4x4;
            tipBlock.style.animationName = 'tip-appearing';
        }
    }
    else {
        localStorage.setItem('lineSize', 4);
        tableGenerationFunc(16);
    }
}
else {
    if (lineSize === 3) {
        victoryNum = 128;
        gameTable.classList.add('game-table_3x3');
        if (bestScore_3x3 != null && bestScore_3x3 != '') bestScoreBlock.innerHTML = bestScore_3x3;
    }
    else if (lineSize === 4) {
        if (bestScore_4x4 != null && bestScore_4x4 != '') bestScoreBlock.innerHTML = bestScore_4x4;
    }
    gameTable.innerHTML = ls_currentRoundSave;
}

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







let cellCombine = 0;
let specialCellIndex = 0;
let filledCellsLine = [];
let emptyCellsLine = [];
let line = null;




// controls
function rightMoveFunc() {
    specialCellIndex = 0;
    cellCombine = 0;
    for (let i = 0; i < cells.length; i++) {
        if (i % lineSize === 0) {
            if (lineSize === 4) line = [cells[i].innerHTML, cells[i+1].innerHTML, cells[i+2].innerHTML, cells[i+3].innerHTML];
            else if (lineSize === 3) line = [cells[i].innerHTML, cells[i+1].innerHTML, cells[i+2].innerHTML];

            filledCellsLine = [];
            emptyCellsLine = [];

            lineFilterFunc();
            rightAndDownCombineFunc();

            const correctLine = emptyCellsLine.concat(filledCellsLine);
            for (let k = 0; k < lineSize; k++) {
                cells[i+k].innerHTML = correctLine[k];
                if (correctLine[k] != '') {
                    if (lineSize === 3) cells[i+k].classList = `cell cell_3x3 num_${correctLine[k]}`;
                    else if (lineSize === 4) cells[i+k].classList = `cell num_${correctLine[k]}`;
                }
                else {
                    if (lineSize === 3) cells[i+k].classList = `cell cell_3x3`;
                    else if (lineSize === 4) cells[i+k].classList = `cell`;
                }
            }
            
            // animations
            let elemsSum = 0;
            for (let elem of line) {
                if (elem !== '' && correctLine.indexOf(+elem) === -1 && +elem !== elemsSum % 2) {
                    elemsSum = +elem * 2;
                    specialCellIndex = i + correctLine.indexOf(elemsSum);
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
        if (i % lineSize === 0) {
            if (lineSize === 4) line = [cells[i].innerHTML, cells[i+1].innerHTML, cells[i+2].innerHTML, cells[i+3].innerHTML];
            else if (lineSize === 3) line = [cells[i].innerHTML, cells[i+1].innerHTML, cells[i+2].innerHTML];
            
            filledCellsLine = [];
            emptyCellsLine = [];
            
            lineFilterFunc();
            leftAndUpCombineFunc();

            const correctLine = filledCellsLine.concat(emptyCellsLine);
            for (let k = 0; k < lineSize; k++) {
                cells[i+k].innerHTML = correctLine[k];
                if (correctLine[k] != '') {
                    if (lineSize === 3) cells[i+k].classList = `cell cell_3x3 num_${correctLine[k]}`;
                    else if (lineSize === 4) cells[i+k].classList = `cell num_${correctLine[k]}`;
                }
                else {
                    if (lineSize === 3) cells[i+k].classList = `cell cell_3x3`;
                    else if (lineSize === 4) cells[i+k].classList = `cell`;
                }
                
            }
            
            // animations
            let elemsSum = 0;
            let elemsSumPos = 0;
            for (let elem of line) {
                if (elem !== '' && correctLine.indexOf(+elem) === -1 && +elem !== elemsSum % 2) {
                    elemsSum = +elem * 2;

                    if (elemsSum == correctLine[0] || elemsSum == correctLine[1]) {
                        for (let k = lineSize-1; k >= 0; k--) {
                            if (elemsSum == correctLine[k] && elemsSumPos === 0) elemsSumPos = k;
                        }
                        specialCellIndex = i + elemsSumPos;
                        cells[specialCellIndex].classList.add('cell-filling');
                    }
                    else {
                        elemsSumPos = correctLine.indexOf(elemsSum); 
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
    for (let i = 0; i < lineSize; i++) {
        if (lineSize === 4) line = [cells[i].innerHTML, cells[i+4].innerHTML, cells[i+8].innerHTML, cells[i+12].innerHTML];
        else if (lineSize === 3) line = [cells[i].innerHTML, cells[i+3].innerHTML, cells[i+6].innerHTML];
        
        filledCellsLine = [];
        emptyCellsLine = [];
        
        lineFilterFunc();
        rightAndDownCombineFunc();
        
        const correctLine = emptyCellsLine.concat(filledCellsLine);
        let l = 0;
        for (let k = 0; k < cells.length; k++) {
            if (k % lineSize === 0) {
                cells[i+k].innerHTML = correctLine[l];
                if (correctLine[l] != '') {
                    if (lineSize === 3) cells[i+k].classList = `cell cell_3x3 num_${correctLine[l]}`;
                    else if (lineSize === 4) cells[i+k].classList = `cell num_${correctLine[l]}`;
                }
                else {
                    if (lineSize === 3) cells[i+k].classList = `cell cell_3x3`;
                    else if (lineSize === 4) cells[i+k].classList = `cell`;
                }
                l++;
            }
        }


        // animations
        let elemsSum = 0;
        for (let elem of line) {
            if (elem !== '' && correctLine.indexOf(Number(elem)) === -1 && +elem !== elemsSum % 2) {
                elemsSum = +elem * 2;
                
                const verticalElemsSumPos = correctLine.indexOf(elemsSum);
                l = 0;
                for (let k = 0; k < cells.length; k++) {
                    if (k % lineSize === 0 && l <= lineSize-1) {
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
    for (let i = 0; i < lineSize; i++) {
        if (lineSize === 4) line = [cells[i].innerHTML, cells[i+4].innerHTML, cells[i+8].innerHTML, cells[i+12].innerHTML];
        else if (lineSize === 3) line = [cells[i].innerHTML, cells[i+3].innerHTML, cells[i+6].innerHTML];
        
        filledCellsLine = [];
        emptyCellsLine = [];
        
        lineFilterFunc();
        leftAndUpCombineFunc();
        
        const correctLine = filledCellsLine.concat(emptyCellsLine);
        let l = 0;
        for (let k = 0; k < cells.length; k++) {
            if (k % lineSize === 0) {
                cells[i+k].innerHTML = correctLine[l];
                if (correctLine[l] != '') {
                    if (lineSize === 3) cells[i+k].classList = `cell cell_3x3 num_${correctLine[l]}`;
                    else if (lineSize === 4) cells[i+k].classList = `cell num_${correctLine[l]}`;
                }
                else {
                    if (lineSize === 3) cells[i+k].classList = `cell cell_3x3`;
                    else if (lineSize === 4) cells[i+k].classList = `cell`;
                }
                l++;
            }
        }


        // animations
        let elemsSum = 0;
        let verticalElemsSumPos = 0;
        for (let elem of line) {
            if (elem !== '' && correctLine.indexOf(Number(elem)) === -1 && +elem !== elemsSum % 2) {
                elemsSum = +elem * 2;

                for (let k = lineSize-1; k >= 0; k--) {
                    if (elemsSum == correctLine[k] && verticalElemsSumPos === 0) verticalElemsSumPos = k;
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






function lineFilterFunc() {
    for (let elem of line) {
        if (elem !== '') filledCellsLine.push(+elem);
        else emptyCellsLine.push('');
    }
}

function rightAndDownCombineFunc() {
    if (filledCellsLine.length > 1) {
        for (let j = 0; j < filledCellsLine.length - 1; j++) {
            if (filledCellsLine[j] === filledCellsLine[j+1] && filledCellsLine[j+1] === filledCellsLine[j+2] && filledCellsLine[j+2] !== filledCellsLine[j+3]) {
                cellCombine = filledCellsLine[j+1] + filledCellsLine[j+2];
                score = score + cellCombine;

                // victory check
                if (cellCombine === victoryNum) endGameFunc('Victory!');

                filledCellsLine[j+2] = cellCombine;
                filledCellsLine.splice(j+1, 1);
                filledCellsLine.unshift('');
            }
            else if (filledCellsLine[j] === filledCellsLine[j+1]) {
                cellCombine = filledCellsLine[j] + filledCellsLine[j+1];
                score = score + cellCombine;

                // victory check
                if (cellCombine === victoryNum) endGameFunc('Victory!');

                emptyCellsLine.push('');
                filledCellsLine[j+1] = cellCombine;
                filledCellsLine.splice(j, 1);
            }
        }
    }
}

function leftAndUpCombineFunc() {
    if (filledCellsLine.length > 1) {
        for (let j = 0; j < filledCellsLine.length - 1; j++) {
            if (filledCellsLine[j] === filledCellsLine[j+1]) {
                cellCombine = filledCellsLine[j] + filledCellsLine[j+1];
                score = score + cellCombine;
                
                // victory check
                if (cellCombine === victoryNum) endGameFunc('Victory!');

                emptyCellsLine.push('');
                filledCellsLine[j] = cellCombine;
                filledCellsLine.splice(j+1, 1);
            }
        }
    }
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

    if (lineSize === 4) {
        if (bestScore_4x4 != null) {
            if (bestScore_4x4 < score) localStorage.setItem('bestScore_4x4', score);
        }
        else localStorage.setItem('bestScore_4x4', score);

    }
    else if (lineSize === 3) {
        if (bestScore_3x3 != null) {
            if (bestScore_3x3 < score) localStorage.setItem('bestScore_3x3', score);
        }
        else localStorage.setItem('bestScore_3x3', score);
    }

    setTimeout("localStorage.removeItem('currentRoundSave')", 1500);
    setTimeout("localStorage.removeItem('currentScore');", 1500);
}




function defeatCheckFunc() {
    let defeatCheck = false;
    for (let i = 0; i < cells.length; i++) {
        if (i % lineSize === 0) {
            for (let k = 0; k < lineSize - 1; k++) {
                if (+cells[i+k].innerHTML == +cells[i+(k+1)].innerHTML) defeatCheck = true;
            }
        }
    }
    let l = 0;
    for (let i = 0; i < lineSize; i++) {
        for (let k = 0; k < cells.length; k++) {
            if (k % lineSize === 0 && l < lineSize - 1) {
                if (+cells[i+k].innerHTML == +cells[i+(k+lineSize)].innerHTML) defeatCheck = true;
                l++;
            }
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
    setTimeout('location.reload()', 1500);
}





// save the progress
function progressSaveFunc() {
    const currentRoundSave = gameTable.innerHTML;
    localStorage.setItem('currentRoundSave', currentRoundSave);

    localStorage.setItem('currentScore', score);
    scoreBlock.innerHTML = score;

    if (score <= 4) { 
        tipBlock.classList.add('tip-hiding');
        tipBlock.style.animationName = 'tip-hiding';
    }
}




// menu
const menuButtonShell = document.querySelector('.menu-button-shell');
const continueBut = document.querySelector('.menu-continue');
const restartBut = document.querySelector('.menu-restart');
const menuButton = document.querySelector('.menu-button-click-area');

const sizeChangeBlock = document.querySelector('.game-table-size-change');
const size_3x3Block = document.querySelector('.size_3x3');
const size_4x4Block = document.querySelector('.size_4x4');
const target = document.querySelector('.target');

menuButton.addEventListener('click', menuOpeningFunc);

function menuOpeningFunc() {
    listeningStopFunc();

    if (lineSize === 3) {
        target.style.animationName = 'target-reduce_3x3';
        target.innerHTML = '3x3';
    }
    else if (lineSize === 4) {
        target.style.animationName = 'target-reduce_4x4';
        target.innerHTML = '4x4';
    }

    menuWindow.style.display = 'flex';
    setTimeout('menuWindow.style.transform = "translateY(-100%)"', 10);

    continueBut.addEventListener('click', continueButFunc);
    window.addEventListener('keyup', e => {
        if (e.key == 'Escape') continueButFunc();
    });
    restartBut.addEventListener('click', restartButFunc);
    sizeChangeBlock.addEventListener('click', tableSizeSetFunc);
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
    menuWindow.style.transform = 'translateY(0)';
    setTimeout('location.reload()', 600);
}





function tableSizeSetFunc(e) {
    if (e.target == size_3x3Block) {
        target.classList.add('size_3x3-set');
        setTimeout("target.style.transform = 'translateX(0)'", 10);
        target.innerHTML = '3x3';
        sizeChangeBlock.style.animationName = 'size-change-click';

        localStorage.setItem('lineSize', 3);
        
        localStorage.removeItem('currentScore');
        localStorage.removeItem('currentRoundSave');
        setTimeout("menuWindow.style.transform = 'translateY(0)'", 500);
        setTimeout('location.reload()', 800);
    }
    else if (e.target == size_4x4Block) {
        target.classList.add('size_4x4-set');
        setTimeout("target.style.transform = 'translateX(100%)'", 10);
        target.innerHTML = '4x4';
        sizeChangeBlock.style.animationName = 'size-change-click';

        localStorage.setItem('lineSize', 4);
        
        localStorage.removeItem('currentScore');
        localStorage.removeItem('currentRoundSave');
        setTimeout("menuWindow.style.transform = 'translateY(0)'", 500);
        setTimeout('location.reload()', 800);
    }
}