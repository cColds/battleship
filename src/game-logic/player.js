export default class Player {
	constructor(gameboard, ...ships) {
		this.gameboard = gameboard;
		this.ships = ships;
	}

	static getRandomInt = (max) => Math.floor(Math.random() * max);

	/* Randomize array in-place using Durstenfeld shuffle algorithm */
	static shuffleArray(array) {
		const newArray = [...array];
		for (let i = array.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
		}

		return newArray;
	}

	static getRandomOrientation = () =>
		Player.getRandomInt(2) === 0 ? "horizontal" : "vertical";

	static getRandomValidCoords = (validCoords) =>
		validCoords[Player.getRandomInt(validCoords.length)];

	placeAllShipsRandomly() {
		const randomShips = Player.shuffleArray(this.ships);
		randomShips.forEach((ship) => {
			this.gameboard.orientation = Player.getRandomOrientation();

			const validCoords = [];
			for (let row = 0; row < 10; row += 1) {
				for (let col = 0; col < 10; col += 1) {
					if (this.gameboard.canPlaceShip(ship, [row, col])) {
						validCoords.push([row, col]);
					}
				}
			}

			const [randomX, randomY] = Player.getRandomValidCoords(validCoords);
			this.gameboard.placeShip(ship, [randomX, randomY]);
		});
	}

	static getValidCoords(enemy) {
		const enemyBoard = enemy.gameboard.board;
		const validCoords = [];
		for (let row = 0; row < 10; row += 1) {
			for (let col = 0; col < 10; col += 1) {
				if (enemyBoard[row][col] === null) {
					validCoords.push([row, col]);
				}
			}
		}

		return validCoords;
	}

	attack([row, col], enemy) {
		enemy.gameboard.receiveAttack([row, col]);
		Player.makeComputerAttack(this);
	}

	static makeComputerAttack(player) {
		const randomValidCoord = Player.getRandomValidCoords(
			Player.getValidCoords(player)
		);

		player.gameboard.receiveAttack(randomValidCoord);

		return randomValidCoord;
	}
}
