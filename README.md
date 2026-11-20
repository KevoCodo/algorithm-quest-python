# Algorithm Quest: Python Maze Challenge

A browser-based teaching portfolio project that introduces computational thinking through a visual maze. Designed as an accessible hands-on learning experience with clear feedback and progressively deeper Python exercises.

## Status

- **AQ-101:** Next.js, TypeScript, Tailwind foundation, CI and setup documentation
- **AQ-102:** Deterministic 5×5 maze with keyboard/button controls, movement and collision rules, reset and unit tests
- **AQ-103:** Execute learner Python in a separate browser Web Worker, with clear errors, bounded command output, and timeout recovery.
- **AQ-104:** Define the movement command contract, validate/replay action sequences and verify legal moves, collisions and victory with automated tests.

**Important:** This version runs real Python using Pyodide and maps the resulting movement commands into the maze. The guided lesson and more extensive assessment are upcoming.

## Technical stack

Next.js App Router, React, TypeScript, Tailwind CSS v4, Node.js 22 and GitHub Actions. The movement rules are implemented in a framework-independent JavaScript module so future Python execution can reuse the exact same rules.

## Run locally

Install Node.js 22 (`.nvmrc`), then:

```bash
npm install
npm run dev
```

Open http://localhost:3000. You can guide the explorer with arrows or type Python in the editor and press **Run Python**. Available functions are `move_up()`, `move_down()`, `move_left()`, and `move_right()`. Every Python run starts the explorer at the beginning. The first run downloads the Pyodide runtime from a pinned CDN URL, so the browser must be online. Use **Reset maze** to stop an active run and try again.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs on pushes to `main` and `feature/**` and PRs to `main`. A lockfile is still pending from AQ-101; CI currently uses `npm install` rather than `npm ci` until a lockfile is committed.

## Python movement API\n\nThe learner can call four zero-argument Python functions: `move_up()`, `move_down()`, `move_left()`, and `move_right()`. Calls are recorded **in order** by the worker, then `replayMoves()` validates each direction against the shared maze engine. Every Run starts at the entrance. If a command hits a wall or boundary, execution stops and reports the number of legal moves. Reaching the goal stops the sequence with a success state. More than 100 commands or an unknown direction are rejected.\n\nExample route from start to goal:\n\n```python\nmove_right()\nmove_down()\nmove_down()\nmove_right()\nmove_right()\nmove_down()\nmove_right()\nmove_down()\n```\n\nThe learner can use Python loops to produce the same ordered commands. Code execution is browser-local and subject to runtime limits.\n\n## Maze and learning notes

- Grid coordinates are zero-based in source code (row, column), displayed as one-based to learners.
- `S` denotes the start, `#` a wall, `G` the goal.
- Current exercise: reason about sequencing, direction, and correcting mistakes using immediate visual feedback.
- The Python worker returns movement commands after executing Python. React replays those commands with the existing deterministic maze rules. This keeps the maze logic consistent for manual and Python play.
- All maze rules live in `src/lib/maze.mjs`, with type declarations in `src/lib/maze.d.mts` and tests in `tests/maze.test.mjs`.

## Runtime safety notes

Python runs in a disposable Web Worker, not on a server. A watchdog terminates and recreates the worker after a timeout, and the movement API caps emitted commands at 100. **Pyodide is not a hardened security sandbox**: arbitrary Python is permitted in the worker and the code should not receive credentials, sensitive data, privileged APIs, or cross-origin access. The runtime is intended for voluntary, untrusted public exercises, not adversarial code execution. For future deployment hardening, add a restrictive Content Security Policy, review the runtime CDN supply chain and consider a same-origin pinned build.

## Setup

No environment variables, secrets, accounts, or external data store are required. `.env.example` documents this.

## Issues

[Project epic](https://github.com/KevoCodo/algorithm-quest-python/issues/1) · [AQ-102 maze](https://github.com/KevoCodo/algorithm-quest-python/issues/3)

## License

Publicly visible source; no open-source reuse license granted at this time.
