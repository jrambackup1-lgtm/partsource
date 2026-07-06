export function Footer() {
  return (
    <footer className="h-auto py-3 bg-[var(--bg-surface)] border-t border-[var(--border)] px-6 flex flex-col md:flex-row items-center justify-between text-[var(--text-secondary)] text-[10px] shrink-0 mt-auto gap-2">
      <div className="flex gap-4">
        <span>Session ID: <span className="mono">MC-782-X2</span></span>
        <span>Database: <span className="mono">v1.04.12</span></span>
      </div>
      <div className="text-center md:text-right">
        Built by Jay. Need custom machinery or mechanical design consulting? <a href="https://jayar.co" target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline font-bold">Visit jayar.co</a>
      </div>
    </footer>
  );
}
