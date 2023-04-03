import Gameboard from "../game-logic/gameboard";
import Ship from "../game-logic/ship";
let gameboard, carrier, battleship, submarine, destroyer;

beforeEach(() => {
	gameboard = new Gameboard();
	carrier = new Ship(5);
	battleship = new Ship(4);
	submarine = new Ship(3);
	destroyer = new Ship(2);
});

describe("gameboard place ship at coordinates", () => {
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
		let gameboard = new Gameboard();
		beforeAll(() => {
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

	// it.todo("gameboard vertical and horizontal orientation");
	// it.todo("gameboard adjacent squares");
});

// should not place ship if starting position is valid but ending position overflows board
