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
    const canPlaceShips = ships.every((ship) =>
      player.gameboard.canPlaceShip(ship, ship.coords, ship.orientation)
    );
    const shipsCoords = ships.map((ship) => JSON.stringify(ship.coords));
    const areAllUniqueShipCoords = Array.from(new Set(shipsCoords));

    expect(canPlaceShips).toBe(false);
    expect(areAllUniqueShipCoords).toStrictEqual(shipsCoords);
    expect(shipsCoords.length).toBe(5);
  });

  it("should call AI's gameboard receiveAttack method with correct coordinates when player attacks", () => {
    const mockReceiveAttack = jest.fn();

    ai.gameboard.receiveAttack = mockReceiveAttack;
    Player.attack([3, 5], ai);
    expect(mockReceiveAttack).toBeCalledWith([3, 5]);
    expect(mockReceiveAttack).toBeCalledTimes(1);
  });

  it("should remove attacked coordinates from valid coordinates list", () => {
    const [row, col] = Player.getRandomValidCoord(
      Player.getValidCoords(player)
    );
    player.gameboard.receiveAttack([row, col]);
    expect(isCoordFound(Player.getValidCoords(player), [row, col])).toBe(false);
  });
});

describe("ai functionality", () => {
  describe("random mode", () => {
    it("should make random attack against player", () => {
      const mockReceiveAttack = jest.fn();

      player.gameboard.receiveAttack = mockReceiveAttack;

      ai.makeAiAttack(player);
      expect(mockReceiveAttack).toBeCalledTimes(1);
    });

    it("should set aiInitialHitCoord to hit coord if its a hit", () => {
      const mockGetValidCoords = jest.fn().mockReturnValueOnce([[3, 5]]);
      player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");

      Player.getValidCoords = mockGetValidCoords;
      ai.makeAiAttack(player);
      expect(ai.aiInitialHitCoord).toEqual([3, 5]);
    });

    it("should not set aiInitialHitCoord to hit coord if its a miss", () => {
      const mockGetValidCoords = jest.fn().mockReturnValueOnce([[3, 4]]);
      player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");

      Player.getValidCoords = mockGetValidCoords;
      ai.makeAiAttack(player);
      expect(ai.aiInitialHitCoord).toBe(null);
    });
  });

  describe("target ship mode", () => {
    it("should call makeAdjacentAttack with player if this.aiInitialHitCoord is truthy", () => {
      jest.spyOn(Player, "getValidCoords").mockReturnValueOnce([[3, 5]]);
      const mockMakeAdjacentAttack = jest.fn();
      ai.makeAdjacentAttack = mockMakeAdjacentAttack;

      player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");
      ai.makeAiAttack(player);
      ai.makeAiAttack(player);
      expect(mockMakeAdjacentAttack).toBeCalledTimes(1);
      expect(mockMakeAdjacentAttack).toBeCalledWith(player);
    });
  });

  it("should be an adjacent attack", () => {
    jest.spyOn(Player, "getValidCoords").mockReturnValueOnce([[3, 5]]);
    player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");

    ai.makeAiAttack(player);
    ai.makeAiAttack(player);
    const lastAttack = player.gameboard.attackLog.at(-1);
    expect(isAdjacentTo([3, 5], lastAttack)).toBe(true);
  });

  it("should not include coord already attacked for getValidAdjacentCoords", () => {
    jest.spyOn(Player, "getValidCoords").mockReturnValueOnce([[3, 5]]);
    jest.spyOn(ai, "getValidAdjacentCoords").mockReturnValueOnce([[3, 4]]);

    player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");
    ai.makeAiAttack(player);
    ai.makeAiAttack(player);

    const validAdjacentCoords = ai.getValidAdjacentCoords(player);
    const lastAttack = player.gameboard.attackLog.at(-1);
    expect(isCoordFound(validAdjacentCoords, lastAttack)).toBe(false);
  });

  it("should not include coord out of bounds for getValidAdjacentCoords", () => {
    jest.spyOn(Player, "getValidCoords").mockReturnValueOnce([[0, 0]]);

    player.gameboard.placeShip(player.submarine, [0, 0], "horizontal");
    ai.makeAiAttack(player);
    const validAdjacentCoords = ai.getValidAdjacentCoords(player);

    expect(isCoordFound(validAdjacentCoords, [-1, 0])).toBe(false);
    expect(isCoordFound(validAdjacentCoords, [0, -1])).toBe(false);
  });

  it("should return adjacent coords for both orientations and if orientation is null", () => {
    expect(ai.getAdjacentCoords([3, 5])).toEqual([
      [4, 5],
      [2, 5],
      [3, 6],
      [3, 4],
    ]);
    ai.aiShipOrientationTracker = "horizontal";
    expect(ai.getAdjacentCoords([3, 5])).toEqual([
      [3, 6],
      [3, 4],
    ]);
    ai.aiShipOrientationTracker = "vertical";
    expect(ai.getAdjacentCoords([3, 5])).toEqual([
      [4, 5],
      [2, 5],
    ]);
  });

  describe("update ai state", () => {
    it.skip("should set aiCoordTracker to null if different ship or dead end", () => {
      jest.spyOn(Player, "getValidCoords").mockReturnValueOnce([[3, 6]]);
      jest.spyOn(ai, "getValidAdjacentCoords").mockReturnValueOnce([[3, 5]]);

      player.gameboard.placeShip(player.submarine, [3, 5], "horizontal");
      ai.makeAiAttack(player);
      ai.makeAiAttack(player);
      ai.aiCoordTracker = player.gameboard.shotsHit.at(-1);
      ai.makeAiAttack(player);
    });
  });
});

// AI ALGORITHM:
// RANDOM MODE:
// 1) Keep doing random hits until ai hits a ship
// 2) If ai attack hit a ship (initial hit on a unique ship), set this.aiInitialHit to the cell coord it was hit at.

// TARGET SHIP MODE:
// If (this.aiInitialHit is truthy) {
// this.makeAdjacentAttack(player);
// return;
// }

/* FIRST FUNCTION CALL
function makeAdjacentAttack(player) {
const [adjRow, adjCol] = getValidAdjacentCoords(player);
player.receiveAttack([adjRow, adjCol], player);

updateAiState(player)
}
*/

/* SECOND FUNCTION CALL
function getValidAdjacentCoords(player) {
let adjacentCoord;

If (attack was a miss or hit a different ship) {
adjacentCoord = getAdjacentCoords(this.aiInitialHitCoord, player);
this.aiCoordTracker = null;
}
Else if (attack was a hit) {
this.aiCoordTracker = player.gameboard.shotsHit.at(-1);
adjacentCoord = getAdjacentCoords(this.aiCoordTracker, player);
}

return adjacentCoord.filter(coord => !player.gameboard.isOutOfBounds(coord))
}
*/

/* THIRD FUNCTION CALL
function getAdjacentCoords([row, col]) {
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
*/

/* FOURTH FUNCTION CALL
function updateAiState(player) {
const [initRow, initCol] = this.aiInitialHitCoord;
const originalShip = player.gameboard[initRow][initCol];
const isSameShip = player.gameboard[adjRow][adjCol];

// if is different ship or cell is null (dead end)
if (originalShip !== isSameShip || isSameShip === null) {
this.aiCoordTracker = null;
}

// if hit twice on the same ship, we know the orientation. also make sure this.aiShipOrientationTracker isn't set
if (originalShip.timesHit === 2 and this.aiShipOrientationTracker === null) {
this.aiShipOrientationTracker = getAiOrientationTracker();
}

// reset ai state back to random
if (originalShip.isSunk()) {
this.aiInitialHitCoord = null;
this.aiCoordTracker = null;
this.aiShipOrientationTracker = null;
}
}

*/

/* FIFTH FUNCTION CALL
function getAiOrientationTracker() {
const [currRow, currCol] = player.gameboard.shotsHit.at(-1);
const [initRow, initCol] = this.aiInitialHitCoord;

return currRow === initRow ? "horizontal" : "vertical";

} 

*/
