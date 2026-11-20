import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const worker = await readFile(new URL("../public/workers/python-worker.js", import.meta.url), "utf8");

test("Pyodide runtime uses pinned URL and runs user Python", () => {
  assert.match(worker, /pyodide\/v0\.27\.7/);
  assert.match(worker, /runPythonAsync\(payload\.code\)/);
  assert.match(worker, /self\.postMessage\(\{ type: "result"/);
});

test("worker exposes four bounded movement functions", () => {
  for (const name of ["move_up", "move_down", "move_left", "move_right"]) {
    assert.match(worker, new RegExp(`def ${name}\\(\\)`));
  }
  assert.match(worker, /moves\.length >= 100/);
  assert.match(worker, /payload\.code\.length > 8000/);
});

test("web worker never receives application secrets", () => {
  assert.doesNotMatch(worker, /process\.env|localStorage|document\.cookie/);
});
