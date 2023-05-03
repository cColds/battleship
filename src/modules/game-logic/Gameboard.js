import isCoordFound from "../utils";
/* eslint-disable no-param-reassign */

export default class Gameboard {
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
      isCoordFound(this.attackLog, [row, col])
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
