export const ALGORITHM_STARTER: string;
export const ALGORITHM_HINTS: readonly string[];
export function getAlgorithmHint(level: number): string;
export function describeAlgorithmOutcome(result: { won: boolean; blocked: boolean; steps: number }): string;
