import type { Direction, Position } from "./maze.mjs";
export type TraceStep = { position: Position; facing: Direction; direction: Direction; steps: number; blocked: boolean; won: boolean };
export function getMovementTrace(actions: readonly string[]): TraceStep[];
export function getLessonHint(level: number): string;
export function describeOutcome(result: { won: boolean; blocked: boolean; steps: number }): string;
