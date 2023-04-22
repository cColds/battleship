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

      cell.classList.add(board[row][col]);
    }

    function clearGameboardCellsHighlighted() {
      (0,_helper__WEBPACK_IMPORTED_MODULE_1__.clearHighlightedCells)(".gameboard-container .cell", [
        "hit",
        "miss",
        "ship",
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

// implement better ai
//


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixVQUFVO0FBQ2hDLHdCQUF3QixVQUFVO0FBQ2xDO0FBQ0E7QUFDQSwwQ0FBMEMsNkNBQUk7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ25HZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUNmQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTmtDOztBQUVsQyw4REFBaUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS9nYW1lVUkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20vaGVscGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS1sb2dpYy9HYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS1sb2dpYy9HYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lLWxvZ2ljL1BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUtbG9naWMvU2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2FtZSBmcm9tIFwiLi4vZ2FtZS1sb2dpYy9HYW1lXCI7XG5pbXBvcnQgeyBjbGVhckhpZ2hsaWdodGVkQ2VsbHMgfSBmcm9tIFwiLi9oZWxwZXJcIjtcblxuY29uc3QgZ2FtZVVJID0gKCgpID0+IHtcbiAgY29uc3QgZ2FtZSA9IG5ldyBHYW1lKCk7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXItYm9hcmRcIik7XG4gIGNvbnN0IGFpQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFpLWJvYXJkXCIpO1xuICBjb25zdCBzZXR1cEJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZXR1cC1ib2FyZC1jb250YWluZXJcIik7XG4gIGNvbnN0IHNldHVwQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNldHVwLWJvYXJkXCIpO1xuICBjb25zdCBnYW1lYm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC1jb250YWluZXJcIik7XG5cbiAgZnVuY3Rpb24gY3JlYXRlR2FtZWJvYXJkQ2VsbHMoYm9hcmQpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAxMDsgcm93ICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDEwOyBjb2wgKz0gMSkge1xuICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICAgICAgY2VsbC5kYXRhc2V0LmNvb3JkcyA9IGBbJHtyb3d9LCAke2NvbH1dYDtcbiAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdEhvbWVwYWdlKCkge1xuICAgIGNvbnN0IGhvbWVwYWdlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ob21lcGFnZS1jb250YWluZXJcIik7XG5cbiAgICBob21lcGFnZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGhvbWVwYWdlQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBzZXR1cEJvYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0U2V0dXBCb2FyZCgpIHtcbiAgICBjb25zdCByb3RhdGVTaGlwQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yb3RhdGUtc2hpcFwiKTtcbiAgICBjb25zdCBzZXR1cEJvYXJkTWVzc2FnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dXAtYm9hcmQtbWVzc2FnZVwiKTtcbiAgICBjb25zdCByYW5kb21pemVTaGlwc0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmFuZG9taXplLXNoaXBzXCIpO1xuICAgIGNvbnN0IHJlc2V0Qm9hcmRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlc2V0LWJvYXJkXCIpO1xuICAgIGNvbnN0IHN0YXJ0R2FtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dXAtYm9hcmQtc3RhcnQtZ2FtZVwiKTtcbiAgICBjb25zdCBwbGF5ZXJOYW1lSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXllci1uYW1lLWlucHV0XCIpO1xuICAgIGNvbnN0IHBsYXllckJvYXJkTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBcIi5wbGF5ZXItYm9hcmQtY29udGFpbmVyIC5ib2FyZC1uYW1lXCJcbiAgICApO1xuICAgIGxldCBzaGlwT3JpZW50YXRpb25TdGF0ZSA9IFwiaG9yaXpvbnRhbFwiO1xuXG4gICAgZnVuY3Rpb24gaGlnaGxpZ2h0U2hpcChjb29yZHMsIHNoaXAsIG9yaWVudGF0aW9uLCBzZWxlY3RvciwgY2xhc3NOYW1lKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgbGV0IFtyb3csIGNvbF0gPSBbY29vcmRzWzBdLCBjb29yZHNbMV1dO1xuXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIGNvbCArPSBpO1xuICAgICAgICBlbHNlIHJvdyArPSBpO1xuICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgJHtzZWxlY3Rvcn0gW2RhdGEtY29vcmRzPVwiWyR7cm93fSwgJHtjb2x9XVwiXWBcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoY2VsbCkgY2VsbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJIaWdobGlnaHRTaGlwKCkge1xuICAgICAgY2xlYXJIaWdobGlnaHRlZENlbGxzKFwiLnNldHVwLWJvYXJkIC5zaGlwXCIsIFwic2hpcFwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gICAgICBpZiAoZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLnNoaXBzLmxlbmd0aCAhPT0gNSkgcmV0dXJuO1xuXG4gICAgICBzZXR1cEJvYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBnYW1lYm9hcmRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgIGNsZWFySGlnaGxpZ2h0U2hpcCgpO1xuICAgICAgZ2FtZS5haS5yYW5kb21pemVTaGlwcygpO1xuICAgICAgZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLnNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgaGlnaGxpZ2h0U2hpcChcbiAgICAgICAgICBzaGlwLmNvb3JkcyxcbiAgICAgICAgICBzaGlwLFxuICAgICAgICAgIHNoaXAub3JpZW50YXRpb24sXG4gICAgICAgICAgXCIucGxheWVyLWJvYXJkXCIsXG4gICAgICAgICAgXCJzaGlwXCJcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBwbGF5ZXJCb2FyZE5hbWUudGV4dENvbnRlbnQgPSBwbGF5ZXJOYW1lSW5wdXQudmFsdWUudHJpbSgpIHx8IFwiUGxheWVyXCI7XG5cbiAgICAgIHNldHVwQm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICAgICAgc2V0dXBCb2FyZE1lc3NhZ2UudGV4dENvbnRlbnQgPSBcIlBsYWNlIHlvdXIgY2FycmllclwiO1xuICAgICAgc3RhcnRHYW1lQnRuLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckhpZ2hsaWdodFNoaXBQcmV2aWV3KCkge1xuICAgICAgY29uc3QgY2VsbFZhbGlkaXR5Q2xhc3NOYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52YWxpZFwiKVxuICAgICAgICA/IFwidmFsaWRcIlxuICAgICAgICA6IFwiaW52YWxpZFwiO1xuXG4gICAgICBjbGVhckhpZ2hsaWdodGVkQ2VsbHMoXG4gICAgICAgIGAuc2V0dXAtYm9hcmQgLiR7Y2VsbFZhbGlkaXR5Q2xhc3NOYW1lfWAsXG4gICAgICAgIGAke2NlbGxWYWxpZGl0eUNsYXNzTmFtZX1gXG4gICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc2V0Qm9hcmQoKSB7XG4gICAgICBnYW1lLnJlc2V0R2FtZSgpO1xuICAgICAgY2xlYXJIaWdobGlnaHRTaGlwKCk7XG4gICAgICBzZXR1cEJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcbiAgICAgIHNldHVwQm9hcmRNZXNzYWdlLnRleHRDb250ZW50ID0gXCJQbGFjZSB5b3VyIGNhcnJpZXJcIjtcbiAgICAgIHN0YXJ0R2FtZUJ0bi5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGlnaGxpZ2h0U2hpcFByZXZpZXcoZSkge1xuICAgICAgY2xlYXJIaWdobGlnaHRTaGlwUHJldmlldygpO1xuICAgICAgY29uc3QgW2N1cnJlbnRTaGlwXSA9IGdhbWUucGxheWVyLnNoaXBzVG9QbGFjZTtcbiAgICAgIGlmICghY3VycmVudFNoaXAgfHwgIWUudGFyZ2V0LmRhdGFzZXQuY29vcmRzKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGNvb3JkcyA9IEpTT04ucGFyc2UoZS50YXJnZXQuZGF0YXNldC5jb29yZHMpO1xuXG4gICAgICBjb25zdCBpc1ZhbGlkU2hpcFBsYWNlbWVudCA9IGdhbWUucGxheWVyLmdhbWVib2FyZC5jYW5QbGFjZVNoaXAoXG4gICAgICAgIGN1cnJlbnRTaGlwLFxuICAgICAgICBjb29yZHMsXG4gICAgICAgIHNoaXBPcmllbnRhdGlvblN0YXRlXG4gICAgICApO1xuICAgICAgY29uc3QgY2VsbFZhbGlkaXR5TmFtZSA9IGlzVmFsaWRTaGlwUGxhY2VtZW50ID8gXCJ2YWxpZFwiIDogXCJpbnZhbGlkXCI7XG4gICAgICBoaWdobGlnaHRTaGlwKFxuICAgICAgICBjb29yZHMsXG4gICAgICAgIGN1cnJlbnRTaGlwLFxuICAgICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZSxcbiAgICAgICAgXCIuc2V0dXAtYm9hcmRcIixcbiAgICAgICAgY2VsbFZhbGlkaXR5TmFtZVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByYW5kb21pemVTaGlwcygpIHtcbiAgICAgIGdhbWUucGxheWVyLnJlc2V0U2hpcHNQbGFjZWQoKTtcbiAgICAgIGdhbWUucGxheWVyLnJhbmRvbWl6ZVNoaXBzKCk7XG4gICAgICBjbGVhckhpZ2hsaWdodFNoaXAoKTtcbiAgICAgIHN0YXJ0R2FtZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XG5cbiAgICAgIGNvbnN0IHsgc2hpcHMgfSA9IGdhbWUucGxheWVyLmdhbWVib2FyZDtcbiAgICAgIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgaGlnaGxpZ2h0U2hpcChcbiAgICAgICAgICBzaGlwLmNvb3JkcyxcbiAgICAgICAgICBzaGlwLFxuICAgICAgICAgIHNoaXAub3JpZW50YXRpb24sXG4gICAgICAgICAgXCIuc2V0dXAtYm9hcmRcIixcbiAgICAgICAgICBcInNoaXBcIlxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgICBzZXR1cEJvYXJkLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgICAgIHNldHVwQm9hcmRNZXNzYWdlLnRleHRDb250ZW50ID0gXCJSZWFkeSBmb3IgYmF0dGxlIVwiO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBsYWNlU2hpcChlKSB7XG4gICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYm9hcmRcIikpIHJldHVybjtcblxuICAgICAgY29uc3QgY29vcmRzID0gSlNPTi5wYXJzZShlLnRhcmdldC5kYXRhc2V0LmNvb3Jkcyk7XG4gICAgICBjb25zdCBbY3VycmVudFNoaXBdID0gZ2FtZS5wbGF5ZXIuc2hpcHNUb1BsYWNlO1xuXG4gICAgICBpZiAoXG4gICAgICAgICFnYW1lLnBsYXllci5nYW1lYm9hcmQuY2FuUGxhY2VTaGlwKFxuICAgICAgICAgIGN1cnJlbnRTaGlwLFxuICAgICAgICAgIGNvb3JkcyxcbiAgICAgICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZVxuICAgICAgICApXG4gICAgICApXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgY3VycmVudFNoaXAsXG4gICAgICAgIGNvb3JkcyxcbiAgICAgICAgc2hpcE9yaWVudGF0aW9uU3RhdGVcbiAgICAgICk7XG5cbiAgICAgIGhpZ2hsaWdodFNoaXAoXG4gICAgICAgIGNvb3JkcyxcbiAgICAgICAgY3VycmVudFNoaXAsXG4gICAgICAgIGN1cnJlbnRTaGlwLm9yaWVudGF0aW9uLFxuICAgICAgICBcIi5zZXR1cC1ib2FyZFwiLFxuICAgICAgICBcInNoaXBcIlxuICAgICAgKTtcbiAgICAgIGdhbWUucGxheWVyLnNoaXBzVG9QbGFjZS5zaGlmdCgpO1xuXG4gICAgICBjb25zdCBbbmV4dFNoaXBdID0gZ2FtZS5wbGF5ZXIuc2hpcHNUb1BsYWNlO1xuXG4gICAgICBpZiAoIWdhbWUucGxheWVyLnNoaXBzVG9QbGFjZS5sZW5ndGgpIHtcbiAgICAgICAgc2V0dXBCb2FyZE1lc3NhZ2UudGV4dENvbnRlbnQgPSBcIlJlYWR5IGZvciBiYXR0bGUhXCI7XG4gICAgICAgIHNldHVwQm9hcmQuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICAgICAgICBzdGFydEdhbWVCdG4uY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0dXBCb2FyZE1lc3NhZ2UudGV4dENvbnRlbnQgPSBgUGxhY2UgeW91ciAke25leHRTaGlwLm5hbWV9YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnZlcnRCb2FyZE9yaWVudGF0aW9uKCkge1xuICAgICAgc2hpcE9yaWVudGF0aW9uU3RhdGUgPVxuICAgICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZSA9PT0gXCJob3Jpem9udGFsXCIgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIjtcbiAgICB9XG5cbiAgICBzZXR1cEJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgaGlnaGxpZ2h0U2hpcFByZXZpZXcpO1xuICAgIHNldHVwQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgY2xlYXJIaWdobGlnaHRTaGlwUHJldmlldyk7XG4gICAgc2V0dXBCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxhY2VTaGlwKTtcbiAgICByb3RhdGVTaGlwQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBpbnZlcnRCb2FyZE9yaWVudGF0aW9uKTtcbiAgICByYW5kb21pemVTaGlwc0J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmFuZG9taXplU2hpcHMpO1xuICAgIHJlc2V0Qm9hcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlc2V0Qm9hcmQpO1xuICAgIHN0YXJ0R2FtZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRHYW1lYm9hcmQoKSB7XG4gICAgY29uc3QgbW9kYWxPdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1vdmVybGF5XCIpO1xuICAgIGNvbnN0IGdhbWVPdmVyVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1vdmVyLXRleHRcIik7XG4gICAgY29uc3QgcGxheUFnYWluQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5LWFnYWluXCIpO1xuICAgIGNvbnN0IG5ld0dhbWVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5ldy1nYW1lXCIpO1xuXG4gICAgZnVuY3Rpb24gaGlnaGxpZ2h0QXR0YWNrKGJvYXJkLCBbcm93LCBjb2xdLCBzZWxlY3Rvcikge1xuICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAke3NlbGVjdG9yfSBbZGF0YS1jb29yZHM9XCJbJHtyb3d9LCAke2NvbH1dXCJdYFxuICAgICAgKTtcblxuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKGJvYXJkW3Jvd11bY29sXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJHYW1lYm9hcmRDZWxsc0hpZ2hsaWdodGVkKCkge1xuICAgICAgY2xlYXJIaWdobGlnaHRlZENlbGxzKFwiLmdhbWVib2FyZC1jb250YWluZXIgLmNlbGxcIiwgW1xuICAgICAgICBcImhpdFwiLFxuICAgICAgICBcIm1pc3NcIixcbiAgICAgICAgXCJzaGlwXCIsXG4gICAgICBdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwbGF5QWdhaW4oKSB7XG4gICAgICBnYW1lLnJlc2V0R2FtZSgpO1xuXG4gICAgICBjbGVhckdhbWVib2FyZENlbGxzSGlnaGxpZ2h0ZWQoKTtcbiAgICAgIG1vZGFsT3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgICAgZ2FtZWJvYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBzZXR1cEJvYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXR0YWNrKGUpIHtcbiAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJhaS1ib2FyZFwiKSB8fCBnYW1lLmlzR2FtZU92ZXIoKSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBbcm93LCBjb2xdID0gSlNPTi5wYXJzZShlLnRhcmdldC5kYXRhc2V0LmNvb3Jkcyk7XG5cbiAgICAgIGlmICghZ2FtZS5wbGF5ZXIuY29uc3RydWN0b3IuYXR0YWNrKFtyb3csIGNvbF0sIGdhbWUuYWkpKSByZXR1cm47XG5cbiAgICAgIGhpZ2hsaWdodEF0dGFjayhnYW1lLmFpLmdhbWVib2FyZC5ib2FyZCwgW3JvdywgY29sXSwgXCIuYWktYm9hcmRcIik7XG4gICAgICBpZiAoZ2FtZS5pc0dhbWVPdmVyKCkpIHtcbiAgICAgICAgbW9kYWxPdmVybGF5LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgIGdhbWVPdmVyVGV4dC50ZXh0Q29udGVudCA9IGBHYW1lIE92ZXIhIFlvdSB3b24hYDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBnYW1lLmFpLmNvbnN0cnVjdG9yLm1ha2VDb21wdXRlckF0dGFjayhnYW1lLnBsYXllcik7XG4gICAgICBoaWdobGlnaHRBdHRhY2soXG4gICAgICAgIGdhbWUucGxheWVyLmdhbWVib2FyZC5ib2FyZCxcbiAgICAgICAgZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLmxhdGVzdFJlY2VpdmVkQXR0YWNrLFxuICAgICAgICBcIi5wbGF5ZXItYm9hcmRcIlxuICAgICAgKTtcblxuICAgICAgaWYgKGdhbWUuaXNHYW1lT3ZlcigpKSB7XG4gICAgICAgIGdhbWVPdmVyVGV4dC50ZXh0Q29udGVudCA9IGBHYW1lIE92ZXIhIFlvdSBsb3N0IWA7XG5cbiAgICAgICAgbW9kYWxPdmVybGF5LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWlCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXR0YWNrKTtcbiAgICBwbGF5QWdhaW5CdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBsYXlBZ2Fpbik7XG4gICAgbmV3R2FtZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgY3JlYXRlR2FtZWJvYXJkQ2VsbHMocGxheWVyQm9hcmQpO1xuICAgIGNyZWF0ZUdhbWVib2FyZENlbGxzKGFpQm9hcmQpO1xuICAgIGNyZWF0ZUdhbWVib2FyZENlbGxzKHNldHVwQm9hcmQpO1xuXG4gICAgaW5pdEhvbWVwYWdlKCk7XG4gICAgaW5pdFNldHVwQm9hcmQoKTtcbiAgICBpbml0R2FtZWJvYXJkKCk7XG4gIH1cblxuICByZXR1cm4geyBpbml0aWFsaXplIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lVUk7XG5cbi8vIGltcGxlbWVudCBiZXR0ZXIgYWlcbi8vXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuXG5mdW5jdGlvbiBjbGVhckhpZ2hsaWdodGVkQ2VsbHMoc2VsZWN0b3IsIGNsYXNzZXMpIHtcbiAgY29uc3QgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2xhc3NlcykpIHtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc2VzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzZXMpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCB7IGNsZWFySGlnaGxpZ2h0ZWRDZWxscyB9O1xuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9QbGF5ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcigpO1xuICAgIHRoaXMuYWkgPSBuZXcgUGxheWVyKCk7XG4gIH1cblxuICByZXNldEdhbWUoKSB7XG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG4gICAgdGhpcy5haSA9IG5ldyBQbGF5ZXIoKTtcbiAgfVxuXG4gIGlzR2FtZU92ZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMucGxheWVyLmdhbWVib2FyZC5hcmVBbGxTaGlwc1N1bmsoKSB8fFxuICAgICAgdGhpcy5haS5nYW1lYm9hcmQuYXJlQWxsU2hpcHNTdW5rKClcbiAgICApO1xuICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vU2hpcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmJvYXJkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwobnVsbCkpO1xuICAgIHRoaXMuc2hpcHMgPSBbXTtcbiAgfVxuXG4gIHN0YXRpYyBpc091dE9mQm91bmRzID0gKFtyb3csIGNvbF0pID0+XG4gICAgcm93IDwgMCB8fCByb3cgPiA5IHx8IGNvbCA8IDAgfHwgY29sID4gOTtcblxuICBzdGF0aWMgZ2V0RW5kUG9zaXRpb24gPSAoc2hpcCwgW3JvdywgY29sXSwgb3JpZW50YXRpb24pID0+XG4gICAgb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiXG4gICAgICA/IGNvbCArIHNoaXAubGVuZ3RoIC0gMVxuICAgICAgOiByb3cgKyBzaGlwLmxlbmd0aCAtIDE7XG5cbiAgYXJlQWxsU2hpcHNTdW5rID0gKCkgPT4gdGhpcy5zaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSk7XG5cbiAgaXNIaXQgPSAoW3JvdywgY29sXSkgPT4gdGhpcy5ib2FyZFtyb3ddW2NvbF0gaW5zdGFuY2VvZiBTaGlwO1xuXG4gIHJlc2V0R2FtZWJvYXJkKCkge1xuICAgIHRoaXMuYm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheSgxMCkuZmlsbChudWxsKSk7XG4gICAgdGhpcy5zaGlwcyA9IFtdO1xuICB9XG5cbiAgaXNFdmVyeUNlbGxWYWxpZChzaGlwLCBbcm93LCBjb2xdLCBvcmllbnRhdGlvbikge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3ddW2NvbCArIGldID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2FyZFtyb3cgKyBpXVtjb2xdID09PSBudWxsKSBjb250aW51ZTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNhblBsYWNlU2hpcChzaGlwLCBbcm93LCBjb2xdLCBvcmllbnRhdGlvbikge1xuICAgIHJldHVybiAoXG4gICAgICAhR2FtZWJvYXJkLmlzT3V0T2ZCb3VuZHMoW3JvdywgY29sXSkgJiZcbiAgICAgIEdhbWVib2FyZC5nZXRFbmRQb3NpdGlvbihzaGlwLCBbcm93LCBjb2xdLCBvcmllbnRhdGlvbikgPCAxMCAmJlxuICAgICAgdGhpcy5pc0V2ZXJ5Q2VsbFZhbGlkKHNoaXAsIFtyb3csIGNvbF0sIG9yaWVudGF0aW9uKVxuICAgICk7XG4gIH1cblxuICBwbGFjZVNoaXAoc2hpcCwgW3JvdywgY29sXSwgb3JpZW50YXRpb24pIHtcbiAgICBpZiAoIXRoaXMuY2FuUGxhY2VTaGlwKHNoaXAsIFtyb3csIGNvbF0sIG9yaWVudGF0aW9uKSkgcmV0dXJuO1xuXG4gICAgc2hpcC5jb29yZHMgPSBbcm93LCBjb2xdO1xuICAgIHNoaXAub3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcbiAgICB0aGlzLnNoaXBzLnB1c2goc2hpcCk7XG5cbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBzaGlwLmxlbmd0aCkge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICB0aGlzLmJvYXJkW3Jvd11bY29sICsgaV0gPSBzaGlwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ib2FyZFtyb3cgKyBpXVtjb2xdID0gc2hpcDtcbiAgICAgIH1cbiAgICAgIGkgKz0gMTtcbiAgICB9XG4gIH1cblxuICByZWNlaXZlQXR0YWNrKFtyb3csIGNvbF0pIHtcbiAgICBpZiAoXG4gICAgICBHYW1lYm9hcmQuaXNPdXRPZkJvdW5kcyhbcm93LCBjb2xdKSB8fFxuICAgICAgdGhpcy5ib2FyZFtyb3ddW2NvbF0gPT09IFwiaGl0XCIgfHxcbiAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2xdID09PSBcIm1pc3NcIlxuICAgIClcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHRoaXMubGF0ZXN0UmVjZWl2ZWRBdHRhY2sgPSBbcm93LCBjb2xdO1xuXG4gICAgaWYgKCF0aGlzLmlzSGl0KFtyb3csIGNvbF0pKSB7XG4gICAgICB0aGlzLmJvYXJkW3Jvd11bY29sXSA9IFwibWlzc1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJvYXJkW3Jvd11bY29sXS5oaXQoKTtcbiAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2xdID0gXCJoaXRcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9HYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuL1NoaXBcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5nYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgdGhpcy5jYXJyaWVyID0gbmV3IFNoaXAoXCJjYXJyaWVyXCIsIDUpO1xuICAgIHRoaXMuYmF0dGxlc2hpcCA9IG5ldyBTaGlwKFwiYmF0dGxlc2hpcFwiLCA0KTtcbiAgICB0aGlzLmNydWlzZXIgPSBuZXcgU2hpcChcImNydWlzZXJcIiwgMyk7XG4gICAgdGhpcy5zdWJtYXJpbmUgPSBuZXcgU2hpcChcInN1Ym1hcmluZVwiLCAzKTtcbiAgICB0aGlzLmRlc3Ryb3llciA9IG5ldyBTaGlwKFwiZGVzdHJveWVyXCIsIDIpO1xuICAgIHRoaXMuc2hpcHNUb1BsYWNlID0gW1xuICAgICAgdGhpcy5jYXJyaWVyLFxuICAgICAgdGhpcy5iYXR0bGVzaGlwLFxuICAgICAgdGhpcy5jcnVpc2VyLFxuICAgICAgdGhpcy5zdWJtYXJpbmUsXG4gICAgICB0aGlzLmRlc3Ryb3llcixcbiAgICBdO1xuICB9XG5cbiAgc3RhdGljIGdldFJhbmRvbUludCA9IChtYXgpID0+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XG5cbiAgLyogUmFuZG9taXplIGFycmF5IGluLXBsYWNlIHVzaW5nIER1cnN0ZW5mZWxkIHNodWZmbGUgYWxnb3JpdGhtICovXG4gIHN0YXRpYyBzaHVmZmxlQXJyYXkoYXJyYXkpIHtcbiAgICBjb25zdCBuZXdBcnJheSA9IFsuLi5hcnJheV07XG4gICAgZm9yIChsZXQgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPiAwOyBpIC09IDEpIHtcbiAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgIFtuZXdBcnJheVtpXSwgbmV3QXJyYXlbal1dID0gW25ld0FycmF5W2pdLCBuZXdBcnJheVtpXV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9XG5cbiAgc3RhdGljIGdldFJhbmRvbU9yaWVudGF0aW9uID0gKCkgPT5cbiAgICBQbGF5ZXIuZ2V0UmFuZG9tSW50KDIpID09PSAwID8gXCJob3Jpem9udGFsXCIgOiBcInZlcnRpY2FsXCI7XG5cbiAgc3RhdGljIGdldFJhbmRvbVZhbGlkQ29vcmRzID0gKHZhbGlkQ29vcmRzKSA9PlxuICAgIHZhbGlkQ29vcmRzW1BsYXllci5nZXRSYW5kb21JbnQodmFsaWRDb29yZHMubGVuZ3RoKV07XG5cbiAgcmVzZXRTaGlwc1BsYWNlZCgpIHtcbiAgICB0aGlzLnNoaXBzVG9QbGFjZSA9IFtcbiAgICAgIHRoaXMuY2FycmllcixcbiAgICAgIHRoaXMuYmF0dGxlc2hpcCxcbiAgICAgIHRoaXMuY3J1aXNlcixcbiAgICAgIHRoaXMuc3VibWFyaW5lLFxuICAgICAgdGhpcy5kZXN0cm95ZXIsXG4gICAgXTtcbiAgfVxuXG4gIHJhbmRvbWl6ZVNoaXBzKCkge1xuICAgIHRoaXMuZ2FtZWJvYXJkLnJlc2V0R2FtZWJvYXJkKCk7XG5cbiAgICBjb25zdCByYW5kb21TaGlwcyA9IFBsYXllci5zaHVmZmxlQXJyYXkodGhpcy5zaGlwc1RvUGxhY2UpO1xuICAgIHJhbmRvbVNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGNvbnN0IHZhbGlkQ29vcmRzID0gW107XG4gICAgICBjb25zdCByYW5kb21PcmllbnRhdGlvbiA9IFBsYXllci5nZXRSYW5kb21PcmllbnRhdGlvbigpO1xuICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgMTA7IHJvdyArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDEwOyBjb2wgKz0gMSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuZ2FtZWJvYXJkLmNhblBsYWNlU2hpcChzaGlwLCBbcm93LCBjb2xdLCByYW5kb21PcmllbnRhdGlvbilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHZhbGlkQ29vcmRzLnB1c2goW3JvdywgY29sXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IFtyYW5kb21YLCByYW5kb21ZXSA9IFBsYXllci5nZXRSYW5kb21WYWxpZENvb3Jkcyh2YWxpZENvb3Jkcyk7XG4gICAgICB0aGlzLmdhbWVib2FyZC5wbGFjZVNoaXAoc2hpcCwgW3JhbmRvbVgsIHJhbmRvbVldLCByYW5kb21PcmllbnRhdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0VmFsaWRDb29yZHMoZW5lbXkpIHtcbiAgICBjb25zdCBlbmVteUJvYXJkID0gZW5lbXkuZ2FtZWJvYXJkLmJvYXJkO1xuICAgIGNvbnN0IHZhbGlkQ29vcmRzID0gW107XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgMTA7IHJvdyArPSAxKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sICs9IDEpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGVuZW15Qm9hcmRbcm93XVtjb2xdID09PSBudWxsIHx8XG4gICAgICAgICAgZW5lbXlCb2FyZFtyb3ddW2NvbF0gaW5zdGFuY2VvZiBTaGlwXG4gICAgICAgICkge1xuICAgICAgICAgIHZhbGlkQ29vcmRzLnB1c2goW3JvdywgY29sXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRDb29yZHM7XG4gIH1cblxuICBzdGF0aWMgYXR0YWNrKFtyb3csIGNvbF0sIGVuZW15KSB7XG4gICAgcmV0dXJuIGVuZW15LmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKFtyb3csIGNvbF0pO1xuICB9XG5cbiAgc3RhdGljIG1ha2VDb21wdXRlckF0dGFjayhwbGF5ZXIpIHtcbiAgICBjb25zdCByYW5kb21WYWxpZENvb3JkID0gUGxheWVyLmdldFJhbmRvbVZhbGlkQ29vcmRzKFxuICAgICAgUGxheWVyLmdldFZhbGlkQ29vcmRzKHBsYXllcilcbiAgICApO1xuXG4gICAgcmV0dXJuIHBsYXllci5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhyYW5kb21WYWxpZENvb3JkKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGxlbmd0aCkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy50aW1lc0hpdCA9IDA7XG4gICAgdGhpcy5jb29yZHMgPSBudWxsO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIGlmICh0aGlzLnRpbWVzSGl0ICE9PSB0aGlzLmxlbmd0aCkgdGhpcy50aW1lc0hpdCArPSAxO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aCA9PT0gdGhpcy50aW1lc0hpdDtcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgZ2FtZVVJIGZyb20gXCIuL2RvbS9nYW1lVUlcIjtcblxuZ2FtZVVJLmluaXRpYWxpemUoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==