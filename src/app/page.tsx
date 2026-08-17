export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          ShopNexus Frontend Initialized
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Welcome to ShopNexus
        </h1>

        <p className="max-w-xl text-base sm:text-lg text-zinc-400 leading-relaxed">
          Modern e-commerce platform built with Next.js App Router, Strict TypeScript, and Tailwind CSS.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-zinc-400">
          <span className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono">Next.js 16</span>
          <span className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono">TypeScript</span>
          <span className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono">Tailwind CSS</span>
          <span className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono">Zustand</span>
          <span className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono">Zod</span>
        </div>
      </main>
    </div>
  );
}
