import assert from "node:assert/strict";
import test from "node:test";
import { GOAL, START, replayMoves } from "../src/lib/maze.mjs";

test("empty instructions keep the explorer at the entrance", () => {
  assert.deepEqual(replayMoves([]), {
    position: START, facing: "right", steps: 0, blocked: false, won: false,
  });
});

test("Python movement commands replay in order", () => {
  assert.deepEqual(replayMoves(["right", "down", "down"]), {
    position: { row: 2, col: 1 },
    facing: "down", steps: 3, blocked: false, won: false,
  });
});

test("the replay rejects a wall and stops before later commands", () => {
  assert.deepEqual(replayMoves(["right", "right", "down"]), {
    position: { row: 0, col: 1 },
    facing: "right", steps: 1, blocked: true, won: false,
  });
});

test("the replay rejects a boundary", () => {
  assert.deepEqual(replayMoves(["up", "right"]), {
    position: START, facing: "up", steps: 0, blocked: true, won: false,
  });
});

test("reaching the goal wins and ignores additional instructions", () => {
  const route = ["right", "down", "down", "right", "right", "down", "right", "down"];
  assert.deepEqual(replayMoves([...route, "left"]), {
    position: GOAL, facing: "down", steps: 8, blocked: false, won: true,
  });
});

test("unsupported commands and malformed action lists are rejected", () => {
  assert.throws(() => replayMoves(["diagonal"]), /Unknown movement/);
  assert.throws(() => replayMoves([null]), /Unknown movement/);
  assert.throws(() => replayMoves("right"), /must be an array/);
  assert.throws(() => replayMoves(Array(101).fill("right")), /limit reached/);
});
