import Ship from "../game-logic/ship";
let ship;
beforeEach(() => (ship = new Ship()));

describe("ship size", () => {
	console.log(ship);
	it("carrier size should be 5", () => {
		expect(ship.carrier.size).toBe(5);
	});
	it("battleship size should be 4", () => {
		expect(ship.battleship.size).toBe(4);
	});
	it("cruiser size should be 3", () => {
		expect(ship.cruiser.size).toBe(3);
	});
	it("submarine size should be 3", () => {
		expect(ship.submarine.size).toBe(3);
	});
	it("destroyer size should be 2", () => {
		expect(ship.destroyer.size).toBe(2);
	});
});
