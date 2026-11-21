import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { ALGORITHM_STARTER, ALGORITHM_HINTS, getAlgorithmHint, describeAlgorithmOutcome } from "../src/lib/algorithm-challenge.mjs";
import { replayMoves } from "../src/lib/maze.mjs";
import { getMovementTrace } from "../src/lib/lesson.mjs";

test("algorithm starter teaches Python iteration and branching without giving the complete route", () => {
  assert.match(ALGORITHM_STARTER, /for direction in route:/);
  assert.match(ALGORITHM_STARTER, /if direction == "right":/);
  assert.match(ALGORITHM_STARTER, /elif direction == "down":/);
  assert.match(ALGORITHM_STARTER, /\?/);
});
test("incremental hints are available and do not reveal full source code", () => {
  assert.equal(ALGORITHM_HINTS.length, 3);
  assert.equal(getAlgorithmHint(0), "");
  assert.match(getAlgorithmHint(1), /loop/);
  assert.match(getAlgorithmHint(3), /eight/);
});
test("a route dispatched by Python list loop can reach the maze goal", () => {
  const directions = ["right", "down", "down", "right", "right", "down", "right", "down"];
  assert.equal(replayMoves(directions).won, true);
  assert.equal(getMovementTrace(directions).length, 8);
});
test("incorrect routes produce useful feedback", () => {
  const blocked = replayMoves(["right", "right"]);
  assert.match(describeAlgorithmOutcome(blocked), /wall/);
  assert.match(describeAlgorithmOutcome(replayMoves([])), /loop/);
  assert.match(describeAlgorithmOutcome(replayMoves(["right"])), /stops short/);
  assert.match(describeAlgorithmOutcome(replayMoves(["right","down","down","right","right","down","right","down"])), /Algorithm complete/);
});
test("worker checks both Python AST loop and branch nodes", () => {
  const worker = readFileSync(new URL("../public/workers/python-worker.js", import.meta.url), "utf8");
  assert.match(worker, /ast\.For, ast\.While/);
  assert.match(worker, /ast\.If/);
  assert.match(worker, /payload\.challenge === "algorithms"/);
});
