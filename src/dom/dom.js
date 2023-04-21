/* eslint-disable no-param-reassign */
import Player from "../game-logic/player";

const dom = (() => {
  const player = new Player();
  const ai = new Player();
  const playerBoard = document.querySelector(".player-board");
  const aiBoard = document.querySelector(".ai-board");
  const setupBoardContainer = document.querySelector(".setup-board-container");
  const setupBoard = document.querySelector(".setup-board");
  const gameboardContainer = document.querySelector(".gameboard-container");

  const playerNameInput = document.querySelector("#player-name-input");
  const playerBoardName = document.querySelector(
    ".player-board-container .board-name"
  );

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

  function initHomepage() {
    const homepageContainer = document.querySelector(".homepage-container");

    homepageContainer.addEventListener("submit", (e) => {
      e.preventDefault();

      homepageContainer.classList.remove("active");
      setupBoardContainer.classList.add("active");
    });
  }

  function initSetupBoard() {
    const rotateShip = document.querySelector(".rotate-ship");
    const setupBoardMessage = document.querySelector(".setup-board-message");
    const randomizeShipsButton = document.querySelector(".randomize-ships");
    const resetBoard = document.querySelector(".reset-board");
    const startGame = document.querySelector(".setup-board-start-game");
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
      const highlightedCells = document.querySelectorAll(".setup-board .ship");
      highlightedCells.forEach((highlightedCell) =>
        highlightedCell.classList.remove("ship")
      );
    }

    function startGameHandler() {
      if (player.gameboard.ships.length !== 5) return;

      setupBoardContainer.classList.remove("active");
      gameboardContainer.classList.add("active");
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

      playerBoardName.textContent = playerNameInput.value.trim() || "Player";

      setupBoard.classList.remove("disabled");
      rotateShip.style.display = "block";
      setupBoardMessage.textContent = "Place your carrier";
      startGame.classList.add("disabled");
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
      setupBoard.classList.remove("disabled");
      rotateShip.style.display = "block";
      setupBoardMessage.textContent = "Place your carrier";
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
        ".setup-board",
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
          ".setup-board",
          "ship"
        );
      });
      setupBoard.classList.add("disabled");
      setupBoardMessage.textContent = "";
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
        ".setup-board",
        "ship"
      );
      player.shipsToPlace.shift();

      const [nextShip] = player.shipsToPlace;

      if (!player.shipsToPlace.length) {
        setupBoardMessage.textContent = "";
        setupBoard.classList.add("disabled");
        rotateShip.style.display = "none";
        startGame.classList.remove("disabled");
      } else {
        setupBoardMessage.textContent = `Place your ${nextShip.name}`;
      }
    }

    function invertBoardOrientation() {
      currentShipOrientation =
        currentShipOrientation === "horizontal" ? "vertical" : "horizontal";
    }

    setupBoard.addEventListener("mouseover", highlightShipPreview);
    setupBoard.addEventListener("mouseleave", clearHighlightShipPreview);
    setupBoard.addEventListener("click", placeShip);
    rotateShip.addEventListener("click", invertBoardOrientation);
    randomizeShipsButton.addEventListener("click", randomizeShips);
    resetBoard.addEventListener("click", resetBoardHandler);
    startGame.addEventListener("click", startGameHandler);
  }

  function initGameboard() {
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
      gameboardContainer.classList.remove("active");
      setupBoardContainer.classList.add("active");
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
    initGameboardCells(setupBoard);

    initGameboardCellCoords(playerBoard);
    initGameboardCellCoords(aiBoard);
    initGameboardCellCoords(setupBoard);

    initHomepage();
    initSetupBoard();
    initGameboard();
  }

  return { initialize };
})();

export default dom;
