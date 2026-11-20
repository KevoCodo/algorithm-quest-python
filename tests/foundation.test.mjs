import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("project exposes development, quality, and build scripts", async () => {
  const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  for (const name of ["dev", "start", "build", "lint", "test", "typecheck"]) {
    assert.equal(typeof pkg.scripts[name], "string", `${name} script must exist`);
  }
});

test("home page clearly identifies the learning project", async () => {
  const page = await readFile(new URL("src/app/page.tsx", root), "utf8");
  assert.match(page, /Learn Python by solving a maze/);
});
