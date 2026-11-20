export type Direction = "up" | "down" | "left" | "right";
export type Position = { row: number; col: number };
export type CellType = "wall" | "start" | "goal" | "path" | "outside";

export const MAZE_ROWS: readonly string[];
export const START: Readonly<Position>;
export const GOAL: Readonly<Position>;
export const DIRECTIONS: Readonly<Record<Direction, Readonly<Position>>>;

export function isWithinBounds(row: number, col: number): boolean;
export function isWall(row: number, col: number): boolean;
export function getCellType(row: number, col: number): CellType;
export function movePlayer(
  position: Position,
  direction: Direction,
): {
  position: Position;
  facing: Direction;
  blocked: boolean;
  won: boolean;
};

/** Run ordered Python movement commands from START, stopping on a wall or victory. */
export function replayMoves(actions: readonly string[]): {
  position: Position;
  facing: Direction;
  steps: number;
  blocked: boolean;
  won: boolean;
};
