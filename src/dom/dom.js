/* eslint-disable no-param-reassign */
import Player from "../game-logic/player";

const Dom = (() => {
  const player = new Player();
  // const ai = new Player();
  const playerBoard = document.querySelector(".player-board");
  const aiBoard = document.querySelector(".ai-board");
  const placeShipsBoard = document.querySelector(".place-ships-board");
  const battleshipBoard = document.querySelector(".battleship-gameboard");

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
    const rotateShip = document.querySelector(".rotate-ship");
    const placeShipsHint = document.querySelector(".place-ships-hint");

    const randomizeShipsButton = document.querySelector(".randomize-ships");
    const resetBoard = document.querySelector(".reset-board");
    const startGame = document.querySelector(".place-ships-start-game");
    let currentShipOrientation = "horizontal";

    function startGameHandler() {
      if (player.gameboard.ships.length !== 5) return;

      const placeShipsContainer = document.querySelector(
        ".place-ships-container"
      );

      placeShipsContainer.classList.remove("active");
      battleshipBoard.classList.add("active");
    }

    function clearHighlightShipPreview() {
      const isValidCell = document.querySelector(".valid");
      const cellValidityName = isValidCell ? "valid" : "invalid";
      const cellsHighlighted = isValidCell
        ? document.querySelectorAll(".valid")
        : document.querySelectorAll(".invalid");

      cellsHighlighted.forEach((cell) =>
        cell.classList.remove(cellValidityName)
      );
    }

    function clearHighlightShip() {
      const highlightedCells = document.querySelectorAll(".ship");
      highlightedCells.forEach((highlightedCell) =>
        highlightedCell.classList.remove("ship")
      );
    }

    function resetBoardHandler() {
      player.restoreShipsToPlace();
      player.gameboard.resetGameboard();
      clearHighlightShip();
      placeShipsBoard.classList.remove("disable");
      rotateShip.style.display = "block";
      placeShipsHint.textContent = "Place your carrier";
    }

    function highlightShip(coords, ship, orientation, className) {
      const [row, col] = coords;
      for (let i = 0; i < ship.length; i += 1) {
        let [x, y] = [row, col];

        if (orientation === "horizontal") y += i;
        else x += i;

        const shipCell = document.querySelector(
          `.place-ships-board [data-coords="[${x}, ${y}]"]`
        );

        if (shipCell) shipCell.classList.add(className);
      }
    }

    function highlightShipPreview(e) {
      clearHighlightShipPreview();
      const [currentShip] = player.shipsToPlace;
      if (!currentShip) return;

      const coords = JSON.parse(e.target.dataset.coords);
      const isValidShipPlacement = player.gameboard.canPlaceShip(
        currentShip,
        coords,
        currentShipOrientation
      );
      const cellValidityName = isValidShipPlacement ? "valid" : "invalid";
      highlightShip(
        coords,
        currentShip,
        currentShipOrientation,
        cellValidityName
      );
    }

    function randomizeShips() {
      player.restoreShipsToPlace();
      player.placeAllShipsRandomly();
      clearHighlightShip();
      rotateShip.style.display = "block";

      const { ships } = player.gameboard;
      ships.forEach((ship) => {
        highlightShip(ship.coords, ship, ship.orientation, "ship");
      });
      placeShipsBoard.classList.add("disable");
      placeShipsHint.textContent = "";
      rotateShip.style.display = "none";
    }

    function placeShip(e) {
      if (e.target.classList.contains("board")) return;

      const coords = JSON.parse(e.target.dataset.coords);
      const [currentShip] = player.shipsToPlace;

      if (
        !player.gameboard.canPlaceShip(
          currentShip,
          coords,
          currentShipOrientation
        )
      )
        return;

      player.gameboard.placeShip(currentShip, coords, currentShipOrientation);

      highlightShip(coords, currentShip, currentShip.orientation, "ship");
      player.shipsToPlace.shift();

      const [nextShip] = player.shipsToPlace;

      if (!player.shipsToPlace.length) {
        placeShipsHint.textContent = "";
        placeShipsBoard.classList.add("disable");
        rotateShip.style.display = "none";
      } else {
        placeShipsHint.textContent = `Place your ${nextShip.name}`;
      }
    }

    function invertBoardOrientation() {
      currentShipOrientation =
        currentShipOrientation === "horizontal" ? "vertical" : "horizontal";
    }

    placeShipsBoard.addEventListener("mouseover", highlightShipPreview);
    placeShipsBoard.addEventListener("mouseleave", clearHighlightShipPreview);
    placeShipsBoard.addEventListener("click", placeShip);
    rotateShip.addEventListener("click", invertBoardOrientation);
    randomizeShipsButton.addEventListener("click", randomizeShips);
    resetBoard.addEventListener("click", resetBoardHandler);
    startGame.addEventListener("click", startGameHandler);
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
