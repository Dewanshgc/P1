const cells = Array.from(document.querySelectorAll(".cell"));
const statusMessage = document.querySelector("#status");
const playerXCard = document.querySelector("#player-x");
const playerOCard = document.querySelector("#player-o");
const scoreXDisplay = document.querySelector("#score-x");
const scoreODisplay = document.querySelector("#score-o");
const newGameButton = document.querySelector("#new-game");

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill("");
let currentPlayer = "X";
let scores = { X: 0, O: 0 };
let roundOver = false;

function updateTurnDisplay() {
  playerXCard.classList.toggle("active", currentPlayer === "X" && !roundOver);
  playerOCard.classList.toggle("active", currentPlayer === "O" && !roundOver);
  statusMessage.textContent = `Player ${currentPlayer}'s turn`;
}

function finishRound(message) {
  roundOver = true;
  statusMessage.textContent = message;
  cells.forEach((cell) => {
    cell.disabled = true;
  });
  playerXCard.classList.remove("active");
  playerOCard.classList.remove("active");
}

function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  if (roundOver || board[index]) {
    return;
  }

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.setAttribute("aria-label", `${cell.getAttribute("aria-label").split(",")[0]}, ${currentPlayer}`);
  cell.disabled = true;
  if (currentPlayer === "O") {
    cell.classList.add("mark-o");
  }

  const winningLine = winningLines.find((line) => line.every((position) => board[position] === currentPlayer));
  if (winningLine) {
    winningLine.forEach((position) => cells[position].classList.add("winning"));
    scores[currentPlayer] += 1;
    scoreXDisplay.textContent = scores.X;
    scoreODisplay.textContent = scores.O;
    finishRound(`Player ${currentPlayer} wins!`);
    return;
  }

  if (board.every(Boolean)) {
    finishRound("It's a draw! Play another round?");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();
}

function startNewGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  roundOver = false;
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("mark-o", "winning");
    const position = cell.getAttribute("aria-label").split(",")[0];
    cell.setAttribute("aria-label", `${position}, empty`);
  });
  updateTurnDisplay();
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
newGameButton.addEventListener("click", startNewGame);
updateTurnDisplay();
