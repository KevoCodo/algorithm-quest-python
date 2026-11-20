import assert from "node:assert/strict";
import test from "node:test";
import { GOAL, MAZE_ROWS, START, getCellType, isWall, isWithinBounds, movePlayer } from "../src/lib/maze.mjs";

test("maze is a stable 5×5 grid with one start and one goal", () => {
  assert.equal(MAZE_ROWS.length, 5);
  for (const row of MAZE_ROWS) assert.equal(row.length, 5);
  assert.equal(MAZE_ROWS.join("").split("S").length - 1, 1);
  assert.equal(MAZE_ROWS.join("").split("G").length - 1, 1);
  assert.deepEqual(START, { row: 0, col: 0 });
  assert.deepEqual(GOAL, { row: 4, col: 4 });
  assert.equal(getCellType(0, 0), "start");
  assert.equal(getCellType(4, 4), "goal");
});

test("bounds and walls are recognized", () => {
  assert.equal(isWithinBounds(-1, 0), false);
  assert.equal(isWithinBounds(5, 0), false);
  assert.equal(isWithinBounds(0, 5), false);
  assert.equal(isWithinBounds(4, 4), true);
  assert.equal(isWall(0, 2), true);
  assert.equal(isWall(0, 1), false);
  assert.equal(getCellType(-1, 0), "outside");
});

test("legal movement changes location and facing", () => {
  assert.deepEqual(movePlayer(START, "right"), {
    position: { row: 0, col: 1 }, facing: "right", blocked: false, won: false,
  });
});

test("wall collision blocks movement without changing position", () => {
  const initial = { row: 0, col: 1 };
  assert.deepEqual(movePlayer(initial, "right"), {
    position: initial, facing: "right", blocked: true, won: false,
  });
});

test("out-of-bounds movement is blocked", () => {
  assert.equal(movePlayer(START, "up").blocked, true);
  assert.deepEqual(movePlayer(START, "left").position, START);
});

test("invalid direction does not silently change state", () => {
  assert.throws(() => movePlayer(START, "diagonal"), /Unknown direction/);
});

test("goal can be reached through a legal path", () => {
  let position = { ...START };
  for (const direction of ["right", "down", "down", "right", "right", "down", "right", "down"]) {
    const result = movePlayer(position, direction);
    assert.equal(result.blocked, false, `Unexpected block while moving ${direction}`);
    position = result.position;
  }
  assert.deepEqual(position, GOAL);
  assert.equal(movePlayer({ row: 4, col: 3 }, "right").blocked, true);
  assert.equal(movePlayer({ row: 3, col: 4 }, "down").won, true);
});
