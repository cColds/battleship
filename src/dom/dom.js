const playerBoard = document.querySelector(".player-board");
const aiBoard = document.querySelector(".ai-board");

function generateGameboardCells(board) {
  for (let i = 0; i < 100; i += 1) {
    const cell = document.createElement("button");
    cell.classList.add("cell");
    board.appendChild(cell);
  }
}
generateGameboardCells(playerBoard);
generateGameboardCells(aiBoard);
