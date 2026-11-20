import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = await readFile(new URL("../src/components/maze-playground.tsx", import.meta.url), "utf8");
const homepage = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("interactive lesson has descriptive landmarks, actions and feedback", () => {
  assert.match(homepage, /Skip to interactive lesson/);
  assert.match(component, /id="lesson"/);
  assert.match(component, /aria-labelledby="maze-title"/);
  assert.match(component, /aria-label="Python execution controls"/);
  assert.match(component, /aria-label="Python feedback"/);
  assert.match(component, /aria-atomic="true"/);
  for (const direction of ["up", "down", "left", "right"]) {
    assert.match(component, new RegExp('aria-label="Move ' + direction + '"'));
  }
});

test("mobile layout and focus-visible support are present", () => {
  assert.match(component, /min-\[350px\]:grid-cols-2/);
  assert.match(component, /min-w-0/);
  assert.match(styles, /focus-visible/);
  assert.match(styles, /prefers-reduced-motion/);
});

test("keyboard movement ignores text editing targets", () => {
  assert.match(component, /\["INPUT", "TEXTAREA", "SELECT"\]/);
  assert.match(component, /target\.isContentEditable/);
});
