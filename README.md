# Algorithm Quest: Python Maze Challenge

A beginner-friendly interactive learning experience designed to teach Python sequencing and computational thinking through a visual maze. This public project is a teaching-and-engineering portfolio demonstration.

> **Current status:** AQ-101 is the project scaffold only. The interactive maze and browser-based Python execution will be implemented in later issues. The initial page is a working foundation, not a playable lesson yet.

## Technology

- Next.js App Router + React + TypeScript
- Tailwind CSS v4
- Node.js 22
- ESLint, TypeScript checks, Node built-in test runner
- GitHub Actions continuous integration

## Local development

1. Install Node.js 22 (see `.nvmrc`).
2. Clone this repository and run `npm install`.
3. Start development with `npm run dev`.
4. Visit `http://localhost:3000`.

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs on pushes to `main` and `feature/**` and on pull requests to `main`. It installs dependencies, lints, typechecks, runs tests, and builds the production application. A lockfile will be committed once dependencies can be installed in an environment with npm registry access; until then CI uses `npm install` rather than `npm ci`.

## Configuration

No environment variables, secrets, external services, or database are required for this scaffold. `.env.example` documents the empty configuration. For deployment, use a Node.js-compatible Next.js host such as Vercel.

## Learning objective (planned lesson)

Learners will use small Python movement commands to sequence instructions, predict outcomes, observe visual feedback, and correct mistakes. Future issues add the 5×5 maze, Pyodide-based Python runtime in a Web Worker, a movement API, guided feedback, and accessible mobile support.

## Backlog

Epic: [AQ-001](https://github.com/KevoCodo/algorithm-quest-python/issues/1) · Foundation: [AQ-101](https://github.com/KevoCodo/algorithm-quest-python/issues/2)

## License

No open-source license is granted at this time. Source is publicly visible; reuse requires permission.
