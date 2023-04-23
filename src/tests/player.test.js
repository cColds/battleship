import Player from "../game-logic/Player";

let player, ai;

beforeEach(() => {
  player = new Player();
  ai = new Player();
});

describe("player/ai", () => {
  it("should place ships randomly", () => {
    player.randomizeShips();
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
    player.randomizeShips();
    const shipCoordsOne = JSON.stringify(player.gameboard.ships);
    player.randomizeShips();
    const shipCoordsTwo = JSON.stringify(player.gameboard.ships);

    const areShipCoordsEqual = shipCoordsOne === shipCoordsTwo;
    expect(areShipCoordsEqual).toBe(false);
    expect(player.gameboard.ships.length).toBe(5);
  });

  it("should make player attack", () => {
    player.randomizeShips();
    ai.randomizeShips();
    Player.attack([3, 5], ai);

    const [missedRow, missedCol] = ai.gameboard.shotsMissed;
    expect(missedRow === 3 && missedCol === 5);
  });

  it("should make random attack for ai", () => {
    player.randomizeShips();
    ai.randomizeShips();

    Player.makeAiAttack(player);
    const [row, col] = player.gameboard.latestReceivedAttack;
    expect(player.gameboard.receiveAttack([row, col])).toBe(false);
  });
});
