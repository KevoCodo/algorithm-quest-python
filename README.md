# Algorithm Quest: Python Maze Challenge

A browser-based teaching portfolio project that introduces computational thinking through a visual maze. Designed as an accessible hands-on learning experience with clear feedback and progressively deeper Python exercises.

## Status

- **AQ-101:** Next.js, TypeScript, Tailwind foundation, CI and setup documentation
- **AQ-102:** Deterministic 5×5 maze with keyboard/button controls, movement and collision rules, reset and unit tests
- **Coming next (AQ-103/104):** Run real Python in a Web Worker and connect learner commands to the maze

**Important:** This version is a manual movement preview; it does not execute Python yet.

## Technical stack

Next.js App Router, React, TypeScript, Tailwind CSS v4, Node.js 22 and GitHub Actions. The movement rules are implemented in a framework-independent JavaScript module so future Python execution can reuse the exact same rules.

## Run locally

Install Node.js 22 (`.nvmrc`), then:

```bash
npm install
npm run dev
```

Open http://localhost:3000 and guide the explorer using the on-screen arrow buttons or keyboard arrow keys. Walls and the grid boundary block movement. Reach the golden star to win; press **Reset maze** to try again.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs on pushes to `main` and `feature/**` and PRs to `main`. A lockfile is still pending from AQ-101; CI currently uses `npm install` rather than `npm ci` until a lockfile is committed.

## Maze and learning notes

- Grid coordinates are zero-based in source code (row, column), displayed as one-based to learners.
- `S` denotes the start, `#` a wall, `G` the goal.
- Current exercise: reason about sequencing, direction, and correcting mistakes using immediate visual feedback.
- Planned extension: learners will express the same route as Python movement commands, observing the effect of each instruction.
- All maze rules live in `src/lib/maze.mjs`, with type declarations in `src/lib/maze.d.mts` and tests in `tests/maze.test.mjs`.

## Setup

No environment variables, secrets, accounts, or external data store are required. `.env.example` documents this.

## Issues

[Project epic](https://github.com/KevoCodo/algorithm-quest-python/issues/1) · [AQ-102 maze](https://github.com/KevoCodo/algorithm-quest-python/issues/3)

## License

Publicly visible source; no open-source reuse license granted at this time.
