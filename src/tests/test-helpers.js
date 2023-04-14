/* eslint-disable no-param-reassign */
function sinkShip(ship, [row, col], gameboard) {
  console.log({ gameboard, ship });
  for (let i = 0; i < ship.length; i += 1) {
    if (ship.orientation === "horizontal") {
      gameboard.receiveAttack([row + i, col]);
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

export { sinkAllShips, sinkShip };
