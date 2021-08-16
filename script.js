// game table generation
const gameTable = document.querySelector('.game-table');
function table_4x4_generationFunc() {
    gameTable.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        let div = document.createElement('div');
        div.classList.add('cell');
        gameTable.append(div);
    }
}


// game start param
const ls_currentRoundSave = localStorage.getItem('currentRoundSave');
if (ls_currentRoundSave == null) {
    table_4x4_generationFunc();
}
else {
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
            if (randomCell.classList.contains('filled') != 1) resultCell = randomCell;
        }
        else defeatCheckFunc();
    }

    if (resultCell != '') {
        resultCell.classList.add('filled', 'num_2', 'cell-append');
        resultCell.innerHTML = 2;
    }
}
if (ls_currentRoundSave == null) {
    num_2CreationFunc();
    num_2CreationFunc();
}




// cell style render
function cellStyleRender() {
    for (let cell of cells) {
        cell.classList = 'cell';
        if (cell.innerHTML !== '') {
            if (+cell.innerHTML === 2) cell.classList.add('filled', 'num_2');
            else if (+cell.innerHTML === 4) cell.classList.add('filled', 'num_4');
            else if (+cell.innerHTML === 8) cell.classList.add('filled', 'num_8');
            else if (+cell.innerHTML === 16) cell.classList.add('filled', 'num_16');
            else if (+cell.innerHTML === 32) cell.classList.add('filled', 'num_32');
            else if (+cell.innerHTML === 64) cell.classList.add('filled', 'num_64');
            else if (+cell.innerHTML === 128) cell.classList.add('filled', 'num_128');
            else if (+cell.innerHTML === 256) cell.classList.add('filled', 'num_256');
            else if (+cell.innerHTML === 512) cell.classList.add('filled', 'num_512');
            else if (+cell.innerHTML === 1024) cell.classList.add('filled', 'num_1024');
            else if (+cell.innerHTML === 2048) cell.classList.add('filled', 'num_2048');
        }
    }
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
let cellCombineArr = [];
let specialCellIndex = [];


// controls
function rightMoveFunc(e) {
    if (e.key == 'ArrowRight') {
        specialCellIndex = [];
        cellCombine = 0;
        cellCombineArr = [];
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
                    for (let i = 0; i < filledCellsRow.length - 1; i++) {
                        if (filledCellsRow[i] === filledCellsRow[i+1] && filledCellsRow[i+1] === filledCellsRow[i+2] && filledCellsRow[i+2] !== filledCellsRow[i+3]) {
                            cellCombine = filledCellsRow[i+1] + filledCellsRow[i+2];
                            score = score + cellCombine;
                            cellCombineArr.push(cellCombine);

                            filledCellsRow[i+2] = cellCombine;
                            filledCellsRow.splice(i+1, 1);
                            filledCellsRow.unshift('');
                        }
                        else if (filledCellsRow[i] === filledCellsRow[i+1]) {
                            cellCombine = filledCellsRow[i] + filledCellsRow[i+1];
                            score = score + cellCombine;
                            cellCombineArr.push(cellCombine);

                            emptyCellsRow.push('');
                            filledCellsRow[i+1] = cellCombine;
                            filledCellsRow.splice(i, 1);
                        }
                    }
                }

                const correctRow = emptyCellsRow.concat(filledCellsRow);
                cells[i].innerHTML = correctRow[0];
                cells[i+1].innerHTML = correctRow[1];
                cells[i+2].innerHTML = correctRow[2];
                cells[i+3].innerHTML = correctRow[3];


                // animations
                let elemsSum = 0;
                for (let elem of row) {
                    if (elem !== '' && correctRow.indexOf(Number(elem)) === -1) {
                        elemsSum = elemsSum + +elem;
                    }
                }
                const elemsSumPos = correctRow.indexOf(elemsSum); 
                if (elemsSumPos !== -1) specialCellIndex.push(i + elemsSumPos);
            }
        }
        cellStyleRender();
        num_2CreationFunc();
        setAnimFunc();
        victoryCheckFunc();
        progressSaveFunc()
    }
}



function leftMoveFunc(e) {
    if (e.key == 'ArrowLeft') {
        specialCellIndex = [];
        cellCombine = 0;
        cellCombineArr = [];
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
                    for (let i = 0; i < filledCellsRow.length - 1; i++) {
                        if (filledCellsRow[i] === filledCellsRow[i+1]) {
                            cellCombine = filledCellsRow[i] + filledCellsRow[i+1];
                            score = score + cellCombine;
                            cellCombineArr.push(cellCombine);

                            emptyCellsRow.push('');
                            filledCellsRow[i] = cellCombine;
                            filledCellsRow.splice(i+1, 1);
                        }
                    }
                }

                const correctRow = filledCellsRow.concat(emptyCellsRow);
                cells[i].innerHTML = correctRow[0];
                cells[i+1].innerHTML = correctRow[1];
                cells[i+2].innerHTML = correctRow[2];
                cells[i+3].innerHTML = correctRow[3];


                // animations
                let elemsSum = 0;
                for (let elem of row) {
                    if (elem !== '' && correctRow.indexOf(Number(elem)) === -1) {
                        elemsSum = elemsSum + +elem;
                    }
                }
                const elemsSumPos = correctRow.indexOf(elemsSum); 
                if (elemsSumPos !== -1) specialCellIndex.push(i + elemsSumPos);
            }
        }
        cellStyleRender();
        num_2CreationFunc();
        setAnimFunc();
        scoreBlock.innerHTML = score;
        victoryCheckFunc();
        progressSaveFunc()
    }
}



function downMoveFunc(e) {
    if (e.key == 'ArrowDown') {
        specialCellIndex = [];
        cellCombine = 0;
        cellCombineArr = [];
        for (let i = 0; i < 4; i++) {
            const column = [cells[i].innerHTML, cells[i+4].innerHTML, cells[i+8].innerHTML, cells[i+12].innerHTML];
            
            let filledCellsColumn = [];
            let emptyCellsColumn = [];
            for (let elem of column) {
                if (elem !== '') filledCellsColumn.push(+elem);
                else emptyCellsColumn.push('');
            }
            
            if (filledCellsColumn.length > 1) {
                for (let i = 0; i < filledCellsColumn.length - 1; i++) {
                    if (filledCellsColumn[i] === filledCellsColumn[i+1] && filledCellsColumn[i+1] === filledCellsColumn[i+2] && filledCellsColumn[i+2] !== filledCellsColumn[i+3]) {
                        cellCombine = filledCellsColumn[i+1] + filledCellsColumn[i+2];
                        score = score + cellCombine;
                        cellCombineArr.push(cellCombine);

                        filledCellsColumn[i+2] = cellCombine;
                        filledCellsColumn.splice(i+1, 1);
                        filledCellsColumn.unshift('');
                    }
                    else if (filledCellsColumn[i] === filledCellsColumn[i+1]) {
                        cellCombine = filledCellsColumn[i] + filledCellsColumn[i+1];
                        score = score + cellCombine;
                        cellCombineArr.push(cellCombine);

                        emptyCellsColumn.push('');
                        filledCellsColumn[i+1] = cellCombine;
                        filledCellsColumn.splice(i, 1);
                    }
                }
            }
            
            const correctColumn = emptyCellsColumn.concat(filledCellsColumn);
            cells[i].innerHTML = correctColumn[0];
            cells[i+4].innerHTML = correctColumn[1];
            cells[i+8].innerHTML = correctColumn[2];
            cells[i+12].innerHTML = correctColumn[3];


            // animations
            let elemsSum = 0;
            for (let elem of column) {
                if (elem !== '' && correctColumn.indexOf(Number(elem)) === -1) {
                    elemsSum = elemsSum + +elem;
                }
            }
            const verticalElemsSumPos = correctColumn.indexOf(elemsSum);
            if (verticalElemsSumPos === 1) specialCellIndex.push(4 + i);
            else if (verticalElemsSumPos === 2) specialCellIndex.push(8 + i);
            else if (verticalElemsSumPos === 3) specialCellIndex.push(12 + i);
        }
        cellStyleRender();
        num_2CreationFunc();
        setAnimFunc();
        scoreBlock.innerHTML = score;
        victoryCheckFunc();
        progressSaveFunc()
    }
}




function upMoveFunc(e) {
    if (e.key == 'ArrowUp') {
        specialCellIndex = [];
        cellCombine = 0;
        cellCombineArr = [];
        for (let i = 0; i < 4; i++) {
            const column = [cells[i].innerHTML, cells[i+4].innerHTML, cells[i+8].innerHTML, cells[i+12].innerHTML];
            
            let filledCellsColumn = [];
            let emptyCellsColumn = [];
            for (let elem of column) {
                if (elem !== '') filledCellsColumn.push(+elem);
                else emptyCellsColumn.push('');
            }
            
            if (filledCellsColumn.length > 1) {
                for (let i = 0; i < filledCellsColumn.length - 1; i++) {
                    if (filledCellsColumn[i] === filledCellsColumn[i+1]) {
                        cellCombine = filledCellsColumn[i] + filledCellsColumn[i+1];
                        score = score + cellCombine;
                        cellCombineArr.push(cellCombine);

                        emptyCellsColumn.push('');
                        filledCellsColumn[i+1] = cellCombine;
                        filledCellsColumn.splice(i, 1);
                    }
                }
            }
            
            const correctColumn = filledCellsColumn.concat(emptyCellsColumn);
            cells[i].innerHTML = correctColumn[0];
            cells[i+4].innerHTML = correctColumn[1];
            cells[i+8].innerHTML = correctColumn[2];
            cells[i+12].innerHTML = correctColumn[3];


            // animations
            let elemsSum = 0;
            for (let elem of column) {
                if (elem !== '' && correctColumn.indexOf(Number(elem)) === -1) {
                    elemsSum = elemsSum + +elem;
                }
            }
            const verticalElemsSumPos = correctColumn.indexOf(elemsSum);
            if (verticalElemsSumPos === 0) specialCellIndex.push(i);
            else if (verticalElemsSumPos === 1) specialCellIndex.push(4 + i);
            else if (verticalElemsSumPos === 2) specialCellIndex.push(8 + i);
        }
        cellStyleRender();
        num_2CreationFunc();
        setAnimFunc();
        scoreBlock.innerHTML = score;
        victoryCheckFunc();
        progressSaveFunc()
    }
}



window.addEventListener('keyup', rightMoveFunc);
window.addEventListener('keyup', leftMoveFunc);
window.addEventListener('keyup', downMoveFunc);
window.addEventListener('keyup', upMoveFunc);







function setAnimFunc() {
    for (let index of specialCellIndex) {
        if (index !== -1) cells[index].classList.add('cell-filling');
    }
}



// victory and defeat
const endGameWindow = document.querySelector('.end-game-window');
const endGameText = document.querySelectorAll('.end-game-text');
function endGameFunc(gameResult) {
    const gameResultBlock = document.querySelector('.game-result');
    const endGameScore = document.querySelector('.end-game-score');
    const endGameExtraText = document.querySelector('.end-game-extra-text');
    const endGameClickArea = document.querySelector('.end-game-click-area');
    const endGameBg = document.querySelector('.end-game-bg');

    gameResultBlock.innerHTML = gameResult;
    endGameScore.innerHTML = score;
    endGameWindow.style.transform = 'translateY(-100%)';
    endGameText.forEach(text => text.classList.add('end-game-text-animation'));
    endGameExtraText.style.animationName = 'text-appearing';
    endGameBg.style.animationName = 'opacityOn';

    endGameClickArea.addEventListener('click', endGameClickFunc);
    window.addEventListener('keyup', e => {
        if (e.key == 'Enter') endGameClickFunc();
    });

    window.removeEventListener('keyup', rightMoveFunc);
    window.removeEventListener('keyup', leftMoveFunc);
    window.removeEventListener('keyup', downMoveFunc);
    window.removeEventListener('keyup', upMoveFunc);

    const ls_bestScore = localStorage.getItem('bestScore');
    if (ls_bestScore != null) {
        if (ls_bestScore < score) localStorage.setItem('bestScore', score);
    }
    else localStorage.setItem('bestScore', score);
}




function victoryCheckFunc() {
    for (let elem of cellCombineArr) {
        if (elem === victoryNum) endGameFunc('Victory!');
    }
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
    table_4x4_generationFunc();
    localStorage.removeItem('currentRoundSave');
    localStorage.removeItem('currentScore');
    endGameText.forEach(text => {
        text.classList.remove('end-game-text-animation')
        text.classList.add('text-pulse-onclick');
    });
    endGameWindow.style.transform = 'translateY(0)';
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
const menuWindow = document.querySelector('.menu-window');
const menuButtonShell = document.querySelector('.menu-button-shell');
const continueBut = document.querySelector('.menu-continue');
const restartBut = document.querySelector('.menu-restart');
const menuButton = document.querySelector('.menu-button-click-area');
menuButton.addEventListener('click', menuOpeningFunc);

function menuOpeningFunc() {
    window.removeEventListener('keyup', rightMoveFunc);
    window.removeEventListener('keyup', leftMoveFunc);
    window.removeEventListener('keyup', downMoveFunc);
    window.removeEventListener('keyup', upMoveFunc);

    menuWindow.style.transform = 'translateY(-200%)';

    continueBut.addEventListener('click', continueButFunc);
    window.addEventListener('keyup', e => {
        if (e.key == 'Escape') continueButFunc();
    });
    restartBut.addEventListener('click', restartButFunc);
}


function continueButFunc() {
    menuWindow.style.transform = 'translateY(0)';

    window.addEventListener('keyup', rightMoveFunc);
    window.addEventListener('keyup', leftMoveFunc);
    window.addEventListener('keyup', downMoveFunc);
    window.addEventListener('keyup', upMoveFunc);
}
function restartButFunc() {
    localStorage.removeItem('currentScore');
    localStorage.removeItem('currentRoundSave');
    table_4x4_generationFunc();
    menuWindow.style.transform = 'translateY(0)';
    setTimeout('location.reload()', 600);
}