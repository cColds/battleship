/* eslint-disable no-param-reassign */
export function sinkShip(ship, [row, col], gameboard) {
	const start = gameboard.orientation === "horizontal" ? col : row;
	const end =
		gameboard.orientation === "horizontal"
			? col + ship.length
			: row + ship.length;
	for (let i = 0; start + i < end; i += 1) {
		if (gameboard.orientation === "horizontal") {
			gameboard.receiveAttack(gameboard.board[row][col + i]);
		} else {
			gameboard.board[row + i][col].hit();
			gameboard.board[row + i][col] = "hit";
		}
	}
}

export default function sinkAllShips(ships, gameboard) {
	ships.forEach((ship) => {
		sinkShip(ship, ship.coords, gameboard);
	});
}
