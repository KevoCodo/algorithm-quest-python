import { defineConfig, devices } from "@playwright/test";

const url = process.env.BASE_URL;
if (!url || !/^https:\/\/[^\s/]+/.test(url)) {
  throw new Error("Set BASE_URL to an actual deployed HTTPS URL.");
}

export default defineConfig({
  testDir: "./e2e",
  timeout: 120000,
  expect: { timeout: 15000 },
  retries: 0,
  workers: 1,
  use: { baseURL: url, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
