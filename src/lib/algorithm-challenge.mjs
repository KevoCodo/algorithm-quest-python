/** A second lesson on iterating through data and branching on its value. */
export const ALGORITHM_STARTER = `# Level 2: Use a loop to process your route
# Replace the question marks with safe movement directions.
route = ["right", "?", "?", "?", "?", "?", "?", "?"]

for direction in route:
    if direction == "right":
        move_right()
    elif direction == "down":
        move_down()
    # Add conditions for other directions if you need them.
`;

export const ALGORITHM_HINTS = Object.freeze([
  "A loop can process every item in a list. Use the loop variable to choose a movement with if or elif.",
  "Trace the first three squares: right, down, down. Check each direction against the walls before adding it to route.",
  "The route uses eight legal moves. On the open middle row, travel right twice; then go down, right, and down.",
]);

export function getAlgorithmHint(level) {
  if (!Number.isFinite(level) || level < 1) return "";
  return ALGORITHM_HINTS[Math.min(ALGORITHM_HINTS.length - 1, Math.trunc(level) - 1)];
}

/** Learners should demonstrate both repeated iteration and a branch. */
export function describeAlgorithmOutcome(result) {
  if (result.won) return "Algorithm complete! Your loop and conditional guided the explorer to the star in " + result.steps + " moves.";
  if (result.blocked) return "A direction in your route led into a wall or edge. Review the trace, then correct that item in the list.";
  if (result.steps === 0) return "Your loop ran without moving the explorer. Check the list values and the if/elif branches.";
  return "Your loop executed " + result.steps + " movement(s), but the route stops short. Add safe directions and try again.";
}
