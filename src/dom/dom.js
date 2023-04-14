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
    const rotateShip = document.querySelector(".rotate-ship");
    const randomizeShipsButton = document.querySelector(".randomize-ships");
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

    let isHorizontal = true;

    function randomizeShips() {
      // player.placeAllShipsRandomly();
      // // get gameboard ships array
      // // for each ship
      // // loop through all of them and style
      // console.log(player.gameboard.board);
      // const { ships } = player.gameboard;
      // ships.forEach((ship) => {
      //   const [row, col] = ship.coords;
      //   for (let i = 0; i < ship.length; i += 1) {
      //     console.log(ship.name, [row, col]);
      //     let [x, y] = [row, col];
      //     if (player.gameboard.isHorizontal()) x += i;
      //     else y += i;
      //     const cellEl = document.querySelector(
      //       `.place-ships-board [data-coords="[${x}, ${y}]"]`
      //     );
      //     cellEl.classList.add("ship");
      //   }
      // });
    }

    function highlightShipPlaced(e, ship) {
      const [row, col] = JSON.parse(e.target.dataset.coords);
      for (let i = 0; i < ship.length; i += 1) {
        let [x, y] = [row, col];

        if (isHorizontal) y += i;
        else x += i;

        const cellEl = document.querySelector(
          `.place-ships-board [data-coords="[${x}, ${y}]"]`
        );

        cellEl.classList.add("ship");
      }
    }

    function placeShip(e) {
      if (e.target.classList.contains("board")) return;

      const coords = JSON.parse(e.target.dataset.coords);
      const [currentShip] = player.shipsToPlace;

      if (
        !player.gameboard.canPlaceShip(
          currentShip,
          coords,
          isHorizontal ? "horizontal" : "vertical"
        )
      )
        return;

      player.gameboard.placeShip(
        currentShip,
        coords,
        isHorizontal ? "horizontal" : "vertical"
      );
      player.shipsToPlace.shift();

      const [nextShip] = player.shipsToPlace;
      const placeShipsHint = document.querySelector(".place-ships-hint");
      highlightShipPlaced(e, currentShip);

      if (!player.shipsToPlace.length) {
        placeShipsHint.textContent = "";
        placeShipsBoard.classList.add("disable");
        rotateShip.style.display = "none";
      } else {
        placeShipsHint.textContent = `Place your ${nextShip.name}`;
      }
    }

    function highlightShip(e) {
      clearHighlightShip();
      const [currentShip] = player.shipsToPlace;
      if (!currentShip) return;

      const [row, col] = JSON.parse(e.target.dataset.coords);
      const isValidShipPlacement = player.gameboard.canPlaceShip(
        currentShip,
        [row, col],
        isHorizontal ? "horizontal" : "vertical"
      );
      const cellValidityName = isValidShipPlacement ? "valid" : "invalid";

      for (let i = 0; i < currentShip.length; i += 1) {
        let [x, y] = [row, col];

        if (isHorizontal) y += i;
        else x += i;

        const cellEl = document.querySelector(
          `.place-ships-board [data-coords="[${x}, ${y}]"]`
        );

        if (cellEl) cellEl.classList.add(cellValidityName);
      }
    }

    function invertBoardOrientation() {
      isHorizontal = !isHorizontal;
    }

    placeShipsBoard.addEventListener("mouseover", highlightShip);
    placeShipsBoard.addEventListener("mouseleave", clearHighlightShip);
    placeShipsBoard.addEventListener("click", placeShip);
    rotateShip.addEventListener("click", invertBoardOrientation);
    randomizeShipsButton.addEventListener("click", randomizeShips);
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

// TODO
/*
- Refactor orientation to be on ship instead of board
- Add randomize ships, reset board, and start game functionality
- Better variable names, class names, clean code



*/
