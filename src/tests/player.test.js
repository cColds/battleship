import Gameboard from "../game-logic/gameboard";
import Player from "../game-logic/player";
import Ship from "../game-logic/ship";

let carrier, battleship, submarine, cruiser, destroyer, player, ai;

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
		submarine,
		cruiser,
		destroyer
	);
	ai = new Player(
		new Gameboard(),
		carrier,
		battleship,
		submarine,
		cruiser,
		destroyer
	);
});

describe("player/ai", () => {
	it("should place ships randomly", () => {
		player.placeAllShipsRandomly();

		const { ships } = player.gameboard;

		const cantPlaceShips = ships.every(
			(ship) => !player.gameboard.canPlaceShip(ship, ship.coords)
		);
		const shipsCoords = ships.map((ship) => JSON.stringify(ship.coords));
		const areAllUniqueShipCoords = Array.from(new Set(shipsCoords));

		expect(cantPlaceShips).toBe(true);
		expect(areAllUniqueShipCoords).toStrictEqual(shipsCoords);
		expect(shipsCoords.length).toBe(5);
	});
	it("should make player attack", () => {
		player.placeAllShipsRandomly();
		ai.placeAllShipsRandomly();
		player.attack([3, 5], ai);
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
