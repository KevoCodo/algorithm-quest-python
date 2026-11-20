const roadmap = [
  "Read a short Python challenge",
  "Write movement commands",
  "Run your code and watch the maze respond",
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-8 px-6 py-16">
      <div className="inline-flex w-fit rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
        AQ-101 · Foundation ready
      </div>
      <section className="space-y-5">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">Algorithm Quest</p>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">Learn Python by solving a maze.</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
          A hands-on computer science lesson where every line of Python moves you closer to the goal.
          The interactive maze is coming in AQ-102.
        </p>
      </section>
      <section aria-labelledby="roadmap" className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl sm:p-8">
        <h2 id="roadmap" className="mb-4 text-xl font-bold">How the lesson will work</h2>
        <ol className="space-y-3">
          {roadmap.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-slate-200">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400 font-bold text-slate-950">{index + 1}</span>
              <span className="pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </section>
      <p className="text-sm text-slate-400">Built as an interactive CS teaching portfolio project. No account needed.</p>
    </main>
  );
}
