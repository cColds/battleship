import Player from "../game-logic/Player";
import isCoordFound from "../utils";
import { isAdjacentTo } from "./test-helpers";

let player, ai;

beforeEach(() => {
  player = new Player();
  ai = new Player();
  jest.clearAllMocks();
});

describe("player functionality", () => {
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
    Player.attack([3, 5], ai);
    const [row, col] = ai.gameboard.shotsMissed;

    expect(row === 3 && col === 5);
  });

  it("should be a valid coord", () => {
    expect(isCoordFound(Player.getValidCoords(player), [0, 0])).toBe(true);

    Player.attack([0, 0], player);

    expect(isCoordFound(Player.getValidCoords(player), [0, 0])).toBe(false);
  });

  it("should remove attacked coordinates from valid coordinates list", () => {
    const [row, col] = Player.getRandomValidCoords(
      Player.getValidCoords(player)
    );

    player.gameboard.receiveAttack([row, col]);
    expect(isCoordFound(Player.getValidCoords(player), [row, col])).toBe(false);
  });
});

describe("ai functionality", () => {
  it("should make random attack for ai", () => {
    ai.makeAiAttack(player);
    const [row, col] = player.gameboard.attackLog.at(-1);
    expect(player.gameboard.receiveAttack([row, col])).toBe(false);
  });

  it("should make an adjacent attack if ship was hit", () => {
    player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");

    Player.attack([3, 5], player);
    ai.makeAiAttack(player);
    const isAdjacentHit = isAdjacentTo(
      [3, 5],
      player.gameboard.attackLog.at(-1)
    );

    expect(isAdjacentHit).toBe(true);
  });

  it("should make random attack if ship sunk", () => {
    player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");
    Player.attack([3, 5], player);
    Player.attack([3, 6], player);
    Player.attack([3, 7], player);

    expect(Player.isLatestAttackHit(player) && player.submarine.isSunk()).toBe(
      true
    );
  });
});

it("should make adjacent attack to the first ship hit coordinates if the attack missed", () => {
  player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");
  Player.getValidCoords = jest
    .spyOn(Player, "getValidCoords")
    .mockReturnValueOnce([[3, 5]]);

  Player.getValidAdjacentCells = jest
    .spyOn(Player, "getValidAdjacentCells")
    .mockReturnValueOnce([[3, 4]]);

  ai.makeAiAttack(player); // hit at [3, 5]
  ai.makeAiAttack(player); // miss at [3, 4]
  ai.makeAiAttack(player); // adjacent to [3, 5]

  const latestAttack = player.gameboard.attackLog.at(-1);
  expect(ai.aiInitialShipHitCoord).toEqual([3, 5]);
  expect(isAdjacentTo(latestAttack, [3, 5])).toBe(true);
});

it.skip("should only attack horizontally if hit ship more than once and ship is horizontal", () => {
  player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");
  Player.getValidCoords = jest
    .spyOn(Player, "getValidCoords")
    .mockReturnValueOnce([[3, 5]]);

  Player.getValidAdjacentCells = jest
    .spyOn(Player, "getValidAdjacentCells")
    .mockReturnValueOnce([[3, 6]]);

  ai.makeAiAttack(player);
  expect(ai.shipOrientationTracker).toBe(null);

  ai.makeAiAttack(player);
  expect(ai.shipOrientationTracker).toBe("horizontal");

  console.log(player.gameboard.attackLog);
});

it("should update this.aiInitialShipHitCoord to a coord after hitting submarine for the first time", () => {
  player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");
  Player.attack([3, 5], player);
  ai.makeAiAttack(player);
  expect(ai.aiInitialShipHitCoord).toEqual([3, 5]);
});

it("should set this.shipOrientationTracker to horizontal when ship is hit more than once", () => {
  Player.getValidCoords = jest
    .spyOn(Player, "getValidCoords")
    .mockReturnValueOnce([[3, 6]]);

  Player.getValidAdjacentCells = jest
    .spyOn(Player, "getValidAdjacentCells")
    .mockReturnValueOnce([[3, 5]])
    .mockReturnValueOnce([[3, 7]]);

  player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");
  ai.makeAiAttack(player);
  expect(ai.shipOrientationTracker).toBe(null);
  ai.makeAiAttack(player);
  expect(ai.shipOrientationTracker).toBe("horizontal");
  console.log(player.gameboard.attackLog);
});

it("should set ship orientation tracker to null when ship is hit only once", () => {
  Player.getValidCoords = jest
    .spyOn(Player, "getValidCoords")
    .mockReturnValueOnce([[3, 6]]);

  player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");
  ai.makeAiAttack(player);

  expect(ai.shipOrientationTracker).toBe(null);
});

it("should update this.aiInitialShipHitCoord and ai.shipOrientationTracker to null after sinking a ship", () => {
  player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");

  Player.getValidCoords = jest
    .spyOn(Player, "getValidCoords")
    .mockReturnValueOnce([[3, 5]]);

  Player.getValidAdjacentCells = jest
    .spyOn(Player, "getValidAdjacentCells")
    .mockReturnValueOnce([[3, 6]])
    .mockReturnValueOnce([[3, 7]]);

  ai.makeAiAttack(player);
  ai.makeAiAttack(player);
  ai.makeAiAttack(player);

  expect(ai.aiInitialShipHitCoord).toBe(null);
  expect(ai.shipOrientationTracker).toBe(null);
});

// How to attack ship until sunk efficiently
// If hit ship for the first time, make a random adjacent attack and set aiInitialHit to coord where it was hit
// If ship is miss, make an adjacent attack to aiInitialHit coord
// If ship hit again, make an attack on the same direction until a miss/ship sunk
// If ship sunk, set aiInitialHit to null
// If ship is miss, continue adjacent to aiInitialHit in the same direction
