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
    this.aiInitialShipHitCoord = null;
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

  static getValidAdjacentCells([row, col], player) {
    const adjacentCells = [
      [row + 1, col],
      [row - 1, col],
      [row, col + 1],
      [row, col - 1],
    ];

    return adjacentCells.filter(([adjRow, adjCol]) => {
      const isAlreadyAttacked = isCoordFound(player.gameboard.attackLog, [
        adjRow,
        adjCol,
      ]);

      return (
        !player.gameboard.constructor.isOutOfBounds([adjRow, adjCol]) &&
        !isAlreadyAttacked
      );
    });
  }

  static isLatestAttackHit(player) {
    return isCoordFound(
      player.gameboard.shotsHit,
      player.gameboard.attackLog.at(-1)
    );
  }

  makeAiAttack(player) {
    if (this.aiInitialShipHitCoord || Player.isLatestAttackHit(player)) {
      const [row, col] = player.gameboard.shotsHit.at(-1);
      const cell = player.gameboard.board[row][col];

      if (!cell.isSunk()) {
        let adjacentCells;

        if (
          isCoordFound(
            player.gameboard.shotsMissed,
            player.gameboard.attackLog.at(-1)
          )
        ) {
          adjacentCells = Player.getValidAdjacentCells(
            this.aiInitialShipHitCoord,
            player
          );
        } else {
          adjacentCells = Player.getValidAdjacentCells(
            player.gameboard.attackLog.at(-1),
            player
          );
        }

        const randomAdjacentCoord =
          adjacentCells[Player.getRandomInt(adjacentCells.length - 1)];

        player.gameboard.receiveAttack(randomAdjacentCoord);
        if (cell.isSunk()) {
          this.aiInitialShipHitCoord = null;
        } else if (!this.aiInitialShipHitCoord) {
          this.aiInitialShipHitCoord = [row, col];
        }

        return;
      }
    }

    const randomValidCoord = Player.getRandomValidCoords(
      Player.getValidCoords(player)
    );

    player.gameboard.receiveAttack(randomValidCoord);
  }
}
