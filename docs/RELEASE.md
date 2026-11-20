# AQ-107 deployment and release checklist

**Status: release preparation only. Do not mark AQ-107 complete until the live deployment and browser tests pass.**

## Deploy with Vercel
1. In the Vercel dashboard import `KevoCodo/algorithm-quest-python` from GitHub.
2. Use the Next.js framework preset, root directory `./`, production branch `main`, and default build/output settings.
3. No environment variables or database are required.
4. Deploy, then record the **actual** HTTPS production URL. Never assume a URL based on the repository name.
5. Confirm the URL is public in a logged-out/incognito window.

## Browser QA
In GitHub Actions, manually run **Release browser smoke**, entering the real production HTTPS URL. It installs Chromium and exercises the actual deployed page, including Pyodide downloading from its CDN.

- [ ] Public homepage loads without login
- [ ] The eight movement commands reach the golden goal
- [ ] The step-by-step review works
- [ ] Python syntax errors display readable messages
- [ ] A subsequent corrected run succeeds or reports an incomplete route
- [ ] Reset and hints function
- [ ] Infinite loop stops within the documented worker timeout
- [ ] Mobile viewport and keyboard controls verified (AQ-108)
- [ ] Real screenshot/GIF captured from the working app and inspected

Download the browser test screenshot from the GitHub Actions artifact. Replace the current **illustrative diagram** with a verified browser screenshot in the README, add the actual demo link, and confirm CI stays green.

## Release tag
Only **after** the above checks pass: tag the verified `main` commit `v1.0.0` and publish the GitHub release with the verified public demo URL. Do not tag merely because the production build passed.

## Constraints
Pyodide runs browser-side in a disposable Web Worker, not a hardened sandbox. Do not expose secrets or privileged APIs to learner code. A slow or blocked CDN may prevent Python startup; browser tests are required to establish actual availability.
