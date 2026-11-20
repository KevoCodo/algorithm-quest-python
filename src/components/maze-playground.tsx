"use client";

import { useCallback, useEffect, useState } from "react";
import {
  GOAL,
  MAZE_ROWS,
  START,
  getCellType,
  movePlayer,
  type Direction,
  type Position,
} from "@/lib/maze.mjs";

const DIRECTION_LABELS: Record<Direction, string> = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

const INITIAL_MESSAGE = "Your explorer is at the start. Use the arrows to find the goal.";

export default function MazePlayground() {
  const [position, setPosition] = useState<Position>({ ...START });
  const [facing, setFacing] = useState<Direction>("right");
  const [steps, setSteps] = useState(0);
  const [feedback, setFeedback] = useState(INITIAL_MESSAGE);
  const [complete, setComplete] = useState(false);

  const move = useCallback(
    (direction: Direction) => {
      if (complete) return;
      const result = movePlayer(position, direction);
      setFacing(result.facing);
      if (result.blocked) {
        setFeedback("A wall or the edge of the maze blocks that move. Try another direction.");
        return;
      }
      setPosition(result.position);
      setSteps((count) => count + 1);
      if (result.won) {
        setComplete(true);
        setFeedback("You reached the goal! Great job planning your route.");
      } else {
        setFeedback(`Moved ${direction}. Keep going!`);
      }
    },
    [complete, position],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const direction = KEY_TO_DIRECTION[event.key];
      if (!direction) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
          target.isContentEditable)
      ) return;
      event.preventDefault();
      move(direction);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [move]);

  function reset() {
    setPosition({ ...START });
    setFacing("right");
    setSteps(0);
    setComplete(false);
    setFeedback(INITIAL_MESSAGE);
  }

  return (
    <section aria-labelledby="maze-title" className="rounded-3xl border border-slate-700 bg-slate-900/90 p-5 shadow-2xl sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-cyan-300">
            Level 01 · Movement playground
          </p>
          <h2 id="maze-title" className="text-2xl font-bold">Find the golden goal</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
            Practice planning a route. Later, you will guide this explorer with Python code.
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-center">
          <p className="text-xs uppercase tracking-wide text-slate-400">Steps</p>
          <p className="text-2xl font-bold tabular-nums">{steps}</p>
        </div>
      </div>

      <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
        <div>
          <div
            className="mx-auto grid aspect-square w-full max-w-[440px] grid-cols-5 gap-1.5 rounded-2xl bg-slate-950 p-2.5 ring-1 ring-slate-700 sm:gap-2 sm:p-3"
            role="img"
            aria-label={`Five by five maze. Explorer at row ${position.row + 1}, column ${position.col + 1}, facing ${facing}. Goal at row ${GOAL.row + 1}, column ${GOAL.col + 1}.`}
          >
            {MAZE_ROWS.flatMap((row, rowIndex) =>
              Array.from(row).map((_, colIndex) => {
                const type = getCellType(rowIndex, colIndex);
                const playerHere = position.row === rowIndex && position.col === colIndex;
                const cellStyles: Record<string, string> = {
                  wall: "bg-slate-600 border-slate-500/60",
                  path: "bg-slate-800 border-slate-700/60",
                  start: "bg-cyan-950 border-cyan-500/60",
                  goal: "bg-amber-400/20 border-amber-400/70",
                };
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    aria-hidden="true"
                    className={`flex aspect-square items-center justify-center rounded-lg border text-2xl font-bold sm:rounded-xl sm:text-3xl ${cellStyles[type]}`}
                  >
                    {playerHere ? (
                      <span className="flex h-3/4 w-3/4 items-center justify-center rounded-full bg-cyan-400 text-xl font-black text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.55)] sm:text-2xl">
                        {DIRECTION_LABELS[facing]}
                      </span>
                    ) : type === "goal" ? (
                      <span className="text-amber-300" aria-hidden="true">★</span>
                    ) : type === "start" ? (
                      <span className="text-sm font-bold text-cyan-300">S</span>
                    ) : null}
                  </div>
                );
              }),
            )}
          </div>
          <div className="mx-auto mt-4 flex max-w-[440px] flex-wrap justify-between gap-3 text-xs text-slate-300">
            <span><span aria-hidden="true" className="text-cyan-300">●</span> Explorer</span>
            <span><span aria-hidden="true" className="text-slate-400">■</span> Wall</span>
            <span><span aria-hidden="true" className="text-amber-300">★</span> Goal</span>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <h3 className="mb-3 text-sm font-bold text-white">Move the explorer</h3>
            <div className="mx-auto grid w-fit grid-cols-3 gap-2" aria-label="Maze movement controls">
              <div />
              <button type="button" aria-label="Move up" disabled={complete} onClick={() => move("up")} className="maze-control">↑</button>
              <div />
              <button type="button" aria-label="Move left" disabled={complete} onClick={() => move("left")} className="maze-control">←</button>
              <button type="button" aria-label="Move down" disabled={complete} onClick={() => move("down")} className="maze-control">↓</button>
              <button type="button" aria-label="Move right" disabled={complete} onClick={() => move("right")} className="maze-control">→</button>
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">Or use your keyboard arrow keys.</p>
          </div>
          <div role="status" aria-live="polite" className={`min-h-24 rounded-xl border p-4 text-sm leading-relaxed ${complete ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-200" : "border-slate-700 bg-slate-800/80 text-slate-200"}`}>
            {feedback}
          </div>
          <button type="button" onClick={reset} className="w-full rounded-xl border border-cyan-500/50 px-4 py-3 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
            Reset maze
          </button>
        </div>
      </div>
    </section>
  );
}
