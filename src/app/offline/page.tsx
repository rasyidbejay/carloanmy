import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="hero-shell w-full rounded-[36px] border border-[color:var(--line)] p-8 shadow-2xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-soft">Offline</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)] sm:text-5xl">
          You are offline, but the app is still available.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
          CarLoan.my now caches visited routes and core app assets for offline use. If the page you
          need has not been cached yet, reconnect and open it once so it becomes available later.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            href="/"
          >
            Go to home
          </Link>
          <Link
            className="surface-subtle rounded-full px-5 py-3 text-sm font-semibold text-[color:var(--foreground)]"
            href="/ev-loan-calculator"
          >
            EV calculator
          </Link>
        </div>
      </section>
    </main>
  );
}
