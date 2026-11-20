import { DIRECTIONS, START, movePlayer } from "./maze.mjs";

/** Return the visited positions, including the blocked attempt, for learner review. */
export function getMovementTrace(actions) {
  if (!Array.isArray(actions)) throw new TypeError("Movement commands must be an array.");
  if (actions.length > 100) throw new RangeError("Movement limit reached (100 commands).");
  let position = { ...START };
  let steps = 0;
  const trace = [];
  for (const direction of actions) {
    if (typeof direction !== "string" || !Object.hasOwn(DIRECTIONS, direction)) {
      throw new Error("Unknown movement command.");
    }
    const result = movePlayer(position, direction);
    if (!result.blocked) {
      position = result.position;
      steps++;
    }
    trace.push({ position: { ...position }, facing: direction, direction, steps, blocked: result.blocked, won: result.won });
    if (result.blocked || result.won) break;
  }
  return trace;
}

const HINTS = [
  "Look near the start. Moving down hits a wall. Try moving right first.",
  "Once you move right, move down twice before heading across the open middle row.",
  "From row 3, column 2: right twice, down, right, then down to reach the star.",
];

export function getLessonHint(level) {
  const index = Math.max(0, Math.min(2, Math.trunc(level) - 1));
  return HINTS[index];
}

export function describeOutcome(result) {
  if (result.won) return "Success! You reached the golden star in " + result.steps + " steps.";
  if (result.blocked) return "Your code made " + result.steps + " legal move(s) before hitting a wall or the edge. Review the last step and retry.";
  if (result.steps === 0) return "Python ran, but the explorer didn't move. Add a movement command.";
  return "Python moved " + result.steps + " time(s), but has not reached the star. Add the next commands and try again.";
}
