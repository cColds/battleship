/* eslint-disable no-param-reassign */

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

export { clearHighlightedCells };
