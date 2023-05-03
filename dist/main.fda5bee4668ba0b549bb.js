/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/dom/dom-helpers.js":
/*!****************************************!*\
  !*** ./src/modules/dom/dom-helpers.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clearHighlightedCells": () => (/* binding */ clearHighlightedCells),
/* harmony export */   "createGameboardCells": () => (/* binding */ createGameboardCells)
/* harmony export */ });
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




/***/ }),

/***/ "./src/modules/dom/gameUI.js":
/*!***********************************!*\
  !*** ./src/modules/dom/gameUI.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _game_logic_Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game-logic/Game */ "./src/modules/game-logic/Game.js");
/* harmony import */ var _dom_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-helpers */ "./src/modules/dom/dom-helpers.js");



const gameUI = (() => {
  const game = new _game_logic_Game__WEBPACK_IMPORTED_MODULE_0__["default"]();
  const playerBoard = document.querySelector(".player-board");
  const aiBoard = document.querySelector(".ai-board");
  const setupBoardContainer = document.querySelector(".setup-board-container");
  const setupBoard = document.querySelector(".setup-board");
  const gameboardContainer = document.querySelector(".gameboard-container");

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
      (0,_dom_helpers__WEBPACK_IMPORTED_MODULE_1__.clearHighlightedCells)(".setup-board .ship", "ship");
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

      (0,_dom_helpers__WEBPACK_IMPORTED_MODULE_1__.clearHighlightedCells)(
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
      (0,_dom_helpers__WEBPACK_IMPORTED_MODULE_1__.clearHighlightedCells)(".gameboard-container .cell", [
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

      game.ai.makeAiAttack(game.player);
      highlightAttack(
        game.player.gameboard.board,
        game.player.gameboard.attackLog.at(-1),
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
    (0,_dom_helpers__WEBPACK_IMPORTED_MODULE_1__.createGameboardCells)(playerBoard);
    (0,_dom_helpers__WEBPACK_IMPORTED_MODULE_1__.createGameboardCells)(aiBoard);
    (0,_dom_helpers__WEBPACK_IMPORTED_MODULE_1__.createGameboardCells)(setupBoard);

    initHomepage();
    initSetupBoard();
    initGameboard();
  }

  return { initialize };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameUI);


/***/ }),

/***/ "./src/modules/game-logic/Game.js":
/*!****************************************!*\
  !*** ./src/modules/game-logic/Game.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ "./src/modules/game-logic/Player.js");


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

/***/ "./src/modules/game-logic/Gameboard.js":
/*!*********************************************!*\
  !*** ./src/modules/game-logic/Gameboard.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gameboard)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/modules/utils.js");

/* eslint-disable no-param-reassign */

class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [];
    this.shotsMissed = [];
    this.shotsHit = [];
    this.attackLog = [];
  }

  static isOutOfBounds = ([row, col]) =>
    row < 0 || row > 9 || col < 0 || col > 9;

  static getEndPosition = (ship, [row, col], orientation) =>
    orientation === "horizontal"
      ? col + ship.length - 1
      : row + ship.length - 1;

  getCell([row, col]) {
    return this.board[row][col];
  }

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
      (0,_utils__WEBPACK_IMPORTED_MODULE_0__["default"])(this.attackLog, [row, col])
    )
      return false;

    this.attackLog.push([row, col]);

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

/***/ "./src/modules/game-logic/Player.js":
/*!******************************************!*\
  !*** ./src/modules/game-logic/Player.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _Gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Gameboard */ "./src/modules/game-logic/Gameboard.js");
/* harmony import */ var _Ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Ship */ "./src/modules/game-logic/Ship.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/modules/utils.js");




class Player {
  constructor() {
    this.gameboard = new _Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.carrier = new _Ship__WEBPACK_IMPORTED_MODULE_1__["default"]("carrier", 5);
    this.battleship = new _Ship__WEBPACK_IMPORTED_MODULE_1__["default"]("battleship", 4);
    this.cruiser = new _Ship__WEBPACK_IMPORTED_MODULE_1__["default"]("cruiser", 3);
    this.submarine = new _Ship__WEBPACK_IMPORTED_MODULE_1__["default"]("submarine", 3);
    this.destroyer = new _Ship__WEBPACK_IMPORTED_MODULE_1__["default"]("destroyer", 2);
    this.shipsToPlace = [
      // maybe refactor this logic
      this.carrier,
      this.battleship,
      this.cruiser,
      this.submarine,
      this.destroyer,
    ];
    this.aiInitialHitCoord = null;
    this.aiShipOrientationTracker = null;
    this.aiCoordTracker = null;
  }

  static getRandomInt = (max) => Math.floor(Math.random() * max);

  static getRandomOrientation = () =>
    Player.getRandomInt(2) === 0 ? "horizontal" : "vertical";

  static getRandomValidCoord = (validCoords) =>
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

    this.shipsToPlace.forEach((ship) => {
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

      const [randomX, randomY] = Player.getRandomValidCoord(validCoords);
      this.gameboard.placeShip(ship, [randomX, randomY], randomOrientation);
    });
  }

  static getValidCoords(enemy) {
    const validCoords = [];
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        if (
          !(0,_utils__WEBPACK_IMPORTED_MODULE_2__["default"])(enemy.gameboard.shotsMissed, [row, col]) &&
          !(0,_utils__WEBPACK_IMPORTED_MODULE_2__["default"])(enemy.gameboard.shotsHit, [row, col])
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

  static isHit([targetRow, targetCol], player) {
    return player.gameboard.shotsHit.some(
      ([row, col]) => row === targetRow && col === targetCol
    );
  }

  static getRandomValidCoords = (validCoords) =>
    validCoords[Player.getRandomInt(validCoords.length)];

  getAdjacentCoords([row, col]) {
    if (this.aiShipOrientationTracker === "horizontal") {
      return [
        [row, col + 1],
        [row, col - 1],
      ];
    }

    if (this.aiShipOrientationTracker === "vertical")
      return [
        [row + 1, col],
        [row - 1, col],
      ];

    return [
      [row + 1, col],
      [row - 1, col],
      [row, col + 1],
      [row, col - 1],
    ];
  }

  getAiOrientationTracker(player) {
    const [currRow] = player.gameboard.shotsHit.at(-1);
    const [initRow] = this.aiInitialHitCoord;

    return currRow === initRow ? "horizontal" : "vertical";
  }

  updateAiState(player) {
    const [initRow, initCol] = this.aiInitialHitCoord;
    const originalShip = player.gameboard.board[initRow][initCol];
    const isSameShip = player.gameboard.board[initRow][initCol];
    // if is different ship or cell is null (dead end)
    if (originalShip !== isSameShip || isSameShip === null) {
      this.aiCoordTracker = null;
    }
    // if hit twice on the same ship, we know the orientation. also make sure this.aiShipOrientationTracker isn't set
    if (originalShip.timesHit === 2 && this.aiShipOrientationTracker === null) {
      this.aiShipOrientationTracker = this.getAiOrientationTracker(player);
    }
    // reset ai state back to random
    if (originalShip.isSunk()) {
      this.aiInitialHitCoord = null;
      this.aiCoordTracker = null;
      this.aiShipOrientationTracker = null;
    }
  }

  static filterInvalidCoords(coord, player) {
    const isAlreadyAttacked = (0,_utils__WEBPACK_IMPORTED_MODULE_2__["default"])(player.gameboard.attackLog, coord);
    return !_Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"].isOutOfBounds(coord) && !isAlreadyAttacked;
  }

  getValidAdjacentCoords(player) {
    let adjacentCoords;
    const lastAttack = player.gameboard.attackLog.at(-1);
    const isLastAttackHit = Player.isHit(lastAttack, player);
    if (!isLastAttackHit) {
      adjacentCoords = this.getAdjacentCoords(this.aiInitialHitCoord).filter(
        (coord) => Player.filterInvalidCoords(coord, player)
      );
      this.aiCoordTracker = null;
    } else {
      this.aiCoordTracker = player.gameboard.shotsHit.at(-1);
      adjacentCoords = this.getAdjacentCoords(this.aiCoordTracker).filter(
        (coord) => Player.filterInvalidCoords(coord, player)
      );
    }

    if (!adjacentCoords.length) {
      adjacentCoords = this.getAdjacentCoords(this.aiInitialHitCoord);
      this.aiCoordTracker = null;
      adjacentCoords = adjacentCoords.filter((coord) =>
        Player.filterInvalidCoords(coord, player)
      );
    }

    return adjacentCoords;
  }

  makeAdjacentAttack(player) {
    const coords = Player.getRandomValidCoords(
      this.getValidAdjacentCoords(player)
    );

    player.gameboard.receiveAttack(coords);
    this.updateAiState(player);
  }

  makeAiAttack(player) {
    if (this.aiInitialHitCoord) {
      this.makeAdjacentAttack(player);
      return;
    }

    const randomValidCoord = Player.getRandomValidCoord(
      Player.getValidCoords(player)
    );

    player.gameboard.receiveAttack(randomValidCoord);
    if (Player.isHit(randomValidCoord, player)) {
      this.aiInitialHitCoord = randomValidCoord;
    }
  }
}


/***/ }),

/***/ "./src/modules/game-logic/Ship.js":
/*!****************************************!*\
  !*** ./src/modules/game-logic/Ship.js ***!
  \****************************************/
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


/***/ }),

/***/ "./src/modules/utils.js":
/*!******************************!*\
  !*** ./src/modules/utils.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function isCoordFound(array, [targetRow = null, targetCol = null] = []) {
  if (targetRow === null || targetCol === null) return false;

  return array.some(([row, col]) => row === targetRow && col === targetCol);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isCoordFound);


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
/* harmony import */ var _modules_dom_gameUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/dom/gameUI */ "./src/modules/dom/gameUI.js");


_modules_dom_gameUI__WEBPACK_IMPORTED_MODULE_0__["default"].initialize();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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WSxFQUFDOzs7Ozs7O1VDTjVCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOMEM7O0FBRTFDLHNFQUFpQiIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9kb20vZG9tLWhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2RvbS9nYW1lVUkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWUtbG9naWMvR2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZS1sb2dpYy9HYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWUtbG9naWMvUGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lLWxvZ2ljL1NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3V0aWxzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGNsZWFySGlnaGxpZ2h0ZWRDZWxscyhzZWxlY3RvciwgY2xhc3Nlcykge1xuICBjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjbGFzc2VzKSkge1xuICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3Nlcyk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlR2FtZWJvYXJkQ2VsbHMoYm9hcmQpIHtcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgMTA7IHJvdyArPSAxKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCArPSAxKSB7XG4gICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblxuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICAgIGNlbGwuZGF0YXNldC5jb29yZHMgPSBgWyR7cm93fSwgJHtjb2x9XWA7XG4gICAgICBib2FyZC5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgY2xlYXJIaWdobGlnaHRlZENlbGxzLCBjcmVhdGVHYW1lYm9hcmRDZWxscyB9O1xuIiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2dhbWUtbG9naWMvR2FtZVwiO1xuaW1wb3J0IHsgY2xlYXJIaWdobGlnaHRlZENlbGxzLCBjcmVhdGVHYW1lYm9hcmRDZWxscyB9IGZyb20gXCIuL2RvbS1oZWxwZXJzXCI7XG5cbmNvbnN0IGdhbWVVSSA9ICgoKSA9PiB7XG4gIGNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLWJvYXJkXCIpO1xuICBjb25zdCBhaUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5haS1ib2FyZFwiKTtcbiAgY29uc3Qgc2V0dXBCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dXAtYm9hcmQtY29udGFpbmVyXCIpO1xuICBjb25zdCBzZXR1cEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZXR1cC1ib2FyZFwiKTtcbiAgY29uc3QgZ2FtZWJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lYm9hcmQtY29udGFpbmVyXCIpO1xuXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodFNoaXAoY29vcmRzLCBzaGlwLCBvcmllbnRhdGlvbiwgc2VsZWN0b3IsIGNsYXNzTmFtZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgbGV0IFtyb3csIGNvbF0gPSBbY29vcmRzWzBdLCBjb29yZHNbMV1dO1xuXG4gICAgICBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSBjb2wgKz0gaTtcbiAgICAgIGVsc2Ugcm93ICs9IGk7XG4gICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYCR7c2VsZWN0b3J9IFtkYXRhLWNvb3Jkcz1cIlske3Jvd30sICR7Y29sfV1cIl1gXG4gICAgICApO1xuXG4gICAgICBpZiAoY2VsbCkgY2VsbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdEhvbWVwYWdlKCkge1xuICAgIGNvbnN0IGhvbWVwYWdlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ob21lcGFnZS1jb250YWluZXJcIik7XG5cbiAgICBob21lcGFnZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGhvbWVwYWdlQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBzZXR1cEJvYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0U2V0dXBCb2FyZCgpIHtcbiAgICBjb25zdCByb3RhdGVTaGlwQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yb3RhdGUtc2hpcFwiKTtcbiAgICBjb25zdCBzZXR1cEJvYXJkTWVzc2FnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dXAtYm9hcmQtbWVzc2FnZVwiKTtcbiAgICBjb25zdCByYW5kb21pemVTaGlwc0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmFuZG9taXplLXNoaXBzXCIpO1xuICAgIGNvbnN0IHJlc2V0Qm9hcmRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlc2V0LWJvYXJkXCIpO1xuICAgIGNvbnN0IHN0YXJ0R2FtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dXAtYm9hcmQtc3RhcnQtZ2FtZVwiKTtcbiAgICBjb25zdCBwbGF5ZXJOYW1lSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXllci1uYW1lLWlucHV0XCIpO1xuICAgIGNvbnN0IHBsYXllckJvYXJkTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBcIi5wbGF5ZXItYm9hcmQtY29udGFpbmVyIC5ib2FyZC1uYW1lXCJcbiAgICApO1xuICAgIGxldCBzaGlwT3JpZW50YXRpb25TdGF0ZSA9IFwiaG9yaXpvbnRhbFwiO1xuXG4gICAgZnVuY3Rpb24gY2xlYXJIaWdobGlnaHRTaGlwKCkge1xuICAgICAgY2xlYXJIaWdobGlnaHRlZENlbGxzKFwiLnNldHVwLWJvYXJkIC5zaGlwXCIsIFwic2hpcFwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gICAgICBpZiAoZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLnNoaXBzLmxlbmd0aCAhPT0gNSkgcmV0dXJuO1xuXG4gICAgICBzZXR1cEJvYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBnYW1lYm9hcmRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgIGNsZWFySGlnaGxpZ2h0U2hpcCgpO1xuICAgICAgZ2FtZS5haS5yYW5kb21pemVTaGlwcygpO1xuICAgICAgZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLnNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgaGlnaGxpZ2h0U2hpcChcbiAgICAgICAgICBzaGlwLmNvb3JkcyxcbiAgICAgICAgICBzaGlwLFxuICAgICAgICAgIHNoaXAub3JpZW50YXRpb24sXG4gICAgICAgICAgXCIucGxheWVyLWJvYXJkXCIsXG4gICAgICAgICAgXCJzaGlwXCJcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBwbGF5ZXJCb2FyZE5hbWUudGV4dENvbnRlbnQgPSBwbGF5ZXJOYW1lSW5wdXQudmFsdWUudHJpbSgpIHx8IFwiUGxheWVyXCI7XG5cbiAgICAgIHNldHVwQm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICAgICAgc2V0dXBCb2FyZE1lc3NhZ2UudGV4dENvbnRlbnQgPSBcIlBsYWNlIHlvdXIgY2FycmllclwiO1xuICAgICAgc3RhcnRHYW1lQnRuLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckhpZ2hsaWdodFNoaXBQcmV2aWV3KCkge1xuICAgICAgY29uc3QgY2VsbFZhbGlkaXR5Q2xhc3NOYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi52YWxpZFwiKVxuICAgICAgICA/IFwidmFsaWRcIlxuICAgICAgICA6IFwiaW52YWxpZFwiO1xuXG4gICAgICBjbGVhckhpZ2hsaWdodGVkQ2VsbHMoXG4gICAgICAgIGAuc2V0dXAtYm9hcmQgLiR7Y2VsbFZhbGlkaXR5Q2xhc3NOYW1lfWAsXG4gICAgICAgIGAke2NlbGxWYWxpZGl0eUNsYXNzTmFtZX1gXG4gICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc2V0Qm9hcmQoKSB7XG4gICAgICBnYW1lLnJlc2V0R2FtZSgpO1xuICAgICAgY2xlYXJIaWdobGlnaHRTaGlwKCk7XG4gICAgICBzZXR1cEJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcbiAgICAgIHNldHVwQm9hcmRNZXNzYWdlLnRleHRDb250ZW50ID0gXCJQbGFjZSB5b3VyIGNhcnJpZXJcIjtcbiAgICAgIHN0YXJ0R2FtZUJ0bi5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGlnaGxpZ2h0U2hpcFByZXZpZXcoZSkge1xuICAgICAgY2xlYXJIaWdobGlnaHRTaGlwUHJldmlldygpO1xuICAgICAgY29uc3QgW2N1cnJlbnRTaGlwXSA9IGdhbWUucGxheWVyLnNoaXBzVG9QbGFjZTtcbiAgICAgIGlmICghY3VycmVudFNoaXAgfHwgIWUudGFyZ2V0LmRhdGFzZXQuY29vcmRzKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGNvb3JkcyA9IEpTT04ucGFyc2UoZS50YXJnZXQuZGF0YXNldC5jb29yZHMpO1xuXG4gICAgICBjb25zdCBpc1ZhbGlkU2hpcFBsYWNlbWVudCA9IGdhbWUucGxheWVyLmdhbWVib2FyZC5jYW5QbGFjZVNoaXAoXG4gICAgICAgIGN1cnJlbnRTaGlwLFxuICAgICAgICBjb29yZHMsXG4gICAgICAgIHNoaXBPcmllbnRhdGlvblN0YXRlXG4gICAgICApO1xuICAgICAgY29uc3QgY2VsbFZhbGlkaXR5TmFtZSA9IGlzVmFsaWRTaGlwUGxhY2VtZW50ID8gXCJ2YWxpZFwiIDogXCJpbnZhbGlkXCI7XG4gICAgICBoaWdobGlnaHRTaGlwKFxuICAgICAgICBjb29yZHMsXG4gICAgICAgIGN1cnJlbnRTaGlwLFxuICAgICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZSxcbiAgICAgICAgXCIuc2V0dXAtYm9hcmRcIixcbiAgICAgICAgY2VsbFZhbGlkaXR5TmFtZVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByYW5kb21pemVTaGlwcygpIHtcbiAgICAgIGdhbWUucGxheWVyLnJlc2V0U2hpcHNQbGFjZWQoKTtcbiAgICAgIGdhbWUucGxheWVyLnJhbmRvbWl6ZVNoaXBzKCk7XG4gICAgICBjbGVhckhpZ2hsaWdodFNoaXAoKTtcbiAgICAgIHN0YXJ0R2FtZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XG5cbiAgICAgIGNvbnN0IHsgc2hpcHMgfSA9IGdhbWUucGxheWVyLmdhbWVib2FyZDtcbiAgICAgIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgaGlnaGxpZ2h0U2hpcChcbiAgICAgICAgICBzaGlwLmNvb3JkcyxcbiAgICAgICAgICBzaGlwLFxuICAgICAgICAgIHNoaXAub3JpZW50YXRpb24sXG4gICAgICAgICAgXCIuc2V0dXAtYm9hcmRcIixcbiAgICAgICAgICBcInNoaXBcIlxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgICBzZXR1cEJvYXJkLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgICAgIHNldHVwQm9hcmRNZXNzYWdlLnRleHRDb250ZW50ID0gXCJSZWFkeSBmb3IgYmF0dGxlIVwiO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBsYWNlU2hpcChlKSB7XG4gICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYm9hcmRcIikpIHJldHVybjtcblxuICAgICAgY29uc3QgY29vcmRzID0gSlNPTi5wYXJzZShlLnRhcmdldC5kYXRhc2V0LmNvb3Jkcyk7XG4gICAgICBjb25zdCBbY3VycmVudFNoaXBdID0gZ2FtZS5wbGF5ZXIuc2hpcHNUb1BsYWNlO1xuXG4gICAgICBpZiAoXG4gICAgICAgICFnYW1lLnBsYXllci5nYW1lYm9hcmQuY2FuUGxhY2VTaGlwKFxuICAgICAgICAgIGN1cnJlbnRTaGlwLFxuICAgICAgICAgIGNvb3JkcyxcbiAgICAgICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZVxuICAgICAgICApXG4gICAgICApXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgY3VycmVudFNoaXAsXG4gICAgICAgIGNvb3JkcyxcbiAgICAgICAgc2hpcE9yaWVudGF0aW9uU3RhdGVcbiAgICAgICk7XG5cbiAgICAgIGhpZ2hsaWdodFNoaXAoXG4gICAgICAgIGNvb3JkcyxcbiAgICAgICAgY3VycmVudFNoaXAsXG4gICAgICAgIGN1cnJlbnRTaGlwLm9yaWVudGF0aW9uLFxuICAgICAgICBcIi5zZXR1cC1ib2FyZFwiLFxuICAgICAgICBcInNoaXBcIlxuICAgICAgKTtcbiAgICAgIGdhbWUucGxheWVyLnNoaXBzVG9QbGFjZS5zaGlmdCgpO1xuXG4gICAgICBjb25zdCBbbmV4dFNoaXBdID0gZ2FtZS5wbGF5ZXIuc2hpcHNUb1BsYWNlO1xuXG4gICAgICBpZiAoIWdhbWUucGxheWVyLnNoaXBzVG9QbGFjZS5sZW5ndGgpIHtcbiAgICAgICAgc2V0dXBCb2FyZE1lc3NhZ2UudGV4dENvbnRlbnQgPSBcIlJlYWR5IGZvciBiYXR0bGUhXCI7XG4gICAgICAgIHNldHVwQm9hcmQuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICAgICAgICBzdGFydEdhbWVCdG4uY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0dXBCb2FyZE1lc3NhZ2UudGV4dENvbnRlbnQgPSBgUGxhY2UgeW91ciAke25leHRTaGlwLm5hbWV9YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnZlcnRCb2FyZE9yaWVudGF0aW9uKCkge1xuICAgICAgc2hpcE9yaWVudGF0aW9uU3RhdGUgPVxuICAgICAgICBzaGlwT3JpZW50YXRpb25TdGF0ZSA9PT0gXCJob3Jpem9udGFsXCIgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIjtcbiAgICB9XG5cbiAgICBzZXR1cEJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgaGlnaGxpZ2h0U2hpcFByZXZpZXcpO1xuICAgIHNldHVwQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgY2xlYXJIaWdobGlnaHRTaGlwUHJldmlldyk7XG4gICAgc2V0dXBCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxhY2VTaGlwKTtcbiAgICByb3RhdGVTaGlwQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBpbnZlcnRCb2FyZE9yaWVudGF0aW9uKTtcbiAgICByYW5kb21pemVTaGlwc0J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmFuZG9taXplU2hpcHMpO1xuICAgIHJlc2V0Qm9hcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlc2V0Qm9hcmQpO1xuICAgIHN0YXJ0R2FtZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRHYW1lYm9hcmQoKSB7XG4gICAgY29uc3QgbW9kYWxPdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1vdmVybGF5XCIpO1xuICAgIGNvbnN0IGdhbWVPdmVyVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1vdmVyLXRleHRcIik7XG4gICAgY29uc3QgcGxheUFnYWluQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5LWFnYWluXCIpO1xuICAgIGNvbnN0IG5ld0dhbWVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm5ldy1nYW1lXCIpO1xuXG4gICAgZnVuY3Rpb24gaGlnaGxpZ2h0QXR0YWNrKGJvYXJkLCBbcm93LCBjb2xdLCBzZWxlY3Rvcikge1xuICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAke3NlbGVjdG9yfSBbZGF0YS1jb29yZHM9XCJbJHtyb3d9LCAke2NvbH1dXCJdYFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHNoaXAgPSBib2FyZFtyb3ddW2NvbF07XG4gICAgICBpZiAoIXNoaXApIHtcbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICAgIH0gZWxzZSBjZWxsLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG5cbiAgICAgIGlmIChzaGlwICYmIHNoaXAuaXNTdW5rKCkpIHtcbiAgICAgICAgaGlnaGxpZ2h0U2hpcChzaGlwLmNvb3Jkcywgc2hpcCwgc2hpcC5vcmllbnRhdGlvbiwgc2VsZWN0b3IsIFwic3Vua1wiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckdhbWVib2FyZENlbGxzSGlnaGxpZ2h0ZWQoKSB7XG4gICAgICBjbGVhckhpZ2hsaWdodGVkQ2VsbHMoXCIuZ2FtZWJvYXJkLWNvbnRhaW5lciAuY2VsbFwiLCBbXG4gICAgICAgIFwiaGl0XCIsXG4gICAgICAgIFwibWlzc1wiLFxuICAgICAgICBcInNoaXBcIixcbiAgICAgICAgXCJzdW5rXCIsXG4gICAgICBdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwbGF5QWdhaW4oKSB7XG4gICAgICBnYW1lLnJlc2V0R2FtZSgpO1xuXG4gICAgICBjbGVhckdhbWVib2FyZENlbGxzSGlnaGxpZ2h0ZWQoKTtcbiAgICAgIG1vZGFsT3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgICAgZ2FtZWJvYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICBzZXR1cEJvYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXR0YWNrKGUpIHtcbiAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJhaS1ib2FyZFwiKSB8fCBnYW1lLmlzR2FtZU92ZXIoKSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBbcm93LCBjb2xdID0gSlNPTi5wYXJzZShlLnRhcmdldC5kYXRhc2V0LmNvb3Jkcyk7XG5cbiAgICAgIGlmICghZ2FtZS5wbGF5ZXIuY29uc3RydWN0b3IuYXR0YWNrKFtyb3csIGNvbF0sIGdhbWUuYWkpKSByZXR1cm47XG5cbiAgICAgIGhpZ2hsaWdodEF0dGFjayhnYW1lLmFpLmdhbWVib2FyZC5ib2FyZCwgW3JvdywgY29sXSwgXCIuYWktYm9hcmRcIik7XG4gICAgICBpZiAoZ2FtZS5pc0dhbWVPdmVyKCkpIHtcbiAgICAgICAgbW9kYWxPdmVybGF5LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgIGdhbWVPdmVyVGV4dC50ZXh0Q29udGVudCA9IGBHYW1lIE92ZXIhIFlvdSB3b24hYDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBnYW1lLmFpLm1ha2VBaUF0dGFjayhnYW1lLnBsYXllcik7XG4gICAgICBoaWdobGlnaHRBdHRhY2soXG4gICAgICAgIGdhbWUucGxheWVyLmdhbWVib2FyZC5ib2FyZCxcbiAgICAgICAgZ2FtZS5wbGF5ZXIuZ2FtZWJvYXJkLmF0dGFja0xvZy5hdCgtMSksXG4gICAgICAgIFwiLnBsYXllci1ib2FyZFwiXG4gICAgICApO1xuXG4gICAgICBpZiAoZ2FtZS5pc0dhbWVPdmVyKCkpIHtcbiAgICAgICAgZ2FtZU92ZXJUZXh0LnRleHRDb250ZW50ID0gYEdhbWUgT3ZlciEgWW91IGxvc3QhYDtcblxuICAgICAgICBtb2RhbE92ZXJsYXkuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhaUJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhdHRhY2spO1xuICAgIHBsYXlBZ2FpbkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxheUFnYWluKTtcbiAgICBuZXdHYW1lQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBjcmVhdGVHYW1lYm9hcmRDZWxscyhwbGF5ZXJCb2FyZCk7XG4gICAgY3JlYXRlR2FtZWJvYXJkQ2VsbHMoYWlCb2FyZCk7XG4gICAgY3JlYXRlR2FtZWJvYXJkQ2VsbHMoc2V0dXBCb2FyZCk7XG5cbiAgICBpbml0SG9tZXBhZ2UoKTtcbiAgICBpbml0U2V0dXBCb2FyZCgpO1xuICAgIGluaXRHYW1lYm9hcmQoKTtcbiAgfVxuXG4gIHJldHVybiB7IGluaXRpYWxpemUgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVVSTtcbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoKTtcbiAgICB0aGlzLmFpID0gbmV3IFBsYXllcigpO1xuICB9XG5cbiAgcmVzZXRHYW1lKCkge1xuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcigpO1xuICAgIHRoaXMuYWkgPSBuZXcgUGxheWVyKCk7XG4gIH1cblxuICBpc0dhbWVPdmVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnBsYXllci5nYW1lYm9hcmQuYXJlQWxsU2hpcHNTdW5rKCkgfHxcbiAgICAgIHRoaXMuYWkuZ2FtZWJvYXJkLmFyZUFsbFNoaXBzU3VuaygpXG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IGlzQ29vcmRGb3VuZCBmcm9tIFwiLi4vdXRpbHNcIjtcbi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheSgxMCkuZmlsbChudWxsKSk7XG4gICAgdGhpcy5zaGlwcyA9IFtdO1xuICAgIHRoaXMuc2hvdHNNaXNzZWQgPSBbXTtcbiAgICB0aGlzLnNob3RzSGl0ID0gW107XG4gICAgdGhpcy5hdHRhY2tMb2cgPSBbXTtcbiAgfVxuXG4gIHN0YXRpYyBpc091dE9mQm91bmRzID0gKFtyb3csIGNvbF0pID0+XG4gICAgcm93IDwgMCB8fCByb3cgPiA5IHx8IGNvbCA8IDAgfHwgY29sID4gOTtcblxuICBzdGF0aWMgZ2V0RW5kUG9zaXRpb24gPSAoc2hpcCwgW3JvdywgY29sXSwgb3JpZW50YXRpb24pID0+XG4gICAgb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiXG4gICAgICA/IGNvbCArIHNoaXAubGVuZ3RoIC0gMVxuICAgICAgOiByb3cgKyBzaGlwLmxlbmd0aCAtIDE7XG5cbiAgZ2V0Q2VsbChbcm93LCBjb2xdKSB7XG4gICAgcmV0dXJuIHRoaXMuYm9hcmRbcm93XVtjb2xdO1xuICB9XG5cbiAgYXJlQWxsU2hpcHNTdW5rID0gKCkgPT4gdGhpcy5zaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSk7XG5cbiAgcmVzZXRHYW1lYm9hcmQoKSB7XG4gICAgdGhpcy5ib2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sICgpID0+IEFycmF5KDEwKS5maWxsKG51bGwpKTtcbiAgICB0aGlzLnNoaXBzID0gW107XG4gIH1cblxuICBpc0V2ZXJ5Q2VsbFZhbGlkKHNoaXAsIFtyb3csIGNvbF0sIG9yaWVudGF0aW9uKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd11bY29sICsgaV0gPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmJvYXJkW3JvdyArIGldW2NvbF0gPT09IG51bGwpIGNvbnRpbnVlO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY2FuUGxhY2VTaGlwKHNoaXAsIFtyb3csIGNvbF0sIG9yaWVudGF0aW9uKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICFHYW1lYm9hcmQuaXNPdXRPZkJvdW5kcyhbcm93LCBjb2xdKSAmJlxuICAgICAgR2FtZWJvYXJkLmdldEVuZFBvc2l0aW9uKHNoaXAsIFtyb3csIGNvbF0sIG9yaWVudGF0aW9uKSA8IDEwICYmXG4gICAgICB0aGlzLmlzRXZlcnlDZWxsVmFsaWQoc2hpcCwgW3JvdywgY29sXSwgb3JpZW50YXRpb24pXG4gICAgKTtcbiAgfVxuXG4gIHBsYWNlU2hpcChzaGlwLCBbcm93LCBjb2xdLCBvcmllbnRhdGlvbikge1xuICAgIGlmICghdGhpcy5jYW5QbGFjZVNoaXAoc2hpcCwgW3JvdywgY29sXSwgb3JpZW50YXRpb24pKSByZXR1cm47XG5cbiAgICBzaGlwLmNvb3JkcyA9IFtyb3csIGNvbF07XG4gICAgc2hpcC5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICAgIHNoaXAuaWQgPSB0aGlzLnNoaXBzLmxlbmd0aDtcbiAgICB0aGlzLnNoaXBzLnB1c2goc2hpcCk7XG5cbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBzaGlwLmxlbmd0aCkge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICB0aGlzLmJvYXJkW3Jvd11bY29sICsgaV0gPSBzaGlwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ib2FyZFtyb3cgKyBpXVtjb2xdID0gc2hpcDtcbiAgICAgIH1cbiAgICAgIGkgKz0gMTtcbiAgICB9XG4gIH1cblxuICByZWNlaXZlQXR0YWNrKFtyb3csIGNvbF0pIHtcbiAgICBpZiAoXG4gICAgICBHYW1lYm9hcmQuaXNPdXRPZkJvdW5kcyhbcm93LCBjb2xdKSB8fFxuICAgICAgKHRoaXMuYm9hcmRbcm93XVtjb2xdICYmIHRoaXMuYm9hcmRbcm93XVtjb2xdLmlzU3VuaygpKSB8fFxuICAgICAgaXNDb29yZEZvdW5kKHRoaXMuYXR0YWNrTG9nLCBbcm93LCBjb2xdKVxuICAgIClcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHRoaXMuYXR0YWNrTG9nLnB1c2goW3JvdywgY29sXSk7XG5cbiAgICBpZiAoIXRoaXMuYm9hcmRbcm93XVtjb2xdKSB7XG4gICAgICB0aGlzLnNob3RzTWlzc2VkLnB1c2goW3JvdywgY29sXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2xdLmhpdCgpO1xuICAgICAgdGhpcy5zaG90c0hpdC5wdXNoKFtyb3csIGNvbF0pO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL0dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vU2hpcFwiO1xuaW1wb3J0IGlzQ29vcmRGb3VuZCBmcm9tIFwiLi4vdXRpbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5nYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgdGhpcy5jYXJyaWVyID0gbmV3IFNoaXAoXCJjYXJyaWVyXCIsIDUpO1xuICAgIHRoaXMuYmF0dGxlc2hpcCA9IG5ldyBTaGlwKFwiYmF0dGxlc2hpcFwiLCA0KTtcbiAgICB0aGlzLmNydWlzZXIgPSBuZXcgU2hpcChcImNydWlzZXJcIiwgMyk7XG4gICAgdGhpcy5zdWJtYXJpbmUgPSBuZXcgU2hpcChcInN1Ym1hcmluZVwiLCAzKTtcbiAgICB0aGlzLmRlc3Ryb3llciA9IG5ldyBTaGlwKFwiZGVzdHJveWVyXCIsIDIpO1xuICAgIHRoaXMuc2hpcHNUb1BsYWNlID0gW1xuICAgICAgLy8gbWF5YmUgcmVmYWN0b3IgdGhpcyBsb2dpY1xuICAgICAgdGhpcy5jYXJyaWVyLFxuICAgICAgdGhpcy5iYXR0bGVzaGlwLFxuICAgICAgdGhpcy5jcnVpc2VyLFxuICAgICAgdGhpcy5zdWJtYXJpbmUsXG4gICAgICB0aGlzLmRlc3Ryb3llcixcbiAgICBdO1xuICAgIHRoaXMuYWlJbml0aWFsSGl0Q29vcmQgPSBudWxsO1xuICAgIHRoaXMuYWlTaGlwT3JpZW50YXRpb25UcmFja2VyID0gbnVsbDtcbiAgICB0aGlzLmFpQ29vcmRUcmFja2VyID0gbnVsbDtcbiAgfVxuXG4gIHN0YXRpYyBnZXRSYW5kb21JbnQgPSAobWF4KSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuXG4gIHN0YXRpYyBnZXRSYW5kb21PcmllbnRhdGlvbiA9ICgpID0+XG4gICAgUGxheWVyLmdldFJhbmRvbUludCgyKSA9PT0gMCA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuXG4gIHN0YXRpYyBnZXRSYW5kb21WYWxpZENvb3JkID0gKHZhbGlkQ29vcmRzKSA9PlxuICAgIHZhbGlkQ29vcmRzW1BsYXllci5nZXRSYW5kb21JbnQodmFsaWRDb29yZHMubGVuZ3RoKV07XG5cbiAgcmVzZXRTaGlwc1BsYWNlZCgpIHtcbiAgICB0aGlzLnNoaXBzVG9QbGFjZSA9IFtcbiAgICAgIHRoaXMuY2FycmllcixcbiAgICAgIHRoaXMuYmF0dGxlc2hpcCxcbiAgICAgIHRoaXMuY3J1aXNlcixcbiAgICAgIHRoaXMuc3VibWFyaW5lLFxuICAgICAgdGhpcy5kZXN0cm95ZXIsXG4gICAgXTtcbiAgfVxuXG4gIHJhbmRvbWl6ZVNoaXBzKCkge1xuICAgIHRoaXMuZ2FtZWJvYXJkLnJlc2V0R2FtZWJvYXJkKCk7XG5cbiAgICB0aGlzLnNoaXBzVG9QbGFjZS5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBjb25zdCB2YWxpZENvb3JkcyA9IFtdO1xuICAgICAgY29uc3QgcmFuZG9tT3JpZW50YXRpb24gPSBQbGF5ZXIuZ2V0UmFuZG9tT3JpZW50YXRpb24oKTtcbiAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3cgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sICs9IDEpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmdhbWVib2FyZC5jYW5QbGFjZVNoaXAoc2hpcCwgW3JvdywgY29sXSwgcmFuZG9tT3JpZW50YXRpb24pXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB2YWxpZENvb3Jkcy5wdXNoKFtyb3csIGNvbF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBbcmFuZG9tWCwgcmFuZG9tWV0gPSBQbGF5ZXIuZ2V0UmFuZG9tVmFsaWRDb29yZCh2YWxpZENvb3Jkcyk7XG4gICAgICB0aGlzLmdhbWVib2FyZC5wbGFjZVNoaXAoc2hpcCwgW3JhbmRvbVgsIHJhbmRvbVldLCByYW5kb21PcmllbnRhdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0VmFsaWRDb29yZHMoZW5lbXkpIHtcbiAgICBjb25zdCB2YWxpZENvb3JkcyA9IFtdO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3cgKz0gMSkge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCArPSAxKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhaXNDb29yZEZvdW5kKGVuZW15LmdhbWVib2FyZC5zaG90c01pc3NlZCwgW3JvdywgY29sXSkgJiZcbiAgICAgICAgICAhaXNDb29yZEZvdW5kKGVuZW15LmdhbWVib2FyZC5zaG90c0hpdCwgW3JvdywgY29sXSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdmFsaWRDb29yZHMucHVzaChbcm93LCBjb2xdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWxpZENvb3JkcztcbiAgfVxuXG4gIHN0YXRpYyBhdHRhY2soW3JvdywgY29sXSwgZW5lbXkpIHtcbiAgICByZXR1cm4gZW5lbXkuZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soW3JvdywgY29sXSk7XG4gIH1cblxuICBzdGF0aWMgaXNIaXQoW3RhcmdldFJvdywgdGFyZ2V0Q29sXSwgcGxheWVyKSB7XG4gICAgcmV0dXJuIHBsYXllci5nYW1lYm9hcmQuc2hvdHNIaXQuc29tZShcbiAgICAgIChbcm93LCBjb2xdKSA9PiByb3cgPT09IHRhcmdldFJvdyAmJiBjb2wgPT09IHRhcmdldENvbFxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgZ2V0UmFuZG9tVmFsaWRDb29yZHMgPSAodmFsaWRDb29yZHMpID0+XG4gICAgdmFsaWRDb29yZHNbUGxheWVyLmdldFJhbmRvbUludCh2YWxpZENvb3Jkcy5sZW5ndGgpXTtcblxuICBnZXRBZGphY2VudENvb3Jkcyhbcm93LCBjb2xdKSB7XG4gICAgaWYgKHRoaXMuYWlTaGlwT3JpZW50YXRpb25UcmFja2VyID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgW3JvdywgY29sICsgMV0sXG4gICAgICAgIFtyb3csIGNvbCAtIDFdLFxuICAgICAgXTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5haVNoaXBPcmllbnRhdGlvblRyYWNrZXIgPT09IFwidmVydGljYWxcIilcbiAgICAgIHJldHVybiBbXG4gICAgICAgIFtyb3cgKyAxLCBjb2xdLFxuICAgICAgICBbcm93IC0gMSwgY29sXSxcbiAgICAgIF07XG5cbiAgICByZXR1cm4gW1xuICAgICAgW3JvdyArIDEsIGNvbF0sXG4gICAgICBbcm93IC0gMSwgY29sXSxcbiAgICAgIFtyb3csIGNvbCArIDFdLFxuICAgICAgW3JvdywgY29sIC0gMV0sXG4gICAgXTtcbiAgfVxuXG4gIGdldEFpT3JpZW50YXRpb25UcmFja2VyKHBsYXllcikge1xuICAgIGNvbnN0IFtjdXJyUm93XSA9IHBsYXllci5nYW1lYm9hcmQuc2hvdHNIaXQuYXQoLTEpO1xuICAgIGNvbnN0IFtpbml0Um93XSA9IHRoaXMuYWlJbml0aWFsSGl0Q29vcmQ7XG5cbiAgICByZXR1cm4gY3VyclJvdyA9PT0gaW5pdFJvdyA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuICB9XG5cbiAgdXBkYXRlQWlTdGF0ZShwbGF5ZXIpIHtcbiAgICBjb25zdCBbaW5pdFJvdywgaW5pdENvbF0gPSB0aGlzLmFpSW5pdGlhbEhpdENvb3JkO1xuICAgIGNvbnN0IG9yaWdpbmFsU2hpcCA9IHBsYXllci5nYW1lYm9hcmQuYm9hcmRbaW5pdFJvd11baW5pdENvbF07XG4gICAgY29uc3QgaXNTYW1lU2hpcCA9IHBsYXllci5nYW1lYm9hcmQuYm9hcmRbaW5pdFJvd11baW5pdENvbF07XG4gICAgLy8gaWYgaXMgZGlmZmVyZW50IHNoaXAgb3IgY2VsbCBpcyBudWxsIChkZWFkIGVuZClcbiAgICBpZiAob3JpZ2luYWxTaGlwICE9PSBpc1NhbWVTaGlwIHx8IGlzU2FtZVNoaXAgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuYWlDb29yZFRyYWNrZXIgPSBudWxsO1xuICAgIH1cbiAgICAvLyBpZiBoaXQgdHdpY2Ugb24gdGhlIHNhbWUgc2hpcCwgd2Uga25vdyB0aGUgb3JpZW50YXRpb24uIGFsc28gbWFrZSBzdXJlIHRoaXMuYWlTaGlwT3JpZW50YXRpb25UcmFja2VyIGlzbid0IHNldFxuICAgIGlmIChvcmlnaW5hbFNoaXAudGltZXNIaXQgPT09IDIgJiYgdGhpcy5haVNoaXBPcmllbnRhdGlvblRyYWNrZXIgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuYWlTaGlwT3JpZW50YXRpb25UcmFja2VyID0gdGhpcy5nZXRBaU9yaWVudGF0aW9uVHJhY2tlcihwbGF5ZXIpO1xuICAgIH1cbiAgICAvLyByZXNldCBhaSBzdGF0ZSBiYWNrIHRvIHJhbmRvbVxuICAgIGlmIChvcmlnaW5hbFNoaXAuaXNTdW5rKCkpIHtcbiAgICAgIHRoaXMuYWlJbml0aWFsSGl0Q29vcmQgPSBudWxsO1xuICAgICAgdGhpcy5haUNvb3JkVHJhY2tlciA9IG51bGw7XG4gICAgICB0aGlzLmFpU2hpcE9yaWVudGF0aW9uVHJhY2tlciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGZpbHRlckludmFsaWRDb29yZHMoY29vcmQsIHBsYXllcikge1xuICAgIGNvbnN0IGlzQWxyZWFkeUF0dGFja2VkID0gaXNDb29yZEZvdW5kKHBsYXllci5nYW1lYm9hcmQuYXR0YWNrTG9nLCBjb29yZCk7XG4gICAgcmV0dXJuICFHYW1lYm9hcmQuaXNPdXRPZkJvdW5kcyhjb29yZCkgJiYgIWlzQWxyZWFkeUF0dGFja2VkO1xuICB9XG5cbiAgZ2V0VmFsaWRBZGphY2VudENvb3JkcyhwbGF5ZXIpIHtcbiAgICBsZXQgYWRqYWNlbnRDb29yZHM7XG4gICAgY29uc3QgbGFzdEF0dGFjayA9IHBsYXllci5nYW1lYm9hcmQuYXR0YWNrTG9nLmF0KC0xKTtcbiAgICBjb25zdCBpc0xhc3RBdHRhY2tIaXQgPSBQbGF5ZXIuaXNIaXQobGFzdEF0dGFjaywgcGxheWVyKTtcbiAgICBpZiAoIWlzTGFzdEF0dGFja0hpdCkge1xuICAgICAgYWRqYWNlbnRDb29yZHMgPSB0aGlzLmdldEFkamFjZW50Q29vcmRzKHRoaXMuYWlJbml0aWFsSGl0Q29vcmQpLmZpbHRlcihcbiAgICAgICAgKGNvb3JkKSA9PiBQbGF5ZXIuZmlsdGVySW52YWxpZENvb3Jkcyhjb29yZCwgcGxheWVyKVxuICAgICAgKTtcbiAgICAgIHRoaXMuYWlDb29yZFRyYWNrZXIgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFpQ29vcmRUcmFja2VyID0gcGxheWVyLmdhbWVib2FyZC5zaG90c0hpdC5hdCgtMSk7XG4gICAgICBhZGphY2VudENvb3JkcyA9IHRoaXMuZ2V0QWRqYWNlbnRDb29yZHModGhpcy5haUNvb3JkVHJhY2tlcikuZmlsdGVyKFxuICAgICAgICAoY29vcmQpID0+IFBsYXllci5maWx0ZXJJbnZhbGlkQ29vcmRzKGNvb3JkLCBwbGF5ZXIpXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghYWRqYWNlbnRDb29yZHMubGVuZ3RoKSB7XG4gICAgICBhZGphY2VudENvb3JkcyA9IHRoaXMuZ2V0QWRqYWNlbnRDb29yZHModGhpcy5haUluaXRpYWxIaXRDb29yZCk7XG4gICAgICB0aGlzLmFpQ29vcmRUcmFja2VyID0gbnVsbDtcbiAgICAgIGFkamFjZW50Q29vcmRzID0gYWRqYWNlbnRDb29yZHMuZmlsdGVyKChjb29yZCkgPT5cbiAgICAgICAgUGxheWVyLmZpbHRlckludmFsaWRDb29yZHMoY29vcmQsIHBsYXllcilcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFkamFjZW50Q29vcmRzO1xuICB9XG5cbiAgbWFrZUFkamFjZW50QXR0YWNrKHBsYXllcikge1xuICAgIGNvbnN0IGNvb3JkcyA9IFBsYXllci5nZXRSYW5kb21WYWxpZENvb3JkcyhcbiAgICAgIHRoaXMuZ2V0VmFsaWRBZGphY2VudENvb3JkcyhwbGF5ZXIpXG4gICAgKTtcblxuICAgIHBsYXllci5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZHMpO1xuICAgIHRoaXMudXBkYXRlQWlTdGF0ZShwbGF5ZXIpO1xuICB9XG5cbiAgbWFrZUFpQXR0YWNrKHBsYXllcikge1xuICAgIGlmICh0aGlzLmFpSW5pdGlhbEhpdENvb3JkKSB7XG4gICAgICB0aGlzLm1ha2VBZGphY2VudEF0dGFjayhwbGF5ZXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJhbmRvbVZhbGlkQ29vcmQgPSBQbGF5ZXIuZ2V0UmFuZG9tVmFsaWRDb29yZChcbiAgICAgIFBsYXllci5nZXRWYWxpZENvb3JkcyhwbGF5ZXIpXG4gICAgKTtcblxuICAgIHBsYXllci5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhyYW5kb21WYWxpZENvb3JkKTtcbiAgICBpZiAoUGxheWVyLmlzSGl0KHJhbmRvbVZhbGlkQ29vcmQsIHBsYXllcikpIHtcbiAgICAgIHRoaXMuYWlJbml0aWFsSGl0Q29vcmQgPSByYW5kb21WYWxpZENvb3JkO1xuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGxlbmd0aCkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy50aW1lc0hpdCA9IDA7XG4gICAgdGhpcy5jb29yZHMgPSBudWxsO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIGlmICh0aGlzLnRpbWVzSGl0ICE9PSB0aGlzLmxlbmd0aCkgdGhpcy50aW1lc0hpdCArPSAxO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aCA9PT0gdGhpcy50aW1lc0hpdDtcbiAgfVxufVxuIiwiZnVuY3Rpb24gaXNDb29yZEZvdW5kKGFycmF5LCBbdGFyZ2V0Um93ID0gbnVsbCwgdGFyZ2V0Q29sID0gbnVsbF0gPSBbXSkge1xuICBpZiAodGFyZ2V0Um93ID09PSBudWxsIHx8IHRhcmdldENvbCA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBhcnJheS5zb21lKChbcm93LCBjb2xdKSA9PiByb3cgPT09IHRhcmdldFJvdyAmJiBjb2wgPT09IHRhcmdldENvbCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzQ29vcmRGb3VuZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGdhbWVVSSBmcm9tIFwiLi9tb2R1bGVzL2RvbS9nYW1lVUlcIjtcblxuZ2FtZVVJLmluaXRpYWxpemUoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==