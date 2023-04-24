import Player from "./Player";

export default class Game {
  constructor() {
    this.player = new Player();
    this.ai = new Player();
  }

  resetGame() {
    this.player = new Player();
    this.ai = new Player();
  }

  isGameOver() {
    return (
      this.player.gameboard.areAllShipsSunk() ||
      this.ai.gameboard.areAllShipsSunk()
    );
  }
}
