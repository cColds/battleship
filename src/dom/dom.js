import "./homepage";

const Dom = (() => {
  const playerBoard = document.querySelector(".player-board");
  const aiBoard = document.querySelector(".ai-board");
  const playerPlaceShipsBoard = document.querySelector(".place-ships-board");

  function generateGameboardCells(board) {
    for (let i = 0; i < 100; i += 1) {
      const cell = document.createElement("button");
      cell.classList.add("cell");
      board.appendChild(cell);
    }
  }

  function initializeDom() {
    generateGameboardCells(playerBoard);
    generateGameboardCells(aiBoard);
    generateGameboardCells(playerPlaceShipsBoard);
  }

  return { initializeDom };
})();

export default Dom;

// make module pattern init dom load in this file
// make module for home page
// make module for place ship page
// make module for player vs ai
// make module helpers if needed
