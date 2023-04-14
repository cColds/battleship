import Gameboard from "../game-logic/gameboard";
import { sinkAllShips, sinkShip } from "./test-helpers";
import Player from "../game-logic/player";

let player;

beforeEach(() => {
  player = new Player();
});

describe("gameboard place ship at coordinates", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  describe("gameboard horizontal orientation", () => {
    it("should place carrier of length 5 at [9, 5]", () => {
      expect(gameboard.canPlaceShip(player.carrier, [9, 5], "horizontal")).toBe(
        true
      );
    });
    it("should place destroyer of length 2 at [4, 7]", () => {
      expect(
        gameboard.canPlaceShip(player.destroyer, [4, 7], "horizontal")
      ).toBe(true);
    });
    it("should not place ship if row is out of bounds at [-1, 0]", () => {
      expect(
        gameboard.canPlaceShip(player.carrier, [-1, 0], "horizontal")
      ).toBe(false);
    });
    it("should not place ship if column is out of bounds at [0, 10]", () => {
      expect(
        gameboard.canPlaceShip(player.carrier, [0, 10], "horizontal")
      ).toBe(false);
    });
    it("should not place ship if starting position and ending position are invalid [-1, 10]", () => {
      expect(
        gameboard.canPlaceShip(player.carrier, [-1, 10], "horizontal")
      ).toBe(false);
    });
    it("should not place ship if starting position is valid but not ending position at [0, 6]", () => {
      expect(gameboard.canPlaceShip(player.carrier, [0, 6], "horizontal")).toBe(
        false
      );
    });
    it("should not place ship if other ships occupy the cell", () => {
      gameboard.placeShip(player.submarine, [5, 6], "horizontal");
      expect(gameboard.canPlaceShip(player.carrier, [5, 6])).toBe(false);
    });
    it("should not place ship if other ships occupy the cell", () => {
      gameboard.placeShip(player.carrier, [3, 0], "horizontal");
      expect(gameboard.canPlaceShip(player.battleship, [3, 4])).toBe(false);
    });
  });

  describe("gameboard vertical orientation", () => {
    beforeEach(() => {
      gameboard.orientation = "vertical";
    });

    it("should place carrier of length 5 at [5, 9]", () => {
      expect(gameboard.canPlaceShip(player.carrier, [5, 9], "vertical")).toBe(
        true
      );
    });

    it("should place destroyer of length 2 at [4,7]", () => {
      expect(gameboard.canPlaceShip(player.destroyer, [4, 7], "vertical")).toBe(
        true
      );
    });

    it("should not place ship if row is out of bounds at [-1, 0]", () => {
      expect(gameboard.canPlaceShip(player.carrier, [-1, 0], "vertical")).toBe(
        false
      );
    });

    it("should not place ship if column is out of bounds at [0, 10]", () => {
      expect(gameboard.canPlaceShip(player.carrier, [0, 10], "vertical")).toBe(
        false
      );
    });

    it("should not place ship if starting position and ending position are invalid [-1, 10]", () => {
      expect(gameboard.canPlaceShip(player.carrier, [-1, 10], "vertical")).toBe(
        false
      );
    });

    it("should not place ship if starting position is valid but not ending position at [6, 0]", () => {
      expect(gameboard.canPlaceShip(player.carrier, [6, 0], "vertical")).toBe(
        false
      );
    });

    it("should not place ship if other ships occupy the cell", () => {
      gameboard.placeShip(player.submarine, [5, 6], "vertical");
      expect(gameboard.canPlaceShip(player.carrier, [5, 6], "vertical")).toBe(
        false
      );
    });

    it("should not place ship if other ships occupy the cell", () => {
      gameboard.placeShip(player.carrier, [0, 3], "vertical");
      expect(
        gameboard.canPlaceShip(player.battleship, [4, 3], "vertical")
      ).toBe(false);
    });
  });
});

describe("gameboard attack cell", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  it("should attack ship and increment timesHit by 1", () => {
    gameboard.placeShip(player.carrier, [0, 3], "horizontal");
    expect(gameboard.receiveAttack([0, 3])).toBe(true);
    expect(gameboard.board[0][5].timesHit).toBe(1);
  });

  it("should attack ship and increment timesHit by 1", () => {
    gameboard.placeShip(player.carrier, [5, 5], "horizontal");
    expect(gameboard.receiveAttack([5, 9])).toBe(true);
    expect(gameboard.board[5][5].timesHit).toBe(1);
  });

  it("should only attack same ship cell once", () => {
    gameboard.placeShip(player.carrier, [3, 5], "horizontal");
    gameboard.receiveAttack([3, 5]);
    expect(gameboard.receiveAttack([3, 5])).toBe(false);
    expect(gameboard.board[3][9].timesHit).toBe(1);
  });

  it("should only attack same ship cell once", () => {
    gameboard.placeShip(player.carrier, [1, 2], "horizontal");
    gameboard.receiveAttack([1, 2]);
    gameboard.receiveAttack([1, 3]);
    gameboard.receiveAttack([1, 4]);
    gameboard.receiveAttack([1, 5]);
    gameboard.receiveAttack([1, 6]);

    expect(gameboard.receiveAttack([1, 6])).toBe(false);
  });

  it("should miss attack", () => {
    gameboard.placeShip(player.carrier, [7, 2], "horizontal");
    expect(gameboard.receiveAttack([5, 6])).toBe(false);
  });

  it("should miss attack", () => {
    gameboard.placeShip(player.carrier, [4, 3], "horizontal");
    expect(gameboard.receiveAttack([3, 5])).toBe(false);
  });

  it("should miss attack on invalid coordinates", () => {
    gameboard.placeShip(player.carrier, [0, 3], "horizontal");
    expect(gameboard.receiveAttack([-1, 3])).toBe(false);
  });

  it("should miss attack on invalid coordinates", () => {
    gameboard.placeShip(player.carrier, [4, 2], "horizontal");
    expect(gameboard.receiveAttack([0, 10])).toBe(false);
  });
});

describe("gameboard check if ships are all sunk", () => {
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
    // gameboard.orientation = "vertical";
  });

  it("should report all ships sunk as true", () => {
    gameboard.placeShip(player.carrier, [3, 2], "vertical");
    gameboard.placeShip(player.battleship, [5, 5], "vertical");
    gameboard.placeShip(player.submarine, [0, 2], "vertical");

    sinkAllShips(gameboard.ships, gameboard);

    expect(gameboard.areAllShipsSunk()).toBe(true);
  });

  it("should report all ships sunk as true if no ships placed", () => {
    expect(gameboard.areAllShipsSunk()).toBe(true);
  });

  it("should report all ships sunk as false - 1", () => {
    gameboard.placeShip(player.battleship, [5, 5], "vertical");
    gameboard.placeShip(player.submarine, [0, 2], "vertical");

    sinkShip(player.battleship, [5, 5], gameboard);
    gameboard.receiveAttack([0, 2]);
    expect(gameboard.areAllShipsSunk()).toBe(false);
  });

  it("should report all ships sunk as false - 2", () => {
    gameboard.placeShip(player.battleship, [5, 5], "vertical");

    gameboard.receiveAttack([0, 2]);
    gameboard.receiveAttack([0, 5]);
    gameboard.receiveAttack([5, 5]);
    gameboard.receiveAttack([5, 6]);

    expect(gameboard.areAllShipsSunk()).toBe(false);
  });
});

describe("reset gameboard state", () => {
  it("should reset gameboard", () => {
    player.placeAllShipsRandomly();

    player.gameboard.resetGameboard();

    expect(player.gameboard.ships.length).toBe(0);
  });
});
