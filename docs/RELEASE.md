# AQ-107: Local-first verification and optional deployment

**Current focus: local development.** A public Vercel deployment and GitHub release are deferred until the app is ready to share. Do not claim that the deployment has happened.

## Local browser testing

1. Install Node.js 22, then run `npm install`.
2. Install browser test dependencies: `npx playwright install chromium`.
3. Run `npm run test:e2e`. Playwright automatically starts the Next.js dev server at `http://127.0.0.1:3000` when no server is running.
4. To inspect the app manually, run `npm run dev` and open `http://localhost:3000`.
5. The first Python run downloads Pyodide from its pinned CDN, so an internet connection is required.

### Local acceptance checklist

- [ ] Open the maze locally and run the eight-command Python solution to reach the goal
- [ ] Verify the Python step-by-step trace and arrow controls
- [ ] Trigger a syntax error and verify understandable feedback
- [ ] Edit and rerun a corrected/incomplete solution
- [ ] Test reset, hints, and an infinite loop timeout
- [ ] Inspect mobile width and keyboard use as part of AQ-108
- [ ] Capture and review a genuine screenshot of the running application

CI currently checks lint, typecheck, unit tests, and production build; these **do not** establish real-browser Pyodide functionality.

## Optional Vercel deployment later

Vercel's Hobby tier is free for personal, non-commercial use within usage limits. Confirm the project remains eligible for Hobby before publishing it as a personal portfolio demonstration. Import `KevoCodo/algorithm-quest-python` into Vercel, select Next.js, root `./`, and production branch `main`. No environment variables or database are required.

After Vercel supplies an **actual HTTPS URL**, manually trigger GitHub Actions **Release browser smoke**, entering that URL, or locally run:

```bash
BASE_URL=https://your-verified-deployment.example npm run test:e2e
```

Replace the placeholder with the real deployment URL. Check anonymous access, browser tests, and screenshots before adding a live link to README or tagging `v1.0.0`. Do not fabricate a deployment URL, claim tests ran, or publish a version tag before verification.

## Runtime safety

Pyodide in a Web Worker is not a hardened security sandbox. Do not expose secrets or sensitive data to learner code.
