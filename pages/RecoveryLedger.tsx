import { useNavigate } from 'react-router-dom';
import { useTargetStore } from '../stores/targetStore';
import { useMissionStore } from '../stores/missionStore';

export default function RecoveryLedger() {
  const navigate = useNavigate();
  const selected = useTargetStore((s) => s.selected);
  const nrv = useTargetStore((s) => s.nrv);
  const { burnDeltaV, profitEst, resetMission } = useMissionStore();
  const { clearTarget } = useTargetStore();

  const handleReturnToHub = () => {
    resetMission();
    clearTarget();
    navigate('/hub');
  };

  return (
    <div className="mx-auto max-w-2xl font-sans">
      <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-signal">
        Recovery Ledger
      </h1>
      <div className="mt-8 rounded border-2 border-system bg-surface p-6">
        <h2 className="font-mono text-sm uppercase text-system">Manifest secured</h2>
        <ul className="mt-4 space-y-2 font-mono text-signal">
          <li>Target: {selected?.name ?? '—'}</li>
          <li>Net resources: ${(profitEst ?? nrv ?? 0).toLocaleString()}</li>
          <li>Δv used: {burnDeltaV?.toFixed(2) ?? '—'} km/s</li>
          <li>Carbon footprint reduced: —</li>
        </ul>
        <p className="mt-6 text-neutral">Lifetime salvage mass: —</p>
      </div>
      <button
        type="button"
        onClick={handleReturnToHub}
        className="mt-8 rounded border border-signal bg-void px-6 py-2 font-sans text-signal hover:bg-signal hover:text-void"
      >
        Return to Hub
      </button>
    </div>
  );
}
