import { test, expect } from "@playwright/test";

const solution = [
  "move_right()", "move_down()", "move_down()", "move_right()",
  "move_right()", "move_down()", "move_right()", "move_down()",
].join("\n");

test("public lesson runs Python through Pyodide and reaches the goal", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Learn Python by solving a maze." })).toBeVisible();
  await page.locator("#python-code").fill(solution);
  await page.getByRole("button", { name: "Run Python" }).click();
  await expect(page.getByRole("status").filter({ hasText: /Success!/ })).toBeVisible({ timeout: 90000 });
  await expect(page.getByText("Step 8 of 8")).toBeVisible();
  await page.getByRole("button", { name: "Previous step" }).click();
  await expect(page.getByText("Step 7 of 8")).toBeVisible();
  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByText("Step 8 of 8")).toBeVisible();
  await page.screenshot({ path: "artifacts/algorithm-quest-browser.png", fullPage: true });
});

test("Python syntax errors show feedback and permit retry", async ({ page }) => {
  await page.goto("/");
  await page.locator("#python-code").fill("move_right(");
  await page.getByRole("button", { name: "Run Python" }).click();
  await expect(page.getByRole("status").filter({ hasText: /Python error:/ })).toBeVisible({ timeout: 90000 });
  await page.locator("#python-code").fill("move_right()");
  await page.getByRole("button", { name: "Run Python" }).click();
  await expect(page.getByRole("status").filter({ hasText: /has not reached/ })).toBeVisible({ timeout: 90000 });
  await page.getByRole("button", { name: "Reset maze" }).click();
  await expect(page.getByRole("status").filter({ hasText: /Mission:/ })).toBeVisible();
  await page.getByRole("button", { name: "Show first hint" }).click();
  await expect(page.getByText(/right first/)).toBeVisible();
});
