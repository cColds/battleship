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
    const validCoords = [];
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        if (
          !enemy.gameboard.shotsMissed.some(
            ([targetRow, targetCol]) => targetRow === row && targetCol === col
          ) &&
          !enemy.gameboard.shotsHit.some(
            ([targetRow, targetCol]) => targetRow === row && targetCol === col
          )
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ2xDLDBCQUEwQixVQUFVO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQixVQUFVO0FBQ2hDLHdCQUF3QixVQUFVO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3RHZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQ2ZBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOa0M7O0FBRWxDLDhEQUFpQiIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tL2dhbWVVSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS9oZWxwZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lLWxvZ2ljL0dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lLWxvZ2ljL0dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUtbG9naWMvUGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS1sb2dpYy9TaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHYW1lIGZyb20gXCIuLi9nYW1lLWxvZ2ljL0dhbWVcIjtcbmltcG9ydCB7IGNsZWFySGlnaGxpZ2h0ZWRDZWxscyB9IGZyb20gXCIuL2hlbHBlclwiO1xuXG5jb25zdCBnYW1lVUkgPSAoKCkgPT4ge1xuICBjb25zdCBnYW1lID0gbmV3IEdhbWUoKTtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllci1ib2FyZFwiKTtcbiAgY29uc3QgYWlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWktYm9hcmRcIik7XG4gIGNvbnN0IHNldHVwQm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNldHVwLWJvYXJkLWNvbnRhaW5lclwiKTtcbiAgY29uc3Qgc2V0dXBCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dXAtYm9hcmRcIik7XG4gIGNvbnN0IGdhbWVib2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLWNvbnRhaW5lclwiKTtcblxuICBmdW5jdGlvbiBjcmVhdGVHYW1lYm9hcmRDZWxscyhib2FyZCkge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3cgKz0gMSkge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCArPSAxKSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXG4gICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgICAgIGNlbGwuZGF0YXNldC5jb29yZHMgPSBgWyR7cm93fSwgJHtjb2x9XWA7XG4gICAgICAgIGJvYXJkLmFwcGVuZENoaWxkKGNlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodFNoaXAoY29vcmRzLCBzaGlwLCBvcmllbnRhdGlvbiwgc2VsZWN0b3IsIGNsYXNzTmFtZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgbGV0IFtyb3csIGNvbF0gPSBbY29vcmRzWzBdLCBjb29yZHNbMV1dO1xuXG4gICAgICBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSBjb2wgKz0gaTtcbiAgICAgIGVsc2Ugcm93ICs9IGk7XG4gICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYCR7c2VsZWN0b3J9IFtkYXRhLWNvb3Jkcz1cIlske3Jvd30sICR7Y29sfV1cIl1gXG4gICAgICApO1xuXG4gICAgICBpZiAoY2VsbCkgY2VsbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdEhvbWVwYWdlKCkge1xuICAgIGNvbnN0IGhvbWVwYWdlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ob21lcGFnZS1jb250YWluZXJcIik7XG5cbiAgICBob21lcGFnZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGhvbWVwYWdlQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBzZXR1cEJvYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0U2V0dXBCb2FyZCgpIHtcbiAgICBjb25zdCByb3RhdGVTaGlwQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yb3RhdGUtc2hpcFwiKTtcbiAgICBjb25zdCBzZXR1cEJvYXJkTWVzc2FnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dXAtYm9hcmQtbWVzc2FnZVwiKTtcbiAgICBjb25zdCByYW5kb21pemVTaGlwc0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmFuZG9taXplLXNoaXBzXCIpO1xuICAgIGNvbnN0IHJlc2V0Qm9hcmRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlc2V0LWJvYXJkXCIpO1xuICAgIGNvbnN0IHN0YXJ0R2FtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dXAtYm9hcmQtc3RhcnQtZ2FtZVwiKTtcbiAgICBjb25zdCBwbGF5ZXJOYW1lSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXllci1uYW1lLWlucHV0XCIpO1xuICAgIGNvbnN0IHBsYXllckJvYXJkTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBcIi5wbGF5ZXItYm9hcmQtY29udGFpbmVyIC5ib2FyZC1uYW1lXCJcbiAgICApO1xuICAgIGxldCBzaGlwT3JpZW50YXRpb25TdGF0ZSA9IFwiaG9yaXpvbnRhbFwiO1xuXG4gICAgZnVuY3Rpb24gY2xlYXJIaWdobGlnaHRTaGlwKCkge1xuICAgICAgY2xlYXJIaWdobGlnaHRlZENlbGxzKFwiLnNldHVwLWJvYXJkIC5zaGlwXCIsIFwic2hpcFwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gICAgICBpZiAoZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLnNoaXBzLmxlbmd0aCAhPT0gNSkgcmV0dXJuO1xuXG4gICAgICBzZXR1cEJvYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBnYW1lYm9hcmRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgIGNsZWFySGlnaGxpZ2h0U2hpcCgpO1xuICAgICAgZ2FtZS5haS5yYW5kb21pemVTaGlwcygpO1xuICAgICAgZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLnNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgaGlnaGxpZ2h0U2hpcChcbiAgICAgICAgICBzaGlwLmNvb3JkcyxcbiAgICAgICAgICBzaGlwLFxuICAgICAgICAgIHNoaXAub3JpZW50YXRpb24sXG4gICAgICAgICAgXCIucGxheWVyLWJvYXJkXCIsXG4gICAgICAgICAgXCJzaGlwXCJcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBwbGF5ZXJCb2FyZE5hbWUudGV4dENvbnRlbnQgPSBwbGF5ZXJOYW1lSW5wdXQudmFsdWUudHJpbSgpIHx8IFwiUGxheWVyXCI7XG5cbiAgICAgIHNldHVwQm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICAgICAgc2V0dXBCb2FyZE1lc3NhZ2UudGV4dENvbnRlbnQgPSBcIlBsYWNlIHlvdXIgY2FycmllclwiO1xuICAgICAgc3RhcnRHYW1lQnRuLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckhpZ2hsaWdodFNoaXBQcmV2aWV3KCkge1xuICAgICAgY29uc3QgY2VsbFZhbGlkaXR5Q2xhc3NOYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52YWxpZFwiKVxuICAgICAgICA/IFwidmFsaWRcIlxuICAgICAgICA6IFwiaW52YWxpZFwiO1xuXG4gICAgICBjbGVhckhpZ2hsaWdodGVkQ2VsbHMoXG4gICAgICAgIGAuc2V0dXAtYm9hcmQgLiR7Y2VsbFZhbGlkaXR5Q2xhc3NOYW1lfWAsXG4gICAgICAgIGAke2NlbGxWYWxpZGl0eUNsYXNzTmFtZX1gXG4gICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc2V0Qm9hcmQoKSB7XG4gICAgICBnYW1lLnJlc2V0R2FtZSgpO1xuICAgICAgY2xlYXJIaWdobGlnaHRTaGlwKCk7XG4gICAgICBzZXR1cEJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcbiAgICAgIHNldHVwQm9hcmRNZXNzYWdlLnRleHRDb250ZW50ID0gXCJQbGFjZSB5b3VyIGNhcnJpZXJcIjtcbiAgICAgIHN0YXJ0R2FtZUJ0bi5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGlnaGxpZ2h0U2hpcFByZXZpZXcoZSkge1xuICAgICAgY2xlYXJIaWdobGlnaHRTaGlwUHJldmlldygpO1xuICAgICAgY29uc3QgW2N1cnJlbnRTaGlwXSA9IGdhbWUucGxheWVyLnNoaXBzVG9QbGFjZTtcbiAgICAgIGlmICghY3VycmVudFNoaXAgfHwgIWUudGFyZ2V0LmRhdGFzZXQuY29vcmRzKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGNvb3JkcyA9IEpTT04ucGFyc2UoZS50YXJnZXQuZGF0YXNldC5jb29yZHMpO1xuXG4gICAgICBjb25zdCBpc1ZhbGlkU2hpcFBsYWNlbWVudCA9IGdhbWUucGxheWVyLmdhbWVib2FyZC5jYW5QbGFjZVNoaXAoXG4gICAgICAgIGN1cnJlbnRTaGlwLFxuICAgICAgICBjb29yZHMsXG4gICAgICAgIHNoaXBPcmllbnRhdGlvblN0YXRlXG4gICAgICApO1xuICAgICAgY29uc3QgY2VsbFZhbGlkaXR5TmFtZSA9IGlzVmFsaWRTaGlwUGxhY2VtZW50ID8gXCJ2YWxpZFwiIDogXCJpbnZhbGlkXCI7XG4gICAgICBoaWdobGlnaHRTaGlwKFxuICAgICAgICBjb29yZHMsXG4gICAgICAgIGN1cnJlbnRTaGlwLFxuICAgICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZSxcbiAgICAgICAgXCIuc2V0dXAtYm9hcmRcIixcbiAgICAgICAgY2VsbFZhbGlkaXR5TmFtZVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByYW5kb21pemVTaGlwcygpIHtcbiAgICAgIGdhbWUucGxheWVyLnJlc2V0U2hpcHNQbGFjZWQoKTtcbiAgICAgIGdhbWUucGxheWVyLnJhbmRvbWl6ZVNoaXBzKCk7XG4gICAgICBjbGVhckhpZ2hsaWdodFNoaXAoKTtcbiAgICAgIHN0YXJ0R2FtZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XG5cbiAgICAgIGNvbnN0IHsgc2hpcHMgfSA9IGdhbWUucGxheWVyLmdhbWVib2FyZDtcbiAgICAgIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgaGlnaGxpZ2h0U2hpcChcbiAgICAgICAgICBzaGlwLmNvb3JkcyxcbiAgICAgICAgICBzaGlwLFxuICAgICAgICAgIHNoaXAub3JpZW50YXRpb24sXG4gICAgICAgICAgXCIuc2V0dXAtYm9hcmRcIixcbiAgICAgICAgICBcInNoaXBcIlxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgICBzZXR1cEJvYXJkLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgICAgIHNldHVwQm9hcmRNZXNzYWdlLnRleHRDb250ZW50ID0gXCJSZWFkeSBmb3IgYmF0dGxlIVwiO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBsYWNlU2hpcChlKSB7XG4gICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYm9hcmRcIikpIHJldHVybjtcblxuICAgICAgY29uc3QgY29vcmRzID0gSlNPTi5wYXJzZShlLnRhcmdldC5kYXRhc2V0LmNvb3Jkcyk7XG4gICAgICBjb25zdCBbY3VycmVudFNoaXBdID0gZ2FtZS5wbGF5ZXIuc2hpcHNUb1BsYWNlO1xuXG4gICAgICBpZiAoXG4gICAgICAgICFnYW1lLnBsYXllci5nYW1lYm9hcmQuY2FuUGxhY2VTaGlwKFxuICAgICAgICAgIGN1cnJlbnRTaGlwLFxuICAgICAgICAgIGNvb3JkcyxcbiAgICAgICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZVxuICAgICAgICApXG4gICAgICApXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgY3VycmVudFNoaXAsXG4gICAgICAgIGNvb3JkcyxcbiAgICAgICAgc2hpcE9yaWVudGF0aW9uU3RhdGVcbiAgICAgICk7XG5cbiAgICAgIGhpZ2hsaWdodFNoaXAoXG4gICAgICAgIGNvb3JkcyxcbiAgICAgICAgY3VycmVudFNoaXAsXG4gICAgICAgIGN1cnJlbnRTaGlwLm9yaWVudGF0aW9uLFxuICAgICAgICBcIi5zZXR1cC1ib2FyZFwiLFxuICAgICAgICBcInNoaXBcIlxuICAgICAgKTtcbiAgICAgIGdhbWUucGxheWVyLnNoaXBzVG9QbGFjZS5zaGlmdCgpO1xuXG4gICAgICBjb25zdCBbbmV4dFNoaXBdID0gZ2FtZS5wbGF5ZXIuc2hpcHNUb1BsYWNlO1xuXG4gICAgICBpZiAoIWdhbWUucGxheWVyLnNoaXBzVG9QbGFjZS5sZW5ndGgpIHtcbiAgICAgICAgc2V0dXBCb2FyZE1lc3NhZ2UudGV4dENvbnRlbnQgPSBcIlJlYWR5IGZvciBiYXR0bGUhXCI7XG4gICAgICAgIHNldHVwQm9hcmQuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICAgICAgICBzdGFydEdhbWVCdG4uY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0dXBCb2FyZE1lc3NhZ2UudGV4dENvbnRlbnQgPSBgUGxhY2UgeW91ciAke25leHRTaGlwLm5hbWV9YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnZlcnRCb2FyZE9yaWVudGF0aW9uKCkge1xuICAgICAgc2hpcE9yaWVudGF0aW9uU3RhdGUgPVxuICAgICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZSA9PT0gXCJob3Jpem9udGFsXCIgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIjtcbiAgICB9XG5cbiAgICBzZXR1cEJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgaGlnaGxpZ2h0U2hpcFByZXZpZXcpO1xuICAgIHNldHVwQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgY2xlYXJIaWdobGlnaHRTaGlwUHJldmlldyk7XG4gICAgc2V0dXBCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxhY2VTaGlwKTtcbiAgICByb3RhdGVTaGlwQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBpbnZlcnRCb2FyZE9yaWVudGF0aW9uKTtcbiAgICByYW5kb21pemVTaGlwc0J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmFuZG9taXplU2hpcHMpO1xuICAgIHJlc2V0Qm9hcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlc2V0Qm9hcmQpO1xuICAgIHN0YXJ0R2FtZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRHYW1lYm9hcmQoKSB7XG4gICAgY29uc3QgbW9kYWxPdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1vdmVybGF5XCIpO1xuICAgIGNvbnN0IGdhbWVPdmVyVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1vdmVyLXRleHRcIik7XG4gICAgY29uc3QgcGxheUFnYWluQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5LWFnYWluXCIpO1xuICAgIGNvbnN0IG5ld0dhbWVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5ldy1nYW1lXCIpO1xuXG4gICAgZnVuY3Rpb24gaGlnaGxpZ2h0QXR0YWNrKGJvYXJkLCBbcm93LCBjb2xdLCBzZWxlY3Rvcikge1xuICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAke3NlbGVjdG9yfSBbZGF0YS1jb29yZHM9XCJbJHtyb3d9LCAke2NvbH1dXCJdYFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHNoaXAgPSBib2FyZFtyb3ddW2NvbF07XG4gICAgICBpZiAoIXNoaXApIHtcbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICAgIH0gZWxzZSBjZWxsLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG5cbiAgICAgIGlmIChzaGlwICYmIHNoaXAuaXNTdW5rKCkpIHtcbiAgICAgICAgaGlnaGxpZ2h0U2hpcChzaGlwLmNvb3Jkcywgc2hpcCwgc2hpcC5vcmllbnRhdGlvbiwgc2VsZWN0b3IsIFwic3Vua1wiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckdhbWVib2FyZENlbGxzSGlnaGxpZ2h0ZWQoKSB7XG4gICAgICBjbGVhckhpZ2hsaWdodGVkQ2VsbHMoXCIuZ2FtZWJvYXJkLWNvbnRhaW5lciAuY2VsbFwiLCBbXG4gICAgICAgIFwiaGl0XCIsXG4gICAgICAgIFwibWlzc1wiLFxuICAgICAgICBcInNoaXBcIixcbiAgICAgICAgXCJzdW5rXCIsXG4gICAgICBdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwbGF5QWdhaW4oKSB7XG4gICAgICBnYW1lLnJlc2V0R2FtZSgpO1xuXG4gICAgICBjbGVhckdhbWVib2FyZENlbGxzSGlnaGxpZ2h0ZWQoKTtcbiAgICAgIG1vZGFsT3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgICAgZ2FtZWJvYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBzZXR1cEJvYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXR0YWNrKGUpIHtcbiAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJhaS1ib2FyZFwiKSB8fCBnYW1lLmlzR2FtZU92ZXIoKSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBbcm93LCBjb2xdID0gSlNPTi5wYXJzZShlLnRhcmdldC5kYXRhc2V0LmNvb3Jkcyk7XG5cbiAgICAgIGlmICghZ2FtZS5wbGF5ZXIuY29uc3RydWN0b3IuYXR0YWNrKFtyb3csIGNvbF0sIGdhbWUuYWkpKSByZXR1cm47XG5cbiAgICAgIGhpZ2hsaWdodEF0dGFjayhnYW1lLmFpLmdhbWVib2FyZC5ib2FyZCwgW3JvdywgY29sXSwgXCIuYWktYm9hcmRcIik7XG4gICAgICBpZiAoZ2FtZS5pc0dhbWVPdmVyKCkpIHtcbiAgICAgICAgbW9kYWxPdmVybGF5LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgIGdhbWVPdmVyVGV4dC50ZXh0Q29udGVudCA9IGBHYW1lIE92ZXIhIFlvdSB3b24hYDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBnYW1lLmFpLmNvbnN0cnVjdG9yLm1ha2VBaUF0dGFjayhnYW1lLnBsYXllcik7XG4gICAgICBoaWdobGlnaHRBdHRhY2soXG4gICAgICAgIGdhbWUucGxheWVyLmdhbWVib2FyZC5ib2FyZCxcbiAgICAgICAgZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLmxhdGVzdFJlY2VpdmVkQXR0YWNrLFxuICAgICAgICBcIi5wbGF5ZXItYm9hcmRcIlxuICAgICAgKTtcblxuICAgICAgaWYgKGdhbWUuaXNHYW1lT3ZlcigpKSB7XG4gICAgICAgIGdhbWVPdmVyVGV4dC50ZXh0Q29udGVudCA9IGBHYW1lIE92ZXIhIFlvdSBsb3N0IWA7XG5cbiAgICAgICAgbW9kYWxPdmVybGF5LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWlCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXR0YWNrKTtcbiAgICBwbGF5QWdhaW5CdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBsYXlBZ2Fpbik7XG4gICAgbmV3R2FtZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgY3JlYXRlR2FtZWJvYXJkQ2VsbHMocGxheWVyQm9hcmQpO1xuICAgIGNyZWF0ZUdhbWVib2FyZENlbGxzKGFpQm9hcmQpO1xuICAgIGNyZWF0ZUdhbWVib2FyZENlbGxzKHNldHVwQm9hcmQpO1xuXG4gICAgaW5pdEhvbWVwYWdlKCk7XG4gICAgaW5pdFNldHVwQm9hcmQoKTtcbiAgICBpbml0R2FtZWJvYXJkKCk7XG4gIH1cblxuICByZXR1cm4geyBpbml0aWFsaXplIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lVUk7XG5cbi8vIEFJIGlzIGhpdHRpbmcgc2FtZSBjb29yZHMgYWdhaW5cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5cbmZ1bmN0aW9uIGNsZWFySGlnaGxpZ2h0ZWRDZWxscyhzZWxlY3RvciwgY2xhc3Nlcykge1xuICBjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjbGFzc2VzKSkge1xuICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3Nlcyk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IHsgY2xlYXJIaWdobGlnaHRlZENlbGxzIH07XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG4gICAgdGhpcy5haSA9IG5ldyBQbGF5ZXIoKTtcbiAgfVxuXG4gIHJlc2V0R2FtZSgpIHtcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoKTtcbiAgICB0aGlzLmFpID0gbmV3IFBsYXllcigpO1xuICB9XG5cbiAgaXNHYW1lT3ZlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5wbGF5ZXIuZ2FtZWJvYXJkLmFyZUFsbFNoaXBzU3VuaygpIHx8XG4gICAgICB0aGlzLmFpLmdhbWVib2FyZC5hcmVBbGxTaGlwc1N1bmsoKVxuICAgICk7XG4gIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheSgxMCkuZmlsbChudWxsKSk7XG4gICAgdGhpcy5zaGlwcyA9IFtdOyAvLyBwcm9sbHkgZGVsZXRlIGxhdGVyXG4gICAgdGhpcy5zaG90c01pc3NlZCA9IFtdO1xuICAgIHRoaXMuc2hvdHNIaXQgPSBbXTtcbiAgfVxuXG4gIHN0YXRpYyBpc091dE9mQm91bmRzID0gKFtyb3csIGNvbF0pID0+XG4gICAgcm93IDwgMCB8fCByb3cgPiA5IHx8IGNvbCA8IDAgfHwgY29sID4gOTtcblxuICBzdGF0aWMgZ2V0RW5kUG9zaXRpb24gPSAoc2hpcCwgW3JvdywgY29sXSwgb3JpZW50YXRpb24pID0+XG4gICAgb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiXG4gICAgICA/IGNvbCArIHNoaXAubGVuZ3RoIC0gMVxuICAgICAgOiByb3cgKyBzaGlwLmxlbmd0aCAtIDE7XG5cbiAgc3RhdGljIGlzQ29vcmRzRm91bmQgPSAoYXJyYXksIFt0YXJnZXRSb3csIHRhcmdldENvbF0pID0+XG4gICAgYXJyYXkuc29tZSgoW3JvdywgY29sXSkgPT4gcm93ID09PSB0YXJnZXRSb3cgJiYgY29sID09PSB0YXJnZXRDb2wpO1xuXG4gIGFyZUFsbFNoaXBzU3VuayA9ICgpID0+IHRoaXMuc2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkpO1xuXG4gIHJlc2V0R2FtZWJvYXJkKCkge1xuICAgIHRoaXMuYm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheSgxMCkuZmlsbChudWxsKSk7XG4gICAgdGhpcy5zaGlwcyA9IFtdO1xuICB9XG5cbiAgaXNFdmVyeUNlbGxWYWxpZChzaGlwLCBbcm93LCBjb2xdLCBvcmllbnRhdGlvbikge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3ddW2NvbCArIGldID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2FyZFtyb3cgKyBpXVtjb2xdID09PSBudWxsKSBjb250aW51ZTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNhblBsYWNlU2hpcChzaGlwLCBbcm93LCBjb2xdLCBvcmllbnRhdGlvbikge1xuICAgIHJldHVybiAoXG4gICAgICAhR2FtZWJvYXJkLmlzT3V0T2ZCb3VuZHMoW3JvdywgY29sXSkgJiZcbiAgICAgIEdhbWVib2FyZC5nZXRFbmRQb3NpdGlvbihzaGlwLCBbcm93LCBjb2xdLCBvcmllbnRhdGlvbikgPCAxMCAmJlxuICAgICAgdGhpcy5pc0V2ZXJ5Q2VsbFZhbGlkKHNoaXAsIFtyb3csIGNvbF0sIG9yaWVudGF0aW9uKVxuICAgICk7XG4gIH1cblxuICBwbGFjZVNoaXAoc2hpcCwgW3JvdywgY29sXSwgb3JpZW50YXRpb24pIHtcbiAgICBpZiAoIXRoaXMuY2FuUGxhY2VTaGlwKHNoaXAsIFtyb3csIGNvbF0sIG9yaWVudGF0aW9uKSkgcmV0dXJuO1xuXG4gICAgc2hpcC5jb29yZHMgPSBbcm93LCBjb2xdO1xuICAgIHNoaXAub3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcbiAgICBzaGlwLmlkID0gdGhpcy5zaGlwcy5sZW5ndGg7XG4gICAgdGhpcy5zaGlwcy5wdXNoKHNoaXApO1xuXG4gICAgbGV0IGkgPSAwO1xuICAgIHdoaWxlIChpIDwgc2hpcC5sZW5ndGgpIHtcbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgICAgdGhpcy5ib2FyZFtyb3ddW2NvbCArIGldID0gc2hpcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYm9hcmRbcm93ICsgaV1bY29sXSA9IHNoaXA7XG4gICAgICB9XG4gICAgICBpICs9IDE7XG4gICAgfVxuICB9XG5cbiAgcmVjZWl2ZUF0dGFjayhbcm93LCBjb2xdKSB7XG4gICAgaWYgKFxuICAgICAgR2FtZWJvYXJkLmlzT3V0T2ZCb3VuZHMoW3JvdywgY29sXSkgfHxcbiAgICAgICh0aGlzLmJvYXJkW3Jvd11bY29sXSAmJiB0aGlzLmJvYXJkW3Jvd11bY29sXS5pc1N1bmsoKSkgfHxcbiAgICAgIEdhbWVib2FyZC5pc0Nvb3Jkc0ZvdW5kKHRoaXMuc2hvdHNNaXNzZWQsIFtyb3csIGNvbF0pIHx8XG4gICAgICBHYW1lYm9hcmQuaXNDb29yZHNGb3VuZCh0aGlzLnNob3RzSGl0LCBbcm93LCBjb2xdKVxuICAgIClcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHRoaXMubGF0ZXN0UmVjZWl2ZWRBdHRhY2sgPSBbcm93LCBjb2xdOyAvLyBtYXliZSBzdG9yZSBjb29yZHMgaW4gY29uc3RydWN0b3JcblxuICAgIGlmICghdGhpcy5ib2FyZFtyb3ddW2NvbF0pIHtcbiAgICAgIHRoaXMuc2hvdHNNaXNzZWQucHVzaChbcm93LCBjb2xdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ib2FyZFtyb3ddW2NvbF0uaGl0KCk7XG4gICAgICB0aGlzLnNob3RzSGl0LnB1c2goW3JvdywgY29sXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vR2FtZWJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9TaGlwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZ2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIHRoaXMuY2FycmllciA9IG5ldyBTaGlwKFwiY2FycmllclwiLCA1KTtcbiAgICB0aGlzLmJhdHRsZXNoaXAgPSBuZXcgU2hpcChcImJhdHRsZXNoaXBcIiwgNCk7XG4gICAgdGhpcy5jcnVpc2VyID0gbmV3IFNoaXAoXCJjcnVpc2VyXCIsIDMpO1xuICAgIHRoaXMuc3VibWFyaW5lID0gbmV3IFNoaXAoXCJzdWJtYXJpbmVcIiwgMyk7XG4gICAgdGhpcy5kZXN0cm95ZXIgPSBuZXcgU2hpcChcImRlc3Ryb3llclwiLCAyKTtcbiAgICB0aGlzLnNoaXBzVG9QbGFjZSA9IFtcbiAgICAgIHRoaXMuY2FycmllcixcbiAgICAgIHRoaXMuYmF0dGxlc2hpcCxcbiAgICAgIHRoaXMuY3J1aXNlcixcbiAgICAgIHRoaXMuc3VibWFyaW5lLFxuICAgICAgdGhpcy5kZXN0cm95ZXIsXG4gICAgXTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRSYW5kb21JbnQgPSAobWF4KSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuXG4gIC8qIFJhbmRvbWl6ZSBhcnJheSBpbi1wbGFjZSB1c2luZyBEdXJzdGVuZmVsZCBzaHVmZmxlIGFsZ29yaXRobSAqL1xuICBzdGF0aWMgc2h1ZmZsZUFycmF5KGFycmF5KSB7XG4gICAgY29uc3QgbmV3QXJyYXkgPSBbLi4uYXJyYXldO1xuICAgIGZvciAobGV0IGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaSAtPSAxKSB7XG4gICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICBbbmV3QXJyYXlbaV0sIG5ld0FycmF5W2pdXSA9IFtuZXdBcnJheVtqXSwgbmV3QXJyYXlbaV1dO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdBcnJheTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRSYW5kb21PcmllbnRhdGlvbiA9ICgpID0+XG4gICAgUGxheWVyLmdldFJhbmRvbUludCgyKSA9PT0gMCA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuXG4gIHN0YXRpYyBnZXRSYW5kb21WYWxpZENvb3JkcyA9ICh2YWxpZENvb3JkcykgPT5cbiAgICB2YWxpZENvb3Jkc1tQbGF5ZXIuZ2V0UmFuZG9tSW50KHZhbGlkQ29vcmRzLmxlbmd0aCldO1xuXG4gIHJlc2V0U2hpcHNQbGFjZWQoKSB7XG4gICAgdGhpcy5zaGlwc1RvUGxhY2UgPSBbXG4gICAgICB0aGlzLmNhcnJpZXIsXG4gICAgICB0aGlzLmJhdHRsZXNoaXAsXG4gICAgICB0aGlzLmNydWlzZXIsXG4gICAgICB0aGlzLnN1Ym1hcmluZSxcbiAgICAgIHRoaXMuZGVzdHJveWVyLFxuICAgIF07XG4gIH1cblxuICByYW5kb21pemVTaGlwcygpIHtcbiAgICB0aGlzLmdhbWVib2FyZC5yZXNldEdhbWVib2FyZCgpO1xuXG4gICAgY29uc3QgcmFuZG9tU2hpcHMgPSBQbGF5ZXIuc2h1ZmZsZUFycmF5KHRoaXMuc2hpcHNUb1BsYWNlKTtcbiAgICByYW5kb21TaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBjb25zdCB2YWxpZENvb3JkcyA9IFtdO1xuICAgICAgY29uc3QgcmFuZG9tT3JpZW50YXRpb24gPSBQbGF5ZXIuZ2V0UmFuZG9tT3JpZW50YXRpb24oKTtcbiAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3cgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sICs9IDEpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmdhbWVib2FyZC5jYW5QbGFjZVNoaXAoc2hpcCwgW3JvdywgY29sXSwgcmFuZG9tT3JpZW50YXRpb24pXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB2YWxpZENvb3Jkcy5wdXNoKFtyb3csIGNvbF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBbcmFuZG9tWCwgcmFuZG9tWV0gPSBQbGF5ZXIuZ2V0UmFuZG9tVmFsaWRDb29yZHModmFsaWRDb29yZHMpO1xuICAgICAgdGhpcy5nYW1lYm9hcmQucGxhY2VTaGlwKHNoaXAsIFtyYW5kb21YLCByYW5kb21ZXSwgcmFuZG9tT3JpZW50YXRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGdldFZhbGlkQ29vcmRzKGVuZW15KSB7XG4gICAgY29uc3QgdmFsaWRDb29yZHMgPSBbXTtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAxMDsgcm93ICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDEwOyBjb2wgKz0gMSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIWVuZW15LmdhbWVib2FyZC5zaG90c01pc3NlZC5zb21lKFxuICAgICAgICAgICAgKFt0YXJnZXRSb3csIHRhcmdldENvbF0pID0+IHRhcmdldFJvdyA9PT0gcm93ICYmIHRhcmdldENvbCA9PT0gY29sXG4gICAgICAgICAgKSAmJlxuICAgICAgICAgICFlbmVteS5nYW1lYm9hcmQuc2hvdHNIaXQuc29tZShcbiAgICAgICAgICAgIChbdGFyZ2V0Um93LCB0YXJnZXRDb2xdKSA9PiB0YXJnZXRSb3cgPT09IHJvdyAmJiB0YXJnZXRDb2wgPT09IGNvbFxuICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgdmFsaWRDb29yZHMucHVzaChbcm93LCBjb2xdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWxpZENvb3JkcztcbiAgfVxuXG4gIHN0YXRpYyBhdHRhY2soW3JvdywgY29sXSwgZW5lbXkpIHtcbiAgICByZXR1cm4gZW5lbXkuZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soW3JvdywgY29sXSk7XG4gIH1cblxuICBzdGF0aWMgbWFrZUFpQXR0YWNrKHBsYXllcikge1xuICAgIGNvbnN0IHJhbmRvbVZhbGlkQ29vcmQgPSBQbGF5ZXIuZ2V0UmFuZG9tVmFsaWRDb29yZHMoXG4gICAgICBQbGF5ZXIuZ2V0VmFsaWRDb29yZHMocGxheWVyKVxuICAgICk7XG5cbiAgICByZXR1cm4gcGxheWVyLmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHJhbmRvbVZhbGlkQ29vcmQpO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3IobmFtZSwgbGVuZ3RoKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLnRpbWVzSGl0ID0gMDtcbiAgICB0aGlzLmNvb3JkcyA9IG51bGw7IC8vIG1heSBiZSB1bm5lY2Vzc2FyeVxuICB9XG5cbiAgaGl0KCkge1xuICAgIGlmICh0aGlzLnRpbWVzSGl0ICE9PSB0aGlzLmxlbmd0aCkgdGhpcy50aW1lc0hpdCArPSAxO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aCA9PT0gdGhpcy50aW1lc0hpdDtcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgZ2FtZVVJIGZyb20gXCIuL2RvbS9nYW1lVUlcIjtcblxuZ2FtZVVJLmluaXRpYWxpemUoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==