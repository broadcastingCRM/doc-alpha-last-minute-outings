export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <span className="rounded-full border border-foreground/15 px-4 py-1 text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        DOC Alpha
      </span>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Last Minute Outings
      </h1>
      <p className="max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400">
        Foundation release — application skeleton deployed and verified in
        production. Features land incrementally from here.
      </p>
    </main>
  );
}
