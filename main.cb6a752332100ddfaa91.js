/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dom/gameUI.js":
/*!***************************!*\
  !*** ./src/dom/gameUI.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _game_logic_Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game-logic/Game */ "./src/game-logic/Game.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helper */ "./src/dom/helper.js");



const gameUI = (() => {
  const game = new _game_logic_Game__WEBPACK_IMPORTED_MODULE_0__["default"]();
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
      (0,_helper__WEBPACK_IMPORTED_MODULE_1__.clearHighlightedCells)(".setup-board .ship", "ship");
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

      (0,_helper__WEBPACK_IMPORTED_MODULE_1__.clearHighlightedCells)(
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
      (0,_helper__WEBPACK_IMPORTED_MODULE_1__.clearHighlightedCells)(".gameboard-container .cell", [
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameUI);


/***/ }),

/***/ "./src/dom/helper.js":
/*!***************************!*\
  !*** ./src/dom/helper.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clearHighlightedCells": () => (/* binding */ clearHighlightedCells)
/* harmony export */ });
/* eslint-disable no-param-reassign */

function clearHighlightedCells(selector, classes) {
  const cells = document.querySelectorAll(selector);

  cells.forEach((cell) => {
    if (Array.isArray(classes)) {
      cell.classList.remove(...classes);
    } else {
      cell.classList.remove(classes);
    }
  });
}




/***/ }),

/***/ "./src/game-logic/Game.js":
/*!********************************!*\
  !*** ./src/game-logic/Game.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ "./src/game-logic/Player.js");


class Game {
  constructor() {
    this.player = new _Player__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.ai = new _Player__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }

  resetGame() {
    this.player = new _Player__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.ai = new _Player__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }

  isGameOver() {
    return (
      this.player.gameboard.areAllShipsSunk() ||
      this.ai.gameboard.areAllShipsSunk()
    );
  }
}


/***/ }),

/***/ "./src/game-logic/Gameboard.js":
/*!*************************************!*\
  !*** ./src/game-logic/Gameboard.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gameboard)
/* harmony export */ });
/* harmony import */ var _Ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Ship */ "./src/game-logic/Ship.js");
/* eslint-disable no-param-reassign */


class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [];
  }

  static isOutOfBounds = ([row, col]) =>
    row < 0 || row > 9 || col < 0 || col > 9;

  static getEndPosition = (ship, [row, col], orientation) =>
    orientation === "horizontal"
      ? col + ship.length - 1
      : row + ship.length - 1;

  areAllShipsSunk = () => this.ships.every((ship) => ship.isSunk());

  isHit = ([row, col]) => this.board[row][col] instanceof _Ship__WEBPACK_IMPORTED_MODULE_0__["default"];

  resetGameboard() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [];
  }

  isEveryCellValid(ship, [row, col], orientation) {
    for (let i = 0; i < ship.length; i += 1) {
      if (orientation === "horizontal") {
        if (this.board[row][col + i] === null) continue;
      } else if (this.board[row + i][col] === null) continue;

      return false;
    }
    return true;
  }

  canPlaceShip(ship, [row, col], orientation) {
    return (
      !Gameboard.isOutOfBounds([row, col]) &&
      Gameboard.getEndPosition(ship, [row, col], orientation) < 10 &&
      this.isEveryCellValid(ship, [row, col], orientation)
    );
  }

  placeShip(ship, [row, col], orientation) {
    if (!this.canPlaceShip(ship, [row, col], orientation)) return;

    ship.coords = [row, col];
    ship.orientation = orientation;
    this.ships.push(ship);

    let i = 0;
    while (i < ship.length) {
      if (orientation === "horizontal") {
        this.board[row][col + i] = ship;
      } else {
        this.board[row + i][col] = ship;
      }
      i += 1;
    }
  }

  receiveAttack([row, col]) {
    if (
      Gameboard.isOutOfBounds([row, col]) ||
      this.board[row][col] === "hit" ||
      this.board[row][col] === "miss"
    )
      return false;

    this.latestReceivedAttack = [row, col];

    if (!this.isHit([row, col])) {
      this.board[row][col] = "miss";
    } else {
      this.board[row][col].hit();
      this.board[row][col] = "hit";
    }

    return true;
  }
}


/***/ }),

/***/ "./src/game-logic/Player.js":
/*!**********************************!*\
  !*** ./src/game-logic/Player.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _Gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Gameboard */ "./src/game-logic/Gameboard.js");
/* harmony import */ var _Ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Ship */ "./src/game-logic/Ship.js");



class Player {
  constructor() {
    this.gameboard = new _Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.carrier = new _Ship__WEBPACK_IMPORTED_MODULE_1__["default"]("carrier", 5);
    this.battleship = new _Ship__WEBPACK_IMPORTED_MODULE_1__["default"]("battleship", 4);
    this.cruiser = new _Ship__WEBPACK_IMPORTED_MODULE_1__["default"]("cruiser", 3);
    this.submarine = new _Ship__WEBPACK_IMPORTED_MODULE_1__["default"]("submarine", 3);
    this.destroyer = new _Ship__WEBPACK_IMPORTED_MODULE_1__["default"]("destroyer", 2);
    this.shipsToPlace = [
      this.carrier,
      this.battleship,
      this.cruiser,
      this.submarine,
      this.destroyer,
    ];
  }

  static getRandomInt = (max) => Math.floor(Math.random() * max);

  /* Randomize array in-place using Durstenfeld shuffle algorithm */
  static shuffleArray(array) {
    const newArray = [...array];
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
  }

  static getRandomOrientation = () =>
    Player.getRandomInt(2) === 0 ? "horizontal" : "vertical";

  static getRandomValidCoords = (validCoords) =>
    validCoords[Player.getRandomInt(validCoords.length)];

  restoreShipsToPlace() {
    this.shipsToPlace = [
      this.carrier,
      this.battleship,
      this.cruiser,
      this.submarine,
      this.destroyer,
    ];
  }

  placeAllShipsRandomly() {
    this.gameboard.resetGameboard();

    const randomShips = Player.shuffleArray(this.shipsToPlace);
    randomShips.forEach((ship) => {
      const validCoords = [];
      const randomOrientation = Player.getRandomOrientation();
      for (let row = 0; row < 10; row += 1) {
        for (let col = 0; col < 10; col += 1) {
          if (
            this.gameboard.canPlaceShip(ship, [row, col], randomOrientation)
          ) {
            validCoords.push([row, col]);
          }
        }
      }

      const [randomX, randomY] = Player.getRandomValidCoords(validCoords);
      this.gameboard.placeShip(ship, [randomX, randomY], randomOrientation);
    });
  }

  static getValidCoords(enemy) {
    const enemyBoard = enemy.gameboard.board;
    const validCoords = [];
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        if (
          enemyBoard[row][col] === null ||
          enemyBoard[row][col] instanceof _Ship__WEBPACK_IMPORTED_MODULE_1__["default"]
        ) {
          validCoords.push([row, col]);
        }
      }
    }

    return validCoords;
  }

  static attack([row, col], enemy) {
    return enemy.gameboard.receiveAttack([row, col]);
  }

  static makeComputerAttack(player) {
    const randomValidCoord = Player.getRandomValidCoords(
      Player.getValidCoords(player)
    );

    return player.gameboard.receiveAttack(randomValidCoord);
  }
}


/***/ }),

/***/ "./src/game-logic/Ship.js":
/*!********************************!*\
  !*** ./src/game-logic/Ship.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.timesHit = 0;
    this.coords = null;
  }

  hit() {
    if (this.timesHit !== this.length) this.timesHit += 1;
  }

  isSunk() {
    return this.length === this.timesHit;
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom_gameUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom/gameUI */ "./src/dom/gameUI.js");


_dom_gameUI__WEBPACK_IMPORTED_MODULE_0__["default"].initialize();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsVUFBVTtBQUNoQyx3QkFBd0IsVUFBVTtBQUNsQztBQUNBO0FBQ0EsMENBQTBDLDZDQUFJO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNuR2U7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDZkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05rQzs7QUFFbEMsOERBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20vZ2FtZVVJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tL2hlbHBlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUtbG9naWMvR2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUtbG9naWMvR2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS1sb2dpYy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lLWxvZ2ljL1NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2dhbWUtbG9naWMvR2FtZVwiO1xuaW1wb3J0IHsgY2xlYXJIaWdobGlnaHRlZENlbGxzIH0gZnJvbSBcIi4vaGVscGVyXCI7XG5cbmNvbnN0IGdhbWVVSSA9ICgoKSA9PiB7XG4gIGNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLWJvYXJkXCIpO1xuICBjb25zdCBhaUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5haS1ib2FyZFwiKTtcbiAgY29uc3Qgc2V0dXBCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dXAtYm9hcmQtY29udGFpbmVyXCIpO1xuICBjb25zdCBzZXR1cEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZXR1cC1ib2FyZFwiKTtcbiAgY29uc3QgZ2FtZWJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lYm9hcmQtY29udGFpbmVyXCIpO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUdhbWVib2FyZENlbGxzKGJvYXJkKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgMTA7IHJvdyArPSAxKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sICs9IDEpIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgICAgIGNlbGwuZGF0YXNldC5jb29yZHMgPSBgWyR7cm93fSwgJHtjb2x9XWA7XG4gICAgICAgIGJvYXJkLmFwcGVuZENoaWxkKGNlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRIb21lcGFnZSgpIHtcbiAgICBjb25zdCBob21lcGFnZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaG9tZXBhZ2UtY29udGFpbmVyXCIpO1xuXG4gICAgaG9tZXBhZ2VDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBob21lcGFnZUNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgICAgc2V0dXBCb2FyZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFNldHVwQm9hcmQoKSB7XG4gICAgY29uc3Qgcm90YXRlU2hpcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucm90YXRlLXNoaXBcIik7XG4gICAgY29uc3Qgc2V0dXBCb2FyZE1lc3NhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNldHVwLWJvYXJkLW1lc3NhZ2VcIik7XG4gICAgY29uc3QgcmFuZG9taXplU2hpcHNCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJhbmRvbWl6ZS1zaGlwc1wiKTtcbiAgICBjb25zdCByZXNldEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZXNldC1ib2FyZFwiKTtcbiAgICBjb25zdCBzdGFydEdhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNldHVwLWJvYXJkLXN0YXJ0LWdhbWVcIik7XG4gICAgY29uc3QgcGxheWVyTmFtZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGF5ZXItbmFtZS1pbnB1dFwiKTtcbiAgICBjb25zdCBwbGF5ZXJCb2FyZE5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIucGxheWVyLWJvYXJkLWNvbnRhaW5lciAuYm9hcmQtbmFtZVwiXG4gICAgKTtcbiAgICBsZXQgc2hpcE9yaWVudGF0aW9uU3RhdGUgPSBcImhvcml6b250YWxcIjtcblxuICAgIGZ1bmN0aW9uIGhpZ2hsaWdodFNoaXAoY29vcmRzLCBzaGlwLCBvcmllbnRhdGlvbiwgc2VsZWN0b3IsIGNsYXNzTmFtZSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGxldCBbcm93LCBjb2xdID0gW2Nvb3Jkc1swXSwgY29vcmRzWzFdXTtcblxuICAgICAgICBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSBjb2wgKz0gaTtcbiAgICAgICAgZWxzZSByb3cgKz0gaTtcbiAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgYCR7c2VsZWN0b3J9IFtkYXRhLWNvb3Jkcz1cIlske3Jvd30sICR7Y29sfV1cIl1gXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGNlbGwpIGNlbGwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySGlnaGxpZ2h0U2hpcCgpIHtcbiAgICAgIGNsZWFySGlnaGxpZ2h0ZWRDZWxscyhcIi5zZXR1cC1ib2FyZCAuc2hpcFwiLCBcInNoaXBcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRHYW1lSGFuZGxlcigpIHtcbiAgICAgIGlmIChnYW1lLnBsYXllci5nYW1lYm9hcmQuc2hpcHMubGVuZ3RoICE9PSA1KSByZXR1cm47XG5cbiAgICAgIHNldHVwQm9hcmRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgIGdhbWVib2FyZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgY2xlYXJIaWdobGlnaHRTaGlwKCk7XG4gICAgICBnYW1lLmFpLnBsYWNlQWxsU2hpcHNSYW5kb21seSgpO1xuICAgICAgZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLnNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgaGlnaGxpZ2h0U2hpcChcbiAgICAgICAgICBzaGlwLmNvb3JkcyxcbiAgICAgICAgICBzaGlwLFxuICAgICAgICAgIHNoaXAub3JpZW50YXRpb24sXG4gICAgICAgICAgXCIucGxheWVyLWJvYXJkXCIsXG4gICAgICAgICAgXCJzaGlwXCJcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBwbGF5ZXJCb2FyZE5hbWUudGV4dENvbnRlbnQgPSBwbGF5ZXJOYW1lSW5wdXQudmFsdWUudHJpbSgpIHx8IFwiUGxheWVyXCI7XG5cbiAgICAgIHNldHVwQm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICAgICAgc2V0dXBCb2FyZE1lc3NhZ2UudGV4dENvbnRlbnQgPSBcIlBsYWNlIHlvdXIgY2FycmllclwiO1xuICAgICAgc3RhcnRHYW1lLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckhpZ2hsaWdodFNoaXBQcmV2aWV3KCkge1xuICAgICAgY29uc3QgY2VsbFZhbGlkaXR5Q2xhc3NOYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52YWxpZFwiKVxuICAgICAgICA/IFwidmFsaWRcIlxuICAgICAgICA6IFwiaW52YWxpZFwiO1xuXG4gICAgICBjbGVhckhpZ2hsaWdodGVkQ2VsbHMoXG4gICAgICAgIGAuc2V0dXAtYm9hcmQgLiR7Y2VsbFZhbGlkaXR5Q2xhc3NOYW1lfWAsXG4gICAgICAgIGAke2NlbGxWYWxpZGl0eUNsYXNzTmFtZX1gXG4gICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc2V0Qm9hcmRIYW5kbGVyKCkge1xuICAgICAgZ2FtZS5yZXNldEdhbWUoKTtcbiAgICAgIGNsZWFySGlnaGxpZ2h0U2hpcCgpO1xuICAgICAgc2V0dXBCb2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XG4gICAgICBzZXR1cEJvYXJkTWVzc2FnZS50ZXh0Q29udGVudCA9IFwiUGxhY2UgeW91ciBjYXJyaWVyXCI7XG4gICAgICBzdGFydEdhbWUuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhpZ2hsaWdodFNoaXBQcmV2aWV3KGUpIHtcbiAgICAgIGNsZWFySGlnaGxpZ2h0U2hpcFByZXZpZXcoKTtcbiAgICAgIGNvbnN0IFtjdXJyZW50U2hpcF0gPSBnYW1lLnBsYXllci5zaGlwc1RvUGxhY2U7XG4gICAgICBpZiAoIWN1cnJlbnRTaGlwIHx8ICFlLnRhcmdldC5kYXRhc2V0LmNvb3JkcykgcmV0dXJuO1xuXG4gICAgICBjb25zdCBjb29yZHMgPSBKU09OLnBhcnNlKGUudGFyZ2V0LmRhdGFzZXQuY29vcmRzKTtcblxuICAgICAgY29uc3QgaXNWYWxpZFNoaXBQbGFjZW1lbnQgPSBnYW1lLnBsYXllci5nYW1lYm9hcmQuY2FuUGxhY2VTaGlwKFxuICAgICAgICBjdXJyZW50U2hpcCxcbiAgICAgICAgY29vcmRzLFxuICAgICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGNlbGxWYWxpZGl0eU5hbWUgPSBpc1ZhbGlkU2hpcFBsYWNlbWVudCA/IFwidmFsaWRcIiA6IFwiaW52YWxpZFwiO1xuICAgICAgaGlnaGxpZ2h0U2hpcChcbiAgICAgICAgY29vcmRzLFxuICAgICAgICBjdXJyZW50U2hpcCxcbiAgICAgICAgc2hpcE9yaWVudGF0aW9uU3RhdGUsXG4gICAgICAgIFwiLnNldHVwLWJvYXJkXCIsXG4gICAgICAgIGNlbGxWYWxpZGl0eU5hbWVcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmFuZG9taXplU2hpcHMoKSB7XG4gICAgICBnYW1lLnBsYXllci5yZXN0b3JlU2hpcHNUb1BsYWNlKCk7XG4gICAgICBnYW1lLnBsYXllci5wbGFjZUFsbFNoaXBzUmFuZG9tbHkoKTtcbiAgICAgIGNsZWFySGlnaGxpZ2h0U2hpcCgpO1xuICAgICAgc3RhcnRHYW1lLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcblxuICAgICAgY29uc3QgeyBzaGlwcyB9ID0gZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkO1xuICAgICAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICBoaWdobGlnaHRTaGlwKFxuICAgICAgICAgIHNoaXAuY29vcmRzLFxuICAgICAgICAgIHNoaXAsXG4gICAgICAgICAgc2hpcC5vcmllbnRhdGlvbixcbiAgICAgICAgICBcIi5zZXR1cC1ib2FyZFwiLFxuICAgICAgICAgIFwic2hpcFwiXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIHNldHVwQm9hcmQuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICAgICAgc2V0dXBCb2FyZE1lc3NhZ2UudGV4dENvbnRlbnQgPSBcIlJlYWR5IGZvciBiYXR0bGUhXCI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGxhY2VTaGlwKGUpIHtcbiAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJib2FyZFwiKSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBjb29yZHMgPSBKU09OLnBhcnNlKGUudGFyZ2V0LmRhdGFzZXQuY29vcmRzKTtcbiAgICAgIGNvbnN0IFtjdXJyZW50U2hpcF0gPSBnYW1lLnBsYXllci5zaGlwc1RvUGxhY2U7XG5cbiAgICAgIGlmIChcbiAgICAgICAgIWdhbWUucGxheWVyLmdhbWVib2FyZC5jYW5QbGFjZVNoaXAoXG4gICAgICAgICAgY3VycmVudFNoaXAsXG4gICAgICAgICAgY29vcmRzLFxuICAgICAgICAgIHNoaXBPcmllbnRhdGlvblN0YXRlXG4gICAgICAgIClcbiAgICAgIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBnYW1lLnBsYXllci5nYW1lYm9hcmQucGxhY2VTaGlwKFxuICAgICAgICBjdXJyZW50U2hpcCxcbiAgICAgICAgY29vcmRzLFxuICAgICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZVxuICAgICAgKTtcblxuICAgICAgaGlnaGxpZ2h0U2hpcChcbiAgICAgICAgY29vcmRzLFxuICAgICAgICBjdXJyZW50U2hpcCxcbiAgICAgICAgY3VycmVudFNoaXAub3JpZW50YXRpb24sXG4gICAgICAgIFwiLnNldHVwLWJvYXJkXCIsXG4gICAgICAgIFwic2hpcFwiXG4gICAgICApO1xuICAgICAgZ2FtZS5wbGF5ZXIuc2hpcHNUb1BsYWNlLnNoaWZ0KCk7XG5cbiAgICAgIGNvbnN0IFtuZXh0U2hpcF0gPSBnYW1lLnBsYXllci5zaGlwc1RvUGxhY2U7XG5cbiAgICAgIGlmICghZ2FtZS5wbGF5ZXIuc2hpcHNUb1BsYWNlLmxlbmd0aCkge1xuICAgICAgICBzZXR1cEJvYXJkTWVzc2FnZS50ZXh0Q29udGVudCA9IFwiUmVhZHkgZm9yIGJhdHRsZSFcIjtcbiAgICAgICAgc2V0dXBCb2FyZC5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIHN0YXJ0R2FtZS5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXR1cEJvYXJkTWVzc2FnZS50ZXh0Q29udGVudCA9IGBQbGFjZSB5b3VyICR7bmV4dFNoaXAubmFtZX1gO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGludmVydEJvYXJkT3JpZW50YXRpb24oKSB7XG4gICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZSA9XG4gICAgICAgIHNoaXBPcmllbnRhdGlvblN0YXRlID09PSBcImhvcml6b250YWxcIiA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xuICAgIH1cblxuICAgIHNldHVwQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCBoaWdobGlnaHRTaGlwUHJldmlldyk7XG4gICAgc2V0dXBCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBjbGVhckhpZ2hsaWdodFNoaXBQcmV2aWV3KTtcbiAgICBzZXR1cEJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwbGFjZVNoaXApO1xuICAgIHJvdGF0ZVNoaXAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGludmVydEJvYXJkT3JpZW50YXRpb24pO1xuICAgIHJhbmRvbWl6ZVNoaXBzQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByYW5kb21pemVTaGlwcyk7XG4gICAgcmVzZXRCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVzZXRCb2FyZEhhbmRsZXIpO1xuICAgIHN0YXJ0R2FtZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lSGFuZGxlcik7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0R2FtZWJvYXJkKCkge1xuICAgIGNvbnN0IG1vZGFsT3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtb3ZlcmxheVwiKTtcbiAgICBjb25zdCBnYW1lT3ZlclRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtb3Zlci10ZXh0XCIpO1xuICAgIGNvbnN0IHBsYXlBZ2FpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheS1hZ2FpblwiKTtcbiAgICBjb25zdCBuZXdHYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5uZXctZ2FtZVwiKTtcblxuICAgIGZ1bmN0aW9uIGhpZ2hsaWdodEF0dGFjayhib2FyZCwgW3JvdywgY29sXSwgc2VsZWN0b3IpIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgJHtzZWxlY3Rvcn0gW2RhdGEtY29vcmRzPVwiWyR7cm93fSwgJHtjb2x9XVwiXWBcbiAgICAgICk7XG5cbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChib2FyZFtyb3ddW2NvbF0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyR2FtZWJvYXJkQ2VsbHNIaWdobGlnaHRlZCgpIHtcbiAgICAgIGNsZWFySGlnaGxpZ2h0ZWRDZWxscyhcIi5nYW1lYm9hcmQtY29udGFpbmVyIC5jZWxsXCIsIFtcbiAgICAgICAgXCJoaXRcIixcbiAgICAgICAgXCJtaXNzXCIsXG4gICAgICAgIFwic2hpcFwiLFxuICAgICAgXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGxheUFnYWluSGFuZGxlcigpIHtcbiAgICAgIGdhbWUucmVzZXRHYW1lKCk7XG5cbiAgICAgIGNsZWFyR2FtZWJvYXJkQ2VsbHNIaWdobGlnaHRlZCgpO1xuICAgICAgbW9kYWxPdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBnYW1lYm9hcmRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgIHNldHVwQm9hcmRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhdHRhY2soZSkge1xuICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImFpLWJvYXJkXCIpIHx8IGdhbWUuaXNHYW1lT3ZlcigpKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IFtyb3csIGNvbF0gPSBKU09OLnBhcnNlKGUudGFyZ2V0LmRhdGFzZXQuY29vcmRzKTtcblxuICAgICAgaWYgKCFnYW1lLnBsYXllci5jb25zdHJ1Y3Rvci5hdHRhY2soW3JvdywgY29sXSwgZ2FtZS5haSkpIHJldHVybjtcblxuICAgICAgaGlnaGxpZ2h0QXR0YWNrKGdhbWUuYWkuZ2FtZWJvYXJkLmJvYXJkLCBbcm93LCBjb2xdLCBcIi5haS1ib2FyZFwiKTtcbiAgICAgIGlmIChnYW1lLmlzR2FtZU92ZXIoKSkge1xuICAgICAgICBtb2RhbE92ZXJsYXkuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgICAgZ2FtZU92ZXJUZXh0LnRleHRDb250ZW50ID0gYEdhbWUgT3ZlciEgWW91IHdvbiFgO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGdhbWUuYWkuY29uc3RydWN0b3IubWFrZUNvbXB1dGVyQXR0YWNrKGdhbWUucGxheWVyKTtcbiAgICAgIGhpZ2hsaWdodEF0dGFjayhcbiAgICAgICAgZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLmJvYXJkLFxuICAgICAgICBnYW1lLnBsYXllci5nYW1lYm9hcmQubGF0ZXN0UmVjZWl2ZWRBdHRhY2ssXG4gICAgICAgIFwiLnBsYXllci1ib2FyZFwiXG4gICAgICApO1xuXG4gICAgICBpZiAoZ2FtZS5pc0dhbWVPdmVyKCkpIHtcbiAgICAgICAgZ2FtZU92ZXJUZXh0LnRleHRDb250ZW50ID0gYEdhbWUgT3ZlciEgWW91IGxvc3QhYDtcblxuICAgICAgICBtb2RhbE92ZXJsYXkuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhaUJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhdHRhY2spO1xuICAgIHBsYXlBZ2Fpbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxheUFnYWluSGFuZGxlcik7XG4gICAgbmV3R2FtZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgY3JlYXRlR2FtZWJvYXJkQ2VsbHMocGxheWVyQm9hcmQpO1xuICAgIGNyZWF0ZUdhbWVib2FyZENlbGxzKGFpQm9hcmQpO1xuICAgIGNyZWF0ZUdhbWVib2FyZENlbGxzKHNldHVwQm9hcmQpO1xuXG4gICAgaW5pdEhvbWVwYWdlKCk7XG4gICAgaW5pdFNldHVwQm9hcmQoKTtcbiAgICBpbml0R2FtZWJvYXJkKCk7XG4gIH1cblxuICByZXR1cm4geyBpbml0aWFsaXplIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lVUk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuXG5mdW5jdGlvbiBjbGVhckhpZ2hsaWdodGVkQ2VsbHMoc2VsZWN0b3IsIGNsYXNzZXMpIHtcbiAgY29uc3QgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2xhc3NlcykpIHtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc2VzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzZXMpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCB7IGNsZWFySGlnaGxpZ2h0ZWRDZWxscyB9O1xuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9QbGF5ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcigpO1xuICAgIHRoaXMuYWkgPSBuZXcgUGxheWVyKCk7XG4gIH1cblxuICByZXNldEdhbWUoKSB7XG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG4gICAgdGhpcy5haSA9IG5ldyBQbGF5ZXIoKTtcbiAgfVxuXG4gIGlzR2FtZU92ZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMucGxheWVyLmdhbWVib2FyZC5hcmVBbGxTaGlwc1N1bmsoKSB8fFxuICAgICAgdGhpcy5haS5nYW1lYm9hcmQuYXJlQWxsU2hpcHNTdW5rKClcbiAgICApO1xuICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vU2hpcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmJvYXJkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwobnVsbCkpO1xuICAgIHRoaXMuc2hpcHMgPSBbXTtcbiAgfVxuXG4gIHN0YXRpYyBpc091dE9mQm91bmRzID0gKFtyb3csIGNvbF0pID0+XG4gICAgcm93IDwgMCB8fCByb3cgPiA5IHx8IGNvbCA8IDAgfHwgY29sID4gOTtcblxuICBzdGF0aWMgZ2V0RW5kUG9zaXRpb24gPSAoc2hpcCwgW3JvdywgY29sXSwgb3JpZW50YXRpb24pID0+XG4gICAgb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiXG4gICAgICA/IGNvbCArIHNoaXAubGVuZ3RoIC0gMVxuICAgICAgOiByb3cgKyBzaGlwLmxlbmd0aCAtIDE7XG5cbiAgYXJlQWxsU2hpcHNTdW5rID0gKCkgPT4gdGhpcy5zaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSk7XG5cbiAgaXNIaXQgPSAoW3JvdywgY29sXSkgPT4gdGhpcy5ib2FyZFtyb3ddW2NvbF0gaW5zdGFuY2VvZiBTaGlwO1xuXG4gIHJlc2V0R2FtZWJvYXJkKCkge1xuICAgIHRoaXMuYm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheSgxMCkuZmlsbChudWxsKSk7XG4gICAgdGhpcy5zaGlwcyA9IFtdO1xuICB9XG5cbiAgaXNFdmVyeUNlbGxWYWxpZChzaGlwLCBbcm93LCBjb2xdLCBvcmllbnRhdGlvbikge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3ddW2NvbCArIGldID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2FyZFtyb3cgKyBpXVtjb2xdID09PSBudWxsKSBjb250aW51ZTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNhblBsYWNlU2hpcChzaGlwLCBbcm93LCBjb2xdLCBvcmllbnRhdGlvbikge1xuICAgIHJldHVybiAoXG4gICAgICAhR2FtZWJvYXJkLmlzT3V0T2ZCb3VuZHMoW3JvdywgY29sXSkgJiZcbiAgICAgIEdhbWVib2FyZC5nZXRFbmRQb3NpdGlvbihzaGlwLCBbcm93LCBjb2xdLCBvcmllbnRhdGlvbikgPCAxMCAmJlxuICAgICAgdGhpcy5pc0V2ZXJ5Q2VsbFZhbGlkKHNoaXAsIFtyb3csIGNvbF0sIG9yaWVudGF0aW9uKVxuICAgICk7XG4gIH1cblxuICBwbGFjZVNoaXAoc2hpcCwgW3JvdywgY29sXSwgb3JpZW50YXRpb24pIHtcbiAgICBpZiAoIXRoaXMuY2FuUGxhY2VTaGlwKHNoaXAsIFtyb3csIGNvbF0sIG9yaWVudGF0aW9uKSkgcmV0dXJuO1xuXG4gICAgc2hpcC5jb29yZHMgPSBbcm93LCBjb2xdO1xuICAgIHNoaXAub3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcbiAgICB0aGlzLnNoaXBzLnB1c2goc2hpcCk7XG5cbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBzaGlwLmxlbmd0aCkge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICB0aGlzLmJvYXJkW3Jvd11bY29sICsgaV0gPSBzaGlwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ib2FyZFtyb3cgKyBpXVtjb2xdID0gc2hpcDtcbiAgICAgIH1cbiAgICAgIGkgKz0gMTtcbiAgICB9XG4gIH1cblxuICByZWNlaXZlQXR0YWNrKFtyb3csIGNvbF0pIHtcbiAgICBpZiAoXG4gICAgICBHYW1lYm9hcmQuaXNPdXRPZkJvdW5kcyhbcm93LCBjb2xdKSB8fFxuICAgICAgdGhpcy5ib2FyZFtyb3ddW2NvbF0gPT09IFwiaGl0XCIgfHxcbiAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2xdID09PSBcIm1pc3NcIlxuICAgIClcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHRoaXMubGF0ZXN0UmVjZWl2ZWRBdHRhY2sgPSBbcm93LCBjb2xdO1xuXG4gICAgaWYgKCF0aGlzLmlzSGl0KFtyb3csIGNvbF0pKSB7XG4gICAgICB0aGlzLmJvYXJkW3Jvd11bY29sXSA9IFwibWlzc1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJvYXJkW3Jvd11bY29sXS5oaXQoKTtcbiAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2xdID0gXCJoaXRcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9HYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuL1NoaXBcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5nYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgdGhpcy5jYXJyaWVyID0gbmV3IFNoaXAoXCJjYXJyaWVyXCIsIDUpO1xuICAgIHRoaXMuYmF0dGxlc2hpcCA9IG5ldyBTaGlwKFwiYmF0dGxlc2hpcFwiLCA0KTtcbiAgICB0aGlzLmNydWlzZXIgPSBuZXcgU2hpcChcImNydWlzZXJcIiwgMyk7XG4gICAgdGhpcy5zdWJtYXJpbmUgPSBuZXcgU2hpcChcInN1Ym1hcmluZVwiLCAzKTtcbiAgICB0aGlzLmRlc3Ryb3llciA9IG5ldyBTaGlwKFwiZGVzdHJveWVyXCIsIDIpO1xuICAgIHRoaXMuc2hpcHNUb1BsYWNlID0gW1xuICAgICAgdGhpcy5jYXJyaWVyLFxuICAgICAgdGhpcy5iYXR0bGVzaGlwLFxuICAgICAgdGhpcy5jcnVpc2VyLFxuICAgICAgdGhpcy5zdWJtYXJpbmUsXG4gICAgICB0aGlzLmRlc3Ryb3llcixcbiAgICBdO1xuICB9XG5cbiAgc3RhdGljIGdldFJhbmRvbUludCA9IChtYXgpID0+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XG5cbiAgLyogUmFuZG9taXplIGFycmF5IGluLXBsYWNlIHVzaW5nIER1cnN0ZW5mZWxkIHNodWZmbGUgYWxnb3JpdGhtICovXG4gIHN0YXRpYyBzaHVmZmxlQXJyYXkoYXJyYXkpIHtcbiAgICBjb25zdCBuZXdBcnJheSA9IFsuLi5hcnJheV07XG4gICAgZm9yIChsZXQgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPiAwOyBpIC09IDEpIHtcbiAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgIFtuZXdBcnJheVtpXSwgbmV3QXJyYXlbal1dID0gW25ld0FycmF5W2pdLCBuZXdBcnJheVtpXV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9XG5cbiAgc3RhdGljIGdldFJhbmRvbU9yaWVudGF0aW9uID0gKCkgPT5cbiAgICBQbGF5ZXIuZ2V0UmFuZG9tSW50KDIpID09PSAwID8gXCJob3Jpem9udGFsXCIgOiBcInZlcnRpY2FsXCI7XG5cbiAgc3RhdGljIGdldFJhbmRvbVZhbGlkQ29vcmRzID0gKHZhbGlkQ29vcmRzKSA9PlxuICAgIHZhbGlkQ29vcmRzW1BsYXllci5nZXRSYW5kb21JbnQodmFsaWRDb29yZHMubGVuZ3RoKV07XG5cbiAgcmVzdG9yZVNoaXBzVG9QbGFjZSgpIHtcbiAgICB0aGlzLnNoaXBzVG9QbGFjZSA9IFtcbiAgICAgIHRoaXMuY2FycmllcixcbiAgICAgIHRoaXMuYmF0dGxlc2hpcCxcbiAgICAgIHRoaXMuY3J1aXNlcixcbiAgICAgIHRoaXMuc3VibWFyaW5lLFxuICAgICAgdGhpcy5kZXN0cm95ZXIsXG4gICAgXTtcbiAgfVxuXG4gIHBsYWNlQWxsU2hpcHNSYW5kb21seSgpIHtcbiAgICB0aGlzLmdhbWVib2FyZC5yZXNldEdhbWVib2FyZCgpO1xuXG4gICAgY29uc3QgcmFuZG9tU2hpcHMgPSBQbGF5ZXIuc2h1ZmZsZUFycmF5KHRoaXMuc2hpcHNUb1BsYWNlKTtcbiAgICByYW5kb21TaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBjb25zdCB2YWxpZENvb3JkcyA9IFtdO1xuICAgICAgY29uc3QgcmFuZG9tT3JpZW50YXRpb24gPSBQbGF5ZXIuZ2V0UmFuZG9tT3JpZW50YXRpb24oKTtcbiAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3cgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sICs9IDEpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmdhbWVib2FyZC5jYW5QbGFjZVNoaXAoc2hpcCwgW3JvdywgY29sXSwgcmFuZG9tT3JpZW50YXRpb24pXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB2YWxpZENvb3Jkcy5wdXNoKFtyb3csIGNvbF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBbcmFuZG9tWCwgcmFuZG9tWV0gPSBQbGF5ZXIuZ2V0UmFuZG9tVmFsaWRDb29yZHModmFsaWRDb29yZHMpO1xuICAgICAgdGhpcy5nYW1lYm9hcmQucGxhY2VTaGlwKHNoaXAsIFtyYW5kb21YLCByYW5kb21ZXSwgcmFuZG9tT3JpZW50YXRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGdldFZhbGlkQ29vcmRzKGVuZW15KSB7XG4gICAgY29uc3QgZW5lbXlCb2FyZCA9IGVuZW15LmdhbWVib2FyZC5ib2FyZDtcbiAgICBjb25zdCB2YWxpZENvb3JkcyA9IFtdO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3cgKz0gMSkge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCArPSAxKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBlbmVteUJvYXJkW3Jvd11bY29sXSA9PT0gbnVsbCB8fFxuICAgICAgICAgIGVuZW15Qm9hcmRbcm93XVtjb2xdIGluc3RhbmNlb2YgU2hpcFxuICAgICAgICApIHtcbiAgICAgICAgICB2YWxpZENvb3Jkcy5wdXNoKFtyb3csIGNvbF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkQ29vcmRzO1xuICB9XG5cbiAgc3RhdGljIGF0dGFjayhbcm93LCBjb2xdLCBlbmVteSkge1xuICAgIHJldHVybiBlbmVteS5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhbcm93LCBjb2xdKTtcbiAgfVxuXG4gIHN0YXRpYyBtYWtlQ29tcHV0ZXJBdHRhY2socGxheWVyKSB7XG4gICAgY29uc3QgcmFuZG9tVmFsaWRDb29yZCA9IFBsYXllci5nZXRSYW5kb21WYWxpZENvb3JkcyhcbiAgICAgIFBsYXllci5nZXRWYWxpZENvb3JkcyhwbGF5ZXIpXG4gICAgKTtcblxuICAgIHJldHVybiBwbGF5ZXIuZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2socmFuZG9tVmFsaWRDb29yZCk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBsZW5ndGgpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMudGltZXNIaXQgPSAwO1xuICAgIHRoaXMuY29vcmRzID0gbnVsbDtcbiAgfVxuXG4gIGhpdCgpIHtcbiAgICBpZiAodGhpcy50aW1lc0hpdCAhPT0gdGhpcy5sZW5ndGgpIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggPT09IHRoaXMudGltZXNIaXQ7XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGdhbWVVSSBmcm9tIFwiLi9kb20vZ2FtZVVJXCI7XG5cbmdhbWVVSS5pbml0aWFsaXplKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=