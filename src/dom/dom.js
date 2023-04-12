/* eslint-disable no-param-reassign */
import Player from "../game-logic/player";

const Dom = (() => {
  const player = new Player();
  // const ai = new Player();
  const playerBoard = document.querySelector(".player-board");
  const aiBoard = document.querySelector(".ai-board");
  const placeShipsBoard = document.querySelector(".place-ships-board");

  // const shipToPlace = document.querySelector(".place-ship-hint");
  // const rotateShip = document.querySelector(".rotate-ship");
  // const randomizeShips = document.querySelector(".randomize-ships");
  // const resetBoard = document.querySelector(".reset-board");
  // const startGame = document.querySelector(".place-ships-start-game");

  function generateGameboardCells(board) {
    for (let i = 0; i < 100; i += 1) {
      const cell = document.createElement("button");
      cell.classList.add("cell");
      board.appendChild(cell);
    }
  }

  function generateGameboardCellCoords(board) {
    let i = 0;
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        board.children[i].dataset.coords = `[${row}, ${col}]`;
        i += 1;
      }
    }
  }

  function clearHighlightShip() {
    const isValidShipHighlighted = document.querySelector(".valid");
    const cellValidityName = isValidShipHighlighted ? "valid" : "invalid";
    const cellsHighlighted = isValidShipHighlighted
      ? document.querySelectorAll(".valid")
      : document.querySelectorAll(".invalid");

    cellsHighlighted.forEach((cell) => cell.classList.remove(cellValidityName));
  }

  function removeHighlightOnMouseLeave() {
    placeShipsBoard.addEventListener("mouseleave", () => {
      clearHighlightShip();
    });
  }

  function highlightShip() {
    [...placeShipsBoard.children].forEach((cell) =>
      cell.addEventListener("mouseenter", (e) => {
        clearHighlightShip();
        const [currentShip] = player.shipsToPlace;

        const [row, col] = JSON.parse(e.target.dataset.coords);
        const isValidShipPlacement = player.gameboard.canPlaceShip(
          currentShip,
          [row, col]
        );
        const cellValidityName = isValidShipPlacement ? "valid" : "invalid";

        for (let i = 0; i < currentShip.length; i += 1) {
          let cellElement;
          if (player.gameboard.isHorizontal()) {
            if (player.gameboard.board[row][col + i] === null) {
              cellElement = document.querySelector(
                `.place-ships-board [data-coords="[${row}, ${col + i}]"]`
              );
              cellElement.classList.add(cellValidityName);
            }
          } else if (player.gameboard.board[row + i][col] === null) {
            cellElement = document.querySelector(
              `.place-ships-board [data-coords="[${row + i}, ${col}]"]`
            );
            cellElement.classList.add(cellValidityName);
          }
        }
      })
    );
  }

  function initStartGameHomepage() {
    const startGameContainer = document.querySelector(".start-game-container");
    const startGameHomepage = document.querySelector(".homepage-start-game");
    const placeShipsPage = document.querySelector(".place-ships-container");
    const placeShipsGameboard = document.querySelector(
      ".place-ships-gameboard"
    );
    startGameHomepage.addEventListener("click", () => {
      startGameContainer.classList.remove("active");
      placeShipsPage.classList.add("active");
      placeShipsGameboard.classList.add("active");
    });
  }

  function initialize() {
    initStartGameHomepage();
    generateGameboardCells(playerBoard);
    generateGameboardCells(aiBoard);
    generateGameboardCells(placeShipsBoard);

    generateGameboardCellCoords(playerBoard);
    generateGameboardCellCoords(aiBoard);
    generateGameboardCellCoords(placeShipsBoard);
    highlightShip();
    removeHighlightOnMouseLeave();
  }

  return { initialize };
})();

export default Dom;
