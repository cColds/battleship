export default class Gameboard {
	constructor() {
		this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
	}

	isEveryCellValid(shipCells) {
		return shipCells.every((cell) => cell === null);
	}

	isOutOfBounds(row, col, end) {
		return row < 0 || row > 9 || col < 0 || col > 9 || end > 9;
	}

	canPlaceShip(ship, col, row) {
		const start = col;
		const end = ship.length + col;
		try {
			const shipCells = this.board[row].slice(start, end + 1);
			if (
				this.isOutOfBounds(row, col, end) ||
				!this.isEveryCellValid(shipCells)
			) {
				return false;
			}

			return true;
		} catch {
			return false;
		}
	}

	placeShip(ship, [row, col]) {
		if (!this.canPlaceShip(ship, col, row)) return false;

		let i = ship.length;
		while (i--) {
			this.board[row][col + i] = ".";
		}
		return true;
	}
}
