import assert from "node:assert/strict";
import test from "node:test";
import { GOAL } from "../src/lib/maze.mjs";
import { getMovementTrace, getLessonHint, describeOutcome } from "../src/lib/lesson.mjs";

test("trace records valid steps in order", () => {
  const steps = getMovementTrace(["right", "down", "down"]);
  assert.deepEqual(steps.map(s => s.position), [{row:0,col:1},{row:1,col:1},{row:2,col:1}]);
  assert.deepEqual(steps.map(s => s.steps), [1,2,3]);
});
test("trace includes blocked action but ignores following moves", () => {
  const steps = getMovementTrace(["right","right","down"]);
  assert.equal(steps.length,2);
  assert.equal(steps[1].blocked,true);
  assert.equal(steps[1].steps,1);
});
test("trace ends when reaching goal", () => {
  const route = ["right","down","down","right","right","down","right","down","left"];
  const steps = getMovementTrace(route);
  assert.equal(steps.length,8);
  assert.deepEqual(steps.at(-1).position,GOAL);
  assert.equal(steps.at(-1).won,true);
});
test("invalid and excessive inputs are rejected", () => {
  assert.throws(() => getMovementTrace("right"), /must be an array/);
  assert.throws(() => getMovementTrace(["diagonal"]), /Unknown movement/);
  assert.throws(() => getMovementTrace(Array(101).fill("right")), /limit reached/);
});
test("progressive hints and outcome messages are distinct", () => {
  assert.match(getLessonHint(1),/right first/);
  assert.match(getLessonHint(2),/down twice/);
  assert.match(getLessonHint(3),/row 3/);
  assert.match(describeOutcome({won:true,blocked:false,steps:8}),/Success/);
  assert.match(describeOutcome({won:false,blocked:true,steps:2}),/wall/);
  assert.match(describeOutcome({won:false,blocked:false,steps:0}),/didn't move/);
});
