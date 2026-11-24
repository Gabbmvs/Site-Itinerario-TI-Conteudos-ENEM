
const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let currentPlayer = "X";
let gameActive = true;

let board = ["", "", "", "", "", "", "", "", ""];

let scores = {
    X: 0,
    O: 0
};

// Combinações possíveis para vencer
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];

// Jogada
function handleCellClick(event) {

    const cell = event.target;
    const index = Number(cell.dataset.index);

    // Impede jogadas inválidas
    if (board[index] !== "" || !gameActive) {
        return;
    }

    board[index] = currentPlayer;

    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    checkWinner();
}

// Verifica o vencedor
function checkWinner() {

    let winningCombination = null;

    for (const combination of winningConditions) {

        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            winningCombination = combination;
            break;
        }
    }

    // Existe um vencedor
    if (winningCombination) {

        gameActive = false;

        winningCombination.forEach(index => {
            cells[index].classList.add("winner");
        });

        scores[currentPlayer]++;

        updateScore();

        statusText.textContent =
            `Jogador ${currentPlayer} venceu!`;

        return;
    }

    // Verifica empate
    if (!board.includes("")) {

        gameActive = false;
        statusText.textContent = "Empate!";

        return;
    }

    // Alterna jogador
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    statusText.textContent =
        `Vez do jogador ${currentPlayer}`;
}

// Atualiza o placar
function updateScore() {

    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;

}

// Reinicia a partida
function resetGame() {

    board = ["", "", "", "", "", "", "", "", ""];

    currentPlayer = "X";
    gameActive = true;

    statusText.textContent = "Vez do jogador X";

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );

    });

}

// Eventos
cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

resetButton.addEventListener("click", resetGame);
