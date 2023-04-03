export default class Gameboard {
	constructor() {
		this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
		this.orientation = "horizontal";
	}

	isHorizontal = () => this.orientation === "horizontal";

	isValidShipPlacement(ship, [row, col]) {
		const start = this.isHorizontal() ? col : row;
		const end = this.isHorizontal() ? col + ship.length : row + ship.length;
		for (let i = 0; start + i < end; i += 1) {
			if (this.isHorizontal()) {
				if (this.board[row][col + i] === null) continue;
			} else if (this.board[row + i][col] === null) continue;

			return false;
		}

		return true;
	}

	isOutOfBounds(ship, [row, col]) {
		const end = this.isHorizontal() // add - 1 because ship should start at col/row
			? col + ship.length - 1
			: row + ship.length - 1;
		return row < 0 || row > 9 || col < 0 || col > 9 || end > 9;
	}

	canPlaceShip(ship, [row, col]) {
		return (
			!this.isOutOfBounds(ship, [row, col]) &&
			this.isValidShipPlacement(ship, [row, col])
		);
	}

	placeShip(ship, [row, col]) {
		if (!this.canPlaceShip(ship, [row, col])) return;

		let i = ship.length;

		while (i) {
			if (this.isHorizontal()) {
				this.board[row][col + i] = ship;
			} else {
				this.board[row + i][col] = ship;
			}
			i -= 1;
		}
	}
}
