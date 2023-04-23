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

  function initHomepage() {
    const homepageContainer = document.querySelector(".homepage-container");

    homepageContainer.addEventListener("submit", (e) => {
      e.preventDefault();

      homepageContainer.classList.remove("active");
      setupBoardContainer.classList.add("active");
    });
  }

  function initSetupBoard() {
    const rotateShipBtn = document.querySelector(".rotate-ship");
    const setupBoardMessage = document.querySelector(".setup-board-message");
    const randomizeShipsBtn = document.querySelector(".randomize-ships");
    const resetBoardBtn = document.querySelector(".reset-board");
    const startGameBtn = document.querySelector(".setup-board-start-game");
    const playerNameInput = document.querySelector("#player-name-input");
    const playerBoardName = document.querySelector(
      ".player-board-container .board-name"
    );
    let shipOrientationState = "horizontal";

    function clearHighlightShip() {
      (0,_helper__WEBPACK_IMPORTED_MODULE_1__.clearHighlightedCells)(".setup-board .ship", "ship");
    }

    function startGame() {
      if (game.player.gameboard.ships.length !== 5) return;

      setupBoardContainer.classList.remove("active");
      gameboardContainer.classList.add("active");
      clearHighlightShip();
      game.ai.randomizeShips();
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
      startGameBtn.classList.add("disabled");
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

    function resetBoard() {
      game.resetGame();
      clearHighlightShip();
      setupBoard.classList.remove("disabled");
      setupBoardMessage.textContent = "Place your carrier";
      startGameBtn.classList.add("disabled");
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
      game.player.resetShipsPlaced();
      game.player.randomizeShips();
      clearHighlightShip();
      startGameBtn.classList.remove("disabled");

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
        startGameBtn.classList.remove("disabled");
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
    rotateShipBtn.addEventListener("click", invertBoardOrientation);
    randomizeShipsBtn.addEventListener("click", randomizeShips);
    resetBoardBtn.addEventListener("click", resetBoard);
    startGameBtn.addEventListener("click", startGame);
  }

  function initGameboard() {
    const modalOverlay = document.querySelector(".modal-overlay");
    const gameOverText = document.querySelector(".game-over-text");
    const playAgainBtn = document.querySelector(".play-again");
    const newGameBtn = document.querySelector(".new-game");

    function highlightAttack(board, [row, col], selector) {
      const cell = document.querySelector(
        `${selector} [data-coords="[${row}, ${col}]"]`
      );
      const ship = board[row][col];
      if (!ship) {
        cell.classList.add("miss");
      } else cell.classList.add("hit");

      if (ship && ship.isSunk()) {
        highlightShip(ship.coords, ship, ship.orientation, selector, "sunk");
      }
    }

    function clearGameboardCellsHighlighted() {
      (0,_helper__WEBPACK_IMPORTED_MODULE_1__.clearHighlightedCells)(".gameboard-container .cell", [
        "hit",
        "miss",
        "ship",
        "sunk",
      ]);
    }

    function playAgain() {
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

      game.ai.constructor.makeAiAttack(game.player);
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
    playAgainBtn.addEventListener("click", playAgain);
    newGameBtn.addEventListener("click", () => window.location.reload());
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

// AI is hitting same coords again


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
/* eslint-disable no-param-reassign */

class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = []; // prolly delete later
    this.shotsMissed = [];
    this.shotsHit = [];
  }

  static isOutOfBounds = ([row, col]) =>
    row < 0 || row > 9 || col < 0 || col > 9;

  static getEndPosition = (ship, [row, col], orientation) =>
    orientation === "horizontal"
      ? col + ship.length - 1
      : row + ship.length - 1;

  static isCoordsFound = (array, [targetRow, targetCol]) =>
    array.some(([row, col]) => row === targetRow && col === targetCol);

  areAllShipsSunk = () => this.ships.every((ship) => ship.isSunk());

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
    ship.id = this.ships.length;
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
      (this.board[row][col] && this.board[row][col].isSunk()) ||
      Gameboard.isCoordsFound(this.shotsMissed, [row, col]) ||
      Gameboard.isCoordsFound(this.shotsHit, [row, col])
    )
      return false;

    this.latestReceivedAttack = [row, col]; // maybe store coords in constructor

    if (!this.board[row][col]) {
      this.shotsMissed.push([row, col]);
    } else {
      this.board[row][col].hit();
      this.shotsHit.push([row, col]);
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

  resetShipsPlaced() {
    this.shipsToPlace = [
      this.carrier,
      this.battleship,
      this.cruiser,
      this.submarine,
      this.destroyer,
    ];
  }

  randomizeShips() {
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

  static makeAiAttack(player) {
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
    this.coords = null; // may be unnecessary
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ2xDLDBCQUEwQixVQUFVO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFVBQVU7QUFDaEMsd0JBQXdCLFVBQVU7QUFDbEM7QUFDQTtBQUNBLDBDQUEwQyw2Q0FBSTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDbkdlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDZkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05rQzs7QUFFbEMsOERBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20vZ2FtZVVJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tL2hlbHBlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUtbG9naWMvR2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUtbG9naWMvR2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS1sb2dpYy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lLWxvZ2ljL1NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2dhbWUtbG9naWMvR2FtZVwiO1xuaW1wb3J0IHsgY2xlYXJIaWdobGlnaHRlZENlbGxzIH0gZnJvbSBcIi4vaGVscGVyXCI7XG5cbmNvbnN0IGdhbWVVSSA9ICgoKSA9PiB7XG4gIGNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLWJvYXJkXCIpO1xuICBjb25zdCBhaUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5haS1ib2FyZFwiKTtcbiAgY29uc3Qgc2V0dXBCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dXAtYm9hcmQtY29udGFpbmVyXCIpO1xuICBjb25zdCBzZXR1cEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZXR1cC1ib2FyZFwiKTtcbiAgY29uc3QgZ2FtZWJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lYm9hcmQtY29udGFpbmVyXCIpO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUdhbWVib2FyZENlbGxzKGJvYXJkKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgMTA7IHJvdyArPSAxKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sICs9IDEpIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICAgICAgY2VsbC5kYXRhc2V0LmNvb3JkcyA9IGBbJHtyb3d9LCAke2NvbH1dYDtcbiAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0U2hpcChjb29yZHMsIHNoaXAsIG9yaWVudGF0aW9uLCBzZWxlY3RvciwgY2xhc3NOYW1lKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBsZXQgW3JvdywgY29sXSA9IFtjb29yZHNbMF0sIGNvb3Jkc1sxXV07XG5cbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIGNvbCArPSBpO1xuICAgICAgZWxzZSByb3cgKz0gaTtcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgJHtzZWxlY3Rvcn0gW2RhdGEtY29vcmRzPVwiWyR7cm93fSwgJHtjb2x9XVwiXWBcbiAgICAgICk7XG5cbiAgICAgIGlmIChjZWxsKSBjZWxsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbml0SG9tZXBhZ2UoKSB7XG4gICAgY29uc3QgaG9tZXBhZ2VDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhvbWVwYWdlLWNvbnRhaW5lclwiKTtcblxuICAgIGhvbWVwYWdlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaG9tZXBhZ2VDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgIHNldHVwQm9hcmRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRTZXR1cEJvYXJkKCkge1xuICAgIGNvbnN0IHJvdGF0ZVNoaXBCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJvdGF0ZS1zaGlwXCIpO1xuICAgIGNvbnN0IHNldHVwQm9hcmRNZXNzYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZXR1cC1ib2FyZC1tZXNzYWdlXCIpO1xuICAgIGNvbnN0IHJhbmRvbWl6ZVNoaXBzQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yYW5kb21pemUtc2hpcHNcIik7XG4gICAgY29uc3QgcmVzZXRCb2FyZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzZXQtYm9hcmRcIik7XG4gICAgY29uc3Qgc3RhcnRHYW1lQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZXR1cC1ib2FyZC1zdGFydC1nYW1lXCIpO1xuICAgIGNvbnN0IHBsYXllck5hbWVJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheWVyLW5hbWUtaW5wdXRcIik7XG4gICAgY29uc3QgcGxheWVyQm9hcmROYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIFwiLnBsYXllci1ib2FyZC1jb250YWluZXIgLmJvYXJkLW5hbWVcIlxuICAgICk7XG4gICAgbGV0IHNoaXBPcmllbnRhdGlvblN0YXRlID0gXCJob3Jpem9udGFsXCI7XG5cbiAgICBmdW5jdGlvbiBjbGVhckhpZ2hsaWdodFNoaXAoKSB7XG4gICAgICBjbGVhckhpZ2hsaWdodGVkQ2VsbHMoXCIuc2V0dXAtYm9hcmQgLnNoaXBcIiwgXCJzaGlwXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcbiAgICAgIGlmIChnYW1lLnBsYXllci5nYW1lYm9hcmQuc2hpcHMubGVuZ3RoICE9PSA1KSByZXR1cm47XG5cbiAgICAgIHNldHVwQm9hcmRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgIGdhbWVib2FyZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgY2xlYXJIaWdobGlnaHRTaGlwKCk7XG4gICAgICBnYW1lLmFpLnJhbmRvbWl6ZVNoaXBzKCk7XG4gICAgICBnYW1lLnBsYXllci5nYW1lYm9hcmQuc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICBoaWdobGlnaHRTaGlwKFxuICAgICAgICAgIHNoaXAuY29vcmRzLFxuICAgICAgICAgIHNoaXAsXG4gICAgICAgICAgc2hpcC5vcmllbnRhdGlvbixcbiAgICAgICAgICBcIi5wbGF5ZXItYm9hcmRcIixcbiAgICAgICAgICBcInNoaXBcIlxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIHBsYXllckJvYXJkTmFtZS50ZXh0Q29udGVudCA9IHBsYXllck5hbWVJbnB1dC52YWx1ZS50cmltKCkgfHwgXCJQbGF5ZXJcIjtcblxuICAgICAgc2V0dXBCb2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XG4gICAgICBzZXR1cEJvYXJkTWVzc2FnZS50ZXh0Q29udGVudCA9IFwiUGxhY2UgeW91ciBjYXJyaWVyXCI7XG4gICAgICBzdGFydEdhbWVCdG4uY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySGlnaGxpZ2h0U2hpcFByZXZpZXcoKSB7XG4gICAgICBjb25zdCBjZWxsVmFsaWRpdHlDbGFzc05hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZhbGlkXCIpXG4gICAgICAgID8gXCJ2YWxpZFwiXG4gICAgICAgIDogXCJpbnZhbGlkXCI7XG5cbiAgICAgIGNsZWFySGlnaGxpZ2h0ZWRDZWxscyhcbiAgICAgICAgYC5zZXR1cC1ib2FyZCAuJHtjZWxsVmFsaWRpdHlDbGFzc05hbWV9YCxcbiAgICAgICAgYCR7Y2VsbFZhbGlkaXR5Q2xhc3NOYW1lfWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzZXRCb2FyZCgpIHtcbiAgICAgIGdhbWUucmVzZXRHYW1lKCk7XG4gICAgICBjbGVhckhpZ2hsaWdodFNoaXAoKTtcbiAgICAgIHNldHVwQm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICAgICAgc2V0dXBCb2FyZE1lc3NhZ2UudGV4dENvbnRlbnQgPSBcIlBsYWNlIHlvdXIgY2FycmllclwiO1xuICAgICAgc3RhcnRHYW1lQnRuLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoaWdobGlnaHRTaGlwUHJldmlldyhlKSB7XG4gICAgICBjbGVhckhpZ2hsaWdodFNoaXBQcmV2aWV3KCk7XG4gICAgICBjb25zdCBbY3VycmVudFNoaXBdID0gZ2FtZS5wbGF5ZXIuc2hpcHNUb1BsYWNlO1xuICAgICAgaWYgKCFjdXJyZW50U2hpcCB8fCAhZS50YXJnZXQuZGF0YXNldC5jb29yZHMpIHJldHVybjtcblxuICAgICAgY29uc3QgY29vcmRzID0gSlNPTi5wYXJzZShlLnRhcmdldC5kYXRhc2V0LmNvb3Jkcyk7XG5cbiAgICAgIGNvbnN0IGlzVmFsaWRTaGlwUGxhY2VtZW50ID0gZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLmNhblBsYWNlU2hpcChcbiAgICAgICAgY3VycmVudFNoaXAsXG4gICAgICAgIGNvb3JkcyxcbiAgICAgICAgc2hpcE9yaWVudGF0aW9uU3RhdGVcbiAgICAgICk7XG4gICAgICBjb25zdCBjZWxsVmFsaWRpdHlOYW1lID0gaXNWYWxpZFNoaXBQbGFjZW1lbnQgPyBcInZhbGlkXCIgOiBcImludmFsaWRcIjtcbiAgICAgIGhpZ2hsaWdodFNoaXAoXG4gICAgICAgIGNvb3JkcyxcbiAgICAgICAgY3VycmVudFNoaXAsXG4gICAgICAgIHNoaXBPcmllbnRhdGlvblN0YXRlLFxuICAgICAgICBcIi5zZXR1cC1ib2FyZFwiLFxuICAgICAgICBjZWxsVmFsaWRpdHlOYW1lXG4gICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhbmRvbWl6ZVNoaXBzKCkge1xuICAgICAgZ2FtZS5wbGF5ZXIucmVzZXRTaGlwc1BsYWNlZCgpO1xuICAgICAgZ2FtZS5wbGF5ZXIucmFuZG9taXplU2hpcHMoKTtcbiAgICAgIGNsZWFySGlnaGxpZ2h0U2hpcCgpO1xuICAgICAgc3RhcnRHYW1lQnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcblxuICAgICAgY29uc3QgeyBzaGlwcyB9ID0gZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkO1xuICAgICAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICBoaWdobGlnaHRTaGlwKFxuICAgICAgICAgIHNoaXAuY29vcmRzLFxuICAgICAgICAgIHNoaXAsXG4gICAgICAgICAgc2hpcC5vcmllbnRhdGlvbixcbiAgICAgICAgICBcIi5zZXR1cC1ib2FyZFwiLFxuICAgICAgICAgIFwic2hpcFwiXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIHNldHVwQm9hcmQuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICAgICAgc2V0dXBCb2FyZE1lc3NhZ2UudGV4dENvbnRlbnQgPSBcIlJlYWR5IGZvciBiYXR0bGUhXCI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGxhY2VTaGlwKGUpIHtcbiAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJib2FyZFwiKSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBjb29yZHMgPSBKU09OLnBhcnNlKGUudGFyZ2V0LmRhdGFzZXQuY29vcmRzKTtcbiAgICAgIGNvbnN0IFtjdXJyZW50U2hpcF0gPSBnYW1lLnBsYXllci5zaGlwc1RvUGxhY2U7XG5cbiAgICAgIGlmIChcbiAgICAgICAgIWdhbWUucGxheWVyLmdhbWVib2FyZC5jYW5QbGFjZVNoaXAoXG4gICAgICAgICAgY3VycmVudFNoaXAsXG4gICAgICAgICAgY29vcmRzLFxuICAgICAgICAgIHNoaXBPcmllbnRhdGlvblN0YXRlXG4gICAgICAgIClcbiAgICAgIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBnYW1lLnBsYXllci5nYW1lYm9hcmQucGxhY2VTaGlwKFxuICAgICAgICBjdXJyZW50U2hpcCxcbiAgICAgICAgY29vcmRzLFxuICAgICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZVxuICAgICAgKTtcblxuICAgICAgaGlnaGxpZ2h0U2hpcChcbiAgICAgICAgY29vcmRzLFxuICAgICAgICBjdXJyZW50U2hpcCxcbiAgICAgICAgY3VycmVudFNoaXAub3JpZW50YXRpb24sXG4gICAgICAgIFwiLnNldHVwLWJvYXJkXCIsXG4gICAgICAgIFwic2hpcFwiXG4gICAgICApO1xuICAgICAgZ2FtZS5wbGF5ZXIuc2hpcHNUb1BsYWNlLnNoaWZ0KCk7XG5cbiAgICAgIGNvbnN0IFtuZXh0U2hpcF0gPSBnYW1lLnBsYXllci5zaGlwc1RvUGxhY2U7XG5cbiAgICAgIGlmICghZ2FtZS5wbGF5ZXIuc2hpcHNUb1BsYWNlLmxlbmd0aCkge1xuICAgICAgICBzZXR1cEJvYXJkTWVzc2FnZS50ZXh0Q29udGVudCA9IFwiUmVhZHkgZm9yIGJhdHRsZSFcIjtcbiAgICAgICAgc2V0dXBCb2FyZC5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIHN0YXJ0R2FtZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXR1cEJvYXJkTWVzc2FnZS50ZXh0Q29udGVudCA9IGBQbGFjZSB5b3VyICR7bmV4dFNoaXAubmFtZX1gO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGludmVydEJvYXJkT3JpZW50YXRpb24oKSB7XG4gICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZSA9XG4gICAgICAgIHNoaXBPcmllbnRhdGlvblN0YXRlID09PSBcImhvcml6b250YWxcIiA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xuICAgIH1cblxuICAgIHNldHVwQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCBoaWdobGlnaHRTaGlwUHJldmlldyk7XG4gICAgc2V0dXBCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBjbGVhckhpZ2hsaWdodFNoaXBQcmV2aWV3KTtcbiAgICBzZXR1cEJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwbGFjZVNoaXApO1xuICAgIHJvdGF0ZVNoaXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGludmVydEJvYXJkT3JpZW50YXRpb24pO1xuICAgIHJhbmRvbWl6ZVNoaXBzQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByYW5kb21pemVTaGlwcyk7XG4gICAgcmVzZXRCb2FyZEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVzZXRCb2FyZCk7XG4gICAgc3RhcnRHYW1lQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydEdhbWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdEdhbWVib2FyZCgpIHtcbiAgICBjb25zdCBtb2RhbE92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsLW92ZXJsYXlcIik7XG4gICAgY29uc3QgZ2FtZU92ZXJUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lLW92ZXItdGV4dFwiKTtcbiAgICBjb25zdCBwbGF5QWdhaW5CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXktYWdhaW5cIik7XG4gICAgY29uc3QgbmV3R2FtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmV3LWdhbWVcIik7XG5cbiAgICBmdW5jdGlvbiBoaWdobGlnaHRBdHRhY2soYm9hcmQsIFtyb3csIGNvbF0sIHNlbGVjdG9yKSB7XG4gICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYCR7c2VsZWN0b3J9IFtkYXRhLWNvb3Jkcz1cIlske3Jvd30sICR7Y29sfV1cIl1gXG4gICAgICApO1xuICAgICAgY29uc3Qgc2hpcCA9IGJvYXJkW3Jvd11bY29sXTtcbiAgICAgIGlmICghc2hpcCkge1xuICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICAgICAgfSBlbHNlIGNlbGwuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcblxuICAgICAgaWYgKHNoaXAgJiYgc2hpcC5pc1N1bmsoKSkge1xuICAgICAgICBoaWdobGlnaHRTaGlwKHNoaXAuY29vcmRzLCBzaGlwLCBzaGlwLm9yaWVudGF0aW9uLCBzZWxlY3RvciwgXCJzdW5rXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyR2FtZWJvYXJkQ2VsbHNIaWdobGlnaHRlZCgpIHtcbiAgICAgIGNsZWFySGlnaGxpZ2h0ZWRDZWxscyhcIi5nYW1lYm9hcmQtY29udGFpbmVyIC5jZWxsXCIsIFtcbiAgICAgICAgXCJoaXRcIixcbiAgICAgICAgXCJtaXNzXCIsXG4gICAgICAgIFwic2hpcFwiLFxuICAgICAgICBcInN1bmtcIixcbiAgICAgIF0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBsYXlBZ2FpbigpIHtcbiAgICAgIGdhbWUucmVzZXRHYW1lKCk7XG5cbiAgICAgIGNsZWFyR2FtZWJvYXJkQ2VsbHNIaWdobGlnaHRlZCgpO1xuICAgICAgbW9kYWxPdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBnYW1lYm9hcmRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgIHNldHVwQm9hcmRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhdHRhY2soZSkge1xuICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImFpLWJvYXJkXCIpIHx8IGdhbWUuaXNHYW1lT3ZlcigpKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IFtyb3csIGNvbF0gPSBKU09OLnBhcnNlKGUudGFyZ2V0LmRhdGFzZXQuY29vcmRzKTtcblxuICAgICAgaWYgKCFnYW1lLnBsYXllci5jb25zdHJ1Y3Rvci5hdHRhY2soW3JvdywgY29sXSwgZ2FtZS5haSkpIHJldHVybjtcblxuICAgICAgaGlnaGxpZ2h0QXR0YWNrKGdhbWUuYWkuZ2FtZWJvYXJkLmJvYXJkLCBbcm93LCBjb2xdLCBcIi5haS1ib2FyZFwiKTtcbiAgICAgIGlmIChnYW1lLmlzR2FtZU92ZXIoKSkge1xuICAgICAgICBtb2RhbE92ZXJsYXkuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgICAgZ2FtZU92ZXJUZXh0LnRleHRDb250ZW50ID0gYEdhbWUgT3ZlciEgWW91IHdvbiFgO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGdhbWUuYWkuY29uc3RydWN0b3IubWFrZUFpQXR0YWNrKGdhbWUucGxheWVyKTtcbiAgICAgIGhpZ2hsaWdodEF0dGFjayhcbiAgICAgICAgZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLmJvYXJkLFxuICAgICAgICBnYW1lLnBsYXllci5nYW1lYm9hcmQubGF0ZXN0UmVjZWl2ZWRBdHRhY2ssXG4gICAgICAgIFwiLnBsYXllci1ib2FyZFwiXG4gICAgICApO1xuXG4gICAgICBpZiAoZ2FtZS5pc0dhbWVPdmVyKCkpIHtcbiAgICAgICAgZ2FtZU92ZXJUZXh0LnRleHRDb250ZW50ID0gYEdhbWUgT3ZlciEgWW91IGxvc3QhYDtcblxuICAgICAgICBtb2RhbE92ZXJsYXkuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhaUJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhdHRhY2spO1xuICAgIHBsYXlBZ2FpbkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxheUFnYWluKTtcbiAgICBuZXdHYW1lQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBjcmVhdGVHYW1lYm9hcmRDZWxscyhwbGF5ZXJCb2FyZCk7XG4gICAgY3JlYXRlR2FtZWJvYXJkQ2VsbHMoYWlCb2FyZCk7XG4gICAgY3JlYXRlR2FtZWJvYXJkQ2VsbHMoc2V0dXBCb2FyZCk7XG5cbiAgICBpbml0SG9tZXBhZ2UoKTtcbiAgICBpbml0U2V0dXBCb2FyZCgpO1xuICAgIGluaXRHYW1lYm9hcmQoKTtcbiAgfVxuXG4gIHJldHVybiB7IGluaXRpYWxpemUgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVVSTtcblxuLy8gQUkgaXMgaGl0dGluZyBzYW1lIGNvb3JkcyBhZ2FpblxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cblxuZnVuY3Rpb24gY2xlYXJIaWdobGlnaHRlZENlbGxzKHNlbGVjdG9yLCBjbGFzc2VzKSB7XG4gIGNvbnN0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGNsYXNzZXMpKSB7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3Nlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc2VzKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgeyBjbGVhckhpZ2hsaWdodGVkQ2VsbHMgfTtcbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoKTtcbiAgICB0aGlzLmFpID0gbmV3IFBsYXllcigpO1xuICB9XG5cbiAgcmVzZXRHYW1lKCkge1xuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcigpO1xuICAgIHRoaXMuYWkgPSBuZXcgUGxheWVyKCk7XG4gIH1cblxuICBpc0dhbWVPdmVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnBsYXllci5nYW1lYm9hcmQuYXJlQWxsU2hpcHNTdW5rKCkgfHxcbiAgICAgIHRoaXMuYWkuZ2FtZWJvYXJkLmFyZUFsbFNoaXBzU3VuaygpXG4gICAgKTtcbiAgfVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ib2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sICgpID0+IEFycmF5KDEwKS5maWxsKG51bGwpKTtcbiAgICB0aGlzLnNoaXBzID0gW107IC8vIHByb2xseSBkZWxldGUgbGF0ZXJcbiAgICB0aGlzLnNob3RzTWlzc2VkID0gW107XG4gICAgdGhpcy5zaG90c0hpdCA9IFtdO1xuICB9XG5cbiAgc3RhdGljIGlzT3V0T2ZCb3VuZHMgPSAoW3JvdywgY29sXSkgPT5cbiAgICByb3cgPCAwIHx8IHJvdyA+IDkgfHwgY29sIDwgMCB8fCBjb2wgPiA5O1xuXG4gIHN0YXRpYyBnZXRFbmRQb3NpdGlvbiA9IChzaGlwLCBbcm93LCBjb2xdLCBvcmllbnRhdGlvbikgPT5cbiAgICBvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgID8gY29sICsgc2hpcC5sZW5ndGggLSAxXG4gICAgICA6IHJvdyArIHNoaXAubGVuZ3RoIC0gMTtcblxuICBzdGF0aWMgaXNDb29yZHNGb3VuZCA9IChhcnJheSwgW3RhcmdldFJvdywgdGFyZ2V0Q29sXSkgPT5cbiAgICBhcnJheS5zb21lKChbcm93LCBjb2xdKSA9PiByb3cgPT09IHRhcmdldFJvdyAmJiBjb2wgPT09IHRhcmdldENvbCk7XG5cbiAgYXJlQWxsU2hpcHNTdW5rID0gKCkgPT4gdGhpcy5zaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSk7XG5cbiAgcmVzZXRHYW1lYm9hcmQoKSB7XG4gICAgdGhpcy5ib2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sICgpID0+IEFycmF5KDEwKS5maWxsKG51bGwpKTtcbiAgICB0aGlzLnNoaXBzID0gW107XG4gIH1cblxuICBpc0V2ZXJ5Q2VsbFZhbGlkKHNoaXAsIFtyb3csIGNvbF0sIG9yaWVudGF0aW9uKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd11bY29sICsgaV0gPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmJvYXJkW3JvdyArIGldW2NvbF0gPT09IG51bGwpIGNvbnRpbnVlO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY2FuUGxhY2VTaGlwKHNoaXAsIFtyb3csIGNvbF0sIG9yaWVudGF0aW9uKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICFHYW1lYm9hcmQuaXNPdXRPZkJvdW5kcyhbcm93LCBjb2xdKSAmJlxuICAgICAgR2FtZWJvYXJkLmdldEVuZFBvc2l0aW9uKHNoaXAsIFtyb3csIGNvbF0sIG9yaWVudGF0aW9uKSA8IDEwICYmXG4gICAgICB0aGlzLmlzRXZlcnlDZWxsVmFsaWQoc2hpcCwgW3JvdywgY29sXSwgb3JpZW50YXRpb24pXG4gICAgKTtcbiAgfVxuXG4gIHBsYWNlU2hpcChzaGlwLCBbcm93LCBjb2xdLCBvcmllbnRhdGlvbikge1xuICAgIGlmICghdGhpcy5jYW5QbGFjZVNoaXAoc2hpcCwgW3JvdywgY29sXSwgb3JpZW50YXRpb24pKSByZXR1cm47XG5cbiAgICBzaGlwLmNvb3JkcyA9IFtyb3csIGNvbF07XG4gICAgc2hpcC5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICAgIHNoaXAuaWQgPSB0aGlzLnNoaXBzLmxlbmd0aDtcbiAgICB0aGlzLnNoaXBzLnB1c2goc2hpcCk7XG5cbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBzaGlwLmxlbmd0aCkge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICB0aGlzLmJvYXJkW3Jvd11bY29sICsgaV0gPSBzaGlwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ib2FyZFtyb3cgKyBpXVtjb2xdID0gc2hpcDtcbiAgICAgIH1cbiAgICAgIGkgKz0gMTtcbiAgICB9XG4gIH1cblxuICByZWNlaXZlQXR0YWNrKFtyb3csIGNvbF0pIHtcbiAgICBpZiAoXG4gICAgICBHYW1lYm9hcmQuaXNPdXRPZkJvdW5kcyhbcm93LCBjb2xdKSB8fFxuICAgICAgKHRoaXMuYm9hcmRbcm93XVtjb2xdICYmIHRoaXMuYm9hcmRbcm93XVtjb2xdLmlzU3VuaygpKSB8fFxuICAgICAgR2FtZWJvYXJkLmlzQ29vcmRzRm91bmQodGhpcy5zaG90c01pc3NlZCwgW3JvdywgY29sXSkgfHxcbiAgICAgIEdhbWVib2FyZC5pc0Nvb3Jkc0ZvdW5kKHRoaXMuc2hvdHNIaXQsIFtyb3csIGNvbF0pXG4gICAgKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgdGhpcy5sYXRlc3RSZWNlaXZlZEF0dGFjayA9IFtyb3csIGNvbF07IC8vIG1heWJlIHN0b3JlIGNvb3JkcyBpbiBjb25zdHJ1Y3RvclxuXG4gICAgaWYgKCF0aGlzLmJvYXJkW3Jvd11bY29sXSkge1xuICAgICAgdGhpcy5zaG90c01pc3NlZC5wdXNoKFtyb3csIGNvbF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJvYXJkW3Jvd11bY29sXS5oaXQoKTtcbiAgICAgIHRoaXMuc2hvdHNIaXQucHVzaChbcm93LCBjb2xdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9HYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuL1NoaXBcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5nYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgdGhpcy5jYXJyaWVyID0gbmV3IFNoaXAoXCJjYXJyaWVyXCIsIDUpO1xuICAgIHRoaXMuYmF0dGxlc2hpcCA9IG5ldyBTaGlwKFwiYmF0dGxlc2hpcFwiLCA0KTtcbiAgICB0aGlzLmNydWlzZXIgPSBuZXcgU2hpcChcImNydWlzZXJcIiwgMyk7XG4gICAgdGhpcy5zdWJtYXJpbmUgPSBuZXcgU2hpcChcInN1Ym1hcmluZVwiLCAzKTtcbiAgICB0aGlzLmRlc3Ryb3llciA9IG5ldyBTaGlwKFwiZGVzdHJveWVyXCIsIDIpO1xuICAgIHRoaXMuc2hpcHNUb1BsYWNlID0gW1xuICAgICAgdGhpcy5jYXJyaWVyLFxuICAgICAgdGhpcy5iYXR0bGVzaGlwLFxuICAgICAgdGhpcy5jcnVpc2VyLFxuICAgICAgdGhpcy5zdWJtYXJpbmUsXG4gICAgICB0aGlzLmRlc3Ryb3llcixcbiAgICBdO1xuICB9XG5cbiAgc3RhdGljIGdldFJhbmRvbUludCA9IChtYXgpID0+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XG5cbiAgLyogUmFuZG9taXplIGFycmF5IGluLXBsYWNlIHVzaW5nIER1cnN0ZW5mZWxkIHNodWZmbGUgYWxnb3JpdGhtICovXG4gIHN0YXRpYyBzaHVmZmxlQXJyYXkoYXJyYXkpIHtcbiAgICBjb25zdCBuZXdBcnJheSA9IFsuLi5hcnJheV07XG4gICAgZm9yIChsZXQgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPiAwOyBpIC09IDEpIHtcbiAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgIFtuZXdBcnJheVtpXSwgbmV3QXJyYXlbal1dID0gW25ld0FycmF5W2pdLCBuZXdBcnJheVtpXV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9XG5cbiAgc3RhdGljIGdldFJhbmRvbU9yaWVudGF0aW9uID0gKCkgPT5cbiAgICBQbGF5ZXIuZ2V0UmFuZG9tSW50KDIpID09PSAwID8gXCJob3Jpem9udGFsXCIgOiBcInZlcnRpY2FsXCI7XG5cbiAgc3RhdGljIGdldFJhbmRvbVZhbGlkQ29vcmRzID0gKHZhbGlkQ29vcmRzKSA9PlxuICAgIHZhbGlkQ29vcmRzW1BsYXllci5nZXRSYW5kb21JbnQodmFsaWRDb29yZHMubGVuZ3RoKV07XG5cbiAgcmVzZXRTaGlwc1BsYWNlZCgpIHtcbiAgICB0aGlzLnNoaXBzVG9QbGFjZSA9IFtcbiAgICAgIHRoaXMuY2FycmllcixcbiAgICAgIHRoaXMuYmF0dGxlc2hpcCxcbiAgICAgIHRoaXMuY3J1aXNlcixcbiAgICAgIHRoaXMuc3VibWFyaW5lLFxuICAgICAgdGhpcy5kZXN0cm95ZXIsXG4gICAgXTtcbiAgfVxuXG4gIHJhbmRvbWl6ZVNoaXBzKCkge1xuICAgIHRoaXMuZ2FtZWJvYXJkLnJlc2V0R2FtZWJvYXJkKCk7XG5cbiAgICBjb25zdCByYW5kb21TaGlwcyA9IFBsYXllci5zaHVmZmxlQXJyYXkodGhpcy5zaGlwc1RvUGxhY2UpO1xuICAgIHJhbmRvbVNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGNvbnN0IHZhbGlkQ29vcmRzID0gW107XG4gICAgICBjb25zdCByYW5kb21PcmllbnRhdGlvbiA9IFBsYXllci5nZXRSYW5kb21PcmllbnRhdGlvbigpO1xuICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgMTA7IHJvdyArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDEwOyBjb2wgKz0gMSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuZ2FtZWJvYXJkLmNhblBsYWNlU2hpcChzaGlwLCBbcm93LCBjb2xdLCByYW5kb21PcmllbnRhdGlvbilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHZhbGlkQ29vcmRzLnB1c2goW3JvdywgY29sXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IFtyYW5kb21YLCByYW5kb21ZXSA9IFBsYXllci5nZXRSYW5kb21WYWxpZENvb3Jkcyh2YWxpZENvb3Jkcyk7XG4gICAgICB0aGlzLmdhbWVib2FyZC5wbGFjZVNoaXAoc2hpcCwgW3JhbmRvbVgsIHJhbmRvbVldLCByYW5kb21PcmllbnRhdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0VmFsaWRDb29yZHMoZW5lbXkpIHtcbiAgICBjb25zdCBlbmVteUJvYXJkID0gZW5lbXkuZ2FtZWJvYXJkLmJvYXJkO1xuICAgIGNvbnN0IHZhbGlkQ29vcmRzID0gW107XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgMTA7IHJvdyArPSAxKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sICs9IDEpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGVuZW15Qm9hcmRbcm93XVtjb2xdID09PSBudWxsIHx8XG4gICAgICAgICAgZW5lbXlCb2FyZFtyb3ddW2NvbF0gaW5zdGFuY2VvZiBTaGlwXG4gICAgICAgICkge1xuICAgICAgICAgIHZhbGlkQ29vcmRzLnB1c2goW3JvdywgY29sXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRDb29yZHM7XG4gIH1cblxuICBzdGF0aWMgYXR0YWNrKFtyb3csIGNvbF0sIGVuZW15KSB7XG4gICAgcmV0dXJuIGVuZW15LmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKFtyb3csIGNvbF0pO1xuICB9XG5cbiAgc3RhdGljIG1ha2VBaUF0dGFjayhwbGF5ZXIpIHtcbiAgICBjb25zdCByYW5kb21WYWxpZENvb3JkID0gUGxheWVyLmdldFJhbmRvbVZhbGlkQ29vcmRzKFxuICAgICAgUGxheWVyLmdldFZhbGlkQ29vcmRzKHBsYXllcilcbiAgICApO1xuXG4gICAgcmV0dXJuIHBsYXllci5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhyYW5kb21WYWxpZENvb3JkKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGxlbmd0aCkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy50aW1lc0hpdCA9IDA7XG4gICAgdGhpcy5jb29yZHMgPSBudWxsOyAvLyBtYXkgYmUgdW5uZWNlc3NhcnlcbiAgfVxuXG4gIGhpdCgpIHtcbiAgICBpZiAodGhpcy50aW1lc0hpdCAhPT0gdGhpcy5sZW5ndGgpIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggPT09IHRoaXMudGltZXNIaXQ7XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGdhbWVVSSBmcm9tIFwiLi9kb20vZ2FtZVVJXCI7XG5cbmdhbWVVSS5pbml0aWFsaXplKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=