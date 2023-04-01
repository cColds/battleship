import Gameboard from "../game-logic/gameboard";
import Ship from "../game-logic/ship";
let gameboard, carrier, battleship, cruiser, submarine, destroyer;
beforeEach(() => {
	gameboard = new Gameboard();
	carrier = new Ship(5);
	battleship = new Ship(4);
	cruiser = new Ship(3);
	submarine = new Ship(3);
	destroyer = new Ship(2);
});

describe("gameboard place ship at coordinates", () => {
	it("should place carrier of length 5 at [0,0]", () => {
		expect(gameboard.placeShip(carrier, [0, 0])).toBe(true);
	});

	it("should place destroyer of length 2 at [4,7]", () => {
		expect(gameboard.placeShip(destroyer, [4, 7])).toBe(true);
	});

	it("should not place ship out of bounds at [-1, 0]", () => {
		expect(gameboard.placeShip(carrier, [-1, 0])).toBe(false);
	});

	it("should not place ship if starting position and ending position are invalid [-1, 10]", () => {
		expect(gameboard.placeShip(carrier, [-1, 10])).toBe(false);
	});

	it("should not place ship if starting position is valid but not ending position at [0, 5]", () => {
		expect(gameboard.placeShip(carrier, [0, 5])).toBe(false);
	});

	it("should not place ship if other ships occupy the cell", () => {
		gameboard.placeShip(submarine, [5, 6]);
		expect(gameboard.placeShip(carrier, [5, 6])).toBe(false);
	});

	it("should not place ship if other ships occupy the cell", () => {
		gameboard.placeShip(carrier, [3, 3]);
		console.log(gameboard.board);
		expect(gameboard.placeShip(battleship, [3, 0])).toBe(false);
	});
});
