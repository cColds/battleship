/* eslint-disable no-param-reassign */
function sinkShip(ship, [row, col], gameboard) {
  for (let i = 0; i < ship.length; i += 1) {
    if (gameboard.orientation === "horizontal") {
      gameboard.receiveAttack(gameboard.board[row][col + i]);
    } else {
      gameboard.board[row + i][col].hit();
      gameboard.board[row + i][col] = "hit";
    }
  }
}

function sinkAllShips(ships, gameboard) {
  ships.forEach((ship) => {
    sinkShip(ship, ship.coords, gameboard);
  });
}

export { sinkAllShips, sinkShip };
