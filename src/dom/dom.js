/* eslint-disable no-param-reassign */
import Player from "../game-logic/player";

const Dom = (() => {
  const player = new Player();
  // const ai = new Player();
  const playerBoard = document.querySelector(".player-board");
  const aiBoard = document.querySelector(".ai-board");
  const placeShipsBoard = document.querySelector(".place-ships-board");

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

  function initPlaceShipsPage() {
    // const shipToPlace = document.querySelector(".place-ship-hint");
    // const rotateShip = document.querySelector(".rotate-ship");
    // const randomizeShips = document.querySelector(".randomize-ships");
    // const resetBoard = document.querySelector(".reset-board");
    // const startGame = document.querySelector(".place-ships-start-game");

    function clearHighlightShip() {
      const isValidShipHighlighted = document.querySelector(".valid");
      const cellValidityName = isValidShipHighlighted ? "valid" : "invalid";
      const cellsHighlighted = isValidShipHighlighted
        ? document.querySelectorAll(".valid")
        : document.querySelectorAll(".invalid");

      cellsHighlighted.forEach((cell) =>
        cell.classList.remove(cellValidityName)
      );
    }

    function placeShip(e) {
      if (e.target.classList.contains("board")) return;

      const coords = JSON.parse(e.target.dataset.coords);
      const currentShip = player.shipsToPlace.shift();
      const [nextShip] = player.shipsToPlace;
      const placeShipsHint = document.querySelector(".place-ships-hint");

      player.gameboard.placeShip(currentShip, coords);

      if (!player.shipsToPlace.length) {
        placeShipsHint.textContent = "";
        placeShipsBoard.classList.add("disable");
      } else {
        placeShipsHint.textContent = `Place your ${nextShip.name}`;
      }
    }

    function highlightShip(e) {
      clearHighlightShip();
      const [currentShip] = player.shipsToPlace;
      if (!currentShip) return;

      const [row, col] = JSON.parse(e.target.dataset.coords);
      const isValidShipPlacement = player.gameboard.canPlaceShip(currentShip, [
        row,
        col,
      ]);
      const cellValidityName = isValidShipPlacement ? "valid" : "invalid";

      for (let i = 0; i < currentShip.length; i += 1) {
        let [x, y] = [row, col];

        if (player.gameboard.isHorizontal()) y += i;
        else x += i;

        const cellEl = document.querySelector(
          `.place-ships-board [data-coords="[${x}, ${y}]"]`
        );

        if (cellEl) cellEl.classList.add(cellValidityName);
      }
    }

    placeShipsBoard.addEventListener("mouseover", highlightShip);
    placeShipsBoard.addEventListener("mouseleave", clearHighlightShip);
    placeShipsBoard.addEventListener("click", placeShip);
  }

  function initGameboardCells(board) {
    for (let i = 0; i < 100; i += 1) {
      const cell = document.createElement("button");
      cell.classList.add("cell");
      board.appendChild(cell);
    }
  }

  function initGameboardCellCoords(board) {
    let i = 0;
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        board.children[i].dataset.coords = `[${row}, ${col}]`;
        i += 1;
      }
    }
  }

  function initialize() {
    initGameboardCells(playerBoard);
    initGameboardCells(aiBoard);
    initGameboardCells(placeShipsBoard);

    initGameboardCellCoords(playerBoard);
    initGameboardCellCoords(aiBoard);
    initGameboardCellCoords(placeShipsBoard);

    initStartGameHomepage();
    initPlaceShipsPage();
  }

  return { initialize };
})();

export default Dom;
