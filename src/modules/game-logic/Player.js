import Gameboard from "./Gameboard";
import Ship from "./Ship";
import isCoordFound from "../utils";

export default class Player {
  constructor() {
    this.gameboard = new Gameboard();
    this.carrier = new Ship("carrier", 5);
    this.battleship = new Ship("battleship", 4);
    this.cruiser = new Ship("cruiser", 3);
    this.submarine = new Ship("submarine", 3);
    this.destroyer = new Ship("destroyer", 2);
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
          !isCoordFound(enemy.gameboard.shotsMissed, [row, col]) &&
          !isCoordFound(enemy.gameboard.shotsHit, [row, col])
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
    const isAlreadyAttacked = isCoordFound(player.gameboard.attackLog, coord);
    return !Gameboard.isOutOfBounds(coord) && !isAlreadyAttacked;
  }

  getValidAdjacentCoords(player) {
    let adjacentCoord;
    const lastAttack = player.gameboard.attackLog.at(-1);
    const isLastAttackHit = Player.isHit(lastAttack, player);
    if (!isLastAttackHit) {
      adjacentCoord = this.getAdjacentCoords(this.aiInitialHitCoord);
      this.aiCoordTracker = null;
    } else {
      this.aiCoordTracker = player.gameboard.shotsHit.at(-1);
      adjacentCoord = this.getAdjacentCoords(this.aiCoordTracker);
    }

    let validAdjacentCoords = adjacentCoord.filter((coord) =>
      Player.filterInvalidCoords(coord, player)
    );

    if (!adjacentCoord.length) {
      adjacentCoord = this.getAdjacentCoords(this.aiInitialHitCoord);
      this.aiCoordTracker = null;
      validAdjacentCoords = adjacentCoord.filter((coord) =>
        Player.filterInvalidCoords(coord, player)
      );
    }

    return validAdjacentCoords;
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
