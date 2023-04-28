function clearHighlightedCells(selector, classes) {
  const cells = document.querySelectorAll(selector);

  cells.forEach((cell) => {
    if (Array.isArray(classes)) {
      cell.classList.remove(...classes);
    } else {
      cell.classList.remove(classes);
    }
  });
}

function createGameboardCells(board) {
  for (let row = 0; row < 10; row += 1) {
    for (let col = 0; col < 10; col += 1) {
      const cell = document.createElement("button");

      cell.classList.add("cell");
      cell.dataset.coords = `[${row}, ${col}]`;
      board.appendChild(cell);
    }
  }
}

export { clearHighlightedCells, createGameboardCells };
