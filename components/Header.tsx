export default function Header() {
  const utc = new Date().toISOString().slice(11, 19);
  return (
    <header className="flex items-center gap-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      <span className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: '#F2F2F2' }}>
        NEXUS
      </span>
      <span className="text-sm" style={{ fontFamily: 'monospace', color: '#404040' }}>UTC {utc}</span>
      <span className="text-sm" style={{ fontFamily: 'monospace', color: '#404040' }}>Orbital density —</span>
    </header>
  );
}
