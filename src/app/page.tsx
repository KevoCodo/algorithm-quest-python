import MazePlayground from "@/components/maze-playground";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <header className="max-w-3xl space-y-4">
        <div className="inline-flex rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-cyan-200">
          Interactive learning · Python maze preview
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">Algorithm Quest</p>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
          Learn Python by solving a maze.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
          Algorithms begin with a sequence of decisions. Get to know the maze by moving your
          explorer, one step at a time. Python controls are coming in the next lesson update.
        </p>
      </header>
      <MazePlayground />
      <footer className="text-sm text-slate-400">
        AQ-102 · Maze movement preview. No account or login required.
      </footer>
    </main>
  );
}
