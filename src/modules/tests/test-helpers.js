/* eslint-disable no-param-reassign */
function sinkShip(ship, [row, col], gameboard) {
  for (let i = 0; i < ship.length; i += 1) {
    if (ship.orientation === "horizontal") {
      gameboard.receiveAttack([row, col + i]);
    } else {
      gameboard.receiveAttack([row + i, col]);
    }
  }
}

function sinkAllShips(ships, gameboard) {
  ships.forEach((ship) => {
    sinkShip(ship, ship.coords, gameboard);
  });
}

function isAdjacentTo([rowOne, colOne], [rowTwo, colTwo]) {
  return (
    (rowOne === rowTwo && Math.abs(colOne - colTwo) === 1) ||
    (colOne === colTwo && Math.abs(rowOne - rowTwo) === 1)
  );
}

export { sinkAllShips, sinkShip, isAdjacentTo };
