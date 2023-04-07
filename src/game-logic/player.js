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
			const randomOrientation = Player.getRandomOrientation();
			const validCoords = [];

			let row = 0,
				col = 0;

			while (row < 10 && col < 10) {
				if (row === 9 && col === 9) {
					const [randomX, randomY] =
						Player.getRandomValidCoords(validCoords);
					this.gameboard.placeShip(ship, [randomX, randomY]);
				}
				const isValidShipPlacement =
					this.gameboard.isValidShipPlacement(ship, [row, col]);
				if (isValidShipPlacement) validCoords.push([row, col]);

				if (randomOrientation === "horizontal") {
					row = col === 9 ? row + 1 : row; // must set row before col because if col is 9, it'll reset to 0 and row won't increment
					col = col !== 9 ? col + 1 : 0;
				} else {
					col = row === 9 ? col + 1 : col; // must set col before row because if row is 9, it'll reset to 0 and col won't increment
					row = row !== 9 ? row + 1 : 0;
				}
			}
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
