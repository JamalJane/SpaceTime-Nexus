import { useTargetStore } from '../stores/targetStore';

export default function RightSidebar() {
  const selected = useTargetStore((s) => s.selected);
  const nrv = useTargetStore((s) => s.nrv);

  return (
    <aside
      className="fixed right-0 top-0 z-20 h-full w-[380px] border-l backdrop-blur-[10px]"
      style={{ 
        marginTop: 0,
        borderColor: '#404040',
        backgroundColor: 'rgba(13, 13, 13, 0.9)'
      }}
    >
      <div className="flex h-full flex-col p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#404040', fontFamily: 'Inter, sans-serif' }}>
          Bounty
        </h2>
        {selected ? (
          <div className="mt-4" style={{ fontFamily: 'monospace', color: '#F2F2F2' }}>
            <p className="text-sm">{selected.name}</p>
            <p className="mt-1 text-xs" style={{ color: '#404040' }}>NORAD {selected.norad_id}</p>
            {nrv != null && (
              <p className="mt-2 text-lg" style={{ color: '#FFD700' }}>${nrv.toLocaleString()}</p>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm" style={{ fontFamily: 'monospace', color: '#404040' }}>
            Select a target from the graveyard
          </p>
        )}
      </div>
    </aside>
  );
}
