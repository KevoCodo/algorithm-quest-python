import { defineConfig, devices } from "@playwright/test";

const externalUrl = process.env.BASE_URL;
if (externalUrl && !/^https:\/\/[^\s/]+/.test(externalUrl)) {
  throw new Error("BASE_URL must be a real HTTPS deployment URL when provided.");
}

export default defineConfig({
  testDir: "./e2e",
  timeout: 120000,
  expect: { timeout: 15000 },
  retries: 0,
  workers: 1,
  webServer: externalUrl ? undefined : {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  use: { baseURL: externalUrl ?? "http://127.0.0.1:3000", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
