/* Browser-local Python runtime. Executed in a disposable worker, not a security sandbox. */
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js";
const PYODIDE_INDEX = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/";

let runtimePromise;
let running = false;

async function runtime() {
  if (!runtimePromise) {
    runtimePromise = (async () => {
      importScripts(PYODIDE_URL);
      const pyodide = await self.loadPyodide({ indexURL: PYODIDE_INDEX });
      self.postMessage({ type: "ready" });
      return pyodide;
    })();
  }
  return runtimePromise;
}

self.onmessage = async (event) => {
  const payload = event.data;
  if (!payload || payload.type !== "run" || !Number.isInteger(payload.id) || typeof payload.code !== "string") return;
  if (running) {
    self.postMessage({ type: "result", id: payload.id, ok: false, error: "Python is already running." });
    return;
  }
  if (payload.code.length > 8000) {
    self.postMessage({ type: "result", id: payload.id, ok: false, error: "Please keep your lesson code under 8,000 characters." });
    return;
  }
  running = true;
  try {
    const pyodide = await runtime();
    const moves = [];
    const emit = (direction) => {
      if (moves.length >= 100) throw Error("Movement limit reached (100 commands).");
      moves.push(direction);
    };
    pyodide.globals.set("__aq_move", emit);
    try {
      await pyodide.runPythonAsync(`
def move_up():
    __aq_move("up")

def move_down():
    __aq_move("down")

def move_left():
    __aq_move("left")

def move_right():
    __aq_move("right")
`);
      if (payload.challenge === "algorithms") {
        pyodide.globals.set("__aq_student_code", payload.code);
        try {
          await pyodide.runPythonAsync(`
import ast
tree = ast.parse(__aq_student_code)
if not any(isinstance(node, (ast.For, ast.While)) for node in ast.walk(tree)):
    raise ValueError("Level 2 needs a for or while loop to repeat instructions.")
if not any(isinstance(node, ast.If) for node in ast.walk(tree)):
    raise ValueError("Level 2 needs an if statement to choose a movement.")
`);
        } finally {
          pyodide.globals.delete("__aq_student_code");
        }
      }
      await pyodide.runPythonAsync(payload.code);
      self.postMessage({ type: "result", id: payload.id, ok: true, moves });
    } finally {
      pyodide.globals.delete("__aq_move");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    self.postMessage({ type: "result", id: payload.id, ok: false, error: message.slice(0, 1200) });
  } finally {
    running = false;
  }
};
