import Gameboard from "../game-logic/gameboard";
import Ship from "../game-logic/ship";
import { sinkAllShips, sinkShip } from "./test-helpers";
import Player from "../game-logic/player";

let player, carrier, battleship, cruiser, submarine, destroyer;

beforeEach(() => {
  carrier = new Ship(5);
  battleship = new Ship(4);
  cruiser = new Ship(3);
  submarine = new Ship(3);
  destroyer = new Ship(2);
  player = new Player(
    new Gameboard(),
    carrier,
    battleship,
    cruiser,
    submarine,
    destroyer
  );
});

describe("gameboard place ship at coordinates", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  describe("gameboard horizontal orientation", () => {
    it("should place carrier of length 5 at [9, 5]", () => {
      expect(gameboard.canPlaceShip(carrier, [9, 5])).toBe(true);
    });
    it("should place destroyer of length 2 at [4, 7]", () => {
      expect(gameboard.canPlaceShip(destroyer, [4, 7])).toBe(true);
    });
    it("should not place ship if row is out of bounds at [-1, 0]", () => {
      expect(gameboard.canPlaceShip(carrier, [-1, 0])).toBe(false);
    });
    it("should not place ship if column is out of bounds at [0, 10]", () => {
      expect(gameboard.canPlaceShip(carrier, [0, 10])).toBe(false);
    });
    it("should not place ship if starting position and ending position are invalid [-1, 10]", () => {
      expect(gameboard.canPlaceShip(carrier, [-1, 10])).toBe(false);
    });
    it("should not place ship if starting position is valid but not ending position at [0, 6]", () => {
      expect(gameboard.canPlaceShip(carrier, [0, 6])).toBe(false);
    });
    it("should not place ship if other ships occupy the cell", () => {
      gameboard.placeShip(submarine, [5, 6]);
      expect(gameboard.canPlaceShip(carrier, [5, 6])).toBe(false);
    });
    it("should not place ship if other ships occupy the cell", () => {
      gameboard.placeShip(carrier, [3, 0]);
      expect(gameboard.canPlaceShip(battleship, [3, 4])).toBe(false);
    });
  });

  describe("gameboard vertical orientation", () => {
    beforeEach(() => {
      gameboard.orientation = "vertical";
    });

    it("should place carrier of length 5 at [5, 9]", () => {
      expect(gameboard.canPlaceShip(carrier, [5, 9])).toBe(true);
    });

    it("should place destroyer of length 2 at [4,7]", () => {
      expect(gameboard.canPlaceShip(destroyer, [4, 7])).toBe(true);
    });

    it("should not place ship if row is out of bounds at [-1, 0]", () => {
      expect(gameboard.canPlaceShip(carrier, [-1, 0])).toBe(false);
    });

    it("should not place ship if column is out of bounds at [0, 10]", () => {
      expect(gameboard.canPlaceShip(carrier, [0, 10])).toBe(false);
    });

    it("should not place ship if starting position and ending position are invalid [-1, 10]", () => {
      expect(gameboard.canPlaceShip(carrier, [-1, 10])).toBe(false);
    });

    it("should not place ship if starting position is valid but not ending position at [6, 0]", () => {
      expect(gameboard.canPlaceShip(carrier, [6, 0])).toBe(false);
    });

    it("should not place ship if other ships occupy the cell", () => {
      gameboard.placeShip(submarine, [5, 6]);
      expect(gameboard.canPlaceShip(carrier, [5, 6])).toBe(false);
    });

    it("should not place ship if other ships occupy the cell", () => {
      gameboard.placeShip(carrier, [0, 3]);
      expect(gameboard.canPlaceShip(battleship, [4, 3])).toBe(false);
    });
  });
});

describe("gameboard attack cell", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  it("should attack ship and increment timesHit by 1", () => {
    gameboard.placeShip(carrier, [0, 3]);
    expect(gameboard.receiveAttack([0, 3])).toBe(true);
    expect(gameboard.board[0][5].timesHit).toBe(1);
  });

  it("should attack ship and increment timesHit by 1", () => {
    gameboard.placeShip(carrier, [5, 5]);
    expect(gameboard.receiveAttack([5, 9])).toBe(true);
    expect(gameboard.board[5][5].timesHit).toBe(1);
  });

  it("should only attack same ship cell once", () => {
    gameboard.placeShip(carrier, [3, 5]);
    gameboard.receiveAttack([3, 5]);
    expect(gameboard.receiveAttack([3, 5])).toBe(false);
    expect(gameboard.board[3][9].timesHit).toBe(1);
  });

  it("should only attack same ship cell once", () => {
    gameboard.placeShip(carrier, [1, 2]);
    gameboard.receiveAttack([1, 2]);
    gameboard.receiveAttack([1, 3]);
    gameboard.receiveAttack([1, 4]);
    gameboard.receiveAttack([1, 5]);
    gameboard.receiveAttack([1, 6]);

    expect(gameboard.receiveAttack([1, 6])).toBe(false);
  });

  it("should miss attack", () => {
    gameboard.placeShip(carrier, [7, 2]);
    expect(gameboard.receiveAttack([5, 6])).toBe(false);
  });

  it("should miss attack", () => {
    gameboard.placeShip(carrier, [4, 3]);
    expect(gameboard.receiveAttack([3, 5])).toBe(false);
  });

  it("should miss attack on invalid coordinates", () => {
    gameboard.placeShip(carrier, [0, 3]);
    expect(gameboard.receiveAttack([-1, 3])).toBe(false);
  });

  it("should miss attack on invalid coordinates", () => {
    gameboard.placeShip(carrier, [4, 2]);
    expect(gameboard.receiveAttack([0, 10])).toBe(false);
  });
});

describe("gameboard check if ships are all sunk", () => {
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
    gameboard.orientation = "vertical";
  });

  it("should report all ships sunk as true", () => {
    gameboard.placeShip(carrier, [3, 2]);
    gameboard.placeShip(battleship, [5, 5]);
    gameboard.placeShip(submarine, [0, 2]);

    sinkAllShips(gameboard.ships, gameboard);

    expect(gameboard.areAllShipsSunk()).toBe(true);
  });

  it("should report all ships sunk as true if no ships placed", () => {
    expect(gameboard.areAllShipsSunk()).toBe(true);
  });

  it("should report all ships sunk as false", () => {
    gameboard.placeShip(battleship, [5, 5]);
    gameboard.placeShip(submarine, [0, 2]);

    sinkShip(battleship, [5, 5], gameboard);
    gameboard.receiveAttack([0, 2]);
    expect(gameboard.areAllShipsSunk()).toBe(false);
  });

  it("should report all ships sunk as false", () => {
    gameboard.placeShip(battleship, [5, 5]);

    gameboard.receiveAttack([0, 2]);
    gameboard.receiveAttack([0, 5]);
    gameboard.receiveAttack([5, 5]);
    gameboard.receiveAttack([5, 6]);

    expect(gameboard.areAllShipsSunk()).toBe(false);
  });
});

describe("reset gameboard state", () => {
  it("should reset gameboard", () => {
    player.gameboard.orientation = "vertical";
    player.placeAllShipsRandomly();

    player.gameboard.resetGameboard();

    expect(player.gameboard.orientation).toBe("horizontal");
    expect(player.gameboard.ships.length).toBe(0);
  });
});
