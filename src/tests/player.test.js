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

describe("player vs ai", () => {
	it("should make move for ai after player attacks", () => {
		player.placeAllShipsRandomly();
		ai.placeAllShipsRandomly();

		// console.log(ai.gameboard.receiveAttack([1, 2]));
		console.log(ai.gameboard);
		console.log(player.gameboard);
		console.log(ai.gameboard.ships);
		// ai.receiveAttack()
	});
});

// if turn is null, set it to player by default, else set it to the other player
// if turn is ai, grab a random legal move (not out of bounds or hit already) and call player's board with receiveAttack(randomMove)
// else, call ai's board with receiveAttack(yourMove)
// if all ships have sunk, end game and set player who made the last move as the winner
