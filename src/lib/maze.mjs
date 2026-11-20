/**
 * Maze rules are intentionally framework-independent so future Python commands
 * can call the same movement logic as manual practice controls.
 */
export const MAZE_ROWS = Object.freeze([
  "S.#..",
  "#.#.#",
  "....#",
  ".##..",
  "...#G",
]);

export const START = Object.freeze({ row: 0, col: 0 });
export const GOAL = Object.freeze({ row: 4, col: 4 });
export const DIRECTIONS = Object.freeze({
  up: Object.freeze({ row: -1, col: 0 }),
  down: Object.freeze({ row: 1, col: 0 }),
  left: Object.freeze({ row: 0, col: -1 }),
  right: Object.freeze({ row: 0, col: 1 }),
});

/** @returns {boolean} */
export function isWithinBounds(row, col) {
  return row >= 0 && row < MAZE_ROWS.length &&
    col >= 0 && col < MAZE_ROWS[0].length;
}

/** @returns {boolean} */
export function isWall(row, col) {
  return isWithinBounds(row, col) && MAZE_ROWS[row][col] === "#";
}

/** @returns {{ position: {row: number, col: number}, facing: string, blocked: boolean, won: boolean }} */
export function movePlayer(position, direction) {
  const delta = DIRECTIONS[direction];
  if (!delta) throw new Error(`Unknown direction: ${direction}`);

  const next = {
    row: position.row + delta.row,
    col: position.col + delta.col,
  };
  const blocked = !isWithinBounds(next.row, next.col) || isWall(next.row, next.col);
  const updatedPosition = blocked ? { ...position } : next;

  return {
    position: updatedPosition,
    facing: direction,
    blocked,
    won: updatedPosition.row === GOAL.row && updatedPosition.col === GOAL.col,
  };
}

export function getCellType(row, col) {
  if (!isWithinBounds(row, col)) return "outside";
  const cell = MAZE_ROWS[row][col];
  if (cell === "#") return "wall";
  if (cell === "S") return "start";
  if (cell === "G") return "goal";
  return "path";
}
