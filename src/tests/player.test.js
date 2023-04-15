import Player from "../game-logic/player";

let player, ai;

beforeEach(() => {
  player = new Player();
  ai = new Player();
});

describe("player/ai", () => {
  it("should place ships randomly", () => {
    player.placeAllShipsRandomly();
    const { ships } = player.gameboard;
    const cantPlaceShips = ships.every(
      (ship) =>
        !player.gameboard.canPlaceShip(ship, ship.coords, ship.orientation)
    );
    const shipsCoords = ships.map((ship) => JSON.stringify(ship.coords));
    const areAllUniqueShipCoords = Array.from(new Set(shipsCoords));

    expect(cantPlaceShips).toBe(true);
    expect(areAllUniqueShipCoords).toStrictEqual(shipsCoords);
    expect(shipsCoords.length).toBe(5);
  });

  it("should be able to place ships randomly more than once", () => {
    player.placeAllShipsRandomly();
    const shipCoordsOne = JSON.stringify(player.gameboard.ships);
    player.placeAllShipsRandomly();
    const shipCoordsTwo = JSON.stringify(player.gameboard.ships);

    const areShipCoordsEqual = shipCoordsOne === shipCoordsTwo;
    expect(areShipCoordsEqual).toBe(false);
    expect(player.gameboard.ships.length).toBe(5);
  });

  it("should make player attack", () => {
    player.placeAllShipsRandomly();
    ai.placeAllShipsRandomly();
    Player.attack([3, 5], ai);
    expect(ai.gameboard.board[3][5]).not.toBe(null);
  });

  it("should make random attack for ai", () => {
    player.placeAllShipsRandomly();
    ai.placeAllShipsRandomly();

    const [computerRow, computerCol] = Player.makeComputerAttack(player);
    const playerBoard = player.gameboard.board;
    expect(playerBoard[computerRow][computerCol]).not.toBe(null);
  });
});
