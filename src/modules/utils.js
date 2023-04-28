function isCoordFound(array, [targetRow = null, targetCol = null] = []) {
  if (targetRow === null || targetCol === null) return false;

  return array.some(([row, col]) => row === targetRow && col === targetCol);
}

export default isCoordFound;
