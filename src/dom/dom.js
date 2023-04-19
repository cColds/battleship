/* eslint-disable no-param-reassign */
import Player from "../game-logic/player";

const Dom = (() => {
  const player = new Player();
  const ai = new Player();
  const playerBoard = document.querySelector(".player-board");
  const aiBoard = document.querySelector(".ai-board");
  const placeShipsPage = document.querySelector(".place-ships-container");
  const placeShipsBoard = document.querySelector(".place-ships-board");

  const placeShipsContainer = document.querySelector(".place-ships-container");
  const playerNameInput = document.querySelector("#player-name-input");
  const playerBoardName = document.querySelector(
    ".player-board-container .board-name"
  );

  const battleshipBoard = document.querySelector(".battleship-gameboard");

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

  function initStartGameHomepage() {
    const startGameContainer = document.querySelector(".start-game-container");
    const startGameHomepage = document.querySelector(".homepage-start-game");
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

    function highlightShip(coords, ship, orientation, selector, className) {
      const [row, col] = coords;
      for (let i = 0; i < ship.length; i += 1) {
        let [x, y] = [row, col];

        if (orientation === "horizontal") y += i;
        else x += i;

        const shipCell = document.querySelector(
          `${selector} [data-coords="[${x}, ${y}]"]`
        );

        if (shipCell) shipCell.classList.add(className);
      }
    }

    function clearHighlightShip() {
      const highlightedCells = document.querySelectorAll(
        ".place-ships-board .ship"
      );
      highlightedCells.forEach((highlightedCell) =>
        highlightedCell.classList.remove("ship")
      );
    }

    function startGameHandler() {
      if (player.gameboard.ships.length !== 5) return;

      placeShipsContainer.classList.remove("active");
      battleshipBoard.classList.add("active");
      clearHighlightShip();
      ai.placeAllShipsRandomly();

      player.gameboard.ships.forEach((ship) => {
        highlightShip(
          ship.coords,
          ship,
          ship.orientation,
          ".player-board",
          "ship"
        );
      });

      playerBoardName.textContent = playerNameInput.value.trim()
        ? playerNameInput.value.trim()
        : "Player";

      placeShipsBoard.classList.remove("disabled");
      rotateShip.style.display = "block";
      placeShipsHint.textContent = "Place your carrier";
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

    function resetBoardHandler() {
      player.restoreShipsToPlace();
      player.gameboard.resetGameboard();
      clearHighlightShip();
      placeShipsBoard.classList.remove("disabled");
      rotateShip.style.display = "block";
      placeShipsHint.textContent = "Place your carrier";
      startGame.classList.add("disabled");
    }

    function highlightShipPreview(e) {
      clearHighlightShipPreview();
      const [currentShip] = player.shipsToPlace;
      if (!currentShip || !e.target.dataset.coords) return;

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
        ".place-ships-board",
        cellValidityName
      );
    }

    function randomizeShips() {
      player.restoreShipsToPlace();
      player.placeAllShipsRandomly();
      clearHighlightShip();
      rotateShip.style.display = "block";
      startGame.classList.remove("disabled");

      const { ships } = player.gameboard;
      ships.forEach((ship) => {
        highlightShip(
          ship.coords,
          ship,
          ship.orientation,
          ".place-ships-board",
          "ship"
        );
      });
      placeShipsBoard.classList.add("disabled");
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

      highlightShip(
        coords,
        currentShip,
        currentShip.orientation,
        ".place-ships-board",
        "ship"
      );
      player.shipsToPlace.shift();

      const [nextShip] = player.shipsToPlace;

      if (!player.shipsToPlace.length) {
        placeShipsHint.textContent = "";
        placeShipsBoard.classList.add("disabled");
        rotateShip.style.display = "none";
        startGame.classList.remove("disabled");
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

  function initBattleshipPage() {
    const modalOverlay = document.querySelector(".modal-overlay");
    const gameOverText = document.querySelector(".game-over-text");
    const playAgain = document.querySelector(".play-again");
    const newGame = document.querySelector(".new-game");

    function highlightAttack(board, [row, col], selector) {
      const cell = document.querySelector(
        `${selector} [data-coords="[${row}, ${col}]"]`
      );

      cell.classList.add(board[row][col]);
    }

    function clearGameboardCellsHighlighted() {
      const cells = document.querySelectorAll(".cell");
      cells.forEach((cell) => {
        cell.style.backgroundColor = "";
        cell.classList.remove("ship");
        cell.classList.remove("hit");
        cell.classList.remove("miss");
      });
    }

    function playAgainHandler() {
      player.gameboard.resetGameboard();
      ai.gameboard.resetGameboard();
      player.gameboard.ships = [];
      ai.gameboard.ships = [];
      player.restoreShipsToPlace();
      ai.restoreShipsToPlace();

      clearGameboardCellsHighlighted();
      modalOverlay.classList.remove("active");
      battleshipBoard.classList.remove("active");
      placeShipsContainer.classList.add("active");
    }

    function attack(e) {
      if (
        e.target.classList.contains("ai-board") ||
        player.gameboard.areAllShipsSunk() ||
        ai.gameboard.areAllShipsSunk()
      )
        return;

      const [row, col] = JSON.parse(e.target.dataset.coords);

      if (!Player.attack([row, col], ai)) return;

      highlightAttack(ai.gameboard.board, [row, col], ".ai-board");
      if (ai.gameboard.areAllShipsSunk()) {
        modalOverlay.classList.add("active");
        gameOverText.textContent = `Game Over! You won!`;
        return;
      }

      Player.makeComputerAttack(player);
      highlightAttack(
        player.gameboard.board,
        player.gameboard.latestReceivedAttack,
        ".player-board"
      );

      if (player.gameboard.areAllShipsSunk()) {
        gameOverText.textContent = `Game Over! You lost!`;

        modalOverlay.classList.add("active");
      }
    }

    aiBoard.addEventListener("click", attack);
    playAgain.addEventListener("click", playAgainHandler);
    newGame.addEventListener("click", () => window.location.reload());
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
    initBattleshipPage();
  }

  return { initialize };
})();

export default Dom;
