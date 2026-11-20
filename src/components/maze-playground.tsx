"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMovementTrace, getLessonHint, describeOutcome, type TraceStep } from "@/lib/lesson.mjs";
import {
  GOAL, MAZE_ROWS, START, getCellType, movePlayer, replayMoves, type Direction, type Position,
} from "@/lib/maze.mjs";

const DIRECTIONS: Record<Direction, string> = { up: "↑", down: "↓", left: "←", right: "→" };
const KEYS: Record<string, Direction> = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
};
const STARTER = `# Guide your explorer one step at a time
move_right()
move_down()
move_down()
# What should happen next?
`;
const INTRO = "Mission: guide the explorer from S to the golden star using Python commands.";

type WorkerMessage =
  | { type: "ready" }
  | { type: "result"; id: number; ok: true; moves: Direction[] }
  | { type: "result"; id: number; ok: false; error: string };

export default function MazePlayground() {
  const [position, setPosition] = useState<Position>({ ...START });
  const [facing, setFacing] = useState<Direction>("right");
  const [steps, setSteps] = useState(0);
  const [feedback, setFeedback] = useState(INTRO);
  const [complete, setComplete] = useState(false);
  const [code, setCode] = useState(STARTER);
  const [running, setRunning] = useState(false);
  const [pythonReady, setPythonReady] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [traceIndex, setTraceIndex] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const runId = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const applyMoves = useCallback((directions: Direction[]) => {
    try {
      const result = replayMoves(directions);
      const history = getMovementTrace(directions);
      setTrace(history);
      setTraceIndex(history.length);
      setPosition(result.position);
      setFacing(result.facing);
      setSteps(result.steps);
      setComplete(result.won);
      setFeedback(describeOutcome(result));
    } catch (error) {
      setTrace([]);
      setTraceIndex(0);
      setFeedback(error instanceof Error ? error.message : "Invalid movement commands.");
    }
  }, []);

  const startWorker = useCallback(() => {
    workerRef.current?.terminate();
    setPythonReady(false);
    if (typeof Worker === "undefined") {
      setFeedback("This browser does not support Web Workers.");
      return;
    }
    const worker = new Worker("/workers/python-worker.js");
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      if (message.type === "ready") {
        setPythonReady(true);
        return;
      }
      if (message.type !== "result" || message.id !== runId.current) return;
      clearTimer();
      setRunning(false);
      if (!message.ok) {
        setTrace([]);
        setTraceIndex(0);
        setFeedback(`Python error: ${message.error}\nCheck spelling, parentheses, and indentation, then try again.`);
        return;
      }
      applyMoves(message.moves);
    };
    worker.onerror = () => {
      clearTimer();
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      setRunning(false);
      setPythonReady(false);
      setFeedback("Python could not load. Check your connection and retry.");
    };
  }, [applyMoves, clearTimer]);

  useEffect(() => {
    // Worker is created on demand to avoid downloading Python until Run is clicked.
    return () => {
      runId.current++;
      clearTimer();
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [clearTimer]);

  const move = useCallback((direction: Direction) => {
    if (complete || running) return;
    setTrace([]);
    setTraceIndex(0);
    const result = movePlayer(position, direction);
    setFacing(direction);
    if (result.blocked) {
      setFeedback("That move is blocked by a wall or the edge of the maze.");
      return;
    }
    setPosition(result.position);
    setSteps((n) => n + 1);
    setComplete(result.won);
    setFeedback(result.won ? "Goal reached! Try the same route with Python." : `Moved ${direction}.`);
  }, [complete, position, running]);

  useEffect(() => {
    function keyDown(event: KeyboardEvent) {
      const direction = KEYS[event.key];
      if (!direction) return;
      const target = event.target;
      if (target instanceof HTMLElement &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable)) return;
      event.preventDefault();
      move(direction);
    }
    window.addEventListener("keydown", keyDown);
    return () => window.removeEventListener("keydown", keyDown);
  }, [move]);

  function runPython() {
    if (running) return;
    runId.current++;
    const id = runId.current;
    setRunning(true);
    setTrace([]);
    setTraceIndex(0);
    setFeedback("Loading Python and running your program...");
    if (!workerRef.current) startWorker();
    const worker = workerRef.current;
    if (!worker) { setRunning(false); return; }
    // Allow first-time Pyodide download longer than subsequent runs.
    const duration = pythonReady ? 5000 : 60000;
    clearTimer();
    timeoutRef.current = setTimeout(() => {
      if (runId.current !== id) return;
      runId.current++;
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      setPythonReady(false);
      setRunning(false);
      setFeedback("Python took too long and was stopped. Check for an infinite loop and run again.");
    }, duration);
    worker.postMessage({ type: "run", id, code });
  }

  function reset() {
    runId.current++;
    clearTimer();
    if (running) {
      workerRef.current?.terminate();
      workerRef.current = null;
      setPythonReady(false);
      setRunning(false);
    }
    setPosition({ ...START });
    setFacing("right");
    setSteps(0);
    setTrace([]);
    setTraceIndex(0);
    setHintLevel(0);
    setComplete(false);
    setFeedback(INTRO);
  }

  const preview = traceIndex > 0 ? trace[traceIndex - 1] : null;
  const shownPosition = trace.length ? (preview?.position ?? START) : position;
  const shownFacing = trace.length ? (preview?.facing ?? "right") : facing;
  const shownSteps = trace.length ? (preview?.steps ?? 0) : steps;

  return (
    <section aria-labelledby="maze-title" className="rounded-3xl border border-slate-700 bg-slate-900/90 p-5 shadow-2xl sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-cyan-300">Level 01 · Python movement</p>
          <h2 id="maze-title" className="text-2xl font-bold">Find the golden goal</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
            Write a sequence of Python commands that moves the explorer from S to the star. Each Run starts at S.
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-center">
          <p className="text-xs uppercase tracking-wide text-slate-400">Steps</p>
          <p className="text-2xl font-bold tabular-nums">{shownSteps}</p>
        </div>
      </div>
      <div className="mb-6 rounded-xl border border-cyan-500/30 bg-cyan-950/25 p-4">
        <h3 className="font-bold text-cyan-100">Learning goal: sequence your instructions</h3>
        <p className="mt-2 text-sm text-slate-200">Each command moves the explorer one square. Walls stop movement. Plan a route to the star, then test your instructions with Run Python.</p>
        <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-slate-300">
          <li>Inspect the maze and choose a safe path.</li>
          <li>Edit the starter Python commands.</li>
          <li>Run your code and review each step to improve it.</li>
        </ol>
      </div>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(270px,0.9fr)]">
        <div className="space-y-4">
          <div
            className="mx-auto grid aspect-square w-full max-w-[440px] grid-cols-5 gap-1.5 rounded-2xl bg-slate-950 p-2.5 ring-1 ring-slate-700 sm:gap-2 sm:p-3"
            role="img"
            aria-label={`Five by five maze. Explorer at row ${shownPosition.row + 1}, column ${shownPosition.col + 1}, facing ${shownFacing}. Goal at row ${GOAL.row + 1}, column ${GOAL.col + 1}.`}
          >
            {MAZE_ROWS.flatMap((row, rowIndex) =>
              Array.from(row).map((_, colIndex) => {
                const cell = getCellType(rowIndex, colIndex);
                const player = shownPosition.row === rowIndex && shownPosition.col === colIndex;
                const styles: Record<string, string> = {
                  wall: "bg-slate-600 border-slate-500/60",
                  path: "bg-slate-800 border-slate-700/60",
                  start: "bg-cyan-950 border-cyan-500/60",
                  goal: "bg-amber-400/20 border-amber-400/70",
                };
                return (
                  <div key={`${rowIndex}-${colIndex}`} aria-hidden="true"
                    className={`flex aspect-square items-center justify-center rounded-lg border text-2xl font-bold sm:rounded-xl sm:text-3xl ${styles[cell]}`}>
                    {player ? (
                      <span className="flex h-3/4 w-3/4 items-center justify-center rounded-full bg-cyan-400 text-xl font-black text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.55)] sm:text-2xl">
                        {DIRECTIONS[shownFacing]}
                      </span>
                    ) : cell === "goal" ? <span className="text-amber-300">★</span>
                      : cell === "start" ? <span className="text-sm font-bold text-cyan-300">S</span> : null}
                  </div>
                );
              }),
            )}
          </div>
          <div className="mx-auto flex max-w-[440px] flex-wrap justify-between gap-3 text-xs text-slate-300">
            <span><span className="text-cyan-300">●</span> Explorer</span>
            <span><span className="text-slate-400">■</span> Wall</span>
            <span><span className="text-amber-300">★</span> Goal</span>
          </div>
          <div className="mx-auto grid w-fit grid-cols-3 gap-2" aria-label="Manual movement controls">
            <div />
            <button aria-label="Move up" type="button" disabled={complete || running} onClick={() => move("up")} className="maze-control">↑</button>
            <div />
            <button aria-label="Move left" type="button" disabled={complete || running} onClick={() => move("left")} className="maze-control">←</button>
            <button aria-label="Move down" type="button" disabled={complete || running} onClick={() => move("down")} className="maze-control">↓</button>
            <button aria-label="Move right" type="button" disabled={complete || running} onClick={() => move("right")} className="maze-control">→</button>
          </div>
          <p className="text-center text-xs text-slate-400">Keyboard arrows also work when the editor is not focused.</p>
          {trace.length > 0 && (
            <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold">Review your program</h3>
                <span className="text-xs text-cyan-200">Step {traceIndex} of {trace.length}</span>
              </div>
              <p className="mt-2 text-sm text-slate-300" aria-live="polite">
                {preview ? (preview.blocked ? "This move was blocked by a wall or edge." : preview.won ? "The explorer reached the star!" : "Moved " + preview.direction + ".") : "Starting at S. What will the first instruction do?"}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button type="button" disabled={running || traceIndex === 0} onClick={() => setTraceIndex(n => Math.max(0, n - 1))}
                  className="rounded-lg border border-slate-600 p-2 text-sm disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-cyan-300">Previous step</button>
                <button type="button" disabled={running || traceIndex === trace.length} onClick={() => setTraceIndex(n => Math.min(trace.length, n + 1))}
                  className="rounded-lg border border-slate-600 p-2 text-sm disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-cyan-300">Next step</button>
              </div>
            </div>
          )>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="python-code" className="mb-2 block text-sm font-bold text-white">Your Python code</label>
            <textarea id="python-code" value={code} onChange={(event) => setCode(event.target.value)}
              spellCheck={false} autoCapitalize="off" autoCorrect="off"
              className="min-h-64 w-full resize-y rounded-xl border border-slate-600 bg-slate-950 p-4 font-mono text-sm leading-relaxed text-cyan-100 focus-visible:outline-2 focus-visible:outline-cyan-300"
              aria-describedby="python-help" />
            <p id="python-help" className="mt-2 text-xs leading-relaxed text-slate-300">
              Commands: <code>move_up()</code>, <code>move_down()</code>, <code>move_left()</code>, <code>move_right()</code>.
              Python downloads the first time you run it.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" disabled={running} onClick={runPython}
              className="rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
              {running ? "Running..." : "Run Python"}
            </button>
            <button type="button" onClick={reset}
              className="rounded-xl border border-cyan-500/50 px-4 py-3 font-semibold text-cyan-200 hover:bg-cyan-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
              {running ? "Stop & reset" : "Reset maze"}
            </button>
          </div>
          <p className="text-xs text-slate-400" aria-live="polite">
            {running ? "Python is running in a separate browser worker." : pythonReady ? "Python engine ready." : "Python engine loads on first run."}
          </p>
          <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-bold">Need a hint?</h3>
              <button type="button" disabled={running || hintLevel >= 3} onClick={() => setHintLevel(n => Math.min(3,n + 1))}
                className="rounded-lg border border-cyan-500/50 px-3 py-2 text-xs text-cyan-200 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-cyan-300">
                {hintLevel === 0 ? "Show first hint" : hintLevel === 3 ? "All hints shown" : "Show another hint"}
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-300" aria-live="polite">
              {hintLevel ? getLessonHint(hintLevel) : "Try a route before revealing a hint."}
            </p>
          </div>
          <div role="status" aria-live="polite"
            className={`min-h-24 whitespace-pre-wrap break-words rounded-xl border p-4 text-sm leading-relaxed ${complete ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-200" : "border-slate-700 bg-slate-800/80 text-slate-200"}`}>
            {feedback}
          </div>
        </div>
      </div>
    </section>
  );
}
