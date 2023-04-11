/* eslint-disable no-param-reassign */
import Ship from "./ship";

export default class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.orientation = "horizontal";
    this.ships = [];
  }

  static isOutOfBounds = ([row, col]) =>
    row < 0 || row > 9 || col < 0 || col > 9;

  isHorizontal = () => this.orientation === "horizontal";

  areAllShipsSunk = () => this.ships.every((ship) => ship.isSunk());

  getEndPosition = (ship, [row, col]) =>
    this.isHorizontal() ? col : row + ship.length - 1;

  isHit = ([row, col]) => this.board[row][col] instanceof Ship;

  resetGameboard() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [];
    this.orientation = "horizontal";
  }

  isEveryCellValid(ship, [row, col]) {
    for (let i = 0; i < ship.length; i += 1) {
      if (this.isHorizontal()) {
        if (this.board[row][col + i] === null) continue;
      } else if (this.board[row + i][col] === null) continue;

      return false;
    }
    return true;
  }

  canPlaceShip(ship, [row, col]) {
    return (
      !Gameboard.isOutOfBounds([row, col]) &&
      this.getEndPosition(ship, [row, col]) < 10 &&
      this.isEveryCellValid(ship, [row, col])
    );
  }

  placeShip(ship, [row, col]) {
    if (!this.canPlaceShip(ship, [row, col])) return;

    let i = 0;
    ship.coords = [row, col];
    while (i < ship.length) {
      if (this.isHorizontal()) {
        this.board[row][col + i] = ship;
      } else {
        this.board[row + i][col] = ship;
      }
      i += 1;
    }

    this.ships.push(ship);
  }

  receiveAttack([row, col]) {
    if (
      Gameboard.isOutOfBounds([row, col]) ||
      this.board[row][col] === "hit" ||
      this.board[row][col] === "miss"
    )
      return false;

    if (!this.isHit([row, col])) {
      this.board[row][col] = "miss";
      return false;
    }

    this.board[row][col].hit();
    this.board[row][col] = "hit";

    return true;
  }
}
