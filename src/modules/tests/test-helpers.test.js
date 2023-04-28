import { isAdjacentTo } from "./test-helpers";

it("should return true when cells are adjacent by +- 1 col", () => {
  expect(isAdjacentTo([3, 5], [3, 6])).toBe(true);
  expect(isAdjacentTo([3, 5], [3, 4])).toBe(true);
});

it("should return true when cells are adjacent by +- 1 row", () => {
  expect(isAdjacentTo([3, 5], [2, 5])).toBe(true);
  expect(isAdjacentTo([3, 5], [4, 5])).toBe(true);
});

it("should return false when adjacent cell is diagonal (+- 1 row and col)", () => {
  expect(isAdjacentTo([3, 5], [2, 6])).toBe(false);
  expect(isAdjacentTo([3, 5], [4, 4])).toBe(false);
});
