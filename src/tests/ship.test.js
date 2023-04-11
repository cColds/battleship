import Ship from "../game-logic/ship";

let carrier, battleship, cruiser, submarine;

beforeEach(() => {
  carrier = new Ship(5);
  battleship = new Ship(4);
  cruiser = new Ship(3);
  submarine = new Ship(3);
});

describe("ship times hit", () => {
  it("should initialize carrier timesHit property to 0", () => {
    expect(carrier.timesHit).toBe(0);
  });
  it("should increment battleship timesHit to 4", () => {
    battleship.hit();
    battleship.hit();
    battleship.hit();
    battleship.hit();
    expect(battleship.timesHit).toBe(4);
  });
  it("should limit submarine timesHit to 3", () => {
    submarine.hit();
    submarine.hit();
    submarine.hit();
    submarine.hit();

    expect(submarine.timesHit).toBe(3);
  });

  it("should increment cruiser timesHit to 1 when hit once", () => {
    cruiser.hit();
    expect(cruiser.timesHit).toBe(1);
  });
});

describe("ship sunk", () => {
  it("should return carrier sunk to false when hit 0 times", () => {
    carrier.hit();
    expect(carrier.isSunk()).toBe(false);
  });

  it("should return battleship sunk to true when hit 4 times", () => {
    battleship.hit();
    battleship.hit();
    battleship.hit();
    battleship.hit();
    expect(battleship.isSunk()).toBe(true);
  });
});
