
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart");
const twoPlayerButton = document.getElementById("twoPlayer");
const computerButton = document.getElementById("computer");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let playWithComputer = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleClick(event) {
    const index = Number(event.target.dataset.index);

    if (board[index] !== "" || !gameActive) return;

    makeMove(index, currentPlayer);

    if (!gameActive) return;

    if (playWithComputer && currentPlayer === "O") {
        setTimeout(computerMove, 400);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].disabled = true;

    if (player === "X") {
        cells[index].style.color = "#38bdf8";
    } else {
        cells[index].style.color = "#fbbf24";
    }

    if (checkWinner(player)) {
        statusText.textContent = player + " Wins! 🎉";
        gameActive = false;
        cells.forEach(cell => cell.disabled = true);
        return;
    }

    if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a Draw! 🤝";
        gameActive = false;
        return;
    }

    currentPlayer = player === "X" ? "O" : "X";

    if (playWithComputer && currentPlayer === "O") {
        statusText.textContent = "Computer's Turn...";
    } else {
        statusText.textContent = "Player " + currentPlayer + "'s Turn";
    }
}

function checkWinner(player) {
    return winningCombinations.some(combination =>
        combination.every(index => board[index] === player)
    );
}

function computerMove() {
    if (!gameActive || !playWithComputer || currentPlayer !== "O") {
        return;
    }

    // First, try to win.
    let move = findBestMove("O");

    // Otherwise, block the player's winning move.
    if (move === -1) {
        move = findBestMove("X");
    }

    // Otherwise, take the center if available.
    if (move === -1 && board[4] === "") {
        move = 4;
    }

    // Otherwise, choose a random empty cell.
    if (move === -1) {
        const emptyCells = board
            .map((value, index) => value === "" ? index : -1)
            .filter(index => index !== -1);

        if (emptyCells.length > 0) {
            move = emptyCells[
                Math.floor(Math.random() * emptyCells.length)
            ];
        }
    }

    if (move !== -1) {
        makeMove(move, "O");
    }
}

function findBestMove(player) {
    for (const combination of winningCombinations) {
        const values = combination.map(index => board[index]);

        if (
            values.filter(value => value === player).length === 2 &&
            values.includes("")
        ) {
            return combination[values.indexOf("")];
        }
    }

    return -1;
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.disabled = false;
        cell.style.color = "#38bdf8";
    });

    statusText.textContent = "Player X's Turn";
}

function setMode(computerMode) {
    playWithComputer = computerMode;

    twoPlayerButton.classList.toggle("active", !computerMode);
    computerButton.classList.toggle("active", computerMode);

    restartGame();
}

cells.forEach(cell => {
    cell.addEventListener("click", handleClick);
});

restartButton.addEventListener("click", restartGame);

twoPlayerButton.addEventListener("click", () => {
    setMode(false);
});

computerButton.addEventListener("click", () => {
    setMode(true);
});

setMode(false);
