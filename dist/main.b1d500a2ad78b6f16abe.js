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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _game_logic_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game-logic/player */ \"./src/game-logic/player.js\");\n/* eslint-disable no-param-reassign */\n\n\nconst Dom = (() => {\n  const player = new _game_logic_player__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n  const ai = new _game_logic_player__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n  const playerBoard = document.querySelector(\".player-board\");\n  const aiBoard = document.querySelector(\".ai-board\");\n  const placeShipsPage = document.querySelector(\".place-ships-container\");\n  const placeShipsBoard = document.querySelector(\".place-ships-board\");\n\n  const placeShipsContainer = document.querySelector(\".place-ships-container\");\n  const playerNameInput = document.querySelector(\"#player-name-input\");\n  const playerBoardName = document.querySelector(\n    \".player-board-container .board-name\"\n  );\n\n  const battleshipBoard = document.querySelector(\".battleship-gameboard\");\n\n  function initGameboardCells(board) {\n    for (let i = 0; i < 100; i += 1) {\n      const cell = document.createElement(\"button\");\n      cell.classList.add(\"cell\");\n      board.appendChild(cell);\n    }\n  }\n\n  function initGameboardCellCoords(board) {\n    let i = 0;\n    for (let row = 0; row < 10; row += 1) {\n      for (let col = 0; col < 10; col += 1) {\n        board.children[i].dataset.coords = `[${row}, ${col}]`;\n        i += 1;\n      }\n    }\n  }\n\n  function initStartGameHomepage() {\n    const startGameContainer = document.querySelector(\".start-game-container\");\n    const startGameHomepage = document.querySelector(\".homepage-start-game\");\n    const placeShipsGameboard = document.querySelector(\n      \".place-ships-gameboard\"\n    );\n    startGameHomepage.addEventListener(\"click\", () => {\n      startGameContainer.classList.remove(\"active\");\n      placeShipsPage.classList.add(\"active\");\n      placeShipsGameboard.classList.add(\"active\");\n    });\n  }\n\n  function initPlaceShipsPage() {\n    const rotateShip = document.querySelector(\".rotate-ship\");\n    const placeShipsHint = document.querySelector(\".place-ships-hint\");\n    const randomizeShipsButton = document.querySelector(\".randomize-ships\");\n    const resetBoard = document.querySelector(\".reset-board\");\n    const startGame = document.querySelector(\".place-ships-start-game\");\n    let currentShipOrientation = \"horizontal\";\n\n    function highlightShip(coords, ship, orientation, selector, className) {\n      const [row, col] = coords;\n      for (let i = 0; i < ship.length; i += 1) {\n        let [x, y] = [row, col];\n\n        if (orientation === \"horizontal\") y += i;\n        else x += i;\n\n        const shipCell = document.querySelector(\n          `${selector} [data-coords=\"[${x}, ${y}]\"]`\n        );\n\n        if (shipCell) shipCell.classList.add(className);\n      }\n    }\n\n    function clearHighlightShip() {\n      const highlightedCells = document.querySelectorAll(\n        \".place-ships-board .ship\"\n      );\n      highlightedCells.forEach((highlightedCell) =>\n        highlightedCell.classList.remove(\"ship\")\n      );\n    }\n\n    function startGameHandler() {\n      if (player.gameboard.ships.length !== 5) return;\n\n      placeShipsContainer.classList.remove(\"active\");\n      battleshipBoard.classList.add(\"active\");\n      clearHighlightShip();\n      ai.placeAllShipsRandomly();\n\n      player.gameboard.ships.forEach((ship) => {\n        highlightShip(\n          ship.coords,\n          ship,\n          ship.orientation,\n          \".player-board\",\n          \"ship\"\n        );\n      });\n\n      playerBoardName.textContent = playerNameInput.value.trim()\n        ? playerNameInput.value.trim()\n        : \"Player\";\n\n      placeShipsBoard.classList.remove(\"disable\");\n      rotateShip.style.display = \"block\";\n      placeShipsHint.textContent = \"Place your carrier\";\n    }\n\n    function clearHighlightShipPreview() {\n      const isValidCell = document.querySelector(\".valid\");\n      const cellValidityName = isValidCell ? \"valid\" : \"invalid\";\n      const cellsHighlighted = isValidCell\n        ? document.querySelectorAll(\".valid\")\n        : document.querySelectorAll(\".invalid\");\n\n      cellsHighlighted.forEach((cell) =>\n        cell.classList.remove(cellValidityName)\n      );\n    }\n\n    function resetBoardHandler() {\n      player.restoreShipsToPlace();\n      player.gameboard.resetGameboard();\n      clearHighlightShip();\n      placeShipsBoard.classList.remove(\"disable\");\n      rotateShip.style.display = \"block\";\n      placeShipsHint.textContent = \"Place your carrier\";\n    }\n\n    function highlightShipPreview(e) {\n      clearHighlightShipPreview();\n      const [currentShip] = player.shipsToPlace;\n      if (!currentShip || !e.target.dataset.coords) return;\n\n      const coords = JSON.parse(e.target.dataset.coords);\n\n      const isValidShipPlacement = player.gameboard.canPlaceShip(\n        currentShip,\n        coords,\n        currentShipOrientation\n      );\n      const cellValidityName = isValidShipPlacement ? \"valid\" : \"invalid\";\n      highlightShip(\n        coords,\n        currentShip,\n        currentShipOrientation,\n        \".place-ships-board\",\n        cellValidityName\n      );\n    }\n\n    function randomizeShips() {\n      player.restoreShipsToPlace();\n      player.placeAllShipsRandomly();\n      clearHighlightShip();\n      rotateShip.style.display = \"block\";\n\n      const { ships } = player.gameboard;\n      ships.forEach((ship) => {\n        highlightShip(\n          ship.coords,\n          ship,\n          ship.orientation,\n          \".place-ships-board\",\n          \"ship\"\n        );\n      });\n      placeShipsBoard.classList.add(\"disable\");\n      placeShipsHint.textContent = \"\";\n      rotateShip.style.display = \"none\";\n    }\n\n    function placeShip(e) {\n      if (e.target.classList.contains(\"board\")) return;\n\n      const coords = JSON.parse(e.target.dataset.coords);\n      const [currentShip] = player.shipsToPlace;\n\n      if (\n        !player.gameboard.canPlaceShip(\n          currentShip,\n          coords,\n          currentShipOrientation\n        )\n      )\n        return;\n\n      player.gameboard.placeShip(currentShip, coords, currentShipOrientation);\n\n      highlightShip(\n        coords,\n        currentShip,\n        currentShip.orientation,\n        \".place-ships-board\",\n        \"ship\"\n      );\n      player.shipsToPlace.shift();\n\n      const [nextShip] = player.shipsToPlace;\n\n      if (!player.shipsToPlace.length) {\n        placeShipsHint.textContent = \"\";\n        placeShipsBoard.classList.add(\"disable\");\n        rotateShip.style.display = \"none\";\n      } else {\n        placeShipsHint.textContent = `Place your ${nextShip.name}`;\n      }\n    }\n\n    function invertBoardOrientation() {\n      currentShipOrientation =\n        currentShipOrientation === \"horizontal\" ? \"vertical\" : \"horizontal\";\n    }\n\n    placeShipsBoard.addEventListener(\"mouseover\", highlightShipPreview);\n    placeShipsBoard.addEventListener(\"mouseleave\", clearHighlightShipPreview);\n    placeShipsBoard.addEventListener(\"click\", placeShip);\n    rotateShip.addEventListener(\"click\", invertBoardOrientation);\n    randomizeShipsButton.addEventListener(\"click\", randomizeShips);\n    resetBoard.addEventListener(\"click\", resetBoardHandler);\n    startGame.addEventListener(\"click\", startGameHandler);\n  }\n\n  function initBattleshipPage() {\n    const modalOverlay = document.querySelector(\".modal-overlay\");\n    const gameOverText = document.querySelector(\".game-over-text\");\n    const playAgain = document.querySelector(\".play-again\");\n    const newGame = document.querySelector(\".new-game\");\n\n    function highlightAttack(board, [row, col], selector) {\n      const cell = document.querySelector(\n        `${selector} [data-coords=\"[${row}, ${col}]\"]`\n      );\n\n      cell.classList.add(board[row][col]);\n    }\n\n    function clearGameboardCellsHighlighted() {\n      const cells = document.querySelectorAll(\".cell\");\n      cells.forEach((cell) => {\n        cell.style.backgroundColor = \"\";\n        cell.classList.remove(\"ship\");\n        cell.classList.remove(\"hit\");\n        cell.classList.remove(\"miss\");\n      });\n    }\n\n    function playAgainHandler() {\n      player.gameboard.resetGameboard();\n      ai.gameboard.resetGameboard();\n      player.gameboard.ships = [];\n      ai.gameboard.ships = [];\n      player.restoreShipsToPlace();\n      ai.restoreShipsToPlace();\n\n      clearGameboardCellsHighlighted();\n      modalOverlay.classList.remove(\"active\");\n      battleshipBoard.classList.remove(\"active\");\n      placeShipsContainer.classList.add(\"active\");\n    }\n\n    function attack(e) {\n      if (\n        e.target.classList.contains(\"ai-board\") ||\n        player.gameboard.areAllShipsSunk() ||\n        ai.gameboard.areAllShipsSunk()\n      )\n        return;\n\n      const [row, col] = JSON.parse(e.target.dataset.coords);\n\n      if (!_game_logic_player__WEBPACK_IMPORTED_MODULE_0__[\"default\"].attack([row, col], ai)) return;\n\n      highlightAttack(ai.gameboard.board, [row, col], \".ai-board\");\n      if (ai.gameboard.areAllShipsSunk()) {\n        modalOverlay.classList.add(\"active\");\n        gameOverText.textContent = `Game Over! You won!`;\n        return;\n      }\n\n      _game_logic_player__WEBPACK_IMPORTED_MODULE_0__[\"default\"].makeComputerAttack(player);\n      highlightAttack(\n        player.gameboard.board,\n        player.gameboard.latestReceivedAttack,\n        \".player-board\"\n      );\n\n      if (player.gameboard.areAllShipsSunk()) {\n        gameOverText.textContent = `Game Over! You lost!`;\n\n        modalOverlay.classList.add(\"active\");\n      }\n    }\n\n    aiBoard.addEventListener(\"click\", attack);\n    playAgain.addEventListener(\"click\", playAgainHandler);\n    newGame.addEventListener(\"click\", () => window.location.reload());\n  }\n\n  function initialize() {\n    initGameboardCells(playerBoard);\n    initGameboardCells(aiBoard);\n    initGameboardCells(placeShipsBoard);\n\n    initGameboardCellCoords(playerBoard);\n    initGameboardCellCoords(aiBoard);\n    initGameboardCellCoords(placeShipsBoard);\n\n    initStartGameHomepage();\n    initPlaceShipsPage();\n    initBattleshipPage();\n  }\n\n  return { initialize };\n})();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dom);\n\n\n//# sourceURL=webpack://battleship/./src/dom/dom.js?");

/***/ }),

/***/ "./src/game-logic/gameboard.js":
/*!*************************************!*\
  !*** ./src/game-logic/gameboard.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Gameboard)\n/* harmony export */ });\n/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ \"./src/game-logic/ship.js\");\n/* eslint-disable no-param-reassign */\n\n\nclass Gameboard {\n  constructor() {\n    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));\n    this.ships = [];\n  }\n\n  static isOutOfBounds = ([row, col]) =>\n    row < 0 || row > 9 || col < 0 || col > 9;\n\n  static getEndPosition = (ship, [row, col], orientation) =>\n    orientation === \"horizontal\"\n      ? col + ship.length - 1\n      : row + ship.length - 1;\n\n  areAllShipsSunk = () => this.ships.every((ship) => ship.isSunk());\n\n  isHit = ([row, col]) => this.board[row][col] instanceof _ship__WEBPACK_IMPORTED_MODULE_0__[\"default\"];\n\n  resetGameboard() {\n    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));\n    this.ships = [];\n  }\n\n  isEveryCellValid(ship, [row, col], orientation) {\n    for (let i = 0; i < ship.length; i += 1) {\n      if (orientation === \"horizontal\") {\n        if (this.board[row][col + i] === null) continue;\n      } else if (this.board[row + i][col] === null) continue;\n\n      return false;\n    }\n    return true;\n  }\n\n  canPlaceShip(ship, [row, col], orientation) {\n    return (\n      !Gameboard.isOutOfBounds([row, col]) &&\n      Gameboard.getEndPosition(ship, [row, col], orientation) < 10 &&\n      this.isEveryCellValid(ship, [row, col], orientation)\n    );\n  }\n\n  placeShip(ship, [row, col], orientation) {\n    if (!this.canPlaceShip(ship, [row, col], orientation)) return;\n\n    ship.coords = [row, col];\n    ship.orientation = orientation;\n    this.ships.push(ship);\n\n    let i = 0;\n    while (i < ship.length) {\n      if (orientation === \"horizontal\") {\n        this.board[row][col + i] = ship;\n      } else {\n        this.board[row + i][col] = ship;\n      }\n      i += 1;\n    }\n  }\n\n  receiveAttack([row, col]) {\n    if (\n      Gameboard.isOutOfBounds([row, col]) ||\n      this.board[row][col] === \"hit\" ||\n      this.board[row][col] === \"miss\"\n    )\n      return false;\n\n    this.latestReceivedAttack = [row, col];\n\n    if (!this.isHit([row, col])) {\n      this.board[row][col] = \"miss\";\n    } else {\n      this.board[row][col].hit();\n      this.board[row][col] = \"hit\";\n    }\n\n    return true;\n  }\n}\n\n\n//# sourceURL=webpack://battleship/./src/game-logic/gameboard.js?");

/***/ }),

/***/ "./src/game-logic/player.js":
/*!**********************************!*\
  !*** ./src/game-logic/player.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ \"./src/game-logic/gameboard.js\");\n/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ \"./src/game-logic/ship.js\");\n\n\n\nclass Player {\n  constructor() {\n    this.gameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.carrier = new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\"carrier\", 5);\n    this.battleship = new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\"battleship\", 4);\n    this.cruiser = new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\"cruiser\", 3);\n    this.submarine = new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\"submarine\", 3);\n    this.destroyer = new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\"destroyer\", 2);\n    this.shipsToPlace = [\n      this.carrier,\n      this.battleship,\n      this.cruiser,\n      this.submarine,\n      this.destroyer,\n    ];\n  }\n\n  static getRandomInt = (max) => Math.floor(Math.random() * max);\n\n  /* Randomize array in-place using Durstenfeld shuffle algorithm */\n  static shuffleArray(array) {\n    const newArray = [...array];\n    for (let i = array.length - 1; i > 0; i -= 1) {\n      const j = Math.floor(Math.random() * (i + 1));\n      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];\n    }\n\n    return newArray;\n  }\n\n  static getRandomOrientation = () =>\n    Player.getRandomInt(2) === 0 ? \"horizontal\" : \"vertical\";\n\n  static getRandomValidCoords = (validCoords) =>\n    validCoords[Player.getRandomInt(validCoords.length)];\n\n  restoreShipsToPlace() {\n    this.shipsToPlace = [\n      new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\"carrier\", 5),\n      new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\"battleship\", 4),\n      new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\"cruiser\", 3),\n      new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\"submarine\", 3),\n      new _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\"destroyer\", 2),\n    ];\n  }\n\n  placeAllShipsRandomly() {\n    this.gameboard.resetGameboard();\n\n    const randomShips = Player.shuffleArray(this.shipsToPlace);\n    randomShips.forEach((ship) => {\n      const validCoords = [];\n      const randomOrientation = Player.getRandomOrientation();\n      for (let row = 0; row < 10; row += 1) {\n        for (let col = 0; col < 10; col += 1) {\n          if (\n            this.gameboard.canPlaceShip(ship, [row, col], randomOrientation)\n          ) {\n            validCoords.push([row, col]);\n          }\n        }\n      }\n\n      const [randomX, randomY] = Player.getRandomValidCoords(validCoords);\n      this.gameboard.placeShip(ship, [randomX, randomY], randomOrientation);\n    });\n  }\n\n  static getValidCoords(enemy) {\n    const enemyBoard = enemy.gameboard.board;\n    const validCoords = [];\n    for (let row = 0; row < 10; row += 1) {\n      for (let col = 0; col < 10; col += 1) {\n        if (\n          enemyBoard[row][col] === null ||\n          enemyBoard[row][col] instanceof _ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\n        ) {\n          validCoords.push([row, col]);\n        }\n      }\n    }\n\n    return validCoords;\n  }\n\n  static attack([row, col], enemy) {\n    return enemy.gameboard.receiveAttack([row, col]);\n  }\n\n  static makeComputerAttack(player) {\n    const randomValidCoord = Player.getRandomValidCoords(\n      Player.getValidCoords(player)\n    );\n\n    return player.gameboard.receiveAttack(randomValidCoord);\n  }\n}\n\n\n//# sourceURL=webpack://battleship/./src/game-logic/player.js?");

/***/ }),

/***/ "./src/game-logic/ship.js":
/*!********************************!*\
  !*** ./src/game-logic/ship.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Ship)\n/* harmony export */ });\nclass Ship {\n  constructor(name, length) {\n    this.name = name;\n    this.length = length;\n    this.timesHit = 0;\n    this.coords = null;\n  }\n\n  hit() {\n    if (this.timesHit !== this.length) this.timesHit += 1;\n  }\n\n  isSunk() {\n    return this.length === this.timesHit;\n  }\n}\n\n\n//# sourceURL=webpack://battleship/./src/game-logic/ship.js?");

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