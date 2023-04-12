/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dom/dom.js":
/*!************************!*\
  !*** ./src/dom/dom.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _game_logic_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game-logic/player */ \"./src/game-logic/player.js\");\n/* eslint-disable no-param-reassign */\n\n\nconst Dom = (() => {\n  const player = new _game_logic_player__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n  // const ai = new Player();\n  const playerBoard = document.querySelector(\".player-board\");\n  const aiBoard = document.querySelector(\".ai-board\");\n  const placeShipsBoard = document.querySelector(\".place-ships-board\");\n\n  // const shipToPlace = document.querySelector(\".place-ship-hint\");\n  // const rotateShip = document.querySelector(\".rotate-ship\");\n  // const randomizeShips = document.querySelector(\".randomize-ships\");\n  // const resetBoard = document.querySelector(\".reset-board\");\n  // const startGame = document.querySelector(\".place-ships-start-game\");\n\n  function generateGameboardCells(board) {\n    for (let i = 0; i < 100; i += 1) {\n      const cell = document.createElement(\"button\");\n      cell.classList.add(\"cell\");\n      board.appendChild(cell);\n    }\n  }\n\n  function generateGameboardCellCoords(board) {\n    let i = 0;\n    for (let row = 0; row < 10; row += 1) {\n      for (let col = 0; col < 10; col += 1) {\n        board.children[i].dataset.coords = `[${row}, ${col}]`;\n        i += 1;\n      }\n    }\n  }\n\n  function clearHighlightShip() {\n    const isValidShipHighlighted = document.querySelector(\".valid\");\n    const cellValidityName = isValidShipHighlighted ? \"valid\" : \"invalid\";\n    const cellsHighlighted = isValidShipHighlighted\n      ? document.querySelectorAll(\".valid\")\n      : document.querySelectorAll(\".invalid\");\n\n    cellsHighlighted.forEach((cell) => cell.classList.remove(cellValidityName));\n  }\n\n  function removeHighlightOnMouseLeave() {\n    placeShipsBoard.addEventListener(\"mouseleave\", () => {\n      clearHighlightShip();\n    });\n  }\n\n  function highlightShip() {\n    [...placeShipsBoard.children].forEach((cell) =>\n      cell.addEventListener(\"mouseenter\", (e) => {\n        clearHighlightShip();\n        const [currentShip] = player.shipsToPlace;\n\n        const [row, col] = JSON.parse(e.target.dataset.coords);\n        const isValidShipPlacement = player.gameboard.canPlaceShip(\n          currentShip,\n          [row, col]\n        );\n        const cellValidityName = isValidShipPlacement ? \"valid\" : \"invalid\";\n\n        for (let i = 0; i < currentShip.length; i += 1) {\n          let cellElement;\n          if (player.gameboard.isHorizontal()) {\n            if (player.gameboard.board[row][col + i] === null) {\n              cellElement = document.querySelector(\n                `.place-ships-board [data-coords=\"[${row}, ${col + i}]\"]`\n              );\n              cellElement.classList.add(cellValidityName);\n            }\n          } else if (player.gameboard.board[row + i][col] === null) {\n            cellElement = document.querySelector(\n              `.place-ships-board [data-coords=\"[${row + i}, ${col}]\"]`\n            );\n            cellElement.classList.add(cellValidityName);\n          }\n        }\n      })\n    );\n  }\n\n  function initStartGameHomepage() {\n    const startGameContainer = document.querySelector(\".start-game-container\");\n    const startGameHomepage = document.querySelector(\".homepage-start-game\");\n    const placeShipsPage = document.querySelector(\".place-ships-container\");\n    const placeShipsGameboard = document.querySelector(\n      \".place-ships-gameboard\"\n    );\n    startGameHomepage.addEventListener(\"click\", () => {\n      startGameContainer.classList.remove(\"active\");\n      placeShipsPage.classList.add(\"active\");\n      placeShipsGameboard.classList.add(\"active\");\n    });\n  }\n\n  function initialize() {\n    initStartGameHomepage();\n    generateGameboardCells(playerBoard);\n    generateGameboardCells(aiBoard);\n    generateGameboardCells(placeShipsBoard);\n\n    generateGameboardCellCoords(playerBoard);\n    generateGameboardCellCoords(aiBoard);\n    generateGameboardCellCoords(placeShipsBoard);\n    highlightShip();\n    removeHighlightOnMouseLeave();\n  }\n\n  return { initialize };\n})();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dom);\n\n\n//# sourceURL=webpack://battleship/./src/dom/dom.js?");

/***/ }),

/***/ "./src/game-logic/gameboard.js":
/*!*************************************!*\
  !*** ./src/game-logic/gameboard.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Gameboard)\n/* harmony export */ });\n/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ \"./src/game-logic/ship.js\");\n/* eslint-disable no-param-reassign */\n\n\nclass Gameboard {\n  constructor() {\n    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));\n    this.orientation = \"horizontal\";\n    this.ships = [];\n  }\n\n  static isOutOfBounds = ([row, col]) =>\n    row < 0 || row > 9 || col < 0 || col > 9;\n\n  isHorizontal = () => this.orientation === \"horizontal\";\n\n  areAllShipsSunk = () => this.ships.every((ship) => ship.isSunk());\n\n  getEndPosition = (ship, [row, col]) =>\n    this.isHorizontal() ? col : row + ship.length - 1;\n\n  isHit = ([row, col]) => this.board[row][col] instanceof _ship__WEBPACK_IMPORTED_MODULE_0__[\"default\"];\n\n  resetGameboard() {\n    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));\n    this.ships = [];\n    this.orientation = \"horizontal\";\n  }\n\n  isEveryCellValid(ship, [row, col]) {\n    for (let i = 0; i < ship.length; i += 1) {\n      if (this.isHorizontal()) {\n        if (this.board[row][col + i] === null) continue;\n      } else if (this.board[row + i][col] === null) continue;\n\n      return false;\n    }\n    return true;\n  }\n\n  canPlaceShip(ship, [row, col]) {\n    return (\n      !Gameboard.isOutOfBounds([row, col]) &&\n      this.getEndPosition(ship, [row, col]) < 10 &&\n      this.isEveryCellValid(ship, [row, col])\n    );\n  }\n\n  placeShip(ship, [row, col]) {\n    if (!this.canPlaceShip(ship, [row, col])) return;\n\n    let i = 0;\n    ship.coords = [row, col];\n    while (i < ship.length) {\n      if (this.isHorizontal()) {\n        this.board[row][col + i] = ship;\n      } else {\n        this.board[row + i][col] = ship;\n      }\n      i += 1;\n    }\n\n    this.ships.push(ship);\n  }\n\n  receiveAttack([row, col]) {\n    if (\n      Gameboard.isOutOfBounds([row, col]) ||\n      this.board[row][col] === \"hit\" ||\n      this.board[row][col] === \"miss\"\n    )\n      return false;\n\n    if (!this.isHit([row, col])) {\n      this.board[row][col] = \"miss\";\n      return false;\n    }\n\n    this.board[row][col].hit();\n    this.board[row][col] = \"hit\";\n\n    return true;\n  }\n}\n\n\n//# sourceURL=webpack://battleship/./src/game-logic/gameboard.js?");

/***/ }),

/***/ "./src/game-logic/player.js":
/*!**********************************!*\
  !*** ./src/game-logic/player.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ \"./src/game-logic/gameboard.js\");\n/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ \"./src/game-logic/ship.js\");\n\n\n\nclass Player {\n  constructor() {\n    this.gameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.carrier = new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](5);\n    this.battleship = new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](4);\n    this.cruiser = new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](3);\n    this.submarine = new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](3);\n    this.destroyer = new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](2);\n    this.shipsToPlace = [\n      this.carrier,\n      this.battleship,\n      this.cruiser,\n      this.submarine,\n      this.destroyer,\n    ];\n  }\n\n  static getRandomInt = (max) => Math.floor(Math.random() * max);\n\n  /* Randomize array in-place using Durstenfeld shuffle algorithm */\n  static shuffleArray(array) {\n    const newArray = [...array];\n    for (let i = array.length - 1; i > 0; i -= 1) {\n      const j = Math.floor(Math.random() * (i + 1));\n      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];\n    }\n\n    return newArray;\n  }\n\n  static getRandomOrientation = () =>\n    Player.getRandomInt(2) === 0 ? \"horizontal\" : \"vertical\";\n\n  static getRandomValidCoords = (validCoords) =>\n    validCoords[Player.getRandomInt(validCoords.length)];\n\n  placeAllShipsRandomly() {\n    const randomShips = Player.shuffleArray(this.shipsToPlace);\n\n    randomShips.forEach((ship) => {\n      this.gameboard.orientation = Player.getRandomOrientation();\n\n      const validCoords = [];\n      for (let row = 0; row < 10; row += 1) {\n        for (let col = 0; col < 10; col += 1) {\n          if (this.gameboard.canPlaceShip(ship, [row, col])) {\n            validCoords.push([row, col]);\n          }\n        }\n      }\n\n      const [randomX, randomY] = Player.getRandomValidCoords(validCoords);\n      this.gameboard.placeShip(ship, [randomX, randomY]);\n    });\n  }\n\n  static getValidCoords(enemy) {\n    const enemyBoard = enemy.gameboard.board;\n    const validCoords = [];\n    for (let row = 0; row < 10; row += 1) {\n      for (let col = 0; col < 10; col += 1) {\n        if (enemyBoard[row][col] === null) {\n          validCoords.push([row, col]);\n        }\n      }\n    }\n\n    return validCoords;\n  }\n\n  attack([row, col], enemy) {\n    enemy.gameboard.receiveAttack([row, col]);\n    Player.makeComputerAttack(this);\n  }\n\n  static makeComputerAttack(player) {\n    const randomValidCoord = Player.getRandomValidCoords(\n      Player.getValidCoords(player)\n    );\n\n    player.gameboard.receiveAttack(randomValidCoord);\n\n    return randomValidCoord;\n  }\n}\n\n\n//# sourceURL=webpack://battleship/./src/game-logic/player.js?");

/***/ }),

/***/ "./src/game-logic/ship.js":
/*!********************************!*\
  !*** ./src/game-logic/ship.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Ship)\n/* harmony export */ });\nclass Ship {\n  constructor(length) {\n    this.length = length;\n    this.timesHit = 0;\n    this.coords = null;\n  }\n\n  hit() {\n    if (this.timesHit !== this.length) this.timesHit += 1;\n  }\n\n  isSunk() {\n    return this.length === this.timesHit;\n  }\n}\n\n\n//# sourceURL=webpack://battleship/./src/game-logic/ship.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom/dom */ \"./src/dom/dom.js\");\n\n\n_dom_dom__WEBPACK_IMPORTED_MODULE_0__[\"default\"].initialize();\n\n\n//# sourceURL=webpack://battleship/./src/index.js?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;