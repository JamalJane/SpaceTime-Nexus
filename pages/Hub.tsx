import { useTargetStore } from '../stores/targetStore';

export default function Hub() {
  const selected = useTargetStore((s) => s.selected);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center" style={{ fontFamily: 'Inter, sans-serif' }}>
      <h1 className="text-xl font-bold uppercase tracking-[0.2em]" style={{ color: '#F2F2F2' }}>
        Global Graveyard
      </h1>
      <p className="mt-4 max-w-md text-center text-sm" style={{ fontFamily: 'monospace', color: '#404040' }}>
        Spin the globe and click a satellite to focus. Selected target data appears in the Bounty panel.
      </p>
      {selected && (
        <p className="mt-4 text-sm" style={{ fontFamily: 'monospace', color: '#FFD700' }}>
          Locked: {selected.name} (NORAD {selected.norad_id})
        </p>
      )}
    </div>
  );
}
