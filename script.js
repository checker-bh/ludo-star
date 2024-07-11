let boxes = [], redPieces = [], yellowPieces = [], greenPieces = [], bluePieces = [];
let playerTurns = [redPieces, greenPieces, bluePieces, yellowPieces];
let currentPlayerIndex = 0;
let extraTurn = 0;
let winCount = 0;
let zIndexValue = 5;
let blockedPlayers = -1;
let playerSelections = [];
let blocks = [];

for (let i = 0; i < 52; i++) {
    boxes[i] = document.querySelector("#c" + i.toString());
    boxes[i].style.width = '46px';
    boxes[i].style.height = '46px';
}

for (let i = 61, o = 1; i < 67, o < 7; i++, o++) {
    boxes[i] = document.querySelector("#rr" + o.toString());
    if (i != 66 && o != 6) {
        boxes[i].style.width = '46px';
        boxes[i].style.height = '46px';
    }
}

for (i = 71, o = 1; i < 77, o < 7; i++, o++) {
    boxes[i] = document.querySelector("#gr" + o.toString());
    if (i != 76 && o != 6) {
        boxes[i].style.width = '46px';
        boxes[i].style.height = '46px';
    }
}

for (i = 81, o = 1; i < 87, o < 7; i++, o++) {
    boxes[i] = document.querySelector("#br" + o.toString());
    if (i != 86 && o != 6) {
        boxes[i].style.width = '46px';
        boxes[i].style.height = '46px';
    }
}

for (i = 91, o = 1; i < 97, o < 7; i++, o++) {
    boxes[i] = document.querySelector("#yr" + o.toString());
    if (i != 96 && o != 6) {
        boxes[i].style.width = '46px';
        boxes[i].style.height = '46px';
    }
}

for (i = 1; i < 5; i++) {
    redPieces[i] = document.querySelector(".r" + i.toString());
    redPieces[i].pic = document.querySelector("#rp" + i.toString());
    redPieces[i].state = -1;
    redPieces[i].flag = 0;
    redPieces[i].name = "red";
    redPieces[i].home = document.querySelector(".rk" + i.toString())
    redPieces[i].start = 13;

    yellowPieces[i] = document.querySelector(".y" + i.toString());
    yellowPieces[i].pic = document.querySelector("#yp" + i.toString());
    yellowPieces[i].state = -1;
    yellowPieces[i].flag = 0;
    yellowPieces[i].start = 0;
    yellowPieces[i].name = "yellow";
    yellowPieces[i].home = document.querySelector(".yk" + i.toString());

    bluePieces[i] = document.querySelector(".b" + i.toString());
    bluePieces[i].pic = document.querySelector("#bp" + i.toString());
    bluePieces[i].state = -1;
    bluePieces[i].name = "blue";
    bluePieces[i].home = document.querySelector(".bk" + i.toString());
    bluePieces[i].start = 39;
    bluePieces[i].flag = 0;

    greenPieces[i] = document.querySelector(".g" + i.toString());
    greenPieces[i].pic = document.querySelector("#gp" + i.toString());
    greenPieces[i].state = -1;
    greenPieces[i].name = "green";
    greenPieces[i].home = document.querySelector(".gk" + i.toString());
    greenPieces[i].start = 26;
    greenPieces[i].flag = 0;
}

for (let i = 0; i < 4; i++) {
    playerSelections[i] = document.querySelector(".plse" + i);
}

let diceButton = document.querySelector(".dicy");
let diceDisplay = document.querySelector(".dice");
let winMessage = document.querySelector(".win");
let playerChangeButton = document.querySelector(".plchbtn");
let playerCountDropdown = document.querySelector(".plct");

playerChangeButton.onclick = function (e) {
    e.preventDefault();
    var playerCount = parseInt(playerCountDropdown.value);
    for (let i = 0; i < 4; i++) {
        if (playerSelections[i].checked == false && playerCount) {
            blocks[++blockedPlayers] = playerSelections[i].value;
            playerCount--;
        }
    }
    playerChangeButton.disabled = true;
};

diceButton.onclick = function (e) {
    e.preventDefault();
    rollDice();
};

function rollDice() {
    let diceValue = Math.floor((Math.random() * 6) + 1);
    let diceImageUrl = "url('pictures/" + diceValue.toString() + ".png')";
    diceButton.style.backgroundImage = diceImageUrl;
    handleDiceRoll(diceValue);
}

function handleDiceRoll(diceValue) {
    playerTurns[currentPlayerIndex][1].pic.style.zIndex = playerTurns[currentPlayerIndex][2].pic.style.zIndex = playerTurns[currentPlayerIndex][3].pic.style.zIndex = playerTurns[currentPlayerIndex][4].pic.style.zIndex = zIndexValue++;
    for (i = 0; i < 4; i++) {
        if (currentPlayerIndex == blocks[i])
            currentPlayerIndex++;
        validateCurrentPlayerIndex(currentPlayerIndex);
    }
    diceDisplay.style.backgroundColor = playerTurns[currentPlayerIndex][4].name;
    if (playerTurns[currentPlayerIndex][1].state == -1 && playerTurns[currentPlayerIndex][2].state == -1 && playerTurns[currentPlayerIndex][3].state == -1 && playerTurns[currentPlayerIndex][4].state == -1 && diceValue != 6) {
        currentPlayerIndex++;
        validateCurrentPlayerIndex(currentPlayerIndex);
    } else if (playerTurns[currentPlayerIndex][1].flag == 3 && playerTurns[currentPlayerIndex][2].flag == 3 && playerTurns[currentPlayerIndex][3].flag == 3 && playerTurns[currentPlayerIndex][4].flag == 3) {
        currentPlayerIndex++;
        validateCurrentPlayerIndex(currentPlayerIndex);
    } else {
        diceButton.disabled = true;
        handlePlayerTurn(diceValue);
    }
}

function handlePlayerTurn(diceValue) {
    extraTurn = 0;
    for (let j = 1; j < 5; j++) {
        playerTurns[currentPlayerIndex][j].onclick = (e) => {
            e.preventDefault();
            if (playerTurns[currentPlayerIndex][j].state == -1 && diceValue == 6) {
                boxes[playerTurns[currentPlayerIndex][j].start].appendChild(playerTurns[currentPlayerIndex][j]);
                playerTurns[currentPlayerIndex][j].state = playerTurns[currentPlayerIndex][j].start;
                disableAllPieceClicks();
                diceButton.disabled = false;
            } else if (playerTurns[currentPlayerIndex][j].state != -1 && diceValue == 6) {
                playerTurns[currentPlayerIndex][j].state += diceValue;
                validateState(currentPlayerIndex, j);
                checkCollision(currentPlayerIndex, j);
                checkHomeRow(currentPlayerIndex, j);
                checkWinner(currentPlayerIndex, j, diceValue);
                boxes[playerTurns[currentPlayerIndex][j].state].appendChild(playerTurns[currentPlayerIndex][j]);
                disableAllPieceClicks();
                checkGameWinner();
                diceButton.disabled = false;
            } else if (playerTurns[currentPlayerIndex][j].state != -1 && diceValue != 6) {
                playerTurns[currentPlayerIndex][j].state += diceValue;
                validateState(currentPlayerIndex, j);
                checkCollision(currentPlayerIndex, j);
                checkHomeRow(currentPlayerIndex, j);
                checkWinner(currentPlayerIndex, j, diceValue);
                boxes[playerTurns[currentPlayerIndex][j].state].appendChild(playerTurns[currentPlayerIndex][j]);
                disableAllPieceClicks();
                if (extraTurn != 1)
                    currentPlayerIndex++;
                validateCurrentPlayerIndex(currentPlayerIndex);
                checkGameWinner();
                diceButton.disabled = false;
            }
        }
    }
}

function validateCurrentPlayerIndex(index) {
    if (index == 4)
        currentPlayerIndex = 0;
}

function validateState(playerIndex, pieceIndex) {
    if (playerTurns[playerIndex][pieceIndex].state > 51 && playerTurns[playerIndex][pieceIndex].flag == 0 && playerIndex != 3) {
        playerTurns[playerIndex][pieceIndex].state = playerTurns[playerIndex][pieceIndex].state - 51 - 1;
        playerTurns[playerIndex][pieceIndex].flag = 1;
    } else if (playerIndex == 3 && playerTurns[playerIndex][pieceIndex].flag == 0) {
        if (playerTurns[playerIndex][pieceIndex].state > 50) {
            playerTurns[playerIndex][pieceIndex].state = (playerTurns[playerIndex][pieceIndex].state - 50) + 90;
            playerTurns[playerIndex][pieceIndex].flag = 1;
        }
    }
}

function checkCollision(playerIndex, pieceIndex) {
    if (playerTurns[playerIndex][pieceIndex].state != 0 && playerTurns[playerIndex][pieceIndex].state != 13 && playerTurns[playerIndex][pieceIndex].state != 26 && playerTurns[playerIndex][pieceIndex].state != 39 && playerTurns[playerIndex][pieceIndex].state != 47 && playerTurns[playerIndex][pieceIndex].state != 8 && playerTurns[playerIndex][pieceIndex].state != 21 && playerTurns[playerIndex][pieceIndex].state != 34) {
        for (let k = 0; k < 4; k++) {
            for (let l = 1; l < 5; l++) {
                if (playerTurns[playerIndex][pieceIndex].state == playerTurns[k][l].state && playerIndex != k) {
                    (playerTurns[k][l].home).appendChild(playerTurns[k][l]);
                    playerTurns[k][l].state = -1;
                    playerTurns[k][l].flag = 0;
                    extraTurn = 1;
                }
            }
        }
    }
}

function checkHomeRow(playerIndex, pieceIndex) {
    if (playerIndex == 0) {
        if (playerTurns[playerIndex][pieceIndex].state > 11 && playerTurns[playerIndex][pieceIndex].flag == 1) {
            playerTurns[playerIndex][pieceIndex].state = (playerTurns[playerIndex][pieceIndex].state - 11) + 60;
            playerTurns[playerIndex][pieceIndex].flag = 2;
        }
    } else if (playerIndex == 1) {
        if (playerTurns[playerIndex][pieceIndex].state > 24 && playerTurns[playerIndex][pieceIndex].flag == 1) {
            playerTurns[playerIndex][pieceIndex].state = (playerTurns[playerIndex][pieceIndex].state - 24) + 70;
            playerTurns[playerIndex][pieceIndex].flag = 2;
        }
    } else if (playerIndex == 2) {
        if (playerTurns[playerIndex][pieceIndex].state > 37 && playerTurns[playerIndex][pieceIndex].flag == 1) {
            playerTurns[playerIndex][pieceIndex].state = (playerTurns[playerIndex][pieceIndex].state - 37) + 80;
            playerTurns[playerIndex][pieceIndex].flag = 2;
        }
    }
}
function displayMessage(message) {
    document.getElementById('messageArea').innerText = message;
}

function checkWinner(playerIndex, pieceIndex, diceValue) {
    if (playerIndex == 0) {
        if (playerTurns[playerIndex][pieceIndex].state > 66) {
            playerTurns[playerIndex][pieceIndex].state = playerTurns[playerIndex][pieceIndex].state - diceValue;
        } else if (playerTurns[playerIndex][pieceIndex].state == 66) {
            playerTurns[playerIndex][pieceIndex].flag = 3;
            playerTurns[playerIndex][pieceIndex].disabled = true;
            extraTurn = 1;
            displayMessage(playerTurns[playerIndex][pieceIndex].name + pieceIndex + " is in home");
        }
    } else if (playerIndex == 1) {
        if (playerTurns[playerIndex][pieceIndex].state > 76) {
            playerTurns[playerIndex][pieceIndex].flag = 3;
            playerTurns[playerIndex][pieceIndex].state = playerTurns[playerIndex][pieceIndex].state - diceValue;
        } else if (playerTurns[playerIndex][pieceIndex].state == 76) {
            playerTurns[playerIndex][pieceIndex].flag = 3;
            playerTurns[playerIndex][pieceIndex].disabled = true;
            extraTurn = 1;
            displayMessage(playerTurns[playerIndex][pieceIndex].name + pieceIndex + " is in home");
        }
    } else if (playerIndex == 2) {
        if (playerTurns[playerIndex][pieceIndex].state > 86) {
            playerTurns[playerIndex][pieceIndex].state = playerTurns[playerIndex][pieceIndex].state - diceValue;
        }
        if (playerTurns[playerIndex][pieceIndex].state == 86) {
            playerTurns[playerIndex][pieceIndex].flag = 3;
            playerTurns[playerIndex][pieceIndex].disabled = true;
            extraTurn = 1;
            displayMessage(playerTurns[playerIndex][pieceIndex].name + pieceIndex + " is in home");
        }
    } else if (playerIndex == 3) {
        if (playerTurns[playerIndex][pieceIndex].state > 96) {
            playerTurns[playerIndex][pieceIndex].state = playerTurns[playerIndex][pieceIndex].state - diceValue;
        }
        if (playerTurns[playerIndex][pieceIndex].state == 96) {
            playerTurns[playerIndex][pieceIndex].flag = 3;
            playerTurns[playerIndex][pieceIndex].disabled = true;
            extraTurn = 1;
            displayMessage(playerTurns[playerIndex][pieceIndex].name + pieceIndex + " is in home");
        }
    }
}

function checkGameWinner() {
    if (playerTurns[0][1].state == 66 && playerTurns[0][2].state == 66 && playerTurns[0][3].state == 66 && playerTurns[0][4].state == 66) {
        winCount++;
        displayMessage(playerTurns[0][1].name + " comes at " + winCount + "rd place.");
        currentPlayerIndex++;
        if (currentPlayerIndex == 4)
            currentPlayerIndex = 0;
    } else if (playerTurns[1][1].disabled == true && playerTurns[1][2].disabled == true && playerTurns[1][3].disabled == true && playerTurns[1][4].disabled == true) {
        winCount++;
        displayMessage(playerTurns[1][1].name + " comes at " + winCount + "rd place.");
        currentPlayerIndex++;
        if (currentPlayerIndex == 4)
            currentPlayerIndex = 0;
    } else if (playerTurns[2][1].disabled == true && playerTurns[2][2].disabled == true && playerTurns[2][3].disabled == true && playerTurns[2][4].disabled == true) {
        winCount++;
        displayMessage(playerTurns[2][1].name + " comes at " + winCount + "rd place.");
        currentPlayerIndex++;
        if (currentPlayerIndex == 4)
            currentPlayerIndex = 0;
    } else if (playerTurns[3][1].disabled == true && playerTurns[3][2].disabled == true && playerTurns[3][3].disabled == true && playerTurns[3][4].disabled == true) {
        winCount++;
        displayMessage(playerTurns[3][1].name + " comes at " + winCount + "th place.");
        currentPlayerIndex++;
        if (currentPlayerIndex == 4)
            currentPlayerIndex = 0;
    }
    if (winCount == 3) {
        displayMessage("Game over!!!!!");
        var replay = confirm("Do You want to play again?????");
        if (replay == true)
            location.reload();
    }
}
function disableAllPieceClicks() {
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 5; j++) {
            playerTurns[i][j].onclick = false;
        }
    }
}