import assert from "node:assert/strict";
import test from "node:test";
import { GOAL, MAZE_ROWS, START, replayMoves, movePlayer } from "../src/lib/maze.mjs";
import { describeOutcome, getMovementTrace } from "../src/lib/lesson.mjs";

const solution = ["right", "down", "down", "right", "right", "down", "right", "down"];

test("solution reaches goal and trace agrees with replay at every step", () => {
  const replay = replayMoves(solution);
  const trace = getMovementTrace(solution);
  assert.equal(replay.won, true);
  assert.deepEqual(replay.position, GOAL);
  assert.equal(trace.length, replay.steps);
  assert.deepEqual(trace.at(-1).position, replay.position);
  assert.match(describeOutcome(replay), /Success/);
  let state = { ...START };
  for (const [i, direction] of solution.entries()) {
    const next = movePlayer(state, direction);
    assert.equal(next.blocked, false);
    state = next.position;
    assert.deepEqual(trace[i].position, state);
  }
});

test("every grid row is square and map symbols remain well formed", () => {
  assert.equal(MAZE_ROWS.length, 5);
  for (const row of MAZE_ROWS) assert.equal(row.length, 5);
  const chars = MAZE_ROWS.join("");
  assert.equal([...chars].filter(c => c === "S").length, 1);
  assert.equal([...chars].filter(c => c === "G").length, 1);
  assert.match(chars, /#/);
});

test("blocked move preserves prior location and trace shows the blocked attempt", () => {
  const commands = ["right", "right", "down"];
  const result = replayMoves(commands);
  const trace = getMovementTrace(commands);
  assert.equal(result.blocked, true);
  assert.equal(result.steps, 1);
  assert.deepEqual(result.position, trace.at(-1).position);
  assert.equal(trace.at(-1).blocked, true);
  assert.equal(trace.length, 2);
});

test("malformed commands are rejected consistently by replay and trace", () => {
  const invalid = [["right", "teleport"], [null], Array(101).fill("right")];
  for (const moves of invalid) {
    assert.throws(() => replayMoves(moves));
    assert.throws(() => getMovementTrace(moves));
  }
});
