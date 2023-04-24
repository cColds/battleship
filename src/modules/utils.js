const isCoordFound = (array, [targetRow, targetCol]) =>
  array.some(([row, col]) => row === targetRow && col === targetCol);

export default isCoordFound;
