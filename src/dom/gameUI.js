import Game from "../game-logic/Game";
import { clearHighlightedCells } from "./helper";

const gameUI = (() => {
  const game = new Game();
  const playerBoard = document.querySelector(".player-board");
  const aiBoard = document.querySelector(".ai-board");
  const setupBoardContainer = document.querySelector(".setup-board-container");
  const setupBoard = document.querySelector(".setup-board");
  const gameboardContainer = document.querySelector(".gameboard-container");

  function createGameboardCells(board) {
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        const cell = document.createElement("button");
        cell.classList.add("cell");
        cell.dataset.coords = `[${row}, ${col}]`;
        board.appendChild(cell);
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
    const playerNameInput = document.querySelector("#player-name-input");
    const playerBoardName = document.querySelector(
      ".player-board-container .board-name"
    );
    let shipOrientationState = "horizontal";

    function highlightShip(coords, ship, orientation, selector, className) {
      for (let i = 0; i < ship.length; i += 1) {
        let [row, col] = [coords[0], coords[1]];

        if (orientation === "horizontal") col += i;
        else row += i;
        const cell = document.querySelector(
          `${selector} [data-coords="[${row}, ${col}]"]`
        );

        if (cell) cell.classList.add(className);
      }
    }

    function clearHighlightShip() {
      clearHighlightedCells(".setup-board .ship", "ship");
    }

    function startGameHandler() {
      if (game.player.gameboard.ships.length !== 5) return;

      setupBoardContainer.classList.remove("active");
      gameboardContainer.classList.add("active");
      clearHighlightShip();
      game.ai.placeAllShipsRandomly();
      game.player.gameboard.ships.forEach((ship) => {
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
      setupBoardMessage.textContent = "Place your carrier";
      startGame.classList.add("disabled");
    }

    function clearHighlightShipPreview() {
      const cellValidityClassName = document.querySelector(".valid")
        ? "valid"
        : "invalid";

      clearHighlightedCells(
        `.setup-board .${cellValidityClassName}`,
        `${cellValidityClassName}`
      );
    }

    function resetBoardHandler() {
      game.resetGame();
      clearHighlightShip();
      setupBoard.classList.remove("disabled");
      setupBoardMessage.textContent = "Place your carrier";
      startGame.classList.add("disabled");
    }

    function highlightShipPreview(e) {
      clearHighlightShipPreview();
      const [currentShip] = game.player.shipsToPlace;
      if (!currentShip || !e.target.dataset.coords) return;

      const coords = JSON.parse(e.target.dataset.coords);

      const isValidShipPlacement = game.player.gameboard.canPlaceShip(
        currentShip,
        coords,
        shipOrientationState
      );
      const cellValidityName = isValidShipPlacement ? "valid" : "invalid";
      highlightShip(
        coords,
        currentShip,
        shipOrientationState,
        ".setup-board",
        cellValidityName
      );
    }

    function randomizeShips() {
      game.player.restoreShipsToPlace();
      game.player.placeAllShipsRandomly();
      clearHighlightShip();
      startGame.classList.remove("disabled");

      const { ships } = game.player.gameboard;
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
      setupBoardMessage.textContent = "Ready for battle!";
    }

    function placeShip(e) {
      if (e.target.classList.contains("board")) return;

      const coords = JSON.parse(e.target.dataset.coords);
      const [currentShip] = game.player.shipsToPlace;

      if (
        !game.player.gameboard.canPlaceShip(
          currentShip,
          coords,
          shipOrientationState
        )
      )
        return;

      game.player.gameboard.placeShip(
        currentShip,
        coords,
        shipOrientationState
      );

      highlightShip(
        coords,
        currentShip,
        currentShip.orientation,
        ".setup-board",
        "ship"
      );
      game.player.shipsToPlace.shift();

      const [nextShip] = game.player.shipsToPlace;

      if (!game.player.shipsToPlace.length) {
        setupBoardMessage.textContent = "Ready for battle!";
        setupBoard.classList.add("disabled");
        startGame.classList.remove("disabled");
      } else {
        setupBoardMessage.textContent = `Place your ${nextShip.name}`;
      }
    }

    function invertBoardOrientation() {
      shipOrientationState =
        shipOrientationState === "horizontal" ? "vertical" : "horizontal";
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
      clearHighlightedCells(".gameboard-container .cell", [
        "hit",
        "miss",
        "ship",
      ]);
    }

    function playAgainHandler() {
      game.resetGame();

      clearGameboardCellsHighlighted();
      modalOverlay.classList.remove("active");
      gameboardContainer.classList.remove("active");
      setupBoardContainer.classList.add("active");
    }

    function attack(e) {
      if (e.target.classList.contains("ai-board") || game.isGameOver()) return;

      const [row, col] = JSON.parse(e.target.dataset.coords);

      if (!game.player.constructor.attack([row, col], game.ai)) return;

      highlightAttack(game.ai.gameboard.board, [row, col], ".ai-board");
      if (game.isGameOver()) {
        modalOverlay.classList.add("active");
        gameOverText.textContent = `Game Over! You won!`;
        return;
      }

      game.ai.constructor.makeComputerAttack(game.player);
      highlightAttack(
        game.player.gameboard.board,
        game.player.gameboard.latestReceivedAttack,
        ".player-board"
      );

      if (game.isGameOver()) {
        gameOverText.textContent = `Game Over! You lost!`;

        modalOverlay.classList.add("active");
      }
    }

    aiBoard.addEventListener("click", attack);
    playAgain.addEventListener("click", playAgainHandler);
    newGame.addEventListener("click", () => window.location.reload());
  }

  function initialize() {
    createGameboardCells(playerBoard);
    createGameboardCells(aiBoard);
    createGameboardCells(setupBoard);

    initHomepage();
    initSetupBoard();
    initGameboard();
  }

  return { initialize };
})();

export default gameUI;
